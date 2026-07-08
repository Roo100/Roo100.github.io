(function () {
  const STORAGE_KEY = "plantationToPrisonSources";
  const normalizeTitle = (title) => String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const updates = [
    {
      title: "Formerly Incarcerated Black Mothers Matter Too: Resisting Social Constructions of Motherhood",
      authors: "Mitchell & Davis",
      year: "2019",
      journal: "The Prison Journal, 99(4), 420–436",
      apa: "Mitchell, M. B., & Davis, J. B. (2019). Formerly incarcerated Black mothers matter too: Resisting social constructions of motherhood. The Prison Journal, 99(4), 420–436. https://doi.org/10.1177/0032885519852079",
      link: "https://doi.org/10.1177/0032885519852079",
      articleFile: "articles/mitchell-davis-2019-formerly-incarcerated-black-mothers-matter-too.pdf",
      articleFolder: "literature-tracker/articles",
      articleStatus: "Verify File",
      category: "Black Feminist Theory and Black Motherhood",
      studyType: "Qualitative Study",
      lens: "Black Feminist Theory",
      status: "Need Review",
      priority: "High",
      tags: ["formerly incarcerated Black mothers", "Black feminist theory", "motherhood", "reentry", "lived experience"],
      abstract: "Qualitative study using interview data to examine Black women’s motherhood experiences after incarceration through Black feminist theory.",
      supportClaim: "Core source for centering formerly incarcerated Black mothers, motherwork, stigma, reentry, and resistance to dominant social constructions of motherhood.",
      relevance: "This article closely matches the project focus because it centers formerly incarcerated Black mothers’ post-incarceration lived experiences and uses Black feminist theory."
    },
    {
      title: "The Social and Moral Cost of Mass Incarceration in African American Communities",
      authors: "Roberts",
      year: "2004",
      journal: "Stanford Law Review, 56(5), 1271–1305",
      apa: "Roberts, D. E. (2004). The social and moral cost of mass incarceration in African American communities. Stanford Law Review, 56(5), 1271–1305.",
      link: "https://www.jstor.org/stable/40040178",
      articleFile: "articles/roberts-2004-social-moral-cost-mass-incarceration.pdf",
      articleFolder: "literature-tracker/articles",
      articleStatus: "Verify File",
      category: "Abolitionist Care, Practice, and Community Support",
      studyType: "Legal Analysis",
      lens: "Structural Racism",
      status: "Need Review",
      priority: "High",
      tags: ["mass incarceration", "African American communities", "community harm", "structural racism", "abolitionist theory"],
      abstract: "Legal scholarship reframing mass incarceration as a community-level harm with social and moral costs for African American communities.",
      supportClaim: "Use this source for the structural argument that incarceration harms Black families and communities beyond the individual prison sentence.",
      relevance: "This article supports the project’s broader abolitionist and community-harm framework by showing how mass incarceration damages social networks, citizenship, and collective life."
    }
  ];

  function merge(existing, additions) {
    const list = Array.isArray(existing) ? existing.slice() : [];
    additions.forEach((entry) => {
      const key = normalizeTitle(entry.title);
      const index = list.findIndex((source) => normalizeTitle(source.title) === key);
      if (index >= 0) {
        list[index] = { ...list[index], ...entry };
      } else {
        list.push(entry);
      }
    });
    return list;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merge(saved, updates)));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
  }
})();
