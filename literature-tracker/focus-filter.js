(function () {
  const STORAGE_KEY = "plantationToPrisonSources";

  const keepPattern = /black feminist|black mother|motherhood|mothering|maternal|parent|family|separation|reunification|reentry|release|postrelease|coming home|housing|employment|stigma|collateral|incarcerat|prison|jail|pregnan|childbirth|birth|reproductive|shackling|abolition|community support|care|autoethnograph|method|lived experience|service user/i;
  const removePattern = /cannabis|marijuana|drug arrest|drug enforcement|decriminalization|legalization|possession arrest|racial equity in cannabis|bounded equity|pipe dreams|gentrification|stop-and-frisk|stop and frisk|nypd|frisk|search and force|policing neighborhood|policing gentrification|racialized communities in canada/i;

  function sourceText(source) {
    return [
      source.title,
      source.apa,
      source.citation,
      source.category,
      source.studyType,
      source.type,
      source.lens,
      source.tags,
      source.supportClaim,
      source.use,
      source.relevance,
      source.notes
    ].flat().filter(Boolean).join(" ");
  }

  function shouldKeep(source) {
    const text = sourceText(source);
    if (removePattern.test(text)) return false;
    return keepPattern.test(text);
  }

  function filterSources(list) {
    return Array.isArray(list) ? list.filter(shouldKeep) : list;
  }

  try {
    if (typeof starterSources !== "undefined" && Array.isArray(starterSources)) {
      starterSources.splice(0, starterSources.length, ...filterSources(starterSources));
    }

    if (typeof state !== "undefined" && state && Array.isArray(state.sources)) {
      state.sources = filterSources(state.sources);
    }

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filterSources(saved)));
    }
  } catch (error) {
    // Keep the tracker running even if browser storage is unavailable.
  }
})();
