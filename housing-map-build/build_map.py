from __future__ import annotations

import base64
import csv
import gzip
import html as html_lib
import io
import json
import os
import re
import shutil
import sys
import zipfile
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
BUILD_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = ROOT / "housing-map-artifact"
UNPACKED_DIR = ROOT / "housing-map-unpacked"
OUTPUT_DIR = ROOT / "nyc-housing-intelligence-map"
PORTFOLIO_INDEX = ROOT / "index.html"
COVER_PATH = ROOT / "nyc-housing-intelligence-map-cover.svg"

BOROUGH_NAME = {
    1: "Manhattan",
    2: "Bronx",
    3: "Brooklyn",
    4: "Queens",
    5: "Staten Island",
}


def clean(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).strip().split())


def as_int(value: Any, default: int = 0) -> int:
    text = clean(value)
    if not text:
        return default
    try:
        return int(float(text))
    except (TypeError, ValueError):
        return default


def as_float(value: Any, default: float = 0.0) -> float:
    text = clean(value)
    if not text:
        return default
    try:
        return float(text)
    except (TypeError, ValueError):
        return default


def as_bool(value: Any) -> bool:
    return clean(value).lower() in {"true", "t", "yes", "y", "1"}


def unique(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for value in values:
        text = clean(value)
        if text and text not in seen:
            seen.add(text)
            out.append(text)
    return out


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def locate_official_data() -> Path:
    candidates = list(UNPACKED_DIR.rglob("official-data/processed/rgb_properties.csv"))
    if not candidates:
        raise FileNotFoundError(
            "The downloaded workflow artifact did not contain "
            "official-data/processed/rgb_properties.csv"
        )
    return candidates[0].parents[1]


def unpack_artifact() -> None:
    if UNPACKED_DIR.exists():
        shutil.rmtree(UNPACKED_DIR)
    UNPACKED_DIR.mkdir(parents=True)

    archives = list(ARTIFACT_DIR.glob("*.zip"))
    if not archives:
        raise FileNotFoundError(f"No ZIP archive found under {ARTIFACT_DIR}")

    for archive_path in archives:
        with zipfile.ZipFile(archive_path) as archive:
            archive.extractall(UNPACKED_DIR)

    # Some Actions artifacts contain one nested package ZIP.
    nested = list(UNPACKED_DIR.glob("*.zip"))
    for archive_path in nested:
        target = UNPACKED_DIR / archive_path.stem
        target.mkdir(exist_ok=True)
        with zipfile.ZipFile(archive_path) as archive:
            archive.extractall(target)


def load_boundaries() -> dict[str, Any]:
    text = "".join(
        path.read_text(encoding="utf-8")
        for path in sorted(BUILD_DIR.glob("borough.part*"))
    )
    if not text:
        raise FileNotFoundError("No borough boundary fragments were found")
    boundaries = json.loads(text)
    if len(boundaries.get("features", [])) != 5:
        raise ValueError("Expected exactly five NYC borough boundary features")
    return boundaries


def registration_contacts(
    contacts: list[dict[str, str]],
) -> dict[str, dict[str, list[str]]]:
    by_registration: dict[str, dict[str, list[str]]] = defaultdict(
        lambda: defaultdict(list)
    )
    for row in contacts:
        registration_id = clean(row.get("registration_id"))
        contact_type = clean(row.get("contact_type"))
        if not registration_id or not contact_type:
            continue
        corporation = clean(row.get("corporation_name"))
        person = clean(row.get("person_name"))
        name = corporation or person
        if name:
            by_registration[registration_id][contact_type].append(name)
    return {
        registration_id: {
            role: unique(names)
            for role, names in role_map.items()
        }
        for registration_id, role_map in by_registration.items()
    }


def build_payload(official_data: Path) -> dict[str, Any]:
    processed = official_data / "processed"
    rgb_rows = read_csv(processed / "rgb_properties.csv")
    pluto_rows = read_csv(processed / "pluto_properties.csv")
    registration_rows = read_csv(processed / "hpd_registrations.csv")
    contact_rows = read_csv(processed / "hpd_contacts.csv")

    rgb_by_bbl = {clean(row.get("normalized_bbl")): row for row in rgb_rows}
    pluto_by_bbl = {clean(row.get("normalized_bbl")): row for row in pluto_rows}

    registration_by_bbl: dict[str, dict[str, str]] = {}
    for row in registration_rows:
        bbl = clean(row.get("normalized_bbl"))
        if not bbl:
            continue
        previous = registration_by_bbl.get(bbl)
        if previous is None or as_bool(row.get("is_latest_registration")):
            registration_by_bbl[bbl] = row

    contacts_by_registration = registration_contacts(contact_rows)

    compact_rows: list[list[Any]] = []
    mapped_by_borough: dict[str, int] = defaultdict(int)
    current_registration_count = 0
    contact_match_count = 0

    for bbl, rgb in rgb_by_bbl.items():
        pluto = pluto_by_bbl.get(bbl)
        if not pluto:
            continue
        lon = as_float(pluto.get("longitude"), float("nan"))
        lat = as_float(pluto.get("latitude"), float("nan"))
        if not (-180 <= lon <= 180 and -90 <= lat <= 90):
            continue

        registration = registration_by_bbl.get(bbl, {})
        registration_id = clean(registration.get("registration_id"))
        contacts = contacts_by_registration.get(registration_id, {})
        is_current = as_bool(registration.get("registration_is_current"))
        registration_code = 2 if is_current else (1 if registration_id else 0)
        if is_current:
            current_registration_count += 1

        corporate_owners = contacts.get("CorporateOwner", [])
        agents = contacts.get("Agent", [])
        site_managers = contacts.get("SiteManager", [])
        individual_owners = contacts.get("IndividualOwner", [])
        joint_owners = contacts.get("JointOwner", [])
        pluto_owner = clean(pluto.get("pluto_owner_name"))
        if corporate_owners or agents or pluto_owner:
            contact_match_count += 1

        aliases_raw = clean(rgb.get("source_address_aliases"))
        aliases: list[str]
        try:
            parsed = json.loads(aliases_raw) if aliases_raw else []
            aliases = parsed if isinstance(parsed, list) else [aliases_raw]
        except json.JSONDecodeError:
            aliases = [part.strip() for part in aliases_raw.split("|") if part.strip()]

        borough_code = as_int(rgb.get("borough_code"))
        borough = BOROUGH_NAME.get(borough_code, clean(rgb.get("borough")))
        mapped_by_borough[borough] += 1

        compact_rows.append(
            [
                round(lon, 6),
                round(lat, 6),
                bbl,
                borough_code,
                clean(pluto.get("pluto_address"))
                or clean(rgb.get("primary_source_address")),
                as_int(pluto.get("year_built")),
                as_int(pluto.get("residential_units")),
                registration_code,
                clean(registration.get("building_id")),
                registration_id,
                clean(registration.get("registration_end_date")),
                pluto_owner,
                "; ".join(corporate_owners),
                "; ".join(agents),
                "; ".join(site_managers),
                "; ".join(individual_owners),
                "; ".join(joint_owners),
                clean(rgb.get("source_url")),
                as_int(rgb.get("source_year"), 2024),
                clean(pluto.get("building_class")),
                as_int(pluto.get("total_units")),
                as_float(pluto.get("number_of_floors")),
                clean(registration.get("bin")),
                clean(rgb.get("primary_source_address")),
                aliases,
                clean(pluto.get("pluto_zip"))[:5],
            ]
        )

    compact_rows.sort(key=lambda row: (row[3], row[4], row[2]))

    manifest = {
        "data_mode": "production",
        "is_fixture": False,
        "source_years": [2024],
        "source_as_of": "2025-11",
        "source_property_count": len(rgb_by_bbl),
        "property_count": len(compact_rows),
        "current_hpd_registration_count": current_registration_count,
        "owner_or_agent_match_count": contact_match_count,
        "mapped_by_borough": dict(sorted(mapped_by_borough.items())),
        "pluto_version": next(
            (
                clean(row.get("pluto_version"))
                for row in pluto_rows
                if clean(row.get("pluto_version"))
            ),
            "26v1",
        ),
        "violation_data_status": "live_request_on_selection",
    }

    if len(compact_rows) < 46000:
        raise RuntimeError(
            f"Only {len(compact_rows):,} properties were mapped; expected at least 46,000"
        )

    return {
        "rows": compact_rows,
        "boundaries": load_boundaries(),
        "manifest": manifest,
    }


def load_template() -> str:
    parts = sorted(BUILD_DIR.glob("template.part*"))
    if not parts:
        raise FileNotFoundError("No HTML template fragments were found")
    template = "".join(path.read_text(encoding="utf-8") for path in parts)
    if "__COMPRESSED_HOUSING_DATA__" not in template:
        raise ValueError("Compressed-data placeholder was not found in the template")
    return template


def write_map(payload: dict[str, Any]) -> Path:
    raw = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    encoded = base64.b64encode(gzip.compress(raw, compresslevel=9)).decode("ascii")
    document = load_template().replace("__COMPRESSED_HOUSING_DATA__", encoded)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / "index.html"
    output.write_text(document, encoding="utf-8")
    (OUTPUT_DIR / ".nojekyll").write_text("", encoding="utf-8")
    return output


def write_cover() -> None:
    COVER_PATH.write_text(
        """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1260 540" role="img" aria-labelledby="title desc">
<title id="title">NYC Housing Intelligence Map</title>
<desc id="desc">Editorial map illustration showing New York City housing records.</desc>
<rect width="1260" height="540" fill="#f7f5f0"/>
<path d="M0 410C190 300 320 346 470 252S760 166 1260 86V540H0Z" fill="#dfe8ec"/>
<g fill="#fcfbf8" stroke="#0f1b2d" stroke-width="5" opacity=".96">
<path d="M86 420 242 272 406 236 492 322 398 500 198 510Z"/>
<path d="m472 234 72-174 62 16-38 284-72 58Z"/>
<path d="m588 302 186-144 206 44-44 176-206 104Z"/>
<path d="m756 104 176-64 144 96-94 116-230-62Z"/>
<path d="m106 226 90-70 124 28-60 86-126 24Z"/>
</g>
<g fill="#3f5d80">
<circle cx="178" cy="389" r="9"/><circle cx="232" cy="326" r="8"/><circle cx="340" cy="286" r="8"/>
<circle cx="520" cy="182" r="8"/><circle cx="540" cy="116" r="8"/><circle cx="654" cy="286" r="9"/>
<circle cx="716" cy="240" r="8"/><circle cx="812" cy="210" r="9"/><circle cx="904" cy="246" r="8"/>
<circle cx="896" cy="100" r="8"/><circle cx="1008" cy="150" r="9"/><circle cx="1100" cy="112" r="8"/>
</g>
<rect x="710" y="350" width="472" height="126" rx="24" fill="#fcfbf8" stroke="#d8d3ca" stroke-width="3"/>
<text x="746" y="394" fill="#5f6775" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="3">HOUSING &amp; PUBLIC RECORDS</text>
<text x="746" y="443" fill="#0f1b2d" font-family="Georgia,serif" font-size="43" font-weight="700">NYC Housing Intelligence</text>
</svg>""",
        encoding="utf-8",
    )


def update_portfolio() -> bool:
    if not PORTFOLIO_INDEX.exists():
        return False

    text = PORTFOLIO_INDEX.read_text(encoding="utf-8")
    marker = 'href="nyc-housing-intelligence-map/"'
    if marker in text:
        return False

    card = """
          <div class="card">
            <div class="card-image">
              <img src="nyc-housing-intelligence-map-cover.svg" alt="Preview of NYC Housing Intelligence Map">
            </div>
            <div class="card-body">
              <div class="project-type">Housing &amp; Public Records Dashboard</div>
              <h3>NYC Housing Intelligence Map</h3>
              <p>Searchable map of source-confirmed rent-stabilized building-list properties with HPD violations, ownership roles, reported complaints, executed-eviction context, and neighborhood affordability indicators.</p>
              <div class="tags">
                <span class="tag">Rent Stabilization</span>
                <span class="tag">HPD Records</span>
                <span class="tag">Housing Conditions</span>
                <span class="tag">Interactive Map</span>
              </div>
              <div class="button-stack">
                <a class="button" href="nyc-housing-intelligence-map/" target="_blank">View Interactive Map</a>
              </div>
            </div>
          </div>
"""
    grid_marker = '<div class="project-grid">'
    if grid_marker not in text:
        raise ValueError("Portfolio project grid was not found")
    text = text.replace(grid_marker, grid_marker + "\n" + card, 1)
    PORTFOLIO_INDEX.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    unpack_artifact()
    official_data = locate_official_data()
    payload = build_payload(official_data)
    output = write_map(payload)
    write_cover()
    portfolio_changed = update_portfolio()

    manifest = payload["manifest"]
    print(
        json.dumps(
            {
                "output": str(output.relative_to(ROOT)),
                "properties": manifest["property_count"],
                "source_properties": manifest["source_property_count"],
                "current_hpd_registrations": manifest[
                    "current_hpd_registration_count"
                ],
                "owner_or_agent_matches": manifest["owner_or_agent_match_count"],
                "portfolio_updated": portfolio_changed,
                "output_bytes": output.stat().st_size,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
