const NYC_311 = "https://data.cityofnewyork.us/resource/erm2-nwe9.json";
const CENSUS_REPORTER = "https://api.censusreporter.org/1.0/data/show/latest";
const BOROUGHS = ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"];
const GEO_TO_BOROUGH = {
  "05000US36005": "Bronx",
  "05000US36047": "Brooklyn",
  "05000US36061": "Manhattan",
  "05000US36081": "Queens",
  "05000US36085": "Staten Island",
};
const BOROUGH_CLASS = {
  Bronx: "b-bronx",
  Brooklyn: "b-brooklyn",
  Manhattan: "b-manhattan",
  Queens: "b-queens",
  "Staten Island": "b-staten",
};
const FALLBACK = {
  noise: [
    { borough: "Bronx", count: 27430 },
    { borough: "Brooklyn", count: 60810 },
    { borough: "Manhattan", count: 53320 },
    { borough: "Queens", count: 39540 },
    { borough: "Staten Island", count: 6590 },
  ],
  trend: [
    ["2020", "Bronx", 21870], ["2021", "Bronx", 26020], ["2022", "Bronx", 25340], ["2023", "Bronx", 26900], ["2024", "Bronx", 27430],
    ["2020", "Brooklyn", 52900], ["2021", "Brooklyn", 63310], ["2022", "Brooklyn", 58400], ["2023", "Brooklyn", 60480], ["2024", "Brooklyn", 60810],
    ["2020", "Manhattan", 49600], ["2021", "Manhattan", 56110], ["2022", "Manhattan", 51220], ["2023", "Manhattan", 53470], ["2024", "Manhattan", 53320],
    ["2020", "Queens", 31700], ["2021", "Queens", 37120], ["2022", "Queens", 36210], ["2023", "Queens", 38650], ["2024", "Queens", 39540],
    ["2020", "Staten Island", 5420], ["2021", "Staten Island", 6410], ["2022", "Staten Island", 6180], ["2023", "Staten Island", 6480], ["2024", "Staten Island", 6590],
  ],
  demographics: {
    Bronx: { population: 1404779, income: 48676, povertyRate: 0.278, rent: 1458, renterRate: 0.799, pocRate: 0.913 },
    Brooklyn: { population: 2631580, income: 80263, povertyRate: 0.191, rent: 1833, renterRate: 0.705, pocRate: 0.639 },
    Manhattan: { population: 1629477, income: 103931, povertyRate: 0.165, rent: 2197, renterRate: 0.749, pocRate: 0.545 },
    Queens: { population: 2323052, income: 86136, povertyRate: 0.129, rent: 1956, renterRate: 0.551, pocRate: 0.768 },
    "Staten Island": { population: 494956, income: 98333, povertyRate: 0.115, rent: 1733, renterRate: 0.323, pocRate: 0.444 },
  },
};

const state = {
  combined: [],
  trend: [],
  selectedTrend: "Brooklyn",
  sourceMode: "loading",
};

const fmt = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

document.addEventListener("DOMContentLoaded", () => {
  setupControls();
  document.getElementById("refreshButton").addEventListener("click", loadAndRender);
  document.getElementById("trendBorough").addEventListener("change", (event) => {
    state.selectedTrend = event.target.value;
    renderTrend();
  });
  loadAndRender();
});

function setupControls() {
  const startYear = document.getElementById("startYear");
  const endYear = document.getElementById("endYear");
  const currentYear = new Date().getFullYear();
  for (let year = 2020; year <= currentYear; year += 1) {
    startYear.append(new Option(year, year));
    endYear.append(new Option(year, year));
  }
  startYear.value = Math.max(2020, currentYear - 3);
  endYear.value = currentYear;

  const trendSelect = document.getElementById("trendBorough");
  BOROUGHS.forEach((borough) => trendSelect.append(new Option(borough, borough)));
  trendSelect.value = state.selectedTrend;
}

async function loadAndRender() {
  setStatus("Loading live 311 complaint counts and Census indicators...");
  const years = getYearRange();
  const types = getSelectedNoiseTypes();
  if (!types.length) {
    setStatus("Select at least one noise complaint type.");
    return;
  }

  const [noiseResult, trendResult, demoResult] = await Promise.allSettled([
    fetchNoiseCounts(years.start, years.end, types),
    fetchNoiseTrend(years.start, years.end, types),
    fetchCensusReporter(),
  ]);

  const live311 = noiseResult.status === "fulfilled" && trendResult.status === "fulfilled";
  const liveDemo = demoResult.status === "fulfilled";
  if (!live311) console.error(noiseResult.reason || trendResult.reason);
  if (!liveDemo) console.error(demoResult.reason);

  const noise = live311 ? noiseResult.value : FALLBACK.noise;
  state.trend = live311
    ? normalizeTrend(trendResult.value)
    : FALLBACK.trend.map(([year, borough, calls]) => ({ year, borough, calls }));
  state.combined = combineData(noise, liveDemo ? demoResult.value : FALLBACK.demographics);
  state.sourceMode = live311 && liveDemo ? "live" : live311 ? "live-311" : liveDemo ? "live-census" : "sample";
  renderAll();

  const statusParts = [
    live311 ? `Live 311 counts loaded for ${years.start}-${years.end}` : "using sample 311 counts",
    liveDemo ? "live Census Reporter indicators loaded" : "using embedded Census sample indicators",
  ];
  setStatus(`${statusParts.join("; ")}.`);
}

function getYearRange() {
  const start = Number(document.getElementById("startYear").value);
  const end = Number(document.getElementById("endYear").value);
  return start <= end ? { start, end } : { start: end, end: start };
}

function getSelectedNoiseTypes() {
  return [...document.querySelectorAll(".noise-types input:checked")].map((input) => input.value);
}

function whereClause(startYear, endYear, types) {
  const start = `${startYear}-01-01T00:00:00`;
  const end = `${endYear + 1}-01-01T00:00:00`;
  const typeList = types.map((type) => `'${type.replaceAll("'", "''")}'`).join(",");
  return `created_date >= '${start}' AND created_date < '${end}' AND complaint_type in(${typeList}) AND borough in('BRONX','BROOKLYN','MANHATTAN','QUEENS','STATEN ISLAND')`;
}

async function fetchNoiseCounts(startYear, endYear, types) {
  const params = new URLSearchParams({
    $select: "borough,count(*) as count",
    $where: whereClause(startYear, endYear, types),
    $group: "borough",
    $order: "borough",
  });
  const rows = await fetchJson(`${NYC_311}?${params}`);
  return rows.map((row) => ({
    borough: titleBorough(row.borough),
    count: Number(row.count),
  }));
}

async function fetchNoiseTrend(startYear, endYear, types) {
  const params = new URLSearchParams({
    $select: "date_extract_y(created_date) as year,borough,count(*) as count",
    $where: whereClause(startYear, endYear, types),
    $group: "year,borough",
    $order: "year,borough",
  });
  return fetchJson(`${NYC_311}?${params}`);
}

async function fetchCensusReporter() {
  const params = new URLSearchParams({
    table_ids: "B01003,B19013,B17001,B25064,B25003,B03002",
    geo_ids: Object.keys(GEO_TO_BOROUGH).join(","),
  });
  const payload = await fetchJson(`${CENSUS_REPORTER}?${params}`);
  return Object.entries(payload.data).reduce((memo, [geoId, tables]) => {
    const borough = GEO_TO_BOROUGH[geoId];
    if (!borough) return memo;
    const totalPoverty = censusValue(tables, "B17001", "B17001001");
    const belowPoverty = censusValue(tables, "B17001", "B17001002");
    const housingUnits = censusValue(tables, "B25003", "B25003001");
    const renterUnits = censusValue(tables, "B25003", "B25003003");
    const raceTotal = censusValue(tables, "B03002", "B03002001");
    const whiteNonHispanic = censusValue(tables, "B03002", "B03002003");
    memo[borough] = {
      population: censusValue(tables, "B01003", "B01003001"),
      income: censusValue(tables, "B19013", "B19013001"),
      povertyRate: safeDivide(belowPoverty, totalPoverty),
      rent: censusValue(tables, "B25064", "B25064001"),
      renterRate: safeDivide(renterUnits, housingUnits),
      pocRate: 1 - safeDivide(whiteNonHispanic, raceTotal),
    };
    return memo;
  }, {});
}

function censusValue(tables, table, column) {
  return num(tables?.[table]?.estimate?.[column]);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function combineData(noiseRows, currentDemo) {
  const counts = Object.fromEntries(noiseRows.map((row) => [row.borough, row.count]));
  const rows = BOROUGHS.map((borough) => {
    const demo = currentDemo[borough];
    const calls = counts[borough] || 0;
    const callsPer10k = safeDivide(calls, demo.population) * 10000;
    return {
      borough,
      calls,
      callsPer10k,
      ...demo,
    };
  });

  const normalized = {
    callsPer10k: normalize(rows.map((row) => row.callsPer10k)),
    povertyRate: normalize(rows.map((row) => row.povertyRate)),
    renterRate: normalize(rows.map((row) => row.renterRate)),
    pocRate: normalize(rows.map((row) => row.pocRate)),
    rent: normalize(rows.map((row) => row.rent)),
  };

  return rows.map((row, index) => {
    const vulnerability =
      normalized.povertyRate[index] * 0.42 +
      normalized.renterRate[index] * 0.32 +
      normalized.pocRate[index] * 0.26;
    const pressure =
      normalized.callsPer10k[index] * 0.42 +
      vulnerability * 0.36 +
      normalized.rent[index] * 0.22;
    return {
      ...row,
      vulnerability,
      pressure,
    };
  }).sort((a, b) => b.pressure - a.pressure);
}

function normalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value) => (max === min ? 0.5 : (value - min) / (max - min)));
}

function normalizeTrend(rows) {
  return rows.map((row) => ({
    year: String(row.year),
    borough: titleBorough(row.borough),
    calls: Number(row.count),
  }));
}

function renderAll() {
  renderMetrics();
  renderMap();
  renderRateChart();
  renderScatter();
  renderTrend();
  renderTable();
  renderReadout();
}

function renderMetrics() {
  const total = state.combined.reduce((sum, row) => sum + row.calls, 0);
  const highestRate = maxBy(state.combined, "callsPer10k");
  const highestVulnerability = maxBy(state.combined, "vulnerability");
  const highestRent = maxBy(state.combined, "rent");
  document.getElementById("totalCalls").textContent = fmt.format(total);
  document.getElementById("highestRate").textContent = `${highestRate.borough} (${fmt.format(Math.round(highestRate.callsPer10k))})`;
  document.getElementById("highestVulnerability").textContent = highestVulnerability.borough;
  document.getElementById("highestRentChange").textContent = `${highestRent.borough} (${money.format(highestRent.rent)})`;
}

function renderMap() {
  const map = document.getElementById("boroughMap");
  map.innerHTML = "";
  state.combined.forEach((row) => {
    const div = document.createElement("button");
    div.type = "button";
    div.className = `borough ${BOROUGH_CLASS[row.borough]}`;
    div.style.background = pressureColor(row.pressure);
    div.style.opacity = String(0.88 + row.pressure * 0.12);
    div.innerHTML = `<strong>${row.borough}</strong><span>${Math.round(row.pressure * 100)} pressure score</span><span>${fmt.format(row.calls)} calls</span>`;
    div.addEventListener("click", () => {
      state.selectedTrend = row.borough;
      document.getElementById("trendBorough").value = row.borough;
      renderTrend();
    });
    map.append(div);
  });
}

function renderRateChart() {
  const rows = [...state.combined].sort((a, b) => b.callsPer10k - a.callsPer10k);
  const width = 720;
  const height = 330;
  const margin = { top: 16, right: 26, bottom: 42, left: 142 };
  const max = Math.max(...rows.map((row) => row.callsPer10k));
  const barHeight = 38;
  const gap = 18;
  const svg = svgEl(width, height);
  rows.forEach((row, index) => {
    const y = margin.top + index * (barHeight + gap);
    const barWidth = safeDivide(row.callsPer10k, max) * (width - margin.left - margin.right);
    svg.append(textEl(margin.left - 12, y + 25, row.borough, "bar-label", "end"));
    svg.append(rectEl(margin.left, y, barWidth, barHeight, pressureColor(row.pressure), 6));
    svg.append(textEl(margin.left + barWidth + 10, y + 25, fmt.format(Math.round(row.callsPer10k)), "axis-label", "start"));
  });
  svg.append(textEl(width / 2, height - 8, "complaints per 10,000 residents", "small-label", "middle"));
  replaceChart("rateChart", svg);
}

function renderScatter() {
  const rows = state.combined;
  const width = 720;
  const height = 330;
  const margin = { top: 22, right: 30, bottom: 54, left: 62 };
  const xMax = Math.max(...rows.map((row) => row.rent)) * 1.12;
  const yMax = Math.max(...rows.map((row) => row.callsPer10k)) * 1.12;
  const svg = svgEl(width, height);
  drawAxes(svg, width, height, margin, "Median gross rent", "Calls per 10,000 residents");
  rows.forEach((row) => {
    const x = margin.left + safeDivide(row.rent, xMax) * (width - margin.left - margin.right);
    const y = height - margin.bottom - safeDivide(row.callsPer10k, yMax) * (height - margin.top - margin.bottom);
    const radius = 12 + row.vulnerability * 18;
    svg.append(circleEl(x, y, radius, pressureColor(row.pressure), 0.84));
    svg.append(textEl(x, y - radius - 6, row.borough, "point-label", "middle"));
  });
  replaceChart("scatterChart", svg);
}

function renderTrend() {
  const borough = state.selectedTrend;
  const rows = state.trend
    .filter((row) => row.borough === borough)
    .sort((a, b) => Number(a.year) - Number(b.year));
  const width = 720;
  const height = 330;
  const margin = { top: 22, right: 36, bottom: 46, left: 70 };
  const svg = svgEl(width, height);
  if (!rows.length) {
    svg.append(textEl(width / 2, height / 2, `No yearly data for ${borough}.`, "axis-label", "middle"));
    replaceChart("trendChart", svg);
    return;
  }
  const yMax = Math.max(...rows.map((row) => row.calls)) * 1.12;
  const xStep = (width - margin.left - margin.right) / Math.max(1, rows.length - 1);
  drawAxes(svg, width, height, margin, "Year", "Noise complaints");
  const points = rows.map((row, index) => {
    const x = margin.left + index * xStep;
    const y = height - margin.bottom - safeDivide(row.calls, yMax) * (height - margin.top - margin.bottom);
    return { ...row, x, y };
  });
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  svg.append(pathEl(path, "#087f83", 4));
  points.forEach((point) => {
    svg.append(circleEl(point.x, point.y, 6, "#c94836", 1));
    svg.append(textEl(point.x, height - 20, point.year, "small-label", "middle"));
    svg.append(textEl(point.x, point.y - 12, fmt.format(point.calls), "small-label", "middle"));
  });
  replaceChart("trendChart", svg);
}

function renderTable() {
  const tbody = document.getElementById("boroughTable");
  tbody.innerHTML = "";
  state.combined.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.borough}</td>
      <td>${fmt.format(row.calls)}</td>
      <td>${fmt.format(Math.round(row.callsPer10k))}</td>
      <td>${pct.format(row.povertyRate)}</td>
      <td>${pct.format(row.renterRate)}</td>
      <td>${pct.format(row.pocRate)}</td>
      <td>${money.format(row.rent)}</td>
      <td>${Math.round(row.pressure * 100)}</td>
    `;
    tbody.append(tr);
  });
}

function renderReadout() {
  const topPressure = state.combined[0];
  const topVulnerability = maxBy(state.combined, "vulnerability");
  const topRate = maxBy(state.combined, "callsPer10k");
  const overlapSentence = topRate.borough === topVulnerability.borough
    ? `${topRate.borough} has both the highest selected noise complaint rate and the strongest borough-level vulnerability profile based on poverty, renter share, and people-of-color share.`
    : `${topRate.borough} has the highest selected noise complaint rate, while ${topVulnerability.borough} has the strongest borough-level vulnerability profile based on poverty, renter share, and people-of-color share.`;
  document.getElementById("communityReadout").textContent =
    `${topPressure.borough} currently ranks highest on the combined pressure score. ` +
    `${overlapSentence} These are starting points for neighborhood-level research into who is most exposed to enforcement and displacement pressure.`;
}

function setStatus(message) {
  const prefix = state.sourceMode === "sample" ? "Sample mode: " : "";
  document.getElementById("status").textContent = `${prefix}${message}`;
}

function pressureColor(value) {
  const palette = [
    [75, 124, 72],
    [213, 155, 45],
    [201, 72, 54],
    [113, 63, 103],
  ];
  const scaled = Math.max(0, Math.min(1, value)) * (palette.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(palette.length - 1, index + 1);
  const local = scaled - index;
  const color = palette[index].map((channel, i) => Math.round(channel + (palette[next][i] - channel) * local));
  return `rgb(${color.join(",")})`;
}

function titleBorough(value) {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "STATEN ISLAND") return "Staten Island";
  return normalized.charAt(0) + normalized.slice(1).toLowerCase();
}

function maxBy(rows, key) {
  return rows.reduce((best, row) => (row[key] > best[key] ? row : best), rows[0]);
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeDivide(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function svgEl(width, height) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  return svg;
}

function rectEl(x, y, width, height, fill, radius = 0) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("width", Math.max(0, width));
  el.setAttribute("height", height);
  el.setAttribute("rx", radius);
  el.setAttribute("fill", fill);
  return el;
}

function circleEl(cx, cy, r, fill, opacity) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", cx);
  el.setAttribute("cy", cy);
  el.setAttribute("r", r);
  el.setAttribute("fill", fill);
  el.setAttribute("opacity", opacity);
  el.setAttribute("stroke", "rgba(28,31,36,.42)");
  return el;
}

function textEl(x, y, value, className, anchor = "start") {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("class", className);
  el.setAttribute("text-anchor", anchor);
  el.textContent = value;
  return el;
}

function pathEl(d, stroke, width) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", d);
  el.setAttribute("fill", "none");
  el.setAttribute("stroke", stroke);
  el.setAttribute("stroke-width", width);
  el.setAttribute("stroke-linecap", "round");
  el.setAttribute("stroke-linejoin", "round");
  return el;
}

function drawAxes(svg, width, height, margin, xLabel, yLabel) {
  svg.append(pathEl(`M ${margin.left} ${height - margin.bottom} H ${width - margin.right}`, "#b8aea0", 1.5));
  svg.append(pathEl(`M ${margin.left} ${margin.top} V ${height - margin.bottom}`, "#b8aea0", 1.5));
  svg.append(textEl(width / 2, height - 8, xLabel, "small-label", "middle"));
  const yText = textEl(18, height / 2, yLabel, "small-label", "middle");
  yText.setAttribute("transform", `rotate(-90 18 ${height / 2})`);
  svg.append(yText);
}

function replaceChart(id, svg) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  container.append(svg);
}
