from __future__ import annotations

import json
from pathlib import Path

import geopandas as gpd
import geodatasets

OUT = Path("borough-boundaries-output")
OUT.mkdir(parents=True, exist_ok=True)

path = geodatasets.get_path("nybb")
gdf = gpd.read_file(path).to_crs(4326)

# Keep the five borough multipolygons, repair geometry, and simplify only enough
# to keep the browser asset compact while preserving the recognizable shoreline.
gdf["geometry"] = gdf.geometry.make_valid().simplify(0.00015, preserve_topology=True)
name_col = "BoroName" if "BoroName" in gdf.columns else "boro_name"
gdf = gdf[[name_col, "geometry"]].rename(columns={name_col: "borough"})

geojson = json.loads(gdf.to_json(drop_id=True))
for feature in geojson["features"]:
    feature["properties"] = {"borough": feature["properties"]["borough"]}

text = json.dumps(geojson, ensure_ascii=False, separators=(",", ":"))
(OUT / "borough_boundaries.geojson").write_text(text)
(OUT / "borough-boundaries.js").write_text("window.NYC_BOROUGH_BOUNDARIES=" + text + ";\n")
print({"features": len(geojson["features"]), "bytes": len(text.encode("utf-8"))})
