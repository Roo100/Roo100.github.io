# ArcGIS Upload Guide: NYS Incarcerated Mothers (Confirmed)

## Files
- `ny_mothers_arcgis_wide_2014_2021.csv`
- `ny_mothers_arcgis_long_share_2014_2021.csv`

## Recommended Use
- Use **long** CSV for the two-line `Mothers Share Over Time` serial chart.
- Use **wide** CSV for indicators, details, and optional data table.

## Field Schema

### long file (`ny_mothers_arcgis_long_share_2014_2021.csv`)
- `year` (Integer)
- `report_date` (Date; format `YYYY-MM-DD`)
- `series` (String)
- `value_pct` (Double)
- `value_label` (String)
- `source_url` (String)

### wide file (`ny_mothers_arcgis_wide_2014_2021.csv`)
- `year` (Integer)
- `report_date` (Date; format `YYYY-MM-DD`)
- `mothers_share_total_pct` (Double)
- `mothers_share_known_pct` (Double)
- `mothers_count` (Integer)
- `women_total` (Integer)
- `no_children` (Integer)
- `unknown_children` (Integer)
- `known_children_status_total` (Integer)
- `avg_age_women` (Double)
- `avg_min_sentence_months` (Double)
- `avg_max_sentence_months` (Double)
- `source_label` (String)
- `source_url` (String)

## ArcGIS Online Setup
1. **Content -> New item -> Your device** and upload each CSV.
2. Publish as **Hosted Table** (no geometry required).
3. In field settings, confirm `report_date` parsed as Date and numeric columns as Number.
4. Build Dashboard:
   - `Serial chart` from long table
     - Category: `report_date`
     - Series/value: `value_pct`
     - Split by: `series`
   - `Indicators` from wide table for selected year:
     - `mothers_count`
     - `mothers_share_total_pct`
     - `avg_age_women`
     - `avg_max_sentence_months`
5. Keep percentage formatting to 1 decimal.

## Data Scope
- Confirmed years: **2014 to 2021**.
- Source: NYS DOCCS Under Custody Report Table 7 and related yearly tables.
