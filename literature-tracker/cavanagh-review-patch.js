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
    tags: [
      "pregnancy in prison",
      "reproductive justice",
      "Black feminist thought",
      "prison abolition",
      "lived experience",
      "qualitative meta-synthesis",
      "peer reviewed"
    ],
    abstract: "This article is a qualitative meta-synthesis of 31 peer-reviewed qualitative studies examining how incarcerated people experience pregnancy, labor, childbirth, and the postpartum period in prisons and jails. Guided by reproductive justice and prison abolition frameworks, the authors identify connectedness to the baby and disconnectedness from support as central themes shaping pregnancy in carceral institutions. The article argues that reproductive justice, including bodily autonomy, self-determination in pregnancy, parenting, and reproductive decision-making, is fundamentally irreconcilable with mass incarceration.",
    problem: "The research problem is that carceral health research has expanded as more women experience incarceration while pregnant, but lived experience remains underexamined. Existing scholarship often measures health outcomes without fully accounting for how pregnant incarcerated people experience confinement, medical care, childbirth, separation, stigma, and reproductive autonomy. The authors address this gap by synthesizing qualitative studies that center lived experience during pregnancy, childbirth, and postpartum incarceration.",
    researchQuestion: "What are the lived experiences of pregnancy, childbirth, and the postpartum period among people who are incarcerated?",
    purpose: "The purpose of the study is to synthesize qualitative research on pregnancy and prison through a reproductive justice lens in order to understand how incarcerated people experience pregnancy, labor, childbirth, postpartum separation or co-residence, and reproductive self-determination under carceral control.",
    studyMethod: "This is a qualitative meta-synthesis. The authors analyzed existing peer-reviewed qualitative studies rather than conducting a new interview study.",
    dataType: "The study uses secondary data from published peer-reviewed qualitative research. The included studies contain primary qualitative data from incarcerated or formerly incarcerated pregnant and postpartum women, but Cavanagh et al. synthesize those studies rather than collecting new participant data.",
    sample: "The meta-synthesis included 31 articles reporting 25 unique qualitative studies. Together, the studies represented approximately 705 women with lived experiences of pregnancy and incarceration. Most studies were conducted in prisons or jails in the United States, with additional studies from the United Kingdom, Brazil, France or a French overseas territory, Canada, Indonesia, and Thailand.",
    methodsInstruments: "The authors searched six databases across health and social science literature, screened titles and abstracts in Covidence, applied inclusion criteria, and appraised included studies using an adapted Critical Appraisal Skills Programme qualitative checklist. They extracted study characteristics using a standard template and coded articles line-by-line using a reproductive justice framework. NVivo was used to manage the data, and final analytical themes were negotiated and refined by the research team.",
    methodology: "The authors conducted a qualitative meta-synthesis using reproductive justice as an imported analytical framework. They searched six databases, screened articles, used CASP-informed quality appraisal, extracted study characteristics, and coded included studies line-by-line to identify connectedness and disconnectedness as the central themes of pregnancy under incarceration.",
    findings: "The study found that pregnancy in prison is shaped by connectedness to the fetus or baby and disconnectedness from support, health care, family, cultural practices, bodily autonomy, and parenting self-determination. Before birth, many participants described strong emotional and physical connection to their pregnancies while fearing separation. During childbirth, women described traumatic, degrading, and dehumanizing experiences shaped by restraints, staff surveillance, restricted support, and loss of control. After birth, women separated from their babies described grief, rage, loneliness, and loss, while those allowed to remain with infants experienced connection under intense surveillance and conditional institutional control.",
    limitations: "The authors note that the synthesis was limited to English-language peer-reviewed articles, disproportionately reflected U.S. prison contexts, and included fewer studies from jails, juvenile detention centers, immigration detention, or experiences involving pregnancy loss or abortion. They also acknowledge that few included articles explicitly analyzed racism, even when racialized incarceration was part of the broader context, and that none of the synthesis authors had lived experience of incarceration.",
    supportClaim: "This is a core source for the Black feminist reproductive justice framework. It supports the claim that pregnancy behind bars is not only a health issue but a lived experience of reproductive control, disconnection, surveillance, medical neglect, family separation, and carceral punishment. It also supports the abolitionist argument that reproductive justice cannot be fully realized inside mass incarceration.",
    relevance: "This article directly supports my research on Black women, criminalization, pregnancy, and reproductive control. It provides a peer-reviewed qualitative synthesis that centers lived experience, uses reproductive justice and abolitionist theory, and argues that incarceration undermines pregnancy autonomy, parenting, and reproductive self-determination. My project can use this source to justify a Black feminist phenomenological approach that centers formerly incarcerated Black women’s lived experiences rather than relying only on policy or health-outcome data.",
    notes: "Full article review added from ChatGPT on July 7, 2026. Use as a core source for the Black feminist reproductive justice and abolitionist framing. Strong fit for the pregnancy, prison, reproductive control, and lived-experience sections of the literature review."
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const sources = Array.isArray(saved) ? saved : [];
    const key = normalizeTitle(cavanaghReview.title);
    const existingIndex = sources.findIndex((source) => normalizeTitle(source.title) === key);

    if (existingIndex >= 0) {
      sources[existingIndex] = { ...sources[existingIndex], ...cavanaghReview };
    } else {
      sources.push(cavanaghReview);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([cavanaghReview]));
  }
})();
