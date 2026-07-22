from __future__ import annotations

import csv
import hashlib
import json
import math
import os
import re
import sys
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator, Sequence

import pandas as pd
import pdfplumber
import requests

OUT = Path(os.environ.get("OUTPUT_DIR", "official-data"))
RAW = OUT / "raw"
QA = OUT / "qa"
PROCESSED = OUT / "processed"
MAP = OUT / "map"
for p in (RAW, QA, PROCESSED, MAP):
    p.mkdir(parents=True, exist_ok=True)

RGB_SOURCE_YEAR = 2024
RGB_SOURCE_AS_OF = "2025-11"
RGB_PAGE_URL = "https://rentguidelinesboard.cityofnewyork.us/resources/rent-stabilized-building-lists/"
RGB_SOURCES = {
    "Manhattan": ("1", "2024-DHCR-Bldg-File-Manhattan.pdf"),
    "Bronx": ("2", "2024-DHCR-Bldg-File-Bronx.pdf"),
    "Brooklyn": ("3", "2024-DHCR-Bldg-File-Brooklyn.pdf"),
    "Queens": ("4", "2024-DHCR-Bldg-File-Queens.pdf"),
    "Staten Island": ("5", "2024-DHCR-Bldg-File-Staten-Island.pdf"),
}
for borough, (code, filename) in list(RGB_SOURCES.items()):
    RGB_SOURCES[borough] = (
        code,
        filename,
        f"https://rentguidelinesboard.cityofnewyork.us/wp-content/uploads/2025/12/{filename}",
    )

PDF_HEADERS = [
    "ZIP", "BLDGNO1", "STREET1", "STSUFX1", "BLDGNO2", "STREET2",
    "STSUFX2", "CITY", "COUNTY", "STATUS1", "STATUS2", "STATUS3", "BLOCK", "LOT",
]
SOURCE_COLUMNS = [
    "zip", "building_number_1", "street_1", "street_suffix_1",
    "building_number_2", "street_2", "street_suffix_2", "city", "county",
    "status_1", "status_2", "status_3", "block", "lot",
]
HEADER_TO_FIELD = dict(zip(PDF_HEADERS, SOURCE_COLUMNS, strict=True))
ZIP_RE = re.compile(r"^\d{5}$")
INTEGER_RE = re.compile(r"^\d+$")

SOCRATA_DOMAIN = "data.cityofnewyork.us"
DATASETS = {
    "pluto": {
        "id": "64uk-42ks",
        "select": [
            "borough", "block", "lot", "bbl", "address", "zipcode", "cd", "ownername",
            "landuse", "bldgclass", "numbldgs", "numfloors", "unitsres", "unitstotal",
            "yearbuilt", "yearalter1", "yearalter2", "latitude", "longitude", "version",
        ],
    },
    "registrations": {
        "id": "tesw-yqqr",
        "select": [
            "registrationid", "buildingid", "boroid", "boro", "housenumber",
            "lowhousenumber", "highhousenumber", "streetname", "zip", "block", "lot",
            "bin", "communityboard", "lastregistrationdate", "registrationenddate",
        ],
    },
    "contacts": {
        "id": "feu5-w2e2",
        "select": [
            "registrationcontactid", "registrationid", "type", "contactdescription",
            "corporationname", "title", "firstname", "middleinitial", "lastname",
            "businesshousenumber", "businessstreetname", "businessapartment",
            "businesscity", "businessstate", "businesszip",
        ],
    },
    "violations": {
        "id": "wvxf-dwi5",
        "select": [
            "violationid", "buildingid", "registrationid", "boro", "housenumber",
            "streetname", "zip", "block", "lot", "class", "inspectiondate",
            "novissueddate", "novdescription", "currentstatus", "currentstatusdate",
            "violationstatus", "rentimpairing", "bin", "bbl", "communityboard",
            "councildistrict", "nta", "latitude", "longitude",
        ],
    },
}

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; NYC-Housing-Intelligence/1.0; official-data-build)",
    "Accept": "*/*",
})
APP_TOKEN = os.environ.get("SOCRATA_APP_TOKEN")
if APP_TOKEN:
    SESSION.headers["X-App-Token"] = APP_TOKEN


def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean(value: Any) -> str:
    if value is None:
        return ""
    try:
        if pd.isna(value):
            return ""
    except Exception:
        pass
    return " ".join(str(value).strip().split())


def as_int(value: Any, default: int | None = None) -> int | None:
    text = clean(value)
    if not text:
        return default
    try:
        return int(float(text))
    except ValueError:
        return default


def as_float(value: Any, default: float | None = None) -> float | None:
    text = clean(value)
    if not text:
        return default
    try:
        result = float(text)
        return result if math.isfinite(result) else default
    except ValueError:
        return default


def as_bool(value: Any) -> bool:
    return clean(value).lower() in {"true", "t", "yes", "y", "1"}


def unique_nonempty(values: Iterable[Any]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for value in values:
        text = clean(value)
        if text and text not in seen:
            seen.add(text)
            out.append(text)
    return out


def chunks(values: Sequence[str], size: int) -> Iterator[list[str]]:
    for i in range(0, len(values), size):
        yield list(values[i:i + size])


def request(url: str, *, params: dict[str, Any] | None = None, timeout: int = 180, tries: int = 7) -> requests.Response:
    last: Exception | None = None
    for attempt in range(tries):
        try:
            response = SESSION.get(url, params=params, timeout=timeout)
            if response.status_code == 429 or response.status_code >= 500:
                raise RuntimeError(f"temporary HTTP {response.status_code}: {response.text[:300]}")
            response.raise_for_status()
            return response
        except Exception as exc:
            last = exc
            if attempt + 1 == tries:
                break
            delay = min(60, 2 ** attempt * 2)
            print(f"Retrying {url} after {exc!r} in {delay}s", file=sys.stderr)
            time.sleep(delay)
    raise RuntimeError(f"Request failed: {url}: {last}")


def download(url: str, path: Path) -> dict[str, Any]:
    response = request(url)
    content = response.content
    if content[:4] != b"%PDF":
        raise RuntimeError(f"Expected PDF from {url}, got {response.headers.get('content-type')}")
    path.write_bytes(content)
    return {
        "url": url,
        "path": str(path),
        "bytes": len(content),
        "sha256": hashlib.sha256(content).hexdigest(),
        "retrieved_at_utc": now_utc(),
    }


def normalize_token(value: str) -> str:
    return re.sub(r"[^A-Z0-9]", "", value.upper())


def group_words_by_line(words: list[dict[str, Any]], tolerance: float = 2.5) -> list[list[dict[str, Any]]]:
    lines: list[list[dict[str, Any]]] = []
    for word in sorted(words, key=lambda w: (float(w["top"]), float(w["x0"]))):
        if not lines:
            lines.append([word])
            continue
        current_top = sum(float(item["top"]) for item in lines[-1]) / len(lines[-1])
        if abs(float(word["top"]) - current_top) <= tolerance:
            lines[-1].append(word)
        else:
            lines.append([word])
    return [sorted(line, key=lambda w: float(w["x0"])) for line in lines]


def find_header_line(lines: list[list[dict[str, Any]]]) -> tuple[int, list[dict[str, Any]]]:
    for index, line in enumerate(lines):
        tokens = {normalize_token(str(word["text"])) for word in line}
        if {"ZIP", "BLDGNO1", "STREET1", "BLOCK", "LOT"}.issubset(tokens):
            return index, line
    raise ValueError("Could not locate PDF table header")


def header_positions(header_line: list[dict[str, Any]]) -> dict[str, float]:
    positions: dict[str, float] = {}
    for word in header_line:
        token = normalize_token(str(word["text"]))
        if token in PDF_HEADERS and token not in positions:
            positions[token] = float(word["x0"])
    missing = [header for header in PDF_HEADERS if header not in positions]
    if missing:
        raise ValueError(f"Missing expected PDF headers: {missing}")
    return positions


def column_boundaries(positions: dict[str, float]) -> list[tuple[str, float, float]]:
    ordered = [(header, positions[header]) for header in PDF_HEADERS]
    out: list[tuple[str, float, float]] = []
    for i, (header, start) in enumerate(ordered):
        left = float("-inf") if i == 0 else (ordered[i - 1][1] + start) / 2
        right = float("inf") if i == len(ordered) - 1 else (start + ordered[i + 1][1]) / 2
        out.append((header, left, right))
    return out


def words_to_cells(line: list[dict[str, Any]], boundaries: list[tuple[str, float, float]]) -> dict[str, str]:
    cells: dict[str, list[str]] = {HEADER_TO_FIELD[h]: [] for h in PDF_HEADERS}
    for word in line:
        center = (float(word["x0"]) + float(word.get("x1", word["x0"]))) / 2
        for header, left, right in boundaries:
            if left <= center < right:
                cells[HEADER_TO_FIELD[header]].append(str(word["text"]))
                break
    return {field: " ".join(values).strip() for field, values in cells.items()}


def extract_pdf(path: Path, borough: str, borough_code: str, source_url: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], int]:
    accepted: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []
    page_count = 0
    with pdfplumber.open(path) as pdf:
        page_count = len(pdf.pages)
        for page_number, page in enumerate(pdf.pages, start=1):
            words = page.extract_words(x_tolerance=1, y_tolerance=2, keep_blank_chars=False, use_text_flow=False)
            lines = group_words_by_line(words)
            try:
                header_index, header_line = find_header_line(lines)
                boundaries = column_boundaries(header_positions(header_line))
            except Exception as exc:
                rejected.append({"borough": borough, "source_page": page_number, "reason": f"page failure: {exc}"})
                continue
            for line in lines[header_index + 1:]:
                text = " ".join(str(w["text"]) for w in line).strip()
                upper = text.upper()
                if (not text or upper.startswith("LIST OF ") or upper.startswith("SOURCE:") or upper.startswith("ZIP BLDGNO1")
                        or "RENTGUIDELINESBOARD.CITYOFNEWYORK.US" in upper):
                    continue
                cells = words_to_cells(line, boundaries)
                z = cells["zip"].replace(" ", "")
                block = cells["block"].replace(" ", "")
                lot = cells["lot"].replace(" ", "")
                if ZIP_RE.fullmatch(z) and INTEGER_RE.fullmatch(block) and INTEGER_RE.fullmatch(lot):
                    bbl = make_bbl(borough_code, block, lot)
                    address1 = format_address(cells["building_number_1"], cells["street_1"], cells["street_suffix_1"])
                    address2 = format_address(cells["building_number_2"], cells["street_2"], cells["street_suffix_2"])
                    stable = hashlib.sha256(
                        f"{borough_code}|{block}|{lot}|{address1}|{address2}|{RGB_SOURCE_YEAR}".encode()
                    ).hexdigest()
                    accepted.append({
                        "source_record_id": stable,
                        "source_agency": "NYS Homes and Community Renewal",
                        "publisher": "NYC Rent Guidelines Board",
                        "source_title": "2024 Building Registration File",
                        "source_year": RGB_SOURCE_YEAR,
                        "source_as_of": RGB_SOURCE_AS_OF,
                        "source_url": source_url,
                        "source_borough": borough,
                        "borough_code": borough_code,
                        "source_page": page_number,
                        "source_zip": z,
                        "source_building_number_1": clean(cells["building_number_1"]),
                        "source_street_1": clean(cells["street_1"]),
                        "source_suffix_1": clean(cells["street_suffix_1"]),
                        "source_building_number_2": clean(cells["building_number_2"]),
                        "source_street_2": clean(cells["street_2"]),
                        "source_suffix_2": clean(cells["street_suffix_2"]),
                        "source_city": clean(cells["city"]),
                        "source_county": clean(cells["county"]),
                        "source_status_1": clean(cells["status_1"]),
                        "source_status_2": clean(cells["status_2"]),
                        "source_status_3": clean(cells["status_3"]),
                        "source_block": block,
                        "source_lot": lot,
                        "normalized_bbl": bbl,
                        "original_row_text": text,
                        "extraction_status": "parsed",
                        "verification_status": "exact_bbl",
                        "verification_notes": "",
                    })
                elif ZIP_RE.fullmatch(z) or block or lot:
                    rejected.append({
                        "borough": borough, "source_page": page_number,
                        "reason": "candidate row missing or invalid ZIP/block/lot", "original_row_text": text,
                        **cells,
                    })
    return accepted, rejected, page_count


def make_bbl(borough_code: Any, block: Any, lot: Any) -> str:
    b = int(str(borough_code).strip())
    bl = int(float(str(block).strip()))
    lo = int(float(str(lot).strip()))
    if b not in range(1, 6) or not (0 <= bl <= 99999) or not (0 <= lo <= 9999):
        raise ValueError((borough_code, block, lot))
    return f"{b}{bl:05d}{lo:04d}"


def normalize_bbl_value(value: Any) -> str:
    text = clean(value)
    if not text:
        return ""
    try:
        result = str(int(float(text))).zfill(10)
    except ValueError:
        return ""
    return result if re.fullmatch(r"[1-5]\d{9}", result) else ""


def format_address(number: Any, street: Any, suffix: Any = "") -> str:
    return " ".join(x for x in (clean(number), clean(street), clean(suffix)) if x)


def build_rgb_properties(records: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict[str, Any]] = []
    for bbl, group in records.groupby("normalized_bbl", sort=True):
        addresses: list[str] = []
        statuses: list[str] = []
        for _, r in group.iterrows():
            addresses += [
                format_address(r.source_building_number_1, r.source_street_1, r.source_suffix_1),
                format_address(r.source_building_number_2, r.source_street_2, r.source_suffix_2),
            ]
            statuses += [r.source_status_1, r.source_status_2, r.source_status_3]
        addresses = unique_nonempty(addresses)
        statuses = unique_nonempty(statuses)
        first = group.iloc[0]
        rows.append({
            "normalized_bbl": bbl,
            "borough": first.source_borough,
            "borough_code": str(first.borough_code),
            "source_year": RGB_SOURCE_YEAR,
            "source_as_of": RGB_SOURCE_AS_OF,
            "primary_source_address": addresses[0] if addresses else "",
            "source_address_aliases": json.dumps(addresses, ensure_ascii=False),
            "source_statuses": json.dumps(statuses, ensure_ascii=False),
            "source_record_count": len(group),
            "rgb_list_match": True,
            "source_url": first.source_url,
            "verification_status": "exact_bbl",
        })
    return pd.DataFrame(rows)


def socrata_query(dataset_id: str, select: Sequence[str], *, where: str | None = None,
                   order: str | None = None, page_size: int = 50000) -> tuple[pd.DataFrame, int]:
    url = f"https://{SOCRATA_DOMAIN}/resource/{dataset_id}.json"
    offset = 0
    rows: list[dict[str, Any]] = []
    requests_count = 0
    while True:
        params: dict[str, Any] = {"$select": ",".join(select), "$limit": page_size, "$offset": offset}
        if where:
            params["$where"] = where
        if order:
            params["$order"] = order
        payload = request(url, params=params, timeout=180).json()
        if not isinstance(payload, list):
            raise RuntimeError(f"Unexpected Socrata payload for {dataset_id}")
        rows.extend(payload)
        requests_count += 1
        if len(payload) < page_size:
            break
        offset += page_size
    return pd.DataFrame(rows), requests_count


def in_clause(field: str, values: Sequence[str], numeric: bool = True) -> str:
    if numeric:
        return f"{field} in ({','.join(str(int(v)) for v in values)})"
    quoted = []
    for value in values:
        quoted.append("'" + str(value).replace("'", "''") + "'")
    return f"{field} in ({','.join(quoted)})"


def download_chunked(dataset_key: str, clauses: list[str], order: str | None = None) -> tuple[pd.DataFrame, int]:
    cfg = DATASETS[dataset_key]
    frames: list[pd.DataFrame] = []
    count = 0
    for i, clause in enumerate(clauses, start=1):
        frame, req = socrata_query(cfg["id"], cfg["select"], where=clause, order=order)
        frames.append(frame)
        count += req
        if i % 25 == 0 or i == len(clauses):
            print(f"{dataset_key}: {i}/{len(clauses)} query groups; rows={sum(len(f) for f in frames):,}")
    return (pd.concat(frames, ignore_index=True) if frames else pd.DataFrame(columns=cfg["select"]), count)


def normalize_pluto(raw: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for _, r in raw.iterrows():
        bbl = normalize_bbl_value(r.get("bbl"))
        if not bbl:
            continue
        rows.append({
            "normalized_bbl": bbl,
            "pluto_address": clean(r.get("address")),
            "pluto_borough": clean(r.get("borough")),
            "pluto_zip": clean(r.get("zipcode")),
            "community_district": clean(r.get("cd")),
            "pluto_owner_name": clean(r.get("ownername")),
            "land_use": clean(r.get("landuse")),
            "building_class": clean(r.get("bldgclass")),
            "number_of_buildings": as_int(r.get("numbldgs")),
            "number_of_floors": as_float(r.get("numfloors")),
            "residential_units": as_int(r.get("unitsres")),
            "total_units": as_int(r.get("unitstotal")),
            "year_built": as_int(r.get("yearbuilt")),
            "year_altered_1": as_int(r.get("yearalter1")),
            "year_altered_2": as_int(r.get("yearalter2")),
            "latitude": as_float(r.get("latitude")),
            "longitude": as_float(r.get("longitude")),
            "pluto_version": clean(r.get("version")),
        })
    out = pd.DataFrame(rows)
    if not out.empty:
        out = out.sort_values("normalized_bbl").drop_duplicates("normalized_bbl", keep="first")
    return out


def normalize_registrations(raw: pd.DataFrame, source_bbls: set[str]) -> pd.DataFrame:
    rows = []
    for _, r in raw.iterrows():
        try:
            bbl = make_bbl(r.get("boroid"), r.get("block"), r.get("lot"))
        except Exception:
            continue
        if bbl not in source_bbls:
            continue
        rows.append({
            "registration_id": clean(r.get("registrationid")),
            "building_id": clean(r.get("buildingid")),
            "normalized_bbl": bbl,
            "bin": clean(r.get("bin")),
            "hpd_borough": clean(r.get("boro")),
            "hpd_address": format_address(r.get("housenumber") or r.get("lowhousenumber"), r.get("streetname")),
            "hpd_zip": clean(r.get("zip")),
            "community_board": clean(r.get("communityboard")),
            "last_registration_date": clean(r.get("lastregistrationdate")),
            "registration_end_date": clean(r.get("registrationenddate")),
        })
    out = pd.DataFrame(rows)
    if out.empty:
        return out
    out["_date"] = pd.to_datetime(out["last_registration_date"], errors="coerce")
    out = out.sort_values(["normalized_bbl", "_date", "registration_id"], ascending=[True, False, False])
    out["is_latest_registration"] = ~out.duplicated("normalized_bbl", keep="first")
    today = pd.Timestamp.now(tz="UTC").tz_localize(None).normalize()
    end = pd.to_datetime(out["registration_end_date"], errors="coerce")
    out["registration_is_current"] = end.ge(today)
    return out.drop(columns=["_date"])


def person_name(r: pd.Series) -> str:
    return " ".join(unique_nonempty([r.get("firstname"), r.get("middleinitial"), r.get("lastname")]))


def normalize_contacts(raw: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for _, r in raw.iterrows():
        address = " ".join(unique_nonempty([
            r.get("businesshousenumber"), r.get("businessstreetname"), r.get("businessapartment"),
            r.get("businesscity"), r.get("businessstate"), r.get("businesszip"),
        ]))
        rows.append({
            "registration_contact_id": clean(r.get("registrationcontactid")),
            "registration_id": clean(r.get("registrationid")),
            "contact_type": clean(r.get("type")),
            "contact_description": clean(r.get("contactdescription")),
            "corporation_name": clean(r.get("corporationname")),
            "person_name": person_name(r),
            "title": clean(r.get("title")),
            "business_address": address,
        })
    return pd.DataFrame(rows).drop_duplicates() if rows else pd.DataFrame()


def parse_yes(value: Any) -> bool:
    return clean(value).upper() in {"YES", "Y", "TRUE", "T", "1"}


def normalize_violations(raw: pd.DataFrame, residential_units: dict[str, int | None]):
    records = []
    coord_by_bbl: dict[str, list[tuple[float, float]]] = defaultdict(list)
    for _, r in raw.iterrows():
        bbl = normalize_bbl_value(r.get("bbl"))
        if not bbl:
            try:
                boro_map = {"MANHATTAN": 1, "BRONX": 2, "BROOKLYN": 3, "QUEENS": 4, "STATEN ISLAND": 5}
                bbl = make_bbl(boro_map.get(clean(r.get("boro")).upper(), r.get("boro")), r.get("block"), r.get("lot"))
            except Exception:
                continue
        lat, lon = as_float(r.get("latitude")), as_float(r.get("longitude"))
        if lat and lon:
            coord_by_bbl[bbl].append((lat, lon))
        records.append({
            "normalized_bbl": bbl,
            "violation_id": clean(r.get("violationid")),
            "violation_class": clean(r.get("class")).upper(),
            "inspection_date": clean(r.get("inspectiondate"))[:10],
            "current_status": clean(r.get("currentstatus")),
            "current_status_date": clean(r.get("currentstatusdate"))[:10],
            "description": clean(r.get("novdescription")),
            "rent_impairing": parse_yes(r.get("rentimpairing")),
        })
    frame = pd.DataFrame(records)
    if frame.empty:
        return pd.DataFrame(), pd.DataFrame(), coord_by_bbl
    frame = frame.sort_values(["normalized_bbl", "inspection_date", "violation_id"], ascending=[True, False, False])
    frame = frame.drop_duplicates("violation_id", keep="first")
    summary_rows = []
    recent_rows = []
    for bbl, group in frame.groupby("normalized_bbl"):
        counts = group["violation_class"].value_counts().to_dict()
        a, b, c = int(counts.get("A", 0)), int(counts.get("B", 0)), int(counts.get("C", 0))
        total = a + b + c
        units = residential_units.get(bbl)
        rate = round(total / units * 100, 2) if units and units > 0 else None
        summary_rows.append({
            "normalized_bbl": bbl,
            "open_class_a": a,
            "open_class_b": b,
            "open_class_c": c,
            "open_abc_total": total,
            "open_other_classes": int(len(group) - total),
            "open_rent_impairing": int(group["rent_impairing"].sum()),
            "most_recent_open_inspection_date": clean(group.iloc[0].inspection_date),
            "open_violations_per_100_units": rate,
        })
        recent_rows += group.head(5).to_dict("records")
    return pd.DataFrame(summary_rows), pd.DataFrame(recent_rows), coord_by_bbl


def entity_arrays(contacts: pd.DataFrame, registration_id: str) -> dict[str, str]:
    subset = contacts[contacts["registration_id"].astype(str) == str(registration_id)] if not contacts.empty else pd.DataFrame()
    result = {k: [] for k in ["corporate", "agents", "site", "individual", "joint"]}
    for _, r in subset.iterrows():
        typ = clean(r.contact_type).upper().replace(" ", "")
        name = clean(r.corporation_name) or clean(r.person_name)
        if not name:
            continue
        if "CORPORATEOWNER" in typ or ("OWNER" in typ and r.corporation_name):
            result["corporate"].append(name)
        elif typ in {"AGENT", "MANAGINGAGENT"} or "AGENT" in typ:
            result["agents"].append(name)
        elif "SITEMANAGER" in typ:
            result["site"].append(name)
        elif "JOINTOWNER" in typ:
            result["joint"].append(name)
        elif "INDIVIDUALOWNER" in typ or typ == "OWNER":
            result["individual"].append(name)
    return {k: json.dumps(unique_nonempty(v), ensure_ascii=False) for k, v in result.items()}


def build_housing(rgb: pd.DataFrame, pluto: pd.DataFrame, registrations: pd.DataFrame,
                  contacts: pd.DataFrame, violations: pd.DataFrame,
                  coord_by_bbl: dict[str, list[tuple[float, float]]]) -> pd.DataFrame:
    pluto_map = pluto.set_index("normalized_bbl").to_dict("index") if not pluto.empty else {}
    latest_regs = registrations[registrations["is_latest_registration"] == True] if not registrations.empty else pd.DataFrame()
    reg_map = latest_regs.set_index("normalized_bbl").to_dict("index") if not latest_regs.empty else {}
    vio_map = violations.set_index("normalized_bbl").to_dict("index") if not violations.empty else {}
    updated = now_utc()
    rows = []
    for _, source in rgb.iterrows():
        bbl = source.normalized_bbl
        p = pluto_map.get(bbl, {})
        reg = reg_map.get(bbl, {})
        v = vio_map.get(bbl, {})
        arrays = entity_arrays(contacts, clean(reg.get("registration_id")))
        lat, lon = p.get("latitude"), p.get("longitude")
        if (not lat or not lon) and coord_by_bbl.get(bbl):
            coords = coord_by_bbl[bbl]
            lat = sum(x[0] for x in coords) / len(coords)
            lon = sum(x[1] for x in coords) / len(coords)
        rows.append({
            **source.to_dict(),
            "pluto_address": p.get("pluto_address", ""),
            "pluto_zip": p.get("pluto_zip", ""),
            "community_district": p.get("community_district", ""),
            "year_built": p.get("year_built"),
            "residential_units": p.get("residential_units"),
            "total_units": p.get("total_units"),
            "number_of_buildings": p.get("number_of_buildings"),
            "number_of_floors": p.get("number_of_floors"),
            "building_class": p.get("building_class", ""),
            "land_use": p.get("land_use", ""),
            "pluto_owner_name": p.get("pluto_owner_name", ""),
            "latitude": lat,
            "longitude": lon,
            "pluto_version": p.get("pluto_version", ""),
            "hpd_registration_id": reg.get("registration_id", ""),
            "hpd_building_id": reg.get("building_id", ""),
            "bin": reg.get("bin", ""),
            "hpd_registration_current": reg.get("registration_is_current", False),
            "hpd_registration_end_date": reg.get("registration_end_date", ""),
            "hpd_corporate_owners": arrays["corporate"],
            "hpd_agents": arrays["agents"],
            "hpd_site_managers": arrays["site"],
            "hpd_individual_owners": arrays["individual"],
            "hpd_joint_owners": arrays["joint"],
            "open_class_a": int(v.get("open_class_a", 0) or 0),
            "open_class_b": int(v.get("open_class_b", 0) or 0),
            "open_class_c": int(v.get("open_class_c", 0) or 0),
            "open_abc_total": int(v.get("open_abc_total", 0) or 0),
            "open_other_classes": int(v.get("open_other_classes", 0) or 0),
            "open_rent_impairing": int(v.get("open_rent_impairing", 0) or 0),
            "most_recent_open_inspection_date": v.get("most_recent_open_inspection_date", ""),
            "open_violations_per_100_units": v.get("open_violations_per_100_units"),
            "enrichment_updated_at_utc": updated,
        })
    return pd.DataFrame(rows)


def parse_json_array(value: Any) -> list[str]:
    if isinstance(value, list):
        return value
    text = clean(value)
    if not text:
        return []
    try:
        parsed = json.loads(text)
        return [str(x) for x in parsed] if isinstance(parsed, list) else []
    except json.JSONDecodeError:
        return []


def build_map_assets(housing: pd.DataFrame, recent: pd.DataFrame) -> dict[str, Any]:
    features = []
    for _, r in housing.iterrows():
        lat, lon = as_float(r.latitude), as_float(r.longitude)
        if lat is None or lon is None or not (40.3 <= lat <= 41.1 and -74.4 <= lon <= -73.5):
            continue
        props = {
            "bbl": r.normalized_bbl,
            "borough": r.borough,
            "borough_code": as_int(r.borough_code),
            "source_year": RGB_SOURCE_YEAR,
            "source_as_of": RGB_SOURCE_AS_OF,
            "primary_source_address": r.primary_source_address or None,
            "source_address_aliases": parse_json_array(r.source_address_aliases),
            "source_statuses": parse_json_array(r.source_statuses),
            "source_record_count": as_int(r.source_record_count, 0),
            "rgb_list_match": True,
            "source_url": r.source_url,
            "verification_status": r.verification_status,
            "pluto_address": r.pluto_address or r.primary_source_address or None,
            "pluto_zip": r.pluto_zip or None,
            "community_district": r.community_district or None,
            "year_built": as_int(r.year_built),
            "residential_units": as_int(r.residential_units),
            "total_units": as_int(r.total_units),
            "number_of_buildings": as_int(r.number_of_buildings),
            "number_of_floors": as_float(r.number_of_floors),
            "building_class": r.building_class or None,
            "land_use": r.land_use or None,
            "pluto_owner_name": r.pluto_owner_name or None,
            "pluto_version": r.pluto_version or None,
            "hpd_registration_id": r.hpd_registration_id or None,
            "hpd_building_id": r.hpd_building_id or None,
            "bin": r.bin or None,
            "hpd_registration_current": as_bool(r.hpd_registration_current),
            "hpd_registration_end_date": r.hpd_registration_end_date or None,
            "hpd_corporate_owners": parse_json_array(r.hpd_corporate_owners),
            "hpd_agents": parse_json_array(r.hpd_agents),
            "hpd_site_managers": parse_json_array(r.hpd_site_managers),
            "hpd_individual_owners": parse_json_array(r.hpd_individual_owners),
            "hpd_joint_owners": parse_json_array(r.hpd_joint_owners),
            "open_class_a": as_int(r.open_class_a, 0),
            "open_class_b": as_int(r.open_class_b, 0),
            "open_class_c": as_int(r.open_class_c, 0),
            "open_abc_total": as_int(r.open_abc_total, 0),
            "open_other_classes": as_int(r.open_other_classes, 0),
            "open_rent_impairing": as_int(r.open_rent_impairing, 0),
            "most_recent_open_inspection_date": r.most_recent_open_inspection_date or None,
            "open_violations_per_100_units": as_float(r.open_violations_per_100_units),
            "enrichment_updated_at_utc": r.enrichment_updated_at_utc,
        }
        features.append({"type": "Feature", "id": r.normalized_bbl,
                         "geometry": {"type": "Point", "coordinates": [lon, lat]}, "properties": props})
    by_bbl: dict[str, list[dict[str, Any]]] = defaultdict(list)
    if not recent.empty:
        for _, r in recent.iterrows():
            by_bbl[str(r.normalized_bbl)].append({
                "bbl": str(r.normalized_bbl), "violation_id": str(r.violation_id),
                "class": r.violation_class or None, "inspection_date": r.inspection_date or None,
                "current_status": r.current_status or None, "current_status_date": r.current_status_date or None,
                "description": r.description or None, "rent_impairing": bool(r.rent_impairing),
            })
    borough_counts = pd.Series([f["properties"]["borough"] for f in features]).value_counts().to_dict()
    manifest = {
        "project": "NYC Housing Intelligence Map", "gate": "5", "data_mode": "production",
        "is_fixture": False, "property_count": len(features), "source_property_count": len(housing),
        "properties_without_coordinates": int(len(housing) - len(features)), "borough_counts": borough_counts,
        "source_years": [RGB_SOURCE_YEAR], "source_as_of_values": [RGB_SOURCE_AS_OF],
        "built_at_utc": now_utc(),
        "source_catalog": [
            {"name": "NYC Rent Guidelines Board rent-stabilized building lists", "agency": "NYC RGB / NYS HCR", "url": RGB_PAGE_URL},
            {"name": "Primary Land Use Tax Lot Output (PLUTO)", "agency": "NYC Planning", "url": "https://data.cityofnewyork.us/d/64uk-42ks"},
            {"name": "Multiple Dwelling Registrations", "agency": "NYC HPD", "url": "https://data.cityofnewyork.us/d/tesw-yqqr"},
            {"name": "Registration Contacts", "agency": "NYC HPD", "url": "https://data.cityofnewyork.us/d/feu5-w2e2"},
            {"name": "Housing Maintenance Code Violations", "agency": "NYC HPD", "url": "https://data.cityofnewyork.us/d/wvxf-dwi5"},
        ],
    }
    geojson = {"type": "FeatureCollection", "features": features}
    (MAP / "housing_properties.geojson").write_text(json.dumps(geojson, ensure_ascii=False, separators=(",", ":")))
    (MAP / "recent_violations.json").write_text(json.dumps(by_bbl, ensure_ascii=False, separators=(",", ":")))
    (MAP / "manifest.json").write_text(json.dumps(manifest, indent=2))
    js = "window.HOUSING_MAP_DATA=" + json.dumps(geojson, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += "window.HOUSING_RECENT_VIOLATIONS=" + json.dumps(by_bbl, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += "window.HOUSING_MAP_MANIFEST=" + json.dumps(manifest, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (MAP / "map-data.js").write_text(js)
    return manifest


def main() -> None:
    print("Step 1/5: official RGB/HCR PDFs")
    source_manifest = []
    all_records: list[dict[str, Any]] = []
    all_rejected: list[dict[str, Any]] = []
    extraction_summary = []
    for borough, (code, filename, url) in RGB_SOURCES.items():
        path = RAW / filename
        source_manifest.append({"borough": borough, **download(url, path)})
        records, rejected, page_count = extract_pdf(path, borough, code, url)
        if not records:
            raise RuntimeError(f"{borough}: zero extracted records")
        rejection_rate = len(rejected) / max(1, len(records) + len(rejected))
        if rejection_rate > 0.05:
            raise RuntimeError(f"{borough}: rejected {rejection_rate:.1%} of candidate rows")
        all_records += records
        all_rejected += rejected
        extraction_summary.append({
            "borough": borough, "pages": page_count, "rows": len(records),
            "rejected": len(rejected), "unique_bbls": len({r['normalized_bbl'] for r in records}),
            "rejection_rate": rejection_rate,
        })
        print(f"  {borough}: {len(records):,} rows / {extraction_summary[-1]['unique_bbls']:,} BBLs")
    pd.DataFrame(source_manifest).to_csv(QA / "rgb_source_manifest.csv", index=False)
    pd.DataFrame(extraction_summary).to_csv(QA / "rgb_extraction_summary.csv", index=False)
    pd.DataFrame(all_rejected).to_csv(QA / "rgb_rejected_rows.csv", index=False)
    source_records = pd.DataFrame(all_records)
    source_records.to_csv(PROCESSED / "rgb_source_records.csv", index=False, quoting=csv.QUOTE_MINIMAL)
    rgb = build_rgb_properties(source_records)
    rgb.to_csv(PROCESSED / "rgb_properties.csv", index=False)
    bbls = sorted(rgb.normalized_bbl.astype(str).unique())
    source_bbls = set(bbls)
    print(f"Official source-confirmed property universe: {len(bbls):,} BBLs")

    print("Step 2/5: PLUTO")
    pluto_clauses = [in_clause("bbl", group) for group in chunks(bbls, 350)]
    pluto_raw, pluto_requests = download_chunked("pluto", pluto_clauses, order="bbl")
    pluto_raw.to_csv(RAW / "pluto.csv", index=False)
    pluto = normalize_pluto(pluto_raw)
    pluto.to_csv(PROCESSED / "pluto_properties.csv", index=False)
    print(f"PLUTO matches: {len(pluto):,}")

    print("Step 3/5: HPD registrations and contacts")
    reg_raw, reg_requests = socrata_query(DATASETS["registrations"]["id"], DATASETS["registrations"]["select"], order="registrationid")
    reg_raw.to_csv(RAW / "hpd_registrations_all.csv", index=False)
    registrations = normalize_registrations(reg_raw, source_bbls)
    registrations.to_csv(PROCESSED / "hpd_registrations.csv", index=False)
    latest = registrations[registrations["is_latest_registration"] == True] if not registrations.empty else pd.DataFrame()
    reg_ids = sorted(set(latest.registration_id.astype(str))) if not latest.empty else []
    contact_clauses = [in_clause("registrationid", group) for group in chunks(reg_ids, 500)]
    contacts_raw, contact_requests = download_chunked("contacts", contact_clauses, order="registrationid,registrationcontactid") if contact_clauses else (pd.DataFrame(), 0)
    contacts_raw.to_csv(RAW / "hpd_contacts.csv", index=False)
    contacts = normalize_contacts(contacts_raw)
    contacts.to_csv(PROCESSED / "hpd_contacts.csv", index=False)
    print(f"Latest HPD registrations: {len(latest):,}; contacts: {len(contacts):,}")

    print("Step 4/5: open HPD violations")
    violation_clauses = [f"({in_clause('bbl', group)}) and violationstatus='Open'" for group in chunks(bbls, 220)]
    violations_raw, violation_requests = download_chunked("violations", violation_clauses, order="bbl,inspectiondate desc,violationid desc")
    violations_raw.to_csv(RAW / "hpd_open_violations.csv", index=False)
    unit_lookup = dict(zip(pluto.normalized_bbl, pluto.residential_units, strict=False)) if not pluto.empty else {}
    violation_summary, recent, coord_by_bbl = normalize_violations(violations_raw, unit_lookup)
    violation_summary.to_csv(PROCESSED / "violation_summary.csv", index=False)
    recent.to_csv(PROCESSED / "recent_violations.csv", index=False)
    print(f"Open violation records: {len(violations_raw):,}; properties with open A/B/C: {len(violation_summary):,}")

    print("Step 5/5: production map assets")
    housing = build_housing(rgb, pluto, registrations, contacts, violation_summary, coord_by_bbl)
    housing.to_csv(PROCESSED / "housing_properties.csv", index=False)
    manifest = build_map_assets(housing, recent)
    qa = {
        "built_at_utc": now_utc(), "source_records": len(source_records), "source_bbls": len(rgb),
        "pluto_matches": len(pluto), "latest_hpd_registrations": len(latest), "hpd_contacts": len(contacts),
        "open_violation_records": len(violations_raw), "recent_violation_records": len(recent),
        "mapped_properties": manifest["property_count"], "properties_without_coordinates": manifest["properties_without_coordinates"],
        "requests": {"pluto": pluto_requests, "registrations": reg_requests, "contacts": contact_requests, "violations": violation_requests},
    }
    (QA / "official_build_summary.json").write_text(json.dumps(qa, indent=2))
    print(json.dumps(qa, indent=2))
    if manifest["property_count"] < len(rgb) * 0.95:
        raise RuntimeError("Less than 95% of source-confirmed BBLs have map coordinates")
    print("OFFICIAL BUILD: PASS")


if __name__ == "__main__":
    main()
