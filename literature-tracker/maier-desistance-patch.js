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
    articleStatus: "Verify File",
    category: "Abolitionist Care, Practice, and Community Support",
    studyType: "Editorial / Commentary",
    lens: "Reentry",
    status: "Need Review",
    priority: "Medium",
    tags: ["desistance", "lived experience", "reentry", "social justice", "criminalized people"],
    abstract: "Issue introduction that centers criminalized and marginalized people’s voices as essential to understanding punishment, law, justice, reentry, desistance, and social change.",
    problem: "Desistance research and criminal justice practice often discuss reentry, reintegration, and rehabilitation without fully centering the voices and knowledge of people directly impacted by the criminal legal system.",
    purpose: "The chapter introduces a special issue on desistance, social justice, and lived experience, emphasizing how lived experience can reshape scholarship, policy, and practice around reentry and desistance.",
    studyMethod: "Editorial and theoretical introduction to a special issue; not an empirical study.",
    dataType: "Secondary/theoretical synthesis and issue framing.",
    sample: "Not applicable; the chapter introduces contributions from a special issue of the Journal of Prisoners on Prisons.",
    methodology: "Conceptual synthesis of desistance theory, social justice, lived-experience scholarship, and the special issue’s contributions.",
    supportClaim: "Use this source to justify centering lived experience as scholarly knowledge and to connect reentry/desistance to social justice, dignity, community, and institutional change.",
    relevance: "This source supports the project’s autoethnographic framework because it argues that criminalized people’s lived experiences are essential evidence for understanding punishment, reentry, and pathways toward justice."
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
