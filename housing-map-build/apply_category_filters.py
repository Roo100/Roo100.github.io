from __future__ import annotations

import base64
import gzip
import json
import re
import time
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "nyc-housing-intelligence-map" / "index.html"

VIOLATION_DATASET = "wvxf-dwi5"
EVICTION_DATASET = "6z8x-wfk4"
PAGE_SIZE = 50_000
USER_AGENT = "Roo100-NYC-Housing-Intelligence/1.0"

ROW_OPEN_TOTAL = 26
ROW_OPEN_A = 27
ROW_OPEN_B = 28
ROW_OPEN_C = 29
ROW_RENT_IMPAIRING = 30
ROW_EVICTIONS_12M = 31
ROW_EVICTIONS_3Y = 32


def subtract_years(value: date, years: int) -> date:
    try:
        return value.replace(year=value.year - years)
    except ValueError:
        return value.replace(month=2, day=28, year=value.year - years)


def normalize_bbl(value: Any) -> str:
    digits = "".join(character for character in str(value or "") if character.isdigit())
    if not digits or len(digits) > 10:
        return ""
    return digits.zfill(10)


def fetch_json(url: str, attempts: int = 4) -> Any:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            request = Request(url, headers={"Accept": "application/json", "User-Agent": USER_AGENT})
            with urlopen(request, timeout=90) as response:
                return json.load(response)
        except Exception as error:
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(2**attempt)
    raise RuntimeError(f"Unable to retrieve NYC Open Data: {url}") from last_error


def socrata_pages(
    dataset_id: str,
    *,
    select: str,
    where: str,
    group: str | None = None,
    order: str | None = None,
) -> Iterable[dict[str, Any]]:
    offset = 0
    while True:
        params: dict[str, Any] = {
            "$select": select,
            "$where": where,
            "$limit": PAGE_SIZE,
            "$offset": offset,
        }
        if group:
            params["$group"] = group
        if order:
            params["$order"] = order
        url = f"https://data.cityofnewyork.us/resource/{dataset_id}.json?{urlencode(params)}"
        rows = fetch_json(url)
        if not isinstance(rows, list):
            raise RuntimeError(f"Unexpected NYC Open Data response for {dataset_id}")
        yield from rows
        if len(rows) < PAGE_SIZE:
            break
        offset += PAGE_SIZE


def load_violation_snapshot() -> dict[str, dict[str, int]]:
    summary: dict[str, dict[str, int]] = defaultdict(
        lambda: {"open_total": 0, "a": 0, "b": 0, "c": 0, "rent": 0}
    )
    rows = socrata_pages(
        VIOLATION_DATASET,
        select="bbl,class,rentimpairing,count(*) as record_count",
        where="violationstatus='Open' AND bbl IS NOT NULL",
        group="bbl,class,rentimpairing",
        order="bbl,class,rentimpairing",
    )
    for row in rows:
        bbl = normalize_bbl(row.get("bbl"))
        if not bbl:
            continue
        count = int(float(row.get("record_count") or 0))
        violation_class = str(row.get("class") or "").upper()
        if violation_class in {"A", "B", "C"}:
            summary[bbl]["open_total"] += count
            summary[bbl][violation_class.lower()] += count
        if str(row.get("rentimpairing") or "").upper() == "Y":
            summary[bbl]["rent"] += count
    return dict(summary)


def load_eviction_snapshot(today: date) -> dict[str, dict[str, int]]:
    cutoff_3y = subtract_years(today, 3).isoformat() + "T00:00:00.000"
    cutoff_12m = subtract_years(today, 1)
    summary: dict[str, dict[str, int]] = defaultdict(lambda: {"twelve_month": 0, "three_year": 0})
    rows = socrata_pages(
        EVICTION_DATASET,
        select="bbl,executed_date,residential_commercial_ind",
        where=f"executed_date >= '{cutoff_3y}' AND bbl IS NOT NULL",
        order="executed_date DESC",
    )
    for row in rows:
        bbl = normalize_bbl(row.get("bbl"))
        if not bbl:
            continue
        occupancy = str(row.get("residential_commercial_ind") or "").upper()
        if occupancy and "RESIDENT" not in occupancy:
            continue
        executed_text = str(row.get("executed_date") or "")[:10]
        try:
            executed = date.fromisoformat(executed_text)
        except ValueError:
            continue
        summary[bbl]["three_year"] += 1
        if executed >= cutoff_12m:
            summary[bbl]["twelve_month"] += 1
    return dict(summary)


def unpack_payload(document: str) -> tuple[dict[str, Any], re.Match[str]]:
    match = re.search(r'window\.COMPRESSED_HOUSING_DATA="([^"]+)";', document)
    if not match:
        raise ValueError("Compressed housing payload was not found")
    payload = json.loads(gzip.decompress(base64.b64decode(match.group(1))))
    return payload, match


def repack_payload(document: str, payload: dict[str, Any], match: re.Match[str]) -> str:
    raw = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    encoded = base64.b64encode(gzip.compress(raw, compresslevel=9)).decode("ascii")
    return document[: match.start(1)] + encoded + document[match.end(1) :]


def patch_payload(
    payload: dict[str, Any],
    violations: dict[str, dict[str, int]],
    evictions: dict[str, dict[str, int]],
    snapshot_date: str,
) -> None:
    rows = payload.get("rows")
    if not isinstance(rows, list):
        raise ValueError("Housing payload rows are missing")

    for row in rows:
        if not isinstance(row, list) or len(row) < 26:
            raise ValueError("Unexpected compact housing row structure")
        bbl = normalize_bbl(row[2])
        violation = violations.get(bbl, {})
        eviction = evictions.get(bbl, {})
        metrics = [
            int(violation.get("open_total", 0)),
            int(violation.get("a", 0)),
            int(violation.get("b", 0)),
            int(violation.get("c", 0)),
            int(violation.get("rent", 0)),
            int(eviction.get("twelve_month", 0)),
            int(eviction.get("three_year", 0)),
        ]
        if len(row) == 26:
            row.extend(metrics)
        else:
            row[26:33] = metrics

    manifest = payload.setdefault("manifest", {})
    manifest.update(
        {
            "category_filter_snapshot_date": snapshot_date,
            "category_filter_violation_dataset": VIOLATION_DATASET,
            "category_filter_eviction_dataset": EVICTION_DATASET,
            "category_filter_status": "bundled_citywide_snapshot",
            "properties_with_open_abc_violations": sum(
                1 for row in rows if int(row[ROW_OPEN_TOTAL] or 0) > 0
            ),
            "properties_with_executed_evictions_3y": sum(
                1 for row in rows if int(row[ROW_EVICTIONS_3Y] or 0) > 0
            ),
        }
    )


CATEGORY_CSS = r"""
.category-filter-panel{
  margin:16px 0;
  padding:18px;
  border:1px solid var(--rule);
  border-top:4px solid var(--gold);
  border-radius:20px;
  background:linear-gradient(180deg,#fcfbf8 0%,#f5f1e9 100%);
  box-shadow:var(--shadow);
}
.category-filter-head{
  display:flex;
  justify-content:space-between;
  align-items:end;
  gap:18px;
  margin-bottom:13px;
}
.category-filter-head h2{
  margin:4px 0 0;
  font-size:2rem;
  line-height:1;
}
.category-filter-intro{
  max-width:540px;
  margin:0;
  color:var(--muted);
  font-size:.76rem;
  line-height:1.5;
}
.category-filter-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;
}
.category-filter-control{
  padding:11px;
  border:1px solid var(--rule);
  border-radius:14px;
  background:#fff;
}
.category-filter-control label{margin-bottom:7px;color:var(--navy)}
.category-filter-summary{
  margin:11px 0 0;
  padding:9px 11px;
  border-radius:11px;
  background:#eef2f5;
  color:#405267;
  font-size:.7rem;
  line-height:1.45;
}
.category-filter-summary strong{color:var(--navy)}
.category-filter-note{
  margin:8px 0 0;
  color:var(--muted);
  font-size:.64rem;
  line-height:1.45;
}
@media(max-width:760px){
  .category-filter-head{display:block}
  .category-filter-intro{margin-top:8px}
  .category-filter-grid{grid-template-columns:1fr}
}
"""


def category_html(snapshot_date: str) -> str:
    return f"""
  <section class="category-filter-panel" aria-labelledby="categoryFilterHeading">
    <div class="category-filter-head">
      <div>
        <p class="panel-kicker">Narrow the citywide inventory</p>
        <h2 id="categoryFilterHeading">Filter by housing categories</h2>
      </div>
      <p class="category-filter-intro">Use the three filters independently or together. The default remains all source-confirmed buildings, and every selected filter further narrows the visible inventory.</p>
    </div>
    <div class="category-filter-grid">
      <div class="category-filter-control">
        <label for="violationCategoryFilter">Open HPD violations</label>
        <select id="violationCategoryFilter">
          <option value="all">All violation levels</option>
          <option value="any-open">Any open Class A, B, or C</option>
          <option value="class-c">At least one open Class C</option>
          <option value="rent-impairing">At least one rent-impairing violation</option>
          <option value="10-plus">10 or more open A/B/C violations</option>
          <option value="25-plus">25 or more open A/B/C violations</option>
          <option value="none-open">No matched open A/B/C violations</option>
        </select>
      </div>
      <div class="category-filter-control">
        <label for="portfolioCategoryFilter">Ownership portfolio</label>
        <select id="portfolioCategoryFilter">
          <option value="all">All portfolio sizes</option>
          <option value="corp-multi">Corporate owner linked to 2+ buildings</option>
          <option value="corp-5">Corporate owner linked to 5+ buildings</option>
          <option value="corp-10">Corporate owner linked to 10+ buildings</option>
          <option value="corp-25">Corporate owner linked to 25+ buildings</option>
          <option value="agent-multi">Managing agent linked to 2+ buildings</option>
          <option value="agent-5">Managing agent linked to 5+ buildings</option>
          <option value="agent-10">Managing agent linked to 10+ buildings</option>
          <option value="agent-25">Managing agent linked to 25+ buildings</option>
          <option value="no-role">No matched corporate-owner or agent role</option>
        </select>
      </div>
      <div class="category-filter-control">
        <label for="evictionCategoryFilter">Executed evictions</label>
        <select id="evictionCategoryFilter">
          <option value="all">All executed-eviction levels</option>
          <option value="any-12">At least one in past 12 months</option>
          <option value="two-plus-12">Two or more in past 12 months</option>
          <option value="any-3y">At least one in past 3 years</option>
          <option value="three-plus-3y">Three or more in past 3 years</option>
          <option value="none-3y">No matched record in past 3 years</option>
        </select>
      </div>
    </div>
    <p id="categoryFilterSummary" class="category-filter-summary"><strong>Active category filters:</strong> All buildings</p>
    <p class="category-filter-note">Violation and executed-eviction filters use a bundled official-data snapshot generated {snapshot_date}. The selected-property profile requests current live records, so a recently changed record may differ from the citywide filter snapshot. Corporate-owner and managing-agent roles remain separate.</p>
  </section>
"""


FILTER_HELPERS = r"""
  function optionLabel(select) {
    return select?.selectedOptions?.[0]?.textContent?.trim() || "All";
  }

  function categoryFilterMatches(row) {
    const violationFilter=els.violationCategory.value;
    const openTotal=Number(row[ROW.OPEN_TOTAL] || 0);
    const openC=Number(row[ROW.OPEN_C] || 0);
    const rentImpairing=Number(row[ROW.RENT_IMPAIRING] || 0);
    if (violationFilter==="any-open" && openTotal<1) return false;
    if (violationFilter==="class-c" && openC<1) return false;
    if (violationFilter==="rent-impairing" && rentImpairing<1) return false;
    if (violationFilter==="10-plus" && openTotal<10) return false;
    if (violationFilter==="25-plus" && openTotal<25) return false;
    if (violationFilter==="none-open" && openTotal!==0) return false;

    const portfolioFilter=els.portfolioCategory.value;
    const corporateSize=primaryPortfolioSize(row,"corporate");
    const agentSize=primaryPortfolioSize(row,"agent");
    if (portfolioFilter==="corp-multi" && corporateSize<2) return false;
    if (portfolioFilter==="corp-5" && corporateSize<5) return false;
    if (portfolioFilter==="corp-10" && corporateSize<10) return false;
    if (portfolioFilter==="corp-25" && corporateSize<25) return false;
    if (portfolioFilter==="agent-multi" && agentSize<2) return false;
    if (portfolioFilter==="agent-5" && agentSize<5) return false;
    if (portfolioFilter==="agent-10" && agentSize<10) return false;
    if (portfolioFilter==="agent-25" && agentSize<25) return false;
    if (portfolioFilter==="no-role" && (corporateSize>0 || agentSize>0)) return false;

    const evictionFilter=els.evictionCategory.value;
    const evictions12=Number(row[ROW.EVICTIONS_12M] || 0);
    const evictions3=Number(row[ROW.EVICTIONS_3Y] || 0);
    if (evictionFilter==="any-12" && evictions12<1) return false;
    if (evictionFilter==="two-plus-12" && evictions12<2) return false;
    if (evictionFilter==="any-3y" && evictions3<1) return false;
    if (evictionFilter==="three-plus-3y" && evictions3<3) return false;
    if (evictionFilter==="none-3y" && evictions3!==0) return false;
    return true;
  }

  function updateCategoryFilterSummary() {
    if (!els.categorySummary) return;
    const active=[];
    if (els.violationCategory.value!=="all") active.push(optionLabel(els.violationCategory));
    if (els.portfolioCategory.value!=="all") active.push(optionLabel(els.portfolioCategory));
    if (els.evictionCategory.value!=="all") active.push(optionLabel(els.evictionCategory));
    els.categorySummary.innerHTML=`<strong>Active category filters:</strong> ${active.length?esc(active.join(" · ")):"All buildings"} · ${fmt(filtered.length)} properties visible`;
  }

  function violationSnapshotColor(count) {
    if (count===0) return "#d6d2d9";
    if (count<=4) return "#b9cedd";
    if (count<=9) return "#7798b1";
    if (count<=24) return "#3f5d80";
    return "#9c4135";
  }

  function evictionSnapshotColor(count) {
    if (count===0) return "#d6d2d9";
    if (count===1) return "#d7bb76";
    if (count<=4) return "#b57a3c";
    return "#9c4135";
  }

"""


def patch_document(document: str, snapshot_date: str) -> str:
    if "categoryFilterHeading" in document:
        raise ValueError("Category filters were already inserted")

    document = document.replace("</style>", CATEGORY_CSS + "\n</style>", 1)

    dashboard_marker = '  </section>\n\n  <section class="dashboard">'
    if dashboard_marker not in document:
        raise ValueError("Map controls/dashboard boundary was not found")
    document = document.replace(
        dashboard_marker,
        '  </section>\n\n' + category_html(snapshot_date) + '\n  <section class="dashboard">',
        1,
    )

    document = document.replace(
        '<option value="agent-portfolio">Managing-agent portfolio size</option></select>',
        '<option value="agent-portfolio">Managing-agent portfolio size</option><option value="open-violations">Open A/B/C violations</option><option value="executed-evictions">Executed evictions · 3 years</option></select>',
        1,
    )

    document = document.replace(
        'FLOORS:21,BIN:22,SOURCE_ADDRESS:23,ALIASES:24,ZIP:25',
        'FLOORS:21,BIN:22,SOURCE_ADDRESS:23,ALIASES:24,ZIP:25,OPEN_TOTAL:26,OPEN_A:27,OPEN_B:28,OPEN_C:29,RENT_IMPAIRING:30,EVICTIONS_12M:31,EVICTIONS_3Y:32',
        1,
    )

    document = document.replace(
        'year:$("yearFilter"), units:$("unitFilter"), metric:$("displayMetric"),',
        'year:$("yearFilter"), units:$("unitFilter"), metric:$("displayMetric"), violationCategory:$("violationCategoryFilter"), portfolioCategory:$("portfolioCategoryFilter"), evictionCategory:$("evictionCategoryFilter"), categorySummary:$("categoryFilterSummary"),',
        1,
    )

    row_matches_marker = '  function rowMatches(row) {'
    if row_matches_marker not in document:
        raise ValueError("rowMatches function was not found")
    document = document.replace(row_matches_marker, FILTER_HELPERS + row_matches_marker, 1)

    document = document.replace(
        '    if (uf === "unknown" && u !== 0) return false;\n    return true;',
        '    if (uf === "unknown" && u !== 0) return false;\n    if (!categoryFilterMatches(row)) return false;\n    return true;',
        1,
    )

    document = document.replace(
        '    if (els.metric.value === "agent-portfolio") {\n      return portfolioColor(primaryPortfolioSize(row,"agent"));\n    }\n    return COLOR.teal;',
        '    if (els.metric.value === "agent-portfolio") {\n      return portfolioColor(primaryPortfolioSize(row,"agent"));\n    }\n    if (els.metric.value === "open-violations") {\n      return violationSnapshotColor(Number(row[ROW.OPEN_TOTAL] || 0));\n    }\n    if (els.metric.value === "executed-evictions") {\n      return evictionSnapshotColor(Number(row[ROW.EVICTIONS_3Y] || 0));\n    }\n    return COLOR.teal;',
        1,
    )

    document = document.replace(
        '    } else {\n      items = [[COLOR.teal,"Source-confirmed property"]];\n    }',
        '    } else if (els.metric.value === "open-violations") {\n      items = [["#d6d2d9","No matched open A/B/C"],["#b9cedd","1–4 open"],["#7798b1","5–9 open"],["#3f5d80","10–24 open"],["#9c4135","25+ open"]];\n    } else if (els.metric.value === "executed-evictions") {\n      items = [["#d6d2d9","No matched record · 3 years"],["#d7bb76","1 executed eviction"],["#b57a3c","2–4 executed evictions"],["#9c4135","5+ executed evictions"]];\n    } else {\n      items = [[COLOR.teal,"Source-confirmed property"]];\n    }',
        1,
    )

    document = document.replace(
        '    renderLegend();\n    if (fit) fitIndices(filtered);',
        '    renderLegend();\n    updateCategoryFilterSummary();\n    if (fit) fitIndices(filtered);',
        1,
    )

    document = document.replace(
        'els.search.value="";els.borough.value="all";els.registration.value="all";els.year.value="all";els.units.value="all";els.metric.value="source";els.sort.value="address";',
        'els.search.value="";els.borough.value="all";els.registration.value="all";els.year.value="all";els.units.value="all";els.violationCategory.value="all";els.portfolioCategory.value="all";els.evictionCategory.value="all";els.metric.value="source";els.sort.value="address";',
        1,
    )

    document = document.replace(
        '[els.borough,els.registration,els.year,els.units].forEach(e=>e.addEventListener("change",()=>applyFilters()));',
        '[els.borough,els.registration,els.year,els.units,els.violationCategory,els.portfolioCategory,els.evictionCategory].forEach(e=>e.addEventListener("change",()=>applyFilters()));',
        1,
    )

    document = document.replace(
        'const headers=["BBL","Borough","Address","Year built","Residential units","HPD registration","PLUTO owner","HPD corporate owner","Corporate-owner matched buildings","HPD agent","Managing-agent matched buildings","Source"];',
        'const headers=["BBL","Borough","Address","Year built","Residential units","HPD registration","Open Class A","Open Class B","Open Class C","Rent-impairing","Executed evictions past 12 months","Executed evictions past 3 years","PLUTO owner","HPD corporate owner","Corporate-owner matched buildings","HPD agent","Managing-agent matched buildings","Source"];',
        1,
    )

    document = document.replace(
        'lines.push([r[ROW.BBL],BORO[r[ROW.BORO_CODE]],r[ROW.ADDRESS],r[ROW.YEAR],r[ROW.UNITS],registrationLabel(r),r[ROW.PLUTO_OWNER],r[ROW.CORP_OWNER],primaryPortfolioSize(r,"corporate"),r[ROW.AGENT],primaryPortfolioSize(r,"agent"),r[ROW.SOURCE_URL]].map(q).join(","));',
        'lines.push([r[ROW.BBL],BORO[r[ROW.BORO_CODE]],r[ROW.ADDRESS],r[ROW.YEAR],r[ROW.UNITS],registrationLabel(r),r[ROW.OPEN_A],r[ROW.OPEN_B],r[ROW.OPEN_C],r[ROW.RENT_IMPAIRING],r[ROW.EVICTIONS_12M],r[ROW.EVICTIONS_3Y],r[ROW.PLUTO_OWNER],r[ROW.CORP_OWNER],primaryPortfolioSize(r,"corporate"),r[ROW.AGENT],primaryPortfolioSize(r,"agent"),r[ROW.SOURCE_URL]].map(q).join(","));',
        1,
    )

    document = document.replace(
        'bindControls();bindMap();resizeCanvas();renderLegend();updateMetrics();renderResults();renderDetail(-1);',
        'bindControls();bindMap();resizeCanvas();renderLegend();updateMetrics();renderResults();renderDetail(-1);updateCategoryFilterSummary();',
        1,
    )

    document = document.replace(
        'Ownership portfolio size is calculated from exact role-name matches within the embedded inventory.',
        'Ownership portfolio size is calculated from exact role-name matches within the embedded inventory. Citywide violation and executed-eviction category filters use a bundled official-data snapshot, while the selected-property profile requests current live records.',
        1,
    )

    required = [
        'id="violationCategoryFilter"',
        'id="portfolioCategoryFilter"',
        'id="evictionCategoryFilter"',
        'OPEN_TOTAL:26',
        'categoryFilterMatches',
        'value="open-violations"',
        'value="executed-evictions"',
    ]
    missing = [token for token in required if token not in document]
    if missing:
        raise ValueError(f"Category filter patch is incomplete: {missing}")
    return document


def main() -> None:
    if not PAGE.exists():
        raise FileNotFoundError(PAGE)

    today = date.today()
    document = PAGE.read_text(encoding="utf-8")
    payload, match = unpack_payload(document)

    violations = load_violation_snapshot()
    evictions = load_eviction_snapshot(today)
    patch_payload(payload, violations, evictions, today.isoformat())
    document = repack_payload(document, payload, match)
    document = patch_document(document, today.isoformat())
    PAGE.write_text(document, encoding="utf-8")

    print(
        json.dumps(
            {
                "page": str(PAGE),
                "snapshot_date": today.isoformat(),
                "violation_bbls": len(violations),
                "eviction_bbls": len(evictions),
                "rows": len(payload["rows"]),
                "bytes": PAGE.stat().st_size,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
