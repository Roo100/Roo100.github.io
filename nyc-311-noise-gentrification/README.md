# NYC 311 Noise Complaint Visualizer

Open `index.html` in a browser to view a live visualizer for 311 noise complaints across the five NYC boroughs.

The page pulls:

- NYC Open Data 311 Service Requests from 2020 to Present: `erm2-nwe9`
- Census Reporter ACS county indicators for population, income, poverty, rent, tenure, and race

The pressure score is an exploratory index, not a causal model:

`pressure = 0.40 noise complaint exposure + 0.40 displacement vulnerability + 0.20 housing-market pressure`

- Noise complaint exposure: selected 311 noise complaints per 10,000 residents, normalized across boroughs.
- Displacement vulnerability: average of normalized poverty rate, renter share, and people-of-color share.
- Housing-market pressure: normalized current median gross rent.

The variables are grounded in peer-reviewed gentrification and displacement literature, but the weights are interpretive rather than regression-estimated. Use this as a transparent screening score to identify boroughs for deeper neighborhood-level study, not as proof that 311 calls alone cause gentrification.

Relevant sources:

- Freeman & Braconi (2004), "Gentrification and Displacement New York City in the 1990s," Journal of the American Planning Association. https://doi.org/10.1080/01944360408976337
- Newman & Wyly (2006), "The Right to Stay Put, Revisited," Urban Studies. https://doi.org/10.1080/00420980500388710
- Sutton (2020), "Gentrification and the Increasing Significance of Racial Transition in New York City 1970-2010," Urban Affairs Review. https://doi.org/10.1177/1078087418771224
- Hwang & Sampson (2014), "Divergent Pathways of Gentrification," American Sociological Review. https://doi.org/10.1177/0003122414535774
- Kontokosta, Hong & Korsberg (2017), "Equity in 311 Reporting," arXiv preprint. This is not peer reviewed, but it is directly relevant for explaining why 311 complaint data should be treated as a reporting signal rather than a direct measure of underlying neighborhood conditions. https://arxiv.org/abs/1710.02452
