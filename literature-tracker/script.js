const STORAGE_KEY = "plantationToPrisonSources";

const categories = [
  "Black Feminist Theory and Reproductive Justice",
  "Historical Reproductive Control: Plantation to Prison",
  "Criminalization of Black Women",
  "Pregnancy and Incarceration",
  "Medical Neglect, Shackling, and Bodily Control",
  "Motherhood, Family Separation, and Surveillance",
  "Abolitionist Consciousness and System Rejection",
  "Research Gap / Need for Phenomenological Study"
];

const studyTypes = [
  "Qualitative Study",
  "Quantitative Study",
  "Mixed-Methods Study",
  "Scoping Review",
  "Systematic Review",
  "Qualitative Meta-Synthesis",
  "Policy Analysis",
  "Legal Analysis",
  "Theoretical Article"
];

const lenses = [
  "Black Feminist Theory",
  "Reproductive Justice",
  "Intersectionality",
  "Structural Racism",
  "Abolitionist Theory",
  "Carceral State",
  "Reproductive Control",
  "Public Health"
];

const statuses = [
  "Need Review",
  "Not Started",
  "In Progress",
  "Reviewed",
  "Needs Revision",
  "Use in Literature Review"
];

const priorities = ["High", "Medium", "Low"];

const articleStatuses = [
  "Not Downloaded",
  "Uploaded to Project Folder",
  "Downloaded Elsewhere",
  "Citation Only",
  "Verify File"
];

const uploadedSourceRecords = [
  {
    id: 1,
    citation: "American Civil Liberties Union. (2020). A tale of two countries: Racially targeted arrests in the era of marijuana reform. ACLU.",
    title: "A Tale of Two Countries: Racially Targeted Arrests in the Era of Marijuana Reform",
    authors_year: "American Civil Liberties Union (2020)",
    type: "Report / advocacy research",
    peer_reviewed: "No",
    category: "Cannabis criminalization / racial disparities",
    use: "Background source for racialized marijuana arrests; do not use as one of the peer-reviewed article reviews."
  },
  {
    id: 2,
    citation: "Gunadi, C., & Shi, Y. (2022). Cannabis decriminalization and racial disparity in arrests for cannabis possession. Social Science & Medicine, 293, 114672. https://doi.org/10.1016/j.socscimed.2021.114672",
    title: "Cannabis decriminalization and racial disparity in arrests for cannabis possession",
    authors_year: "Gunadi & Shi (2022)",
    type: "Quantitative policy study",
    peer_reviewed: "Yes",
    category: "Cannabis criminalization / racial disparities",
    use: "Supports the claim that cannabis policy reform can reduce arrests while racial disparities may remain."
  },
  {
    id: 3,
    citation: "Sheehan, B. E., Grucza, R. A., & Plunk, A. D. (2021). Association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization. JAMA Health Forum, 2(10), e213435. https://doi.org/10.1001/jamahealthforum.2021.3435",
    title: "Association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization",
    authors_year: "Sheehan, Grucza, & Plunk (2021)",
    type: "Case-control / policy study",
    peer_reviewed: "Yes",
    category: "Cannabis criminalization / racial disparities",
    use: "Useful for the earlier cannabis criminalization version of the project; shows how reform relates to adult and youth arrest disparities."
  },
  {
    id: 4,
    citation: "Wu, G. (2024). Pipe dreams: Cannabis legalization and the persistence of racialized social control. Journal of Criminal Justice, 94, 102245.",
    title: "Pipe Dreams: Cannabis Legalization and the Persistence of Racialized Social Control",
    authors_year: "Wu (2024)",
    type: "Quasi-experimental study",
    peer_reviewed: "Yes",
    category: "Cannabis legalization / racialized social control",
    use: "Supports the earlier argument that legalization can coexist with racialized social control."
  },
  {
    id: 5,
    citation: "Wiese, J. L., et al. (2022). Perspectives on cannabis legalization from members of racialized communities in Canada. Journal of Ethnicity in Substance Abuse.",
    title: "Perspectives on cannabis legalization from members of racialized communities in Canada",
    authors_year: "Wiese et al. (2022)",
    type: "Qualitative thematic study",
    peer_reviewed: "Yes",
    category: "Cannabis legalization / lived experience",
    use: "Useful as a qualitative model for lived-experience framing, though the current project has shifted away from cannabis. Full volume/issue/pages should be verified before final submission."
  },
  {
    id: 6,
    citation: "Doonan, S. M., Johnson, J. K., Firth, C., Flores, A., et al. (2022). Racial equity in cannabis policy: Diversity in the Massachusetts adult-use industry at 18-months. Cannabis, 5(1). https://doi.org/10.26828/cannabis/2022.01.004",
    title: "Racial Equity in Cannabis Policy: Diversity in the Massachusetts Adult-Use Industry at 18-Months",
    authors_year: "Doonan et al. (2022)",
    type: "Empirical policy / workforce study",
    peer_reviewed: "Yes",
    category: "Cannabis equity / policy implementation",
    use: "Useful only if the project returns to cannabis equity; otherwise keep as background."
  },
  {
    id: 7,
    citation: "Hendy, K. (2023). Bounded equity: The limits of economic models of social equity in cannabis legalization. Critical Public Health.",
    title: "Bounded Equity: The Limits of Economic Models of Social Equity in Cannabis Legalization",
    authors_year: "Hendy (2023)",
    type: "Critical policy analysis",
    peer_reviewed: "Yes",
    category: "Cannabis equity critique",
    use: "Useful only for the earlier cannabis-equity framing; it critiques market-based equity models."
  },
  {
    id: 27,
    citation: "Bencsik, P., & Budhiraja, S. (2025). Cannabis deregulation and policing. Journal of Economic Behavior & Organization, 238, 107202. https://doi.org/10.1016/j.jebo.2025.107202",
    title: "Cannabis Deregulation and Policing",
    authors_year: "Bencsik & Budhiraja (2025)",
    type: "Quantitative / difference-in-differences study",
    peer_reviewed: "Yes",
    category: "Cannabis decriminalization / policing / racial disparities",
    use: "Supports tracking how cannabis decriminalization changes policing patterns and racial arrest disparities."
  },
  {
    id: 28,
    citation: "Owusu-Bempah, A., Wallace, D., Gaston, S., Eason, J., & Sevell, E. (2024). Assessing the impact of cannabis decriminalization on racial disparities in Chicago's cannabis possession arrests. Sociology of Race and Ethnicity, 10(2), 211-227. https://doi.org/10.1177/23326492241232322",
    title: "Assessing the Impact of Cannabis Decriminalization on Racial Disparities in Chicago's Cannabis Possession Arrests",
    authors_year: "Owusu-Bempah et al. (2024)",
    type: "Quantitative / policy study",
    peer_reviewed: "Yes",
    category: "Cannabis decriminalization / racial disparities / Chicago",
    use: "Supports background tracking of cannabis decriminalization and racial disparities in cannabis possession arrests."
  },
  {
    id: 29,
    citation: "Wu, G., Durante, K. A., & Melton, H. C. (2024). Pipe dreams: Cannabis legalization and the persistence of racial disparities in jail incarceration. Journal of Criminal Justice, 94, 102230. https://doi.org/10.1016/j.jcrimjus.2024.102230",
    title: "Pipe Dreams: Cannabis Legalization and the Persistence of Racial Disparities in Jail Incarceration",
    authors_year: "Wu, Durante, & Melton (2024)",
    type: "Quasi-experimental study",
    peer_reviewed: "Yes",
    category: "Cannabis legalization / racial disparities / jail incarceration",
    use: "Supports background tracking of cannabis legalization, jail incarceration, and racialized social control."
  },
  {
    id: 30,
    citation: "Lazor, T., Mehra, K., Rup, J., Wiese, J. L., Watson, T. M., Hamilton, H., Sockalingam, S., Kloiber, S., Margolese, S., Wells, S., Owusu-Bempah, A., Agic, B., & Rueda, S. (2025). Navigating mental health and cannabis use post-cannabis legalization: Experiences from racialized community members. Contemporary Drug Problems. Advance online publication. https://doi.org/10.1177/00914509251394526",
    title: "Navigating Mental Health and Cannabis Use Post-Cannabis Legalization: Experiences From Racialized Community Members",
    authors_year: "Lazor et al. (2025)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Cannabis legalization / lived experience / racialized communities",
    use: "Useful as a qualitative model for lived-experience framing around cannabis legalization, racialized communities, mental health, and service interactions."
  },
  {
    id: 8,
    citation: "Beck, B. (2020). Policing gentrification: Stops and low-level arrests during demographic change and real estate reinvestment. City & Community, 19(1), 245–272. https://doi.org/10.1111/cico.12473",
    title: "Policing Gentrification: Stops and Low-Level Arrests During Demographic Change and Real Estate Reinvestment",
    authors_year: "Beck (2020)",
    type: "Quantitative urban/crime study",
    peer_reviewed: "Yes",
    category: "Policing / gentrification / displacement",
    use: "Useful if the project includes gentrification or spatial control; less central to the current pregnancy/reproductive control project."
  },
  {
    id: 9,
    citation: "Urban Institute. (2020). As neighborhoods gentrify, police presence increases. Housing Matters.",
    title: "As Neighborhoods Gentrify, Police Presence Increases",
    authors_year: "Urban Institute (2020)",
    type: "Research summary",
    peer_reviewed: "No",
    category: "Policing / gentrification / displacement",
    use: "Accessible background summary; do not use as a peer-reviewed article review source."
  },
  {
    id: 10,
    citation: "Ferrer, B., et al. (2018). Racial inequities in drug arrests: Treatment in lieu of and after incarceration. American Journal of Public Health, 108(S4), S263–S268.",
    title: "Racial Inequities in Drug Arrests: Treatment in Lieu of and After Incarceration",
    authors_year: "Ferrer et al. (2018)",
    type: "Public health / criminalization analysis",
    peer_reviewed: "Yes",
    category: "Drug enforcement / racialized criminalization",
    use: "Supports broader claims about racialized drug enforcement; useful for background on criminalization."
  },
  {
    id: 11,
    citation: "Whittaker, S., et al. (2023/2025). Rethinking the effects of gentrification on the health of Black communities in the United States: Towards a racialized health framework. Journal of Urban Affairs. Advance online publication.",
    title: "Rethinking the Effects of Gentrification on the Health of Black Communities in the United States",
    authors_year: "Whittaker et al. (2023/2025)",
    type: "Urban health / racialized health framework",
    peer_reviewed: "Yes",
    category: "Gentrification / Black health / displacement",
    use: "Useful if the project returns to gentrification. Citation details should be verified because publication year may appear as online-first 2023 and issue-year 2025."
  },
  {
    id: 12,
    citation: "National Community Reinvestment Coalition. (2025). Displaced by design: Fifty years of gentrification and displacement in America. NCRC.",
    title: "Displaced by Design: Fifty Years of Gentrification and Displacement in America",
    authors_year: "NCRC (2025)",
    type: "Report",
    peer_reviewed: "No",
    category: "Gentrification / displacement",
    use: "Background source only; not peer-reviewed."
  },
  {
    id: 13,
    citation: "Nelsen, M. D., Ramanathan, K., & Ogorzalek, T. (2024). Experiences of policing in gentrifying neighborhoods: Evidence from Chicago. Urban Affairs Review, 60(3), 1062–1093. https://doi.org/10.1177/10780874231215068",
    title: "Experiences of Policing in Gentrifying Neighborhoods: Evidence From Chicago",
    authors_year: "Nelsen, Ramanathan, & Ogorzalek (2024)",
    type: "Urban qualitative / mixed-methods study",
    peer_reviewed: "Yes",
    category: "Policing / gentrification / lived experience",
    use: "Useful if spatial policing or gentrification remains part of the theory section."
  },
  {
    id: 14,
    citation: "Neil, R., & Legewie, J. (2024). Policing neighborhood boundaries and the racialized social control of spaces. Law & Society Review, 58(2), 192–215. https://doi.org/10.1017/lsr.2024.6",
    title: "Policing Neighborhood Boundaries and the Racialized Social Control of Spaces",
    authors_year: "Neil & Legewie (2024)",
    type: "Quantitative/theoretical policing study",
    peer_reviewed: "Yes",
    category: "Policing / racialized space / social control",
    use: "Supports arguments about policing as racialized spatial control."
  },
  {
    id: 15,
    citation: "Ocen, P. A. (2012). Punishing pregnancy: Race, incarceration, and the shackling of pregnant prisoners. California Law Review, 100, 1239–1311.",
    title: "Punishing Pregnancy: Race, Incarceration, and the Shackling of Pregnant Prisoners",
    authors_year: "Ocen (2012)",
    type: "Law review / legal scholarship",
    peer_reviewed: "No / law review",
    category: "Pregnancy / incarceration / reproductive control / race",
    use: "Major anchor source for the plantation-to-prison frame, reproductive punishment, race, shackling, and incarceration. Use as scholarship, but note that law reviews are not conventional peer-reviewed journals."
  },
  {
    id: 16,
    citation: "Hayes, C. M., Sufrin, C., & Perritt, J. B. (2020). Reproductive justice disrupted: Mass incarceration as a driver of reproductive oppression. American Journal of Public Health, 110(S1), S21–S24. https://doi.org/10.2105/AJPH.2019.305407",
    title: "Reproductive Justice Disrupted: Mass Incarceration as a Driver of Reproductive Oppression",
    authors_year: "Hayes, Sufrin, & Perritt (2020)",
    type: "Theoretical / public health article",
    peer_reviewed: "Yes",
    category: "Black feminist theory / reproductive justice / incarceration",
    use: "Core source. Supports the claim that mass incarceration functions as reproductive oppression and should be analyzed through reproductive justice."
  },
  {
    id: 17,
    citation: "Cavanagh, A., Shamsheri, T., Shen, K., Gaber, J., Liauw, J., Vanstone, M., & Kouyoumdjian, F. (2022). Lived experiences of pregnancy and prison through a reproductive justice lens: A qualitative meta-synthesis. Social Science & Medicine, 307, 115179. https://doi.org/10.1016/j.socscimed.2022.115179",
    title: "Lived Experiences of Pregnancy and Prison Through a Reproductive Justice Lens",
    authors_year: "Cavanagh et al. (2022)",
    type: "Qualitative meta-synthesis",
    peer_reviewed: "Yes",
    category: "Pregnancy and incarceration / lived experience / reproductive justice",
    use: "Core source. Directly supports phenomenological/lived-experience framing around pregnancy in prison."
  },
  {
    id: 18,
    citation: "Kramer, C., Thomas, K., Patil, A., Hayes, C. M., & Sufrin, C. B. (2023). Shackling and pregnancy care policies in US prisons and jails. Maternal and Child Health Journal, 27(1), 186–196. https://doi.org/10.1007/s10995-022-03526-y",
    title: "Shackling and Pregnancy Care Policies in US Prisons and Jails",
    authors_year: "Kramer et al. (2023)",
    type: "Policy / empirical article",
    peer_reviewed: "Yes",
    category: "Medical neglect / shackling / pregnancy care",
    use: "Core source for institutional pregnancy care policies, restraint practices, and carceral medical control."
  },
  {
    id: 19,
    citation: "Sufrin, C., Beal, L., Clarke, J., Jones, R., & Mosher, W. D. (2019). Pregnancy outcomes in US prisons, 2016–2017. American Journal of Public Health, 109(5), 799–805. https://doi.org/10.2105/AJPH.2019.305006",
    title: "Pregnancy Outcomes in US Prisons, 2016–2017",
    authors_year: "Sufrin et al. (2019)",
    type: "Quantitative / prospective data study",
    peer_reviewed: "Yes",
    category: "Pregnancy in prison / empirical data",
    use: "Core empirical source for documenting pregnancy prevalence and outcomes in U.S. prisons."
  },
  {
    id: 20,
    citation: "Goodwin, M. (2017). How the criminalization of pregnancy robs women of reproductive autonomy. Hastings Center Report, 47(S3), S19–S27. https://doi.org/10.1002/hast.791",
    title: "How the Criminalization of Pregnancy Robs Women of Reproductive Autonomy",
    authors_year: "Goodwin (2017)",
    type: "Bioethics / legal analysis",
    peer_reviewed: "Yes",
    category: "Criminalization of pregnancy / reproductive autonomy",
    use: "Core source. Supports the criminalization + reproductive autonomy/reproductive control argument."
  },
  {
    id: 21,
    citation: "Crawford, A. D., Ricks, T. N., Polinard, E., & Abbyad, C. W. (2023). What is known about reproductive autonomy among justice-involved Black women? A scoping review. Journal of Transcultural Nursing, 34(5), 375–388. https://doi.org/10.1177/10436596231183180",
    title: "What is Known About Reproductive Autonomy Among Justice-Involved Black Women? A Scoping Review",
    authors_year: "Crawford, Ricks, Polinard, & Abbyad (2023)",
    type: "Scoping review",
    peer_reviewed: "Yes",
    category: "Black women / reproductive autonomy / research gap",
    use: "Core source for justifying the gap around justice-involved Black women and reproductive autonomy."
  },
  {
    id: 22,
    citation: "Rajagopal, K., Landis-Lewis, D., Haven, K., & Sufrin, C. (2023). Reproductive health care for incarcerated people: Advancing health equity in unequitable settings. Clinical Obstetrics and Gynecology, 66(1), 73–85. https://doi.org/10.1097/GRF.0000000000000746",
    title: "Reproductive Health Care for Incarcerated People: Advancing Health Equity in Unequitable Settings",
    authors_year: "Rajagopal et al. (2023)",
    type: "Medical/public health review",
    peer_reviewed: "Yes",
    category: "Reproductive health care / incarceration / structural inequity",
    use: "Supports healthcare access, autonomy, and structural inequity in carceral settings."
  },
  {
    id: 23,
    citation: "Kramer, C., et al. (2025). Maternal health and incarceration: Advancing pregnancy justice for incarcerated pregnant people. Maternal and Child Health Journal.",
    title: "Maternal Health and Incarceration: Advancing Pregnancy Justice for Incarcerated Pregnant People",
    authors_year: "Kramer et al. (2025)",
    type: "Pregnancy justice / maternal health article",
    peer_reviewed: "Yes",
    category: "Pregnancy justice / maternal health / incarceration",
    use: "Useful updated framing for pregnancy justice, maternal health, and structural racism in incarceration. Full volume/issue/pages should be verified before final submission."
  },
  {
    id: 24,
    citation: "Riley, T., et al. (2022). Abortion criminalization: A public health crisis rooted in white supremacy. [Peer-reviewed public health journal article; full citation needs verification].",
    title: "Abortion Criminalization: A Public Health Crisis Rooted in White Supremacy",
    authors_year: "Riley et al. (2022)",
    type: "Public health / reproductive control analysis",
    peer_reviewed: "Likely yes; verify",
    category: "Reproductive control / criminalization / white supremacy",
    use: "Potential support for broader reproductive-control framework. Full citation needs verification before use."
  },
  {
    id: 25,
    citation: "Mitchell, M. B., & Davis, J. B. (2019). Formerly incarcerated Black mothers matter too: Resisting social constructions of motherhood. The Prison Journal, 99(4), 420–436. https://doi.org/10.1177/0032885519852079",
    title: "Formerly Incarcerated Black Mothers Matter Too: Resisting Social Constructions of Motherhood",
    authors_year: "Mitchell & Davis (2019)",
    type: "Qualitative study",
    peer_reviewed: "Yes",
    category: "Black motherhood / formerly incarcerated women / Black feminist theory",
    use: "Core source for centering formerly incarcerated Black mothers and using a Black feminist lens."
  },
  {
    id: 26,
    citation: "Bradley, D. L., et al. (2024). Experiences of anti-Black gendered racism and reproductive coercion among Black pregnant and postpartum women with substance use disorder. [Peer-reviewed journal article; full citation needs verification].",
    title: "Experiences of Anti-Black Gendered Racism and Reproductive Coercion Among Black Pregnant and Postpartum Women With Substance Use Disorder",
    authors_year: "Bradley et al. (2024)",
    type: "Qualitative / reproductive coercion study",
    peer_reviewed: "Likely yes; verify",
    category: "Anti-Black gendered racism / reproductive coercion / pregnancy",
    use: "Potential Black feminist/intersectional source for anti-Black gendered racism, substance-use stigma, reproductive coercion, and family policing. Full citation needs verification."
  }
];

const starterSources = uploadedSourceRecords.map(normalizeUploadedSource);

const state = {
  sources: loadSources(),
  filters: {
    search: "",
    category: "All",
    studyType: "All",
    lens: "All",
    status: "All",
    priority: "All",
    articleStatus: "All"
  }
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  populateControls();
  attachEvents();
  render();
});

function cacheElements() {
  els.heroStats = document.querySelector("#heroStats");
  els.dashboardStats = document.querySelector("#dashboardStats");
  els.categoryBars = document.querySelector("#categoryBars");
  els.studyTypeBars = document.querySelector("#studyTypeBars");
  els.sourceList = document.querySelector("#sourceList");
  els.resultCount = document.querySelector("#resultCount");
  els.filters = document.querySelector("#filters");
  els.searchInput = document.querySelector("#searchInput");
  els.categoryFilter = document.querySelector("#categoryFilter");
  els.studyTypeFilter = document.querySelector("#studyTypeFilter");
  els.lensFilter = document.querySelector("#lensFilter");
  els.statusFilter = document.querySelector("#statusFilter");
  els.priorityFilter = document.querySelector("#priorityFilter");
  els.articleStatusFilter = document.querySelector("#articleStatusFilter");
  els.sourceDialog = document.querySelector("#sourceDialog");
  els.sourceForm = document.querySelector("#sourceForm");
  els.openSourceForm = document.querySelector("#openSourceForm");
  els.closeSourceForm = document.querySelector("#closeSourceForm");
  els.cancelSourceForm = document.querySelector("#cancelSourceForm");
  els.copyTemplate = document.querySelector("#copyTemplate");
  els.condensedTemplate = document.querySelector("#condensedTemplate");
  els.expandedTemplate = document.querySelector("#expandedTemplate");
  els.exportJson = document.querySelector("#exportJson");
  els.exportMarkdown = document.querySelector("#exportMarkdown");
  els.copyApa = document.querySelector("#copyApa");
  els.copyReviewed = document.querySelector("#copyReviewed");
  els.toast = document.querySelector("#toast");
}

function normalizeUploadedSource(record) {
  const parsed = parseAuthorsYear(record.authors_year, record.citation);
  const articleFile = mapArticleFile(record);
  const articleStatus = articleFile
    ? "Uploaded to Project Folder"
    : record.peer_reviewed === "No" || record.peer_reviewed === "No / law review"
      ? "Citation Only"
      : "Not Downloaded";

  return {
    id: 100 + record.id,
    title: record.title,
    authors: parsed.authors,
    year: parsed.year,
    journal: deriveJournal(record),
    apa: record.citation,
    link: extractLink(record.citation),
    articleFile,
    articleFolder: articleFile ? "literature-tracker/articles" : "",
    articleStatus,
    category: mapLiteratureCategory(record),
    studyType: mapStudyType(record.type),
    lens: mapLens(record),
    status: "Need Review",
    priority: mapPriority(record),
    tags: buildTags(record),
    problem: "",
    purpose: "",
    methodology: record.type,
    sample: "",
    findings: "",
    limitations: "",
    relevance: record.use,
    notes: `Uploaded source category: ${record.category}\nPeer-reviewed status: ${record.peer_reviewed}`
  };
}

function mapArticleFile(record) {
  const title = normalizeTitle(record.title);
  const fileMap = new Map([
    [
      "a tale of two countries racially targeted arrests in the era of marijuana reform",
      "articles/a-tale-of-two-countries-racially-targeted-arrests-in-the-era-of-marijuana-reform.pdf"
    ],
    [
      "cannabis decriminalization and racial disparity in arrests for cannabis possession",
      "articles/cannabis-decriminalization-and-racial-disparity-in-arrests-for-cannabis-possession.pdf"
    ],
    [
      "association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization",
      "articles/association-of-racial-disparity-of-cannabis-possession-arrests-among-adults-and-youths.pdf"
    ],
    [
      "cannabis deregulation and policing",
      "articles/cannabis-deregulation-and-policing.pdf"
    ],
    [
      "assessing the impact of cannabis decriminalization on racial disparities in chicago s cannabis possession arrests",
      "articles/assessing-the-impact-of-cannabis-decriminalization-on-racial-disparities-in-chicago-cannabis-possession-arrests.pdf"
    ],
    [
      "pipe dreams cannabis legalization and the persistence of racial disparities in jail incarceration",
      "articles/pipe-dreams-cannabis-legalization-and-the-persistence-of-racial-disparities-in-jail-incarceration.pdf"
    ],
    [
      "lived experiences of pregnancy and prison through a reproductive justice lens a qualitative meta synthesis",
      "articles/lived-experiences-of-pregnancy-and-prison-through-a-reproductive-justice-lens.pdf"
    ],
    [
      "lived experiences of pregnancy and prison through a reproductive justice lens",
      "articles/lived-experiences-of-pregnancy-and-prison-through-a-reproductive-justice-lens.pdf"
    ],
    [
      "perspectives on cannabis legalization from members of racialized communities in canada",
      "articles/overpoliced-and-underrepresented-perspectives-on-cannabis-legalization-from-members-of-racialized-communities-in-canada.pdf"
    ],
    [
      "racial inequities in drug arrests treatment in lieu of and after incarceration",
      "articles/racial-inequities-in-drug-arrests-treatment-in-lieu-of-and-after-incarceration.pdf"
    ],
    [
      "reproductive justice disrupted mass incarceration as a driver of reproductive oppression",
      "articles/reproductive-justice-disrupted-mass-incarceration-as-a-driver-of-reproductive-oppression.pdf"
    ],
    [
      "bounded equity the limits of economic models of social equity in cannabis legalization",
      "articles/bounded-equity-the-limits-of-economic-models-of-social-justice-in-cannabis-legislation.pdf"
    ],
    [
      "navigating mental health and cannabis use post cannabis legalization experiences from racialized community members",
      "articles/navigating-mental-health-and-cannabis-use-post-cannabis-legalization-experiences-from-racialized-community-members.pdf"
    ],
    [
      "experiences of policing in gentrifying neighborhoods evidence from chicago",
      "articles/experiences-of-policing-in-gentrifying-neighborhoods-evidence-from-chicago.pdf"
    ],
    [
      "punishing pregnancy race incarceration and the shackling of pregnant prisoners",
      "articles/punishing-pregnancy-race-incarceration-and-the-shackling-of-pregnant-prisoners.pdf"
    ],
    [
      "racial equity in cannabis policy diversity in the massachusetts adult use industry at 18 months",
      "articles/racial-equity-in-cannabis-policy-diversity-in-the-massachusetts-adult-use-industry-at-18-months.pdf"
    ],
    [
      "policing neighborhood boundaries and the racialized social control of spaces",
      "articles/policing-neighborhood-boundaries-and-the-racialized-social-control-of-spaces.pdf"
    ],
    [
      "what is known about reproductive autonomy among justice involved black women a scoping review",
      "articles/crawford-et-al-2023-reproductive-autonomy-justice-involved-black-women.pdf"
    ]
  ]);

  return fileMap.get(title) || "";
}

function parseAuthorsYear(authorsYear, citation) {
  const fallback = citation.match(/^(.+?)\s+\((\d{4}(?:\/\d{4})?)\)/);
  const compact = authorsYear.match(/^(.+?)\s+\((.+?)\)$/);
  return {
    authors: compact?.[1] || fallback?.[1] || authorsYear,
    year: compact?.[2] || fallback?.[2] || ""
  };
}

function deriveJournal(record) {
  const lowerType = record.type.toLowerCase();
  if (lowerType.includes("report") || lowerType.includes("summary")) return record.type;

  const body = record.citation.replace(/^.+?\(\d{4}(?:\/\d{4})?\)\.\s*/, "");
  const parts = body.split(". ");
  const journal = parts[1]?.replace(/\s+https?:\/\/\S+$/, "").trim();
  return journal || record.type;
}

function extractLink(citation) {
  return citation.match(/https?:\/\/\S+/)?.[0].replace(/[).,]+$/, "") || "";
}

function mapLiteratureCategory(record) {
  const text = `${record.title} ${record.category} ${record.use}`.toLowerCase();
  if (text.includes("research gap")) return "Research Gap / Need for Phenomenological Study";
  if (text.includes("mother")) return "Motherhood, Family Separation, and Surveillance";
  if (text.includes("shackling") || text.includes("medical") || text.includes("health care")) {
    return "Medical Neglect, Shackling, and Bodily Control";
  }
  if (text.includes("pregnancy") || text.includes("pregnant") || text.includes("maternal")) {
    return "Pregnancy and Incarceration";
  }
  if (text.includes("black feminist") || text.includes("reproductive justice") || text.includes("reproductive autonomy")) {
    return "Black Feminist Theory and Reproductive Justice";
  }
  if (text.includes("plantation") || text.includes("reproductive control") || text.includes("white supremacy")) {
    return "Historical Reproductive Control: Plantation to Prison";
  }
  if (text.includes("abolition")) return "Abolitionist Consciousness and System Rejection";
  return "Criminalization of Black Women";
}

function mapStudyType(type) {
  const text = type.toLowerCase();
  if (text.includes("scoping")) return "Scoping Review";
  if (text.includes("systematic")) return "Systematic Review";
  if (text.includes("meta-synthesis")) return "Qualitative Meta-Synthesis";
  if (text.includes("mixed")) return "Mixed-Methods Study";
  if (text.includes("qualitative")) return "Qualitative Study";
  if (text.includes("quantitative") || text.includes("quasi") || text.includes("prospective")) return "Quantitative Study";
  if (text.includes("law") || text.includes("legal") || text.includes("bioethics")) return "Legal Analysis";
  if (text.includes("theoretical") || text.includes("framework")) return "Theoretical Article";
  return "Policy Analysis";
}

function mapLens(record) {
  const text = `${record.title} ${record.category} ${record.use}`.toLowerCase();
  if (text.includes("black feminist")) return "Black Feminist Theory";
  if (text.includes("reproductive justice") || text.includes("pregnancy justice")) return "Reproductive Justice";
  if (text.includes("intersectional") || text.includes("gendered racism")) return "Intersectionality";
  if (text.includes("structural") || text.includes("white supremacy") || text.includes("racial")) return "Structural Racism";
  if (text.includes("abolition")) return "Abolitionist Theory";
  if (text.includes("reproductive control") || text.includes("reproductive coercion")) return "Reproductive Control";
  if (text.includes("public health") || text.includes("health")) return "Public Health";
  return "Carceral State";
}

function mapPriority(record) {
  const text = `${record.use} ${record.category}`.toLowerCase();
  if (text.includes("core source") || text.includes("major anchor")) return "High";
  if (text.includes("potential") || text.includes("supports") || text.includes("useful updated")) return "Medium";
  return "Low";
}

function buildTags(record) {
  const tags = record.category
    .split("/")
    .map((tag) => tag.trim())
    .filter(Boolean);

  tags.push(record.peer_reviewed === "Yes" ? "peer reviewed" : "verify peer review");
  tags.push(record.type);
  return [...new Set(tags)];
}

function loadSources() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return starterSources;

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.length) return starterSources;
    const merged = mergeSavedWithStarterSources(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return starterSources;
  }
}

function mergeSavedWithStarterSources(savedSources) {
  const savedByTitle = new Map(savedSources.map((source) => [normalizeTitle(source.title), source]));
  const starterTitles = new Set(starterSources.map((source) => normalizeTitle(source.title)));
  const mergedStarters = starterSources.map((starter) => {
    const saved = savedByTitle.get(normalizeTitle(starter.title));
    return saved ? mergeSourceMetadata(starter, saved) : starter;
  });
  const customSavedSources = savedSources.filter((source) => !starterTitles.has(normalizeTitle(source.title)));
  return [...mergedStarters, ...customSavedSources];
}

function mergeSourceMetadata(starter, saved) {
  const merged = {
    ...starter,
    id: saved.id || starter.id,
    status: saved.status || starter.status,
    priority: saved.priority || starter.priority
  };

  ["problem", "purpose", "sample", "findings", "limitations"].forEach((field) => {
    if (saved[field]) merged[field] = saved[field];
  });

  if (saved.articleFile && saved.articleFile !== starter.articleFile) {
    merged.articleFile = saved.articleFile;
    merged.articleFolder = saved.articleFolder || "literature-tracker/articles";
    merged.articleStatus = saved.articleStatus || starter.articleStatus;
  } else if (starter.articleFile) {
    merged.articleFile = starter.articleFile;
    merged.articleFolder = starter.articleFolder;
    merged.articleStatus = starter.articleStatus;
  } else {
    merged.articleFile = saved.articleFile || starter.articleFile;
    merged.articleFolder = saved.articleFolder || starter.articleFolder;
    merged.articleStatus = saved.articleStatus || starter.articleStatus;
  }

  merged.methodology = saved.methodology && saved.methodology !== saved.studyType ? saved.methodology : starter.methodology;
  merged.relevance = saved.relevance || starter.relevance;
  merged.notes = saved.notes && !saved.notes.includes("Uploaded source category")
    ? `${starter.notes}\n\nPrevious notes: ${saved.notes}`
    : starter.notes;

  return merged;
}

function normalizeTitle(title) {
  return String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function saveSources() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sources));
}

function populateControls() {
  fillSelect(els.categoryFilter, categories);
  fillSelect(els.studyTypeFilter, studyTypes);
  fillSelect(els.lensFilter, lenses);
  fillSelect(els.statusFilter, statuses);
  fillSelect(els.priorityFilter, priorities);
  fillSelect(els.articleStatusFilter, articleStatuses);

  fillSelect(els.sourceForm.elements.category, categories, false);
  fillSelect(els.sourceForm.elements.studyType, studyTypes, false);
  fillSelect(els.sourceForm.elements.lens, lenses, false);
  fillSelect(els.sourceForm.elements.status, statuses, false);
  fillSelect(els.sourceForm.elements.priority, priorities, false);
  fillSelect(els.sourceForm.elements.articleStatus, articleStatuses, false);

  els.sourceForm.elements.status.value = "Need Review";
  els.sourceForm.elements.priority.value = "High";
  els.sourceForm.elements.articleStatus.value = "Not Downloaded";
}

function fillSelect(select, options, includeAll = true) {
  const items = includeAll ? ["All", ...options] : options;
  select.innerHTML = items.map((option) => `<option value="${escapeAttr(option)}">${escapeHtml(option)}</option>`).join("");
}

function attachEvents() {
  els.filters.addEventListener("input", updateFilters);
  els.filters.addEventListener("reset", () => {
    window.setTimeout(() => {
      state.filters = {
        search: "",
        category: "All",
        studyType: "All",
        lens: "All",
        status: "All",
        priority: "All",
        articleStatus: "All"
      };
      render();
    }, 0);
  });

  els.sourceList.addEventListener("click", handleSourceClick);
  els.sourceList.addEventListener("change", handleSourceChange);
  els.sourceList.addEventListener("submit", handleInlineEdit);

  els.openSourceForm.addEventListener("click", openDialog);
  els.closeSourceForm.addEventListener("click", closeDialog);
  els.cancelSourceForm.addEventListener("click", closeDialog);
  els.sourceForm.addEventListener("submit", addSource);

  els.copyTemplate.addEventListener("click", copyTemplate);
  els.exportJson.addEventListener("click", exportJson);
  els.exportMarkdown.addEventListener("click", exportMarkdown);
  els.copyApa.addEventListener("click", copyApa);
  els.copyReviewed.addEventListener("click", copyReviewed);
}

function updateFilters() {
  state.filters = {
    search: els.searchInput.value.trim().toLowerCase(),
    category: els.categoryFilter.value,
    studyType: els.studyTypeFilter.value,
    lens: els.lensFilter.value,
    status: els.statusFilter.value,
    priority: els.priorityFilter.value,
    articleStatus: els.articleStatusFilter.value
  };
  renderSources();
}

function render() {
  renderStats();
  renderSources();
}

function renderStats() {
  const total = state.sources.length;
  const highPriority = countWhere((source) => source.priority === "High");
  const reviewed = countWhere((source) => isReviewed(source));
  const needsReview = countWhere((source) => source.status === "Need Review" || source.status === "Not Started");
  const uploadedArticles = countWhere((source) => source.articleStatus === "Uploaded to Project Folder");

  const summaryCards = [
    ["Total sources", total],
    ["Reviewed sources", reviewed],
    ["Need review", needsReview],
    ["Downloaded articles", uploadedArticles]
  ];

  els.heroStats.innerHTML = summaryCards.map(renderStatCard).join("");

  const dashboardCards = [
    ["Total Sources", total],
    ["High Priority Sources", highPriority],
    ["Reviewed Sources", reviewed],
    ["Sources Needing Review", needsReview],
    ["Downloaded Articles", uploadedArticles]
  ];

  els.dashboardStats.innerHTML = dashboardCards.map(renderStatCard).join("");
  renderBars(els.categoryBars, categories, "category");
  renderBars(els.studyTypeBars, studyTypes, "studyType");
}

function renderStatCard([label, value]) {
  return `<article class="stat-card"><strong>${value}</strong><span>${escapeHtml(label)}</span></article>`;
}

function renderBars(container, options, field) {
  const max = Math.max(1, ...options.map((option) => countWhere((source) => source[field] === option)));
  container.innerHTML = options
    .map((option) => {
      const count = countWhere((source) => source[field] === option);
      const width = count === 0 ? 0 : Math.max(8, (count / max) * 100);
      return `
        <div class="bar-row">
          <div class="bar-label"><span>${escapeHtml(option)}</span><span>${count}</span></div>
          <div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width: ${width}%"></div></div>
        </div>
      `;
    })
    .join("");
}

function renderSources() {
  const filtered = getFilteredSources();
  els.resultCount.textContent = `${filtered.length} of ${state.sources.length} sources shown`;

  if (!filtered.length) {
    els.sourceList.innerHTML = `<div class="empty-state">No sources match the current filters.</div>`;
    return;
  }

  els.sourceList.innerHTML = filtered.map(renderSourceCard).join("");
}

function renderSourceCard(source) {
  const priorityClass = `priority-${source.priority.toLowerCase()}`;
  const tags = normalizeTags(source.tags);
  const articleFileLink = source.articleFile
    ? `<a class="file-link" href="${escapeAttr(source.articleFile)}" target="_blank" rel="noopener">Open article PDF</a>`
    : `<span class="file-missing">No project-folder file yet</span>`;

  return `
    <article class="source-card" data-id="${source.id}">
      <div class="source-summary">
        <div>
          <h3 class="source-title">${escapeHtml(source.title)}</h3>
          <p class="source-meta">${escapeHtml(source.authors)} (${escapeHtml(source.year)}). <em>${escapeHtml(source.journal)}</em>.</p>
          <div class="badge-row" aria-label="Source labels">
            <span class="badge">${escapeHtml(source.studyType)}</span>
            <span class="badge">${escapeHtml(source.lens)}</span>
            <span class="badge status">${escapeHtml(source.status)}</span>
            <span class="badge ${priorityClass}">${escapeHtml(source.priority)} Priority</span>
            <span class="badge article-file">${escapeHtml(source.articleStatus || "Not Downloaded")}</span>
          </div>
          <div class="file-row">${articleFileLink}</div>
          <div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        </div>
        <div class="source-actions">
          <label>
            <span>Status</span>
            <select data-action="status">
              ${statuses.map((status) => optionMarkup(status, source.status)).join("")}
            </select>
          </label>
          <label>
            <span>Priority</span>
            <select data-action="priority">
              ${priorities.map((priority) => optionMarkup(priority, source.priority)).join("")}
            </select>
          </label>
          <label>
            <span>Article File</span>
            <select data-action="articleStatus">
              ${articleStatuses.map((status) => optionMarkup(status, source.articleStatus || "Not Downloaded")).join("")}
            </select>
          </label>
          <button class="secondary-button toggle-details" type="button" data-action="toggle">Expand Review</button>
        </div>
      </div>

      <div class="source-details">
        <div class="detail-grid">
          ${detailField("APA Citation", source.apa, true)}
          ${detailField("Research Problem", source.problem)}
          ${detailField("Purpose of the Study", source.purpose)}
          ${detailField("Theoretical Framework / Lens", source.lens)}
          ${detailField("Methodology / Study Type", source.methodology || source.studyType)}
          ${detailField("Sample / Population / Data Source", source.sample)}
          ${detailField("Key Results / Main Findings", source.findings, true)}
          ${detailField("Methodological Flaws / Limitations", source.limitations)}
          ${detailField("Relevance to My Study", source.relevance)}
          ${detailField("Literature Review Placement", source.category)}
          ${detailField("Review Status", source.status)}
          ${detailField("Priority Level", source.priority)}
          ${detailField("Article File Status", source.articleStatus || "Not Downloaded")}
          ${articleFileDetail(source)}
          ${detailField("Tags", tags.join(", "), true)}
          ${detailField("Notes", source.notes, true)}
        </div>

        <form class="inline-edit" data-action="edit">
          <label class="full">
            <span>Research Problem</span>
            <textarea name="problem" rows="3">${escapeHtml(source.problem)}</textarea>
          </label>
          <label class="full">
            <span>Purpose of the Study</span>
            <textarea name="purpose" rows="3">${escapeHtml(source.purpose)}</textarea>
          </label>
          <label>
            <span>Methodology</span>
            <textarea name="methodology" rows="3">${escapeHtml(source.methodology)}</textarea>
          </label>
          <label>
            <span>Sample / Population / Data Source</span>
            <textarea name="sample" rows="3">${escapeHtml(source.sample)}</textarea>
          </label>
          <label class="full">
            <span>Key Results / Main Findings</span>
            <textarea name="findings" rows="3">${escapeHtml(source.findings)}</textarea>
          </label>
          <label>
            <span>Methodological Flaws / Limitations</span>
            <textarea name="limitations" rows="3">${escapeHtml(source.limitations)}</textarea>
          </label>
          <label>
            <span>Relevance to My Study</span>
            <textarea name="relevance" rows="3">${escapeHtml(source.relevance)}</textarea>
          </label>
          <label>
            <span>Project Article File</span>
            <input name="articleFile" value="${escapeAttr(source.articleFile || "")}" placeholder="articles/example-source.pdf">
          </label>
          <label>
            <span>Article Folder</span>
            <input name="articleFolder" value="${escapeAttr(source.articleFolder || "")}" placeholder="literature-tracker/articles">
          </label>
          <label class="full">
            <span>Notes</span>
            <textarea name="notes" rows="3">${escapeHtml(source.notes)}</textarea>
          </label>
          <div class="form-actions full">
            <button class="primary-button" type="submit">Save Review Details</button>
          </div>
        </form>
      </div>
    </article>
  `;
}

function detailField(label, value, full = false) {
  const text = value ? value : "Not entered yet.";
  return `
    <section class="detail-field ${full ? "full" : ""}">
      <h4>${escapeHtml(label)}</h4>
      <p>${escapeHtml(text)}</p>
    </section>
  `;
}

function articleFileDetail(source) {
  const value = source.articleFile
    ? `<a class="file-link" href="${escapeAttr(source.articleFile)}" target="_blank" rel="noopener">${escapeHtml(source.articleFile)}</a>`
    : "Not entered yet.";

  return `
    <section class="detail-field">
      <h4>Project Article File</h4>
      <p>${value}</p>
    </section>
  `;
}

function optionMarkup(value, selectedValue) {
  return `<option value="${escapeAttr(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(value)}</option>`;
}

function getFilteredSources() {
  return state.sources.filter((source) => {
    const searchable = [
      source.title,
      source.authors,
      source.year,
      source.journal,
      source.apa,
      source.category,
      source.studyType,
      source.lens,
      source.status,
      source.priority,
      source.articleStatus,
      source.articleFile,
      source.articleFolder,
      normalizeTags(source.tags).join(" "),
      source.problem,
      source.purpose,
      source.methodology,
      source.sample,
      source.findings,
      source.limitations,
      source.relevance,
      source.notes
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!state.filters.search || searchable.includes(state.filters.search)) &&
      matchesFilter(source.category, state.filters.category) &&
      matchesFilter(source.studyType, state.filters.studyType) &&
      matchesFilter(source.lens, state.filters.lens) &&
      matchesFilter(source.status, state.filters.status) &&
      matchesFilter(source.priority, state.filters.priority) &&
      matchesFilter(source.articleStatus || "Not Downloaded", state.filters.articleStatus)
    );
  });
}

function matchesFilter(value, filter) {
  return filter === "All" || value === filter;
}

function handleSourceClick(event) {
  const button = event.target.closest("button[data-action='toggle']");
  if (!button) return;

  const card = button.closest(".source-card");
  const isOpen = card.classList.toggle("is-open");
  button.textContent = isOpen ? "Collapse Review" : "Expand Review";
}

function handleSourceChange(event) {
  const select = event.target.closest("select[data-action]");
  if (!select) return;

  const card = select.closest(".source-card");
  const source = findSource(Number(card.dataset.id));
  if (!source) return;

  source[select.dataset.action] = select.value;
  saveSources();
  render();
  showToast("Source updated.");
}

function handleInlineEdit(event) {
  const form = event.target.closest("form[data-action='edit']");
  if (!form) return;

  event.preventDefault();
  const card = form.closest(".source-card");
  const source = findSource(Number(card.dataset.id));
  if (!source) return;

  const data = new FormData(form);
  ["problem", "purpose", "methodology", "sample", "findings", "limitations", "relevance", "articleFile", "articleFolder", "notes"].forEach((field) => {
    source[field] = data.get(field).trim();
  });
  saveSources();
  render();
  const updatedCard = document.querySelector(`.source-card[data-id="${source.id}"]`);
  updatedCard?.classList.add("is-open");
  updatedCard?.querySelector(".toggle-details").replaceChildren("Collapse Review");
  showToast("Review details saved.");
}

function openDialog() {
  els.sourceForm.reset();
  els.sourceForm.elements.status.value = "Need Review";
  els.sourceForm.elements.priority.value = "High";
  els.sourceForm.elements.articleStatus.value = "Not Downloaded";

  if (typeof els.sourceDialog.showModal === "function") {
    els.sourceDialog.showModal();
  } else {
    els.sourceDialog.setAttribute("open", "");
  }
}

function closeDialog() {
  els.sourceDialog.close();
}

function addSource(event) {
  event.preventDefault();
  const data = new FormData(els.sourceForm);
  const newSource = {
    id: Date.now(),
    title: data.get("title").trim(),
    authors: data.get("authors").trim(),
    year: data.get("year").trim(),
    journal: data.get("journal").trim(),
    apa: data.get("apa").trim(),
    link: data.get("link").trim(),
    articleFile: data.get("articleFile").trim(),
    articleFolder: data.get("articleFile").trim() ? "literature-tracker/articles" : "",
    articleStatus: data.get("articleStatus"),
    category: data.get("category"),
    studyType: data.get("studyType"),
    lens: data.get("lens"),
    status: data.get("status"),
    priority: data.get("priority"),
    tags: splitTags(data.get("tags")),
    problem: data.get("problem").trim(),
    purpose: data.get("purpose").trim(),
    sample: data.get("sample").trim(),
    methodology: data.get("methodology").trim(),
    findings: data.get("findings").trim(),
    limitations: data.get("limitations").trim(),
    relevance: data.get("relevance").trim(),
    notes: data.get("notes").trim()
  };

  state.sources = [newSource, ...state.sources];
  saveSources();
  closeDialog();
  render();
  showToast("New source added.");
}

function copyTemplate() {
  const template = `${els.condensedTemplate.textContent}\n\n${els.expandedTemplate.textContent}`;
  copyText(template, "Template copied.");
}

function exportJson() {
  downloadFile("literature-review-sources.json", JSON.stringify(state.sources, null, 2), "application/json");
}

function exportMarkdown() {
  const reviewedSources = state.sources.filter(isReviewed);
  const markdown = reviewedSources.length
    ? reviewedSources.map(sourceToMarkdown).join("\n\n---\n\n")
    : "# Literature Review Notes\n\nNo reviewed sources yet.";
  downloadFile("literature-review-notes.md", markdown, "text/markdown");
}

function copyApa() {
  copyText(state.sources.map((source) => source.apa).join("\n\n"), "APA citations copied.");
}

function copyReviewed() {
  const reviewedSources = state.sources.filter(isReviewed);
  const text = reviewedSources.map(sourceToMarkdown).join("\n\n---\n\n");
  copyText(text || "No reviewed sources yet.", "Reviewed source notes copied.");
}

function sourceToMarkdown(source) {
  return `## APA Citation

${source.apa || ""}

### Research Problem
${source.problem || ""}

### Purpose of the Study
${source.purpose || ""}

### Methodology / Study Type
${source.methodology || source.studyType || ""}

### Sample / Data Source
${source.sample || ""}

### Key Results
${source.findings || ""}

### Methodological Flaws / Limitations
${source.limitations || ""}

### Relevance to My Study
${source.relevance || ""}

### Literature Review Placement
${source.category || ""}

### Article File Status
${source.articleStatus || "Not Downloaded"}

### Project Article File
${source.articleFile || ""}`;
}

function isReviewed(source) {
  return source.status === "Reviewed" || source.status === "Use in Literature Review";
}

function countWhere(predicate) {
  return state.sources.filter(predicate).length;
}

function findSource(id) {
  return state.sources.find((source) => source.id === id);
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === "string") return splitTags(tags);
  return [];
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`${filename} exported.`);
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast(message);
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
