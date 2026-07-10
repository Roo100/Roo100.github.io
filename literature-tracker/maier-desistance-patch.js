(function () {
  const STORAGE_KEY = "plantationToPrisonSources";
  const normalizeTitle = (title) => String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const source = {
    id: 220,
    title: "Desistance, Social Justice and Lived Experience",
    authors: "Maier, Ricciardelli, & Maruna",
    year: "2022",
    journal: "Journal of Prisoners on Prisons, 31(1), 1–9",
    apa: "Maier, K., Ricciardelli, R., & Maruna, S. (2022). Desistance, social justice and lived experience. Journal of Prisoners on Prisons, 31(1), 1–9. University of Ottawa Press. https://www.jstor.org/stable/jj.22247015.3",
    link: "https://www.jstor.org/stable/jj.22247015.3",
    articleFile: "articles/maier-ricciardelli-maruna-2022-desistance-social-justice-lived-experience.pdf",
    articleFolder: "literature-tracker/articles",
    articleStatus: "Uploaded to Project Folder",
    category: "Abolitionist Care, Practice, and Community Support",
    studyType: "Editorial / Commentary",
    lens: "Lived Experience / Desistance",
    status: "Reviewed",
    priority: "High",
    tags: ["desistance", "lived experience", "reentry", "social justice", "criminalized people", "community", "autoethnography", "penal harm"],
    abstract: "This issue introduction argues that criminalized and marginalized people’s voices are essential to understanding punishment, law, justice, incarceration, reentry, and change. It frames desistance as more than recidivism reduction, emphasizing lived experience, social justice, community, dignity, and systems that support belonging rather than exclusion.",
    problem: "The article identifies a problem in criminology and criminal justice scholarship: people directly impacted by the criminal legal system are often treated as objects of study rather than as experts, theorists, and knowledge producers. It also challenges narrow rehabilitative models that focus on treatment, risk, or recidivism without addressing structural marginalization, stigma, socio-economic disadvantage, and the harms produced by prisons.",
    purpose: "The purpose is to introduce a special issue that advances theoretical, empirical, and experiential work on desistance, social justice, and lived experience. The authors argue that scholarship should listen to people who have experienced incarceration and reentry, because their narratives clarify what desistance means, what supports or frustrates it, and what kinds of institutional and community changes are necessary.",
    studyMethod: "Editorial/theoretical introduction, not a traditional empirical study. The article synthesizes desistance scholarship and frames the contributions of a special issue that includes first-person, experiential, and reflective accounts from people impacted by the criminal legal system.",
    dataType: "Secondary/theoretical synthesis. The article relies on existing desistance literature and the thematic organization of the special issue rather than original quantitative or qualitative data collection.",
    sample: "No empirical sample. The special issue includes nine articles addressing desistance, prison culture, reentry, law, sports programming, prison education, autoethnography, and lived experience from people inside and outside prison.",
    methodology: "Conceptual synthesis and issue framing. The authors review desistance theory, distinguish desistance from rehabilitation and recidivism, discuss primary, secondary, and tertiary desistance, and summarize the special issue’s contributions to lived-experience scholarship.",
    supportClaim: "This source supports the claim that lived experience should be treated as legitimate criminological knowledge rather than supplemental anecdote. It helps justify an autoethnographic thesis because it explicitly argues that criminalized people’s personal narratives are necessary for understanding incarceration, reentry, desistance, community belonging, and social justice.",
    relevance: "Highly relevant to the thesis project because it provides methodological and theoretical support for centering lived experience within criminology. It can be used in the methodology chapter to defend autoethnography and in the literature review to connect reentry, desistance, community support, and abolitionist care. It also helps frame the project’s argument that post-release life should be studied through the knowledge of people who have experienced criminalization, not only through institutional data.",
    notes: "Key points for use: JPP centers criminalized and marginalized people’s voices as essential to understanding punishment and justice; desistance theory challenges reintegration, rehabilitation, and recidivism models; desistance can include identity transformation and community belonging; reentry involves housing, employment, stigma, supervision, and institutional rules; desistance should be understood through stories, relationships, community, dignity, and social justice; the article identifies an autoethnographic life-sentence contribution in the special issue, which is useful for showing that autoethnography exists in carceral scholarship but remains limited for formerly incarcerated Black women and mothers."
  };

  function merge(existing, entry) {
    const list = Array.isArray(existing) ? existing.slice() : [];
    const key = normalizeTitle(entry.title);
    const index = list.findIndex((item) => normalizeTitle(item.title) === key);
    if (index >= 0) {
      list[index] = { ...list[index], ...entry };
    } else {
      list.push(entry);
    }
    return list;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merge(saved, source)));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([source]));
  }
})();
