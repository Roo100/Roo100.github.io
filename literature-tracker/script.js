const STORAGE_KEY = "plantationToPrisonSources";

const categories = [
  "Black Feminist Theory and Black Motherhood",
  "Post-Incarceration Motherhood and Reentry",
  "Family Rebuilding, Separation, and Reunification",
  "Stigma, Housing, Employment, and Collateral Consequences",
  "System Contact, Surveillance, and Criminalization After Release",
  "Abolitionist Care, Practice, and Community Support",
  "Pregnancy and Reproductive Justice Background",
  "Research Gap / Autoethnographic Case Study"
];

const studyTypes = [
  "Qualitative Study",
  "Quantitative Study",
  "Mixed-Methods Study",
  "Scoping Review",
  "Systematic Review",
  "Qualitative Meta-Synthesis",
  "Autoethnographic Case Study",
  "Methodological Review",
  "Descriptive Study",
  "Editorial / Commentary",
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
  "Motherhood Studies",
  "Reentry",
  "Collateral Consequences",
  "Research Methods",
  "System Contact",
  "Public Health",
  "Reproductive Control"
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

const assignmentReviews = {
  "cannabis decriminalization and racial disparity in arrests for cannabis possession": {
    abstract: "This article examines whether cannabis decriminalization reduced racial disparities in cannabis possession arrests between Black and White people in the United States. Using FBI Uniform Crime Report data from 37 states between 2000 and 2019, the authors calculated cannabis possession arrest rates separately for Black and White adults and youths. They used a difference-in-differences design to compare states that decriminalized cannabis with states that did not. The study found that cannabis decriminalization was associated with substantial reductions in arrest rates for both Black and White adults and youths. Among adults, decriminalization was associated with an approximately 17% reduction in the Black-White arrest disparity, but no similar reduction was found among youths. The authors conclude that cannabis decriminalization may reduce overall arrests and may reduce racial disparity among adults, though racialized enforcement remains an important concern.",
    problem: "The research problem is that Black people in the United States have been disproportionately arrested for cannabis possession despite similar rates of cannabis use compared with White people. Cannabis decriminalization has been promoted as a way to reduce racial disparities in drug enforcement, but the authors state that there has been very little empirical evidence showing whether decriminalization actually reduces Black-White arrest disparities.",
    researchQuestion: "The main research question is whether cannabis decriminalization is associated with reduced racial disparity in cannabis possession arrests between Black and White people in the United States. The implied hypothesis is that decriminalization would reduce cannabis possession arrests overall and may reduce the Black-White arrest-rate ratio, especially if Black people were disproportionately targeted before decriminalization.",
    studyMethod: "This is a quantitative study. The authors used numerical arrest data and statistical analysis to examine changes in cannabis possession arrest rates before and after decriminalization.",
    dataType: "The study uses secondary data. The authors relied on existing arrest data from the FBI Uniform Crime Reporting Program rather than collecting original data from participants.",
    sample: "The study used state-level arrest data from 37 U.S. states between 2000 and 2019. Eleven states implemented cannabis decriminalization during the study period, while 26 states did not. The authors analyzed arrest rates separately for Black adults, White adults, Black youths, and White youths. Some states were excluded because of incomplete reporting, reporting errors, or cannabis penalty changes that did not fit the study design.",
    methodsInstruments: "The authors used FBI Uniform Crime Report arrest data and a difference-in-differences statistical method. They calculated cannabis possession arrest rates per 1,000 people and measured racial disparity using the Black-to-White arrest-rate ratio. They also used event-study analysis, Goodman-Bacon decomposition, and leave-one-out analysis to test the strength of their findings.",
    relevance: "This article supports my research because it shows that cannabis criminalization has been racially unequal and that policy reforms do not fully eliminate racialized punishment. Although my study focuses on Black women, criminalization, reproductive control, and a Black feminist phenomenological lens, this article provides background evidence that Black people have been disproportionately exposed to criminal legal system contact through cannabis enforcement. It helps establish the broader problem of racialized criminalization before narrowing my study to Black women’s lived experiences."
  },
  "association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization": {
    abstract: "This article examines how statewide cannabis legalization, decriminalization, and no policy change are associated with cannabis possession arrest rates and racial disparities among Black and White adults and youths. The authors used Uniform Crime Reporting Program arrest data and SEER population estimates from 2000 to 2019. The study included 43 U.S. states: 9 legalization states, 8 decriminalization states, and 26 states with no cannabis policy change. The findings show that legalization and decriminalization were associated with large reductions in cannabis possession arrests among adults. Among youths, decriminalization was associated with reductions in arrests and some reduction in disparities, while legalization did not produce the same clear youth arrest reduction. The authors conclude that states without cannabis policy reform experienced increasing racial arrest disparities, showing the need for targeted interventions to address racial injustice.",
    problem: "The research problem is that Black people are disproportionately arrested for cannabis possession despite similar cannabis use rates compared with White people. The authors examine whether statewide legalization, decriminalization, or no policy change is associated with cannabis possession arrest rates and racial disparities among adults and youths.",
    researchQuestion: "How are statewide cannabis policies--legalization, decriminalization, and no policy change--associated with cannabis possession arrest rates and racial disparities among Black and White adults and youths?",
    studyMethod: "This is a quantitative case-control / event-study analysis.",
    dataType: "This study uses secondary administrative data.",
    sample: "The study included 43 U.S. states from 2000 to 2019. Of those states, 9 implemented legalization, 8 implemented decriminalization, and 26 had no cannabis policy change. The study examined arrest rates separately for Black adults, White adults, Black youths, and White youths.",
    methodsInstruments: "The authors used Uniform Crime Reporting Program arrest data and SEER population estimates. They calculated cannabis possession arrest rates per 100,000 people and used event-study analyses to compare arrest trends before and after cannabis policy implementation.",
    findings: "Legalization and decriminalization were associated with large reductions in cannabis possession arrests among adults. Among youths, decriminalization was associated with reductions in arrests and some reduction in disparities, while legalization did not show the same clear youth arrest reduction. Racial disparities remained over time, and states without cannabis policy reform experienced increasing arrest disparities.",
    relevance: "This article supports the background section on racialized criminalization and cannabis enforcement. It shows that policy reform can reduce arrests but does not fully eliminate racial disparity. My project builds on this limitation by using an autoethnographic case study design and Black feminist theory as a critical lens to examine Black motherhood after incarceration, system contact, reentry, and abolitionist practice beyond arrest statistics."
  }
};

const supportClaims = {
  "what is known about reproductive autonomy among justice involved black women a scoping review": "This is one of the most important sources for your gap. The authors reviewed literature on reproductive autonomy among justice-involved Black women and found that recognition of incarceration’s influence on Black women’s reproductive autonomy remains limited.",
  "formerly incarcerated black mothers matter too resisting social constructions of motherhood": "This directly supports centering formerly incarcerated Black women’s voices. The article uses interviews with formerly incarcerated Black mothers and argues for more critical qualitative research grounded in Black feminist theory.",
  "reproductive justice disrupted mass incarceration as a driver of reproductive oppression": "This gives you the core reproductive justice argument. The authors frame mass incarceration as reproductive oppression and connect reproductive justice to Black feminist thought.",
  "lived experiences of pregnancy and prison through a reproductive justice lens": "This supports the phenomenological/lived-experience direction. It synthesizes 31 qualitative studies on pregnancy, labor, childbirth, and postpartum experiences in prisons and jails.",
  "shackling and pregnancy care policies in us prisons and jails": "This supports the pregnancy-in-custody portion of the claim. It examines prison and jail pregnancy policies, including restraint use and anti-shackling compliance.",
  "pregnancy outcomes in us prisons 2016 2017": "This gives empirical grounding for pregnancy in prison. Use it to establish that pregnancy in custody is measurable, documented, and institutionally significant, even though lived-experience work remains limited.",
  "how the criminalization of pregnancy robs women of reproductive autonomy": "This supports the criminalization and reproductive control argument. Goodwin helps frame pregnancy criminalization as an attack on reproductive autonomy rather than a neutral legal process.",
  "experiences of anti black gendered racism and reproductive coercion among black pregnant and postpartum women with substance use disorder": "This supports the Black feminist intersectional lens because it examines how anti-Black gendered racism, substance-use criminalization, and family policing shape Black pregnant women’s reproductive experiences.",
  "reproductive health care for incarcerated people advancing health equity in unequitable settings": "This supports the healthcare-access and autonomy side of your claim. It states that structural inequities, including racism, shape reproductive health outcomes, autonomy, and access to care for people in custody.",
  "maternal health and incarceration advancing pregnancy justice for incarcerated pregnant people": "This is useful for updated pregnancy justice framing. It reviews maternal health and incarceration through structural racism and reproductive justice, which supports the need for a Black feminist analysis of pregnancy under carceral control.",
  "association of racial disparity of cannabis possession arrests among adults and youths with statewide cannabis decriminalization and legalization": "Use this source to show that cannabis policy reform can reduce overall criminal legal exposure while leaving racial disparities intact. It helps establish the broader problem of racialized system contact before narrowing the thesis to Black motherhood after incarceration and the continuing effects of punishment after release."
};

const canonicalAssignmentSourceKeys = new Set(Object.keys(assignmentReviews));

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
    type: "Quantitative case-control / event-study analysis",
    peer_reviewed: "Yes",
    category: "Racialized criminalization / cannabis policy reform / arrest disparities",
    use: "This article supports the background section on racialized criminalization and cannabis enforcement. It shows that policy reform can reduce arrests but does not fully eliminate racial disparity. My project builds on this limitation by using an autoethnographic case study design and Black feminist theory as a critical lens to examine Black motherhood after incarceration, system contact, reentry, and abolitionist practice beyond arrest statistics."
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
  },
  {
    id: 31,
    citation: "Freudenberg, N., Daniels, J., Crum, M., Perkins, T., & Richie, B. E. (2005). Coming home from jail: The social and health consequences of community reentry for women, male adolescents, and their families and communities. American Journal of Public Health, 95(10), 1725–1736.",
    title: "Coming Home From Jail: The Social and Health Consequences of Community Reentry for Women, Male Adolescents, and Their Families and Communities",
    authors_year: "Freudenberg, Daniels, Crum, Perkins, & Richie (2005)",
    type: "Public health / reentry analysis",
    peer_reviewed: "Yes",
    category: "Reentry / community return",
    supportClaim: "Strong source for what happens after release: health, family, community, and social instability. It helps frame incarceration as something that continues beyond the jail/prison wall.",
    use: "Strong source for what happens after release: health, family, community, and social instability. It helps frame incarceration as something that continues beyond the jail/prison wall."
  },
  {
    id: 32,
    citation: "Richie, B. E., Freudenberg, N., & Page, J. (2001). Reintegrating women leaving jail into urban communities: A description of a model program. Journal of Urban Health, 78(2), 290–303.",
    title: "Reintegrating Women Leaving Jail Into Urban Communities: A Description of a Model Program",
    authors_year: "Richie, Freudenberg, & Page (2001)",
    type: "Program model / women’s reentry article",
    peer_reviewed: "Yes",
    category: "Women’s reentry / community support",
    supportClaim: "Useful for showing that women leaving jail need community-based support, not just correctional supervision. This supports the abolitionist practice part of the project.",
    use: "Useful for showing that women leaving jail need community-based support, not just correctional supervision. This supports the abolitionist practice part of the project."
  },
  {
    id: 33,
    citation: "Greene, S. (2004). Mothering and making it, in and out of prison. Punishment & Society, 6(1), 33–54.",
    title: "Mothering and Making It, In and Out of Prison",
    authors_year: "Greene (2004)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Motherhood after incarceration",
    supportClaim: "Directly relevant to mothering across incarceration and release. Use this to discuss how mothers reconstruct identity, responsibility, and family relationships after punishment.",
    use: "Directly relevant to mothering across incarceration and release. Use this to discuss how mothers reconstruct identity, responsibility, and family relationships after punishment."
  },
  {
    id: 34,
    citation: "Ferraro, K. J., & Moe, A. M. (2003). Mothering, crime, and incarceration. Journal of Contemporary Ethnography, 32(1), 9–40.",
    title: "Mothering, Crime, and Incarceration",
    authors_year: "Ferraro & Moe (2003)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Criminalized motherhood",
    supportClaim: "Useful because it links motherhood, criminalization, and incarceration through qualitative analysis. It can support the argument that criminalized mothers are often judged through moralized ideas of good and bad motherhood.",
    use: "Useful because it links motherhood, criminalization, and incarceration through qualitative analysis. It can support the argument that criminalized mothers are often judged through moralized ideas of good and bad motherhood."
  },
  {
    id: 35,
    citation: "Barnes, S. L., & Stringer, E. C. (2014). Is motherhood important? Imprisoned women’s maternal experiences before and during confinement and their postrelease expectations. Feminist Criminology, 9(1), 3–23.",
    title: "Is Motherhood Important? Imprisoned Women’s Maternal Experiences Before and During Confinement and Their Postrelease Expectations",
    authors_year: "Barnes & Stringer (2014)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Maternal identity / postrelease expectations",
    supportClaim: "Important for the reentry focus because it addresses women’s expectations of motherhood after release, not only their experiences during incarceration.",
    use: "Important for the reentry focus because it addresses women’s expectations of motherhood after release, not only their experiences during incarceration."
  },
  {
    id: 36,
    citation: "Henriques, Z. W., & Manatu-Rupert, N. (2001). Living on the outside: African American women before, during, and after imprisonment. The Prison Journal, 81(1), 6–19.",
    title: "Living on the Outside: African American Women Before, During, and After Imprisonment",
    authors_year: "Henriques & Manatu-Rupert (2001)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Black women after imprisonment",
    supportClaim: "This is one of the strongest fits because it specifically focuses on African American women before, during, and after imprisonment. Use it for the Black motherhood/post-incarceration section.",
    use: "This is one of the strongest fits because it specifically focuses on African American women before, during, and after imprisonment. Use it for the Black motherhood/post-incarceration section."
  },
  {
    id: 37,
    citation: "Walker, E. K. (2011). Risk and protective factors in mothers with a history of incarceration: Do relationships buffer the effects of trauma symptoms and substance abuse history? Women & Therapy, 34(3), 271–288.",
    title: "Risk and Protective Factors in Mothers With a History of Incarceration: Do Relationships Buffer the Effects of Trauma Symptoms and Substance Abuse History?",
    authors_year: "Walker (2011)",
    type: "Quantitative Study",
    peer_reviewed: "Yes",
    category: "Trauma / relationships / reentry",
    supportClaim: "Helpful for discussing how relationships, support, trauma, and substance-use history shape post-incarceration motherhood.",
    use: "Helpful for discussing how relationships, support, trauma, and substance-use history shape post-incarceration motherhood."
  },
  {
    id: 38,
    citation: "Luther, K., & Gregson, J. (2011). Restricted motherhood: Parenting in a prison nursery. International Journal of Sociology of the Family, 37(1), 85–104.",
    title: "Restricted Motherhood: Parenting in a Prison Nursery",
    authors_year: "Luther & Gregson (2011)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Restricted motherhood / carceral parenting",
    supportClaim: "Although this focuses on prison nurseries, it is useful for explaining how even motherhood-supportive prison programs can still operate within carceral control.",
    use: "Although this focuses on prison nurseries, it is useful for explaining how even motherhood-supportive prison programs can still operate within carceral control."
  },
  {
    id: 39,
    citation: "Roberts, D. E. (2004). The social and moral cost of mass incarceration in African American communities. Stanford Law Review, 56(5), 1271–1305.",
    title: "The Social and Moral Cost of Mass Incarceration in African American Communities",
    authors_year: "Roberts (2004)",
    type: "Legal Analysis",
    peer_reviewed: "No / law review",
    category: "Black communities / carceral harm",
    supportClaim: "Use this for the broader structural argument: incarceration damages Black families, communities, and collective social life. It supports the beyond-the-carceral-state framing.",
    use: "Use this for the broader structural argument: incarceration damages Black families, communities, and collective social life. It supports the beyond-the-carceral-state framing."
  },
  {
    id: 40,
    citation: "Richie, B. E. (2000). A Black feminist reflection on the antiviolence movement. Signs: Journal of Women in Culture and Society, 25(4), 1133–1137.",
    title: "A Black Feminist Reflection on the Antiviolence Movement",
    authors_year: "Richie (2000)",
    type: "Theoretical Article",
    peer_reviewed: "Yes",
    category: "Black feminist lens / abolitionist critique",
    supportClaim: "Use this for the critical lens. Richie helps explain why Black women’s experiences with violence, criminalization, and state systems require a Black feminist analysis rather than a gender-neutral or race-neutral framework.",
    use: "Use this for the critical lens. Richie helps explain why Black women’s experiences with violence, criminalization, and state systems require a Black feminist analysis rather than a gender-neutral or race-neutral framework."
  },
  {
    id: 41,
    citation: "Testa, A., Jackson, D. B., Vaughn, M. G., & Bello, J. K. (2020). Incarceration as a unique social stressor during pregnancy: Implications for maternal and newborn health. Social Science & Medicine, 246, 112777. https://doi.org/10.1016/j.socscimed.2019.112777",
    title: "Incarceration as a Unique Social Stressor During Pregnancy: Implications for Maternal and Newborn Health",
    authors_year: "Testa, Jackson, Vaughn, & Bello (2020)",
    type: "Quantitative / public health study",
    peer_reviewed: "Yes",
    category: "Pregnancy / incarceration / maternal and newborn health",
    articleFile: "articles/incarceration-as-a-unique-social-stressor-during-pregnancy.pdf",
    supportClaim: "Background source showing incarceration as a social stressor with consequences for maternal and newborn health. Useful for pregnancy context while the main thesis remains focused on motherhood after release.",
    use: "Background source showing incarceration as a social stressor with consequences for maternal and newborn health. Useful for pregnancy context while the main thesis remains focused on motherhood after release."
  },
  {
    id: 42,
    citation: "Barnett-Page, E., & Thomas, J. (2009). Methods for the synthesis of qualitative research: A critical review. BMC Medical Research Methodology, 9, 59. https://doi.org/10.1186/1471-2288-9-59",
    title: "Methods for the Synthesis of Qualitative Research: A Critical Review",
    authors_year: "Barnett-Page & Thomas (2009)",
    type: "Methodological review",
    peer_reviewed: "Yes",
    category: "Qualitative methods / synthesis / research design",
    articleFile: "articles/methods-for-the-synthesis-of-qualitative-research-a-critical-review.pdf",
    supportClaim: "Useful as a methods background source for understanding qualitative synthesis and how qualitative evidence can be organized in a literature review.",
    use: "Useful as a methods background source for understanding qualitative synthesis and how qualitative evidence can be organized in a literature review."
  },
  {
    id: 43,
    citation: "Brinkley-Rubinstein, L. (2020). Mass incarceration as a social-structural driver of health inequities: A supplement to AJPH. American Journal of Public Health, 110(S1), S14–S15. https://doi.org/10.2105/AJPH.2019.305486",
    title: "Mass Incarceration as a Social-Structural Driver of Health Inequities",
    authors_year: "Brinkley-Rubinstein (2020)",
    type: "Public health editorial",
    peer_reviewed: "Yes",
    category: "Mass incarceration / health inequities / structural racism",
    articleFile: "articles/mass-incarceration-as-a-social-structural-driver-of-health-inequities.pdf",
    supportClaim: "Supports the broader claim that incarceration is a structural driver of health inequity and continues to shape life chances after release.",
    use: "Supports the broader claim that incarceration is a structural driver of health inequity and continues to shape life chances after release."
  },
  {
    id: 44,
    citation: "Davis, A. Y. (n.d.). The challenge of abolition. True Leap Press.",
    title: "The Challenge of Abolition",
    authors_year: "Davis (n.d.)",
    type: "Abolitionist essay",
    peer_reviewed: "No",
    category: "Abolitionist practice / carceral state critique",
    articleFile: "articles/the-challenge-of-abolition.pdf",
    supportClaim: "Background source for abolitionist framing and alternatives to carceral solutions. Use as theory/background rather than a peer-reviewed article review.",
    use: "Background source for abolitionist framing and alternatives to carceral solutions. Use as theory/background rather than a peer-reviewed article review."
  },
  {
    id: 45,
    citation: "Carlson, J. R. (2018). Prison nurseries: A way to reduce recidivism. The Prison Journal, 98(6), 760–775. https://doi.org/10.1177/0032885518812694",
    title: "Prison Nurseries: A Way to Reduce Recidivism",
    authors_year: "Carlson (2018)",
    type: "Policy / correctional program article",
    peer_reviewed: "Yes",
    category: "Prison nurseries / motherhood / family connection",
    articleFile: "articles/prison-nurseries-a-way-to-reduce-recidivism.pdf",
    supportClaim: "Useful for discussing prison nursery programs, maternal bonding, and how institutional support for motherhood can still remain tied to carceral control.",
    use: "Useful for discussing prison nursery programs, maternal bonding, and how institutional support for motherhood can still remain tied to carceral control."
  },
  {
    id: 46,
    citation: "Arshad, F., Haith-Cooper, M., & Palloti, P. (2018). The experiences of pregnant migrant women in detention: A qualitative study. British Journal of Midwifery, 26(9), 591–598.",
    title: "The Experiences of Pregnant Migrant Women in Detention: A Qualitative Study",
    authors_year: "Arshad, Haith-Cooper, & Palloti (2018)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Pregnancy / detention / qualitative experience",
    articleFile: "articles/experiences-of-pregnant-migrant-women-in-detention.pdf",
    supportClaim: "Background source for pregnancy in detention and the lived experience of confinement during pregnancy. Use as context rather than a central Black motherhood source.",
    use: "Background source for pregnancy in detention and the lived experience of confinement during pregnancy. Use as context rather than a central Black motherhood source."
  },
  {
    id: 47,
    citation: "Awenat, Y. F., Moore, C., Gooding, P. A., Ulph, F., Mirza, A., & Pratt, D. (2018). Improving the quality of prison research: A qualitative study of ex-offender service user involvement in prison suicide prevention research. Health Expectations, 21(1), 100–109. https://doi.org/10.1111/hex.12590",
    title: "Improving the Quality of Prison Research: A Qualitative Study of Ex-Offender Service User Involvement in Prison Suicide Prevention Research",
    authors_year: "Awenat et al. (2018)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Prison research / lived experience / service user involvement",
    articleFile: "articles/improving-the-quality-of-prison-research-ex-offender-service-user-involvement.pdf",
    supportClaim: "Useful methodology source because it supports involving people with lived experience in prison research and strengthens the rationale for autoethnographic knowledge.",
    use: "Useful methodology source because it supports involving people with lived experience in prison research and strengthens the rationale for autoethnographic knowledge."
  },
  {
    id: 48,
    citation: "Ahrens, D. (2015). Incarcerated childbirth and broader birth control: Autonomy, regulation, and the state. Missouri Law Review, 80(1), 1–52.",
    title: "Incarcerated Childbirth and Broader Birth Control: Autonomy, Regulation, and the State",
    authors_year: "Ahrens (2015)",
    type: "Legal Analysis",
    peer_reviewed: "No / law review",
    category: "Incarcerated childbirth / state regulation / autonomy",
    articleFile: "articles/incarcerated-childbirth-and-broader-birth-control.pdf",
    supportClaim: "Background legal source on state regulation of childbirth and autonomy in carceral settings. Useful for pregnancy context and the history of institutional control.",
    use: "Background legal source on state regulation of childbirth and autonomy in carceral settings. Useful for pregnancy context and the history of institutional control."
  },
  {
    id: 49,
    citation: "Wismont, J. M. (2000). The lived pregnancy experience of women in prison. Journal of Midwifery & Women’s Health, 45(4), 292–300. https://doi.org/10.1016/S1526-9523(00)00034-9",
    title: "The Lived Pregnancy Experience of Women in Prison",
    authors_year: "Wismont (2000)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Pregnancy in prison / lived experience",
    articleFile: "articles/the-lived-pregnancy-experience-of-women-in-prison.pdf",
    supportClaim: "Background lived-experience source for pregnancy in prison. Useful for showing how incarceration shapes embodiment, vulnerability, and motherhood before release.",
    use: "Background lived-experience source for pregnancy in prison. Useful for showing how incarceration shapes embodiment, vulnerability, and motherhood before release."
  },
  {
    id: 50,
    citation: "Abbott, L., Scott, T., Thomas, H., & Weston, K. (2020). Pregnancy and childbirth in English prisons: Institutional ignominy and the pains of imprisonment. Sociology of Health & Illness, 42(3), 660–675. https://doi.org/10.1111/1467-9566.13052",
    title: "Pregnancy and Childbirth in English Prisons: Institutional Ignominy and the Pains of Imprisonment",
    authors_year: "Abbott, Scott, Thomas, & Weston (2020)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Pregnancy / childbirth / prison pains",
    articleFile: "articles/pregnancy-and-childbirth-in-english-prisons.pdf",
    supportClaim: "Background source for prison pregnancy and childbirth experiences, including how institutional confinement intensifies the pains of imprisonment.",
    use: "Background source for prison pregnancy and childbirth experiences, including how institutional confinement intensifies the pains of imprisonment."
  },
  {
    id: 51,
    citation: "Abbott, L. (2023). Compulsory separation of women prisoners from their babies following childbirth: Uncertainty, loss and disenfranchised grief. Sociology of Health & Illness, 45(5), 971–988. https://doi.org/10.1111/1467-9566.13423",
    title: "Compulsory Separation of Women Prisoners From Their Babies Following Childbirth: Uncertainty, Loss and Disenfranchised Grief",
    authors_year: "Abbott (2023)",
    type: "Qualitative Study",
    peer_reviewed: "Yes",
    category: "Family separation / childbirth / prison motherhood",
    articleFile: "articles/compulsory-separation-of-women-prisoners-from-their-babies-following-childbirth.pdf",
    supportClaim: "Highly relevant for family separation and the emotional afterlife of incarceration. It supports the thesis focus on motherhood, grief, and family rebuilding.",
    use: "Highly relevant for family separation and the emotional afterlife of incarceration. It supports the thesis focus on motherhood, grief, and family rebuilding."
  },
  {
    id: 52,
    citation: "Turney, K. (2014). Stress proliferation across generations? Examining the relationship between parental incarceration and childhood health. Journal of Health and Social Behavior, 55(3), 302–319. https://doi.org/10.1177/0022146514544173",
    title: "Stress Proliferation Across Generations? Examining the Relationship Between Parental Incarceration and Childhood Health",
    authors_year: "Turney (2014)",
    type: "Quantitative Study",
    peer_reviewed: "Yes",
    category: "Parental incarceration / child health / intergenerational stress",
    articleFile: "articles/stress-proliferation-across-generations-parental-incarceration-childhood-health.pdf",
    supportClaim: "Important for showing how incarceration affects children and families across generations, supporting the family stability and system afterlife portions of the thesis.",
    use: "Important for showing how incarceration affects children and families across generations, supporting the family stability and system afterlife portions of the thesis."
  },
  {
    id: 53,
    citation: "Williams, L. E., Schulte-Day, S., & Day, S. (2006). Pregnant in prison: The incarcerated woman’s experience: A preliminary descriptive study. Journal of Correctional Health Care, 12(2), 78–88.",
    title: "Pregnant in Prison: The Incarcerated Woman’s Experience: A Preliminary Descriptive Study",
    authors_year: "Williams, Schulte-Day, & Day (2006)",
    type: "Descriptive Study",
    peer_reviewed: "Yes",
    category: "Pregnancy in prison / incarcerated women’s experience",
    articleFile: "articles/pregnant-in-prison-the-incarcerated-womans-experience.pdf",
    supportClaim: "Background source on incarcerated pregnancy experiences. Useful for personal narrative context, but not central to the revised post-release motherhood focus.",
    use: "Background source on incarcerated pregnancy experiences. Useful for personal narrative context, but not central to the revised post-release motherhood focus."
  },
  {
    id: 54,
    citation: "Gelman, A., Fagan, J., & Kiss, A. (2007). An analysis of the New York City Police Department’s stop-and-frisk policy in the context of claims of racial bias. Journal of the American Statistical Association, 102(479), 813–823. https://doi.org/10.1198/016214506000001040",
    title: "An Analysis of the New York City Police Department’s Stop-and-Frisk Policy in the Context of Claims of Racial Bias",
    authors_year: "Gelman, Fagan, & Kiss (2007)",
    type: "Quantitative Study",
    peer_reviewed: "Yes",
    category: "Policing / racial bias / system contact",
    articleFile: "articles/analysis-of-nypd-stop-and-frisk-policy-racial-bias.pdf",
    supportClaim: "Background source for racialized system contact and policing. Useful for explaining how criminalization begins before incarceration and continues through surveillance.",
    use: "Background source for racialized system contact and policing. Useful for explaining how criminalization begins before incarceration and continues through surveillance."
  },
  {
    id: 55,
    citation: "Mitchell, O., & Caudy, M. S. (2015). Examining racial disparities in drug arrests. Justice Quarterly, 32(2), 288–313. https://doi.org/10.1080/07418825.2012.761721",
    title: "Examining Racial Disparities in Drug Arrests",
    authors_year: "Mitchell & Caudy (2015)",
    type: "Quantitative Study",
    peer_reviewed: "Yes",
    category: "Drug arrests / racial disparities / system contact",
    articleFile: "articles/examining-racial-disparities-in-drug-arrests.pdf",
    supportClaim: "Background source for racialized drug enforcement and system contact. Useful for the criminalization backdrop of Black motherhood after incarceration.",
    use: "Background source for racialized drug enforcement and system contact. Useful for the criminalization backdrop of Black motherhood after incarceration."
  },
  {
    id: 56,
    citation: "Milner, A. N., George, B. J., & Allison, D. B. (2016). Black and Hispanic men perceived to be large are at increased risk for police frisk, search, and force. PLOS ONE, 11(1), e0147158. https://doi.org/10.1371/journal.pone.0147158",
    title: "Black and Hispanic Men Perceived to Be Large Are at Increased Risk for Police Frisk, Search, and Force",
    authors_year: "Milner, George, & Allison (2016)",
    type: "Quantitative Study",
    peer_reviewed: "Yes",
    category: "Policing / racialized perception / system contact",
    articleFile: "articles/black-and-hispanic-men-perceived-to-be-large-police-frisk-search-force.pdf",
    supportClaim: "Background source for racialized policing and embodied suspicion. Less central to Black motherhood, but useful for broader system-contact context.",
    use: "Background source for racialized policing and embodied suspicion. Less central to Black motherhood, but useful for broader system-contact context."
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
  const sourceKey = normalizeTitle(record.title);
  const assignmentReview = assignmentReviews[sourceKey] || {};

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
    supportClaim: record.supportClaim || supportClaims[sourceKey] || "",
    abstract: assignmentReview.abstract || "",
    problem: assignmentReview.problem || "",
    researchQuestion: assignmentReview.researchQuestion || "",
    studyMethod: assignmentReview.studyMethod || "",
    dataType: assignmentReview.dataType || "",
    purpose: assignmentReview.researchQuestion || "",
    methodology: assignmentReview.methodsInstruments || record.type,
    sample: assignmentReview.sample || "",
    methodsInstruments: assignmentReview.methodsInstruments || "",
    findings: assignmentReview.findings || "",
    limitations: "",
    relevance: assignmentReview.relevance || record.use,
    notes: `Uploaded source category: ${record.category}\nPeer-reviewed status: ${record.peer_reviewed}`
  };
}

function mapArticleFile(record) {
  if (record.articleFile) return record.articleFile;

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
  if (text.includes("research gap") || text.includes("qualitative methods") || text.includes("methodological") || text.includes("research design") || text.includes("service user involvement")) {
    return "Research Gap / Autoethnographic Case Study";
  }
  if (text.includes("policing") || text.includes("police") || text.includes("drug arrest") || text.includes("arrest disparities") || text.includes("cannabis possession arrest") || text.includes("stop-and-frisk") || text.includes("frisk") || text.includes("search and force") || text.includes("system contact") || text.includes("surveillance")) {
    return "System Contact, Surveillance, and Criminalization After Release";
  }
  if (text.includes("abolition") || text.includes("community support") || text.includes("community-based")) {
    return "Abolitionist Care, Practice, and Community Support";
  }
  if (text.includes("separation") || text.includes("babies") || text.includes("childhood health") || text.includes("parental incarceration") || text.includes("family rebuilding")) {
    return "Family Rebuilding, Separation, and Reunification";
  }
  if (text.includes("pregnancy") || text.includes("pregnant") || text.includes("childbirth") || text.includes("reproductive control") || text.includes("reproductive coercion") || text.includes("shackling") || text.includes("health care")) {
    return "Pregnancy and Reproductive Justice Background";
  }
  if (text.includes("reentry") || text.includes("release") || text.includes("postrelease") || text.includes("coming home") || text.includes("living on the outside")) {
    return "Post-Incarceration Motherhood and Reentry";
  }
  if (text.includes("housing") || text.includes("employment") || text.includes("stigma") || text.includes("collateral") || text.includes("trauma") || text.includes("substance")) {
    return "Stigma, Housing, Employment, and Collateral Consequences";
  }
  if (text.includes("family") || text.includes("mother") || text.includes("maternal") || text.includes("parenting")) {
    return "Family Rebuilding, Separation, and Reunification";
  }
  if (text.includes("black feminist") || text.includes("reproductive justice") || text.includes("reproductive autonomy")) {
    return "Black Feminist Theory and Black Motherhood";
  }
  return "System Contact, Surveillance, and Criminalization After Release";
}

function mapStudyType(type) {
  const text = type.toLowerCase();
  if (text.includes("scoping")) return "Scoping Review";
  if (text.includes("systematic")) return "Systematic Review";
  if (text.includes("meta-synthesis")) return "Qualitative Meta-Synthesis";
  if (text.includes("methodological")) return "Methodological Review";
  if (text.includes("descriptive")) return "Descriptive Study";
  if (text.includes("editorial") || text.includes("commentary") || text.includes("essay")) return "Editorial / Commentary";
  if (text.includes("mixed")) return "Mixed-Methods Study";
  if (text.includes("qualitative")) return "Qualitative Study";
  if (text.includes("quantitative") || text.includes("quasi") || text.includes("prospective")) return "Quantitative Study";
  if (text.includes("law") || text.includes("legal") || text.includes("bioethics")) return "Legal Analysis";
  if (text.includes("theoretical") || text.includes("framework")) return "Theoretical Article";
  return "Policy Analysis";
}

function mapLens(record) {
  const text = `${record.title} ${record.category} ${record.use}`.toLowerCase();
  if (text.includes("method") || text.includes("research design") || text.includes("service user involvement")) return "Research Methods";
  if (text.includes("policing") || text.includes("police") || text.includes("drug arrest") || text.includes("arrest disparities") || text.includes("cannabis possession arrest") || text.includes("stop-and-frisk") || text.includes("frisk") || text.includes("search and force") || text.includes("system contact")) return "System Contact";
  if (text.includes("black feminist")) return "Black Feminist Theory";
  if (text.includes("mother") || text.includes("maternal") || text.includes("parenting")) return "Motherhood Studies";
  if (text.includes("reentry") || text.includes("release") || text.includes("postrelease") || text.includes("coming home")) return "Reentry";
  if (text.includes("housing") || text.includes("employment") || text.includes("stigma") || text.includes("collateral")) return "Collateral Consequences";
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
  if (text.includes("core source") || text.includes("major anchor") || text.includes("strong source") || text.includes("strongest") || text.includes("directly relevant") || text.includes("important for") || text.includes("critical lens")) return "High";
  if (text.includes("potential") || text.includes("supports") || text.includes("useful") || text.includes("helpful")) return "Medium";
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
  const sourceKey = normalizeTitle(starter.title);
  const usesCanonicalAssignment = canonicalAssignmentSourceKeys.has(sourceKey);
  const merged = {
    ...starter,
    id: saved.id || starter.id,
    status: saved.status || starter.status,
    priority: saved.priority || starter.priority
  };

  if (!usesCanonicalAssignment) {
    ["abstract", "problem", "researchQuestion", "studyMethod", "dataType", "sample", "methodsInstruments", "findings", "limitations"].forEach((field) => {
      if (saved[field]) merged[field] = saved[field];
    });
  }

  if (usesCanonicalAssignment) {
    merged.supportClaim = starter.supportClaim || saved.supportClaim || "";
  } else if (saved.supportClaim && saved.supportClaim !== starter.supportClaim) {
    merged.supportClaim = saved.supportClaim;
  } else {
    merged.supportClaim = starter.supportClaim || saved.supportClaim || "";
  }

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

  merged.methodology = usesCanonicalAssignment
    ? starter.methodology
    : saved.methodology && saved.methodology !== saved.studyType ? saved.methodology : starter.methodology;
  merged.purpose = usesCanonicalAssignment ? starter.purpose : saved.purpose || starter.purpose;
  merged.relevance = usesCanonicalAssignment ? starter.relevance : saved.relevance || starter.relevance;
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
          <button class="primary-button copy-review" type="button" data-action="copy-review">Copy Review</button>
        </div>
      </div>

      <div class="source-details">
        <div class="detail-grid">
          ${renderDetailFields(source, tags)}
        </div>
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

function renderDetailFields(source, tags) {
  const fields = [
    ["APA Citation", source.apa, true],
    ["Abstract", source.abstract, true],
    ["What is the research problem?", source.problem, true],
    ["What is the research question and/or hypothesis?", source.researchQuestion || source.purpose, true],
    ["Is the study qualitative, quantitative, or mixed methods?", source.studyMethod || source.studyType, false],
    ["What type of data is used: primary or secondary?", source.dataType, false],
    ["What is the sample size and its characteristics?", source.sample, true],
    ["What research methods or instruments were used?", source.methodsInstruments || source.methodology, true],
    ["Key Findings", source.findings, true],
    ["How it supports your claim", source.supportClaim, true],
    ["Brief relevance to my research topic", source.relevance, true],
    ["Review Status", source.status, false],
    ["Priority Level", source.priority, false],
    ["Article File Status", source.articleStatus || "Not Downloaded", false],
    ["Literature Review Placement", source.category, false],
    ["Theoretical Framework / Lens", source.lens, false],
    ["Tags", tags.join(", "), true],
    ["Notes", source.notes, true]
  ];

  const seen = new Set();
  const rendered = fields
    .filter(([, value]) => hasDetailValue(value))
    .filter(([, value]) => {
      const normalized = normalizeDetailText(value);
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .map(([label, value, full]) => detailField(label, value, full));

  rendered.splice(13, 0, articleFileDetail(source));
  return rendered.join("");
}

function hasDetailValue(value) {
  return String(value || "").trim().length > 0;
}

function normalizeDetailText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
      source.abstract,
      source.problem,
      source.researchQuestion,
      source.studyMethod,
      source.dataType,
      source.methodsInstruments,
      source.supportClaim,
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
  const copyButton = event.target.closest("button[data-action='copy-review']");
  if (copyButton) {
    const card = copyButton.closest(".source-card");
    const source = findSource(Number(card.dataset.id));
    if (source) copyText(sourceToMarkdown(source), "Article review copied.");
    return;
  }

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
    supportClaim: data.get("supportClaim")?.trim() || "",
    abstract: data.get("abstract").trim(),
    problem: data.get("problem").trim(),
    researchQuestion: data.get("purpose").trim(),
    studyMethod: data.get("studyMethod").trim() || data.get("methodology").trim(),
    dataType: data.get("dataType").trim(),
    purpose: data.get("purpose").trim(),
    sample: data.get("sample").trim(),
    methodology: data.get("methodology").trim(),
    methodsInstruments: data.get("methodology").trim(),
    findings: "",
    limitations: "",
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
  return `## Scholarly Article Review

### APA Citation

${source.apa || ""}

### Abstract
${source.abstract || ""}

### What is the research problem?
${source.problem || ""}

### What is the research question and/or hypothesis?
${source.researchQuestion || source.purpose || ""}

### Is the study qualitative, quantitative, or mixed methods?
${source.studyMethod || source.studyType || ""}

### What type of data is used: primary or secondary?
${source.dataType || ""}

### What is the sample size and its characteristics?
${source.sample || ""}

### What research methods or instruments were used?
${source.methodsInstruments || source.methodology || ""}

### Key Findings
${source.findings || ""}

### How it supports your claim
${source.supportClaim || ""}

### Brief relevance to my research topic
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
