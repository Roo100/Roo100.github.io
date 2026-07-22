from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd

import build_nyc_housing_official as b


def read_csv(path, *, bbl: bool = False) -> pd.DataFrame:
    dtype = {"normalized_bbl": "string"} if bbl else None
    return pd.read_csv(path, dtype=dtype, low_memory=False)


def numeric_strings(values) -> list[str]:
    output: list[str] = []
    seen: set[str] = set()
    for value in values:
        text = b.clean(value)
        if not text:
            continue
        try:
            text = str(int(float(text)))
        except ValueError:
            continue
        if text not in seen:
            seen.add(text)
            output.append(text)
    return sorted(output, key=int)


def download_parallel(clauses: list[str], *, order: str, workers: int = 4) -> tuple[pd.DataFrame, int]:
    if not clauses:
        return pd.DataFrame(columns=b.DATASETS["violations"]["select"]), 0

    cfg = b.DATASETS["violations"]
    frames: dict[int, pd.DataFrame] = {}
    request_total = 0
    completed = 0

    def fetch(index_clause: tuple[int, str]):
        index, clause = index_clause
        frame, requests_used = b.socrata_query(
            cfg["id"], cfg["select"], where=clause, order=order
        )
        return index, frame, requests_used

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(fetch, pair): pair[0]
            for pair in enumerate(clauses)
        }
        for future in as_completed(futures):
            index, frame, requests_used = future.result()
            frames[index] = frame
            request_total += requests_used
            completed += 1
            if completed % 10 == 0 or completed == len(clauses):
                rows = sum(len(frame) for frame in frames.values())
                print(
                    f"violations: {completed}/{len(clauses)} query groups; rows={rows:,}",
                    flush=True,
                )

    ordered = [frames[index] for index in sorted(frames)]
    return pd.concat(ordered, ignore_index=True), request_total


def main() -> None:
    required = [
        b.PROCESSED / "rgb_source_records.csv",
        b.PROCESSED / "rgb_properties.csv",
        b.PROCESSED / "pluto_properties.csv",
        b.PROCESSED / "hpd_registrations.csv",
        b.PROCESSED / "hpd_contacts.csv",
    ]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        raise RuntimeError(f"Missing partial-build files: {missing}")

    print("Resume 1/2: load verified official RGB, PLUTO, and HPD registration outputs")
    source_records = read_csv(b.PROCESSED / "rgb_source_records.csv", bbl=True)
    rgb = read_csv(b.PROCESSED / "rgb_properties.csv", bbl=True)
    pluto = read_csv(b.PROCESSED / "pluto_properties.csv", bbl=True)
    registrations = read_csv(b.PROCESSED / "hpd_registrations.csv", bbl=True)
    contacts = read_csv(b.PROCESSED / "hpd_contacts.csv")

    for frame in (source_records, rgb, pluto, registrations):
        if "normalized_bbl" in frame.columns:
            frame["normalized_bbl"] = frame["normalized_bbl"].astype("string").str.zfill(10)

    bbls = sorted(rgb["normalized_bbl"].dropna().astype(str).unique())
    if len(bbls) != 46977:
        raise RuntimeError(f"Expected 46,977 official source BBLs, found {len(bbls):,}")

    latest = registrations[
        registrations["is_latest_registration"].astype(str).str.lower().eq("true")
    ].copy()
    building_ids = numeric_strings(latest.get("building_id", pd.Series(dtype="string")))
    registered_bbls = set(latest["normalized_bbl"].dropna().astype(str))
    unregistered_bbls = sorted(set(bbls) - registered_bbls)

    print(
        f"Loaded {len(source_records):,} source rows, {len(rgb):,} source BBLs, "
        f"{len(pluto):,} PLUTO matches, {len(latest):,} latest registrations, "
        f"{len(building_ids):,} HPD building IDs, and {len(contacts):,} contacts"
    )

    print("Resume 2/2: retrieve open HPD violations and build production map assets")
    building_clauses = [
        f"({b.in_clause('buildingid', group, numeric=True)}) and violationstatus='Open'"
        for group in b.chunks(building_ids, 500)
    ]
    violations_by_building, building_requests = download_parallel(
        building_clauses,
        order="buildingid,inspectiondate desc,violationid desc",
        workers=4,
    )

    bbl_clauses = [
        f"({b.in_clause('bbl', group, numeric=False)}) and violationstatus='Open'"
        for group in b.chunks(unregistered_bbls, 100)
    ]
    violations_by_bbl, bbl_requests = download_parallel(
        bbl_clauses,
        order="bbl,inspectiondate desc,violationid desc",
        workers=2,
    )

    violations_raw = pd.concat(
        [violations_by_building, violations_by_bbl], ignore_index=True
    )
    if "violationid" in violations_raw.columns:
        violations_raw = violations_raw.drop_duplicates("violationid", keep="first")
    violations_raw.to_csv(b.RAW / "hpd_open_violations.csv", index=False)

    unit_lookup = dict(
        zip(pluto["normalized_bbl"].astype(str), pluto["residential_units"], strict=False)
    ) if not pluto.empty else {}
    violation_summary, recent, coord_by_bbl = b.normalize_violations(
        violations_raw, unit_lookup
    )
    violation_summary.to_csv(b.PROCESSED / "violation_summary.csv", index=False)
    recent.to_csv(b.PROCESSED / "recent_violations.csv", index=False)

    housing = b.build_housing(
        rgb, pluto, registrations, contacts, violation_summary, coord_by_bbl
    )
    housing.to_csv(b.PROCESSED / "housing_properties.csv", index=False)
    manifest = b.build_map_assets(housing, recent)

    qa = {
        "built_at_utc": b.now_utc(),
        "source_records": len(source_records),
        "source_bbls": len(rgb),
        "pluto_matches": len(pluto),
        "latest_hpd_registrations": len(latest),
        "hpd_building_ids": len(building_ids),
        "source_bbls_without_current_hpd_building_id": len(unregistered_bbls),
        "hpd_contacts": len(contacts),
        "open_violation_records": len(violations_raw),
        "properties_with_open_violation_summary": len(violation_summary),
        "recent_violation_records": len(recent),
        "mapped_properties": manifest["property_count"],
        "properties_without_coordinates": manifest["properties_without_coordinates"],
        "requests": {
            "violations_by_building_id": building_requests,
            "violations_by_bbl_fallback": bbl_requests,
        },
        "data_mode": "production",
        "is_fixture": False,
    }
    (b.QA / "official_build_summary.json").write_text(json.dumps(qa, indent=2))
    print(json.dumps(qa, indent=2))

    if manifest["property_count"] < len(rgb) * 0.95:
        raise RuntimeError("Less than 95% of source-confirmed BBLs have map coordinates")
    if manifest.get("is_fixture") is not False or manifest.get("data_mode") != "production":
        raise RuntimeError("Map manifest is not marked as production official data")
    print("OFFICIAL RESUMED BUILD: PASS")


if __name__ == "__main__":
    main()
