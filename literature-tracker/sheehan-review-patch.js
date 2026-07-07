(function () {
  const STORAGE_KEY = "plantationToPrisonSources";

  const normalizeTitle = (title) => String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const sheehanReview = {
    id: 103,
    title: "Association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization",
    authors: "Sheehan, Grucza, & Plunk",
    year: "2021",
    journal: "JAMA Health Forum, 2(10), e213435",
    apa: "Sheehan, B. E., Grucza, R. A., & Plunk, A. D. (2021). Association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization. JAMA Health Forum, 2(10), e213435. https://doi.org/10.1001/jamahealthforum.2021.3435",
    link: "https://doi.org/10.1001/jamahealthforum.2021.3435",
    articleFile: "articles/association-of-racial-disparity-of-cannabis-possession-arrests-among-adults-and-youths.pdf",
    articleFolder: "literature-tracker/articles",
    articleStatus: "Uploaded to Project Folder",
    category: "System Contact, Surveillance, and Criminalization After Release",
    studyType: "Quantitative Study",
    lens: "Structural Racism",
    status: "Reviewed",
    priority: "Medium",
    tags: [
      "racialized criminalization",
      "cannabis policy reform",
      "arrest disparities",
      "system contact",
      "peer reviewed"
    ],
    abstract: "This article examines how statewide cannabis legalization, decriminalization, and no policy change are associated with cannabis possession arrest rates and racial disparities among Black and White adults and youths. The authors used Uniform Crime Reporting Program arrest data and SEER population estimates from 2000 to 2019. The study included 43 U.S. states: 9 legalization states, 8 decriminalization states, and 26 states with no cannabis policy change. The findings show that legalization and decriminalization were associated with large reductions in cannabis possession arrests among adults. Among youths, decriminalization was associated with reductions in arrests and some reduction in disparities, while legalization did not produce the same clear youth arrest reduction. The authors conclude that states without cannabis policy reform experienced increasing racial arrest disparities, showing the need for targeted interventions to address racial injustice.",
    problem: "The research problem is that Black people are disproportionately arrested for cannabis possession despite similar cannabis use rates compared with White people. The authors examine whether statewide legalization, decriminalization, or no policy change is associated with cannabis possession arrest rates and racial disparities among adults and youths.",
    researchQuestion: "How are statewide cannabis policies—legalization, decriminalization, and no policy change—associated with cannabis possession arrest rates and racial disparities among Black and White adults and youths?",
    purpose: "How are statewide cannabis policies—legalization, decriminalization, and no policy change—associated with cannabis possession arrest rates and racial disparities among Black and White adults and youths?",
    studyMethod: "This is a quantitative study using a case-control and event-study approach. The authors used numerical arrest-rate data and statistical comparisons to examine changes before and after state cannabis policy reforms.",
    dataType: "The study uses secondary administrative data from the Uniform Crime Reporting Program and SEER population estimates.",
    sample: "The study included 43 U.S. states from 2000 to 2019. Of those states, 9 implemented legalization, 8 implemented decriminalization, and 26 had no cannabis policy change. The analysis examined cannabis possession arrest rates separately for Black adults, White adults, Black youths, and White youths.",
    methodsInstruments: "The authors calculated cannabis possession arrest rates per 100,000 people and used event-study analyses to compare arrest trends before and after cannabis policy implementation. The study compared legalization states, decriminalization states, and states with no policy change.",
    methodology: "The authors calculated cannabis possession arrest rates per 100,000 people and used event-study analyses to compare arrest trends before and after cannabis policy implementation. The study compared legalization states, decriminalization states, and states with no policy change.",
    supportClaim: "Use this source to show that cannabis policy reform can reduce overall criminal legal exposure while leaving racial disparities intact. It helps establish the broader problem of racialized system contact before narrowing the thesis to Black motherhood after incarceration and the continuing effects of punishment after release.",
    relevance: "This article supports the background section on racialized criminalization and cannabis enforcement. It shows that policy reform can reduce arrests but does not fully eliminate racial disparity. The thesis builds on this limitation by using an autoethnographic case study design and Black feminist theory as a critical lens to examine Black motherhood after incarceration, system contact, reentry, and abolitionist practice beyond arrest statistics.",
    notes: "Full article review added from ChatGPT on July 7, 2026. This source is background for racialized criminalization and system contact; it is not the central motherhood/reentry source."
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const sources = Array.isArray(saved) ? saved : [];
    const key = normalizeTitle(sheehanReview.title);
    const existingIndex = sources.findIndex((source) => normalizeTitle(source.title) === key);

    if (existingIndex >= 0) {
      sources[existingIndex] = { ...sources[existingIndex], ...sheehanReview };
    } else {
      sources.push(sheehanReview);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([sheehanReview]));
  }
})();