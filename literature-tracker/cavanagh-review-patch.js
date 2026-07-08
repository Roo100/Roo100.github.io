(function () {
  const STORAGE_KEY = "plantationToPrisonSources";
  const normalizeTitle = (title) => String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const cavanaghReview = {
    id: 117,
    title: "Lived Experiences of Pregnancy and Prison Through a Reproductive Justice Lens",
    authors: "Cavanagh, Shamsheri, Shen, Gaber, Liauw, Vanstone, & Kouyoumdjian",
    year: "2022",
    journal: "Social Science & Medicine, 307, 115179",
    apa: "Cavanagh, A., Shamsheri, T., Shen, K., Gaber, J., Liauw, J., Vanstone, M., & Kouyoumdjian, F. (2022). Lived experiences of pregnancy and prison through a reproductive justice lens: A qualitative meta-synthesis. Social Science & Medicine, 307, 115179. https://doi.org/10.1016/j.socscimed.2022.115179",
    link: "https://doi.org/10.1016/j.socscimed.2022.115179",
    articleFile: "articles/lived-experiences-of-pregnancy-and-prison-through-a-reproductive-justice-lens.pdf",
    articleFolder: "literature-tracker/articles",
    articleStatus: "Uploaded to Project Folder",
    category: "Pregnancy and Reproductive Justice Background",
    studyType: "Qualitative Meta-Synthesis",
    lens: "Reproductive Justice",
    status: "Reviewed",
    priority: "High",
    tags: ["pregnancy in prison", "reproductive justice", "Black feminist thought", "prison abolition", "lived experience", "qualitative meta-synthesis", "peer reviewed"],
    abstract: "This qualitative meta-synthesis reviews 31 peer-reviewed qualitative studies on pregnancy, childbirth, and postpartum experiences in carceral settings. The authors use reproductive justice and abolitionist frameworks and identify connectedness to the baby and disconnectedness from support as central themes.",
    problem: "The research problem is that carceral health research often emphasizes outcomes while giving less attention to lived experience, autonomy, separation, medical care, stigma, and reproductive justice.",
    researchQuestion: "What are the lived experiences of pregnancy, childbirth, and the postpartum period among people who are incarcerated?",
    purpose: "The purpose is to synthesize qualitative research on pregnancy and confinement through a reproductive justice lens.",
    studyMethod: "Qualitative meta-synthesis.",
    dataType: "Secondary synthesis of published peer-reviewed qualitative studies.",
    sample: "31 articles representing 25 unique studies and approximately 705 women across several national contexts.",
    methodsInstruments: "The authors searched six databases, screened studies, used CASP-informed quality appraisal, extracted study characteristics, and coded articles line-by-line using a reproductive justice framework.",
    methodology: "Qualitative meta-synthesis using database searching, screening, quality appraisal, structured extraction, and thematic coding.",
    findings: "The main findings center on connection and disconnection: connection to pregnancy and the baby, and disconnection from family, support, cultural practices, autonomy, and care. Childbirth and postpartum separation are described as especially painful and dehumanizing experiences.",
    limitations: "The synthesis was limited to English-language peer-reviewed articles and includes fewer studies on jails, immigration detention, pregnancy loss, abortion, and explicit analyses of racism.",
    supportClaim: "This is a core source for the reproductive justice framework. It supports the claim that pregnancy under carceral control must be understood through lived experience, bodily autonomy, family separation, surveillance, and reproductive self-determination.",
    relevance: "This article supports my research on Black women, criminalization, pregnancy, and reproductive control. It justifies a Black feminist phenomenological approach that centers lived experience instead of relying only on policy or health-outcome data.",
    notes: "Use as a core source for reproductive justice, abolitionist framing, pregnancy, carceral control, and lived-experience analysis."
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const sources = Array.isArray(saved) ? saved : [];
    const key = normalizeTitle(cavanaghReview.title);
    const existingIndex = sources.findIndex((source) => normalizeTitle(source.title) === key);
    if (existingIndex >= 0) sources[existingIndex] = { ...sources[existingIndex], ...cavanaghReview };
    else sources.push(cavanaghReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([cavanaghReview]));
  }
})();
