(() => {
  'use strict';
  const { showToast, escapeHTML, loadJSON, saveJSON, formatDate, t, COLLEGE_LIST_KEY, PLAN_KEY } = window.P2C;

  const COLLEGES = [
    { name:'Baruch College', aliases:'CUNY Bernard M Baruch', location:'New York, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'Borough of Manhattan Community College', aliases:'BMCC CUNY', location:'New York, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'Bronx Community College', aliases:'BCC CUNY', location:'Bronx, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'Brooklyn College', aliases:'CUNY', location:'Brooklyn, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'College of Staten Island', aliases:'CSI CUNY', location:'Staten Island, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'Guttman Community College', aliases:'Stella Charles Guttman CUNY', location:'New York, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'Hostos Community College', aliases:'Eugenio Maria de Hostos CUNY', location:'Bronx, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'Hunter College', aliases:'CUNY', location:'New York, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'John Jay College of Criminal Justice', aliases:'John Jay CUNY', location:'New York, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'Kingsborough Community College', aliases:'KCC CUNY', location:'Brooklyn, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'LaGuardia Community College', aliases:'LAGCC CUNY', location:'Long Island City, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'Lehman College', aliases:'CUNY', location:'Bronx, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'Medgar Evers College', aliases:'CUNY', location:'Brooklyn, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'New York City College of Technology', aliases:'City Tech CUNY NYCCT', location:'Brooklyn, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'Queens College', aliases:'CUNY', location:'Queens, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'Queensborough Community College', aliases:'QCC CUNY', location:'Queens, NY', type:'Public two-year college (CUNY)', setting:'Commuter' },
    { name:'The City College of New York', aliases:'CCNY City College CUNY', location:'New York, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'York College', aliases:'CUNY', location:'Jamaica, NY', type:'Public four-year college (CUNY)', setting:'Primarily commuter' },
    { name:'SUNY Albany', aliases:'University at Albany UAlbany', location:'Albany, NY', type:'Public four-year university (SUNY)', setting:'Residential and commuter' },
    { name:'Binghamton University', aliases:'SUNY Binghamton', location:'Binghamton, NY', type:'Public four-year university (SUNY)', setting:'Primarily residential' },
    { name:'University at Buffalo', aliases:'SUNY Buffalo UB', location:'Buffalo, NY', type:'Public four-year university (SUNY)', setting:'Residential and commuter' },
    { name:'Stony Brook University', aliases:'SUNY Stony Brook', location:'Stony Brook, NY', type:'Public four-year university (SUNY)', setting:'Residential and commuter' },
    { name:'SUNY New Paltz', aliases:'State University New York New Paltz', location:'New Paltz, NY', type:'Public four-year college (SUNY)', setting:'Primarily residential' },
    { name:'SUNY Purchase', aliases:'Purchase College', location:'Purchase, NY', type:'Public four-year college (SUNY)', setting:'Primarily residential' },
    { name:'SUNY Old Westbury', aliases:'State University New York Old Westbury', location:'Old Westbury, NY', type:'Public four-year college (SUNY)', setting:'Residential and commuter' },
    { name:'Farmingdale State College', aliases:'SUNY Farmingdale', location:'Farmingdale, NY', type:'Public four-year college (SUNY)', setting:'Primarily commuter' },
    { name:'Fashion Institute of Technology', aliases:'FIT SUNY', location:'New York, NY', type:'Public four-year college (SUNY)', setting:'Primarily commuter' },
    { name:'Nassau Community College', aliases:'NCC SUNY', location:'Garden City, NY', type:'Public two-year college (SUNY)', setting:'Commuter' },
    { name:'Westchester Community College', aliases:'SUNY WCC', location:'Valhalla, NY', type:'Public two-year college (SUNY)', setting:'Commuter' },
    { name:'Columbia University', aliases:'Columbia', location:'New York, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Barnard College', aliases:'Barnard', location:'New York, NY', type:'Private four-year college', setting:'Primarily residential' },
    { name:'New York University', aliases:'NYU', location:'New York, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Fordham University', aliases:'Fordham', location:'Bronx and New York, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Pace University', aliases:'Pace', location:'New York and Pleasantville, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'St. John’s University', aliases:'Saint Johns St Johns', location:'Queens, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'The New School', aliases:'New School University', location:'New York, NY', type:'Private four-year university', setting:'Primarily commuter' },
    { name:'Pratt Institute', aliases:'Pratt', location:'Brooklyn, NY', type:'Private four-year college', setting:'Residential and commuter' },
    { name:'Manhattan College', aliases:'Manhattan University', location:'Bronx, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Mercy University', aliases:'Mercy College', location:'Dobbs Ferry and New York, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Adelphi University', aliases:'Adelphi', location:'Garden City, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Hofstra University', aliases:'Hofstra', location:'Hempstead, NY', type:'Private four-year university', setting:'Primarily residential' },
    { name:'Long Island University', aliases:'LIU Brooklyn LIU Post', location:'Brooklyn and Brookville, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Iona University', aliases:'Iona College', location:'New Rochelle, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Sarah Lawrence College', aliases:'Sarah Lawrence', location:'Bronxville, NY', type:'Private four-year college', setting:'Primarily residential' },
    { name:'Yeshiva University', aliases:'Yeshiva', location:'New York, NY', type:'Private four-year university', setting:'Residential and commuter' },
    { name:'Cooper Union', aliases:'The Cooper Union', location:'New York, NY', type:'Private four-year college', setting:'Primarily commuter' },
    { name:'School of Visual Arts', aliases:'SVA', location:'New York, NY', type:'Private four-year college', setting:'Primarily commuter' },
    { name:'Juilliard School', aliases:'The Juilliard School', location:'New York, NY', type:'Private four-year college', setting:'Primarily residential' },
    { name:'Rutgers University–Newark', aliases:'Rutgers Newark', location:'Newark, NJ', type:'Public four-year university', setting:'Residential and commuter' },
    { name:'New Jersey City University', aliases:'NJCU', location:'Jersey City, NJ', type:'Public four-year university', setting:'Primarily commuter' },
    { name:'Montclair State University', aliases:'Montclair State', location:'Montclair, NJ', type:'Public four-year university', setting:'Residential and commuter' },
    { name:'Kean University', aliases:'Kean', location:'Union, NJ', type:'Public four-year university', setting:'Residential and commuter' },
    { name:'Princeton University', aliases:'Princeton', location:'Princeton, NJ', type:'Private four-year university', setting:'Primarily residential' },
    { name:'Yale University', aliases:'Yale', location:'New Haven, CT', type:'Private four-year university', setting:'Primarily residential' },
    { name:'University of Connecticut', aliases:'UConn Connecticut', location:'Storrs, CT', type:'Public four-year university', setting:'Primarily residential' },
    { name:'Temple University', aliases:'Temple', location:'Philadelphia, PA', type:'Public four-year university', setting:'Residential and commuter' },
    { name:'University of Pennsylvania', aliases:'Penn UPenn', location:'Philadelphia, PA', type:'Private four-year university', setting:'Primarily residential' },
    { name:'Howard University', aliases:'Howard', location:'Washington, DC', type:'Private four-year university', setting:'Primarily residential' },
    { name:'Spelman College', aliases:'Spelman', location:'Atlanta, GA', type:'Private four-year college', setting:'Primarily residential' },
    { name:'Morehouse College', aliases:'Morehouse', location:'Atlanta, GA', type:'Private four-year college', setting:'Primarily residential' }
  ].map((college, index) => ({ ...college, id:`directory-${index}`, search:`${college.name} ${college.aliases || ''}`.toLowerCase() }));

  const defaultState = {
    profile: { interest:'', location:'', collegeType:'Either two-year or four-year', campus:'Commuter or residential', priorities:[] },
    colleges:[]
  };
  const oldState = loadJSON('pathwayToCollegeListV1', null);
  const builder = loadJSON(COLLEGE_LIST_KEY, oldState || defaultState);
  if (!builder.profile) builder.profile = { ...defaultState.profile };
  if (!Array.isArray(builder.colleges)) builder.colleges = [];

  const els = {
    profileForm: document.querySelector('#college-profile-form'), interest:document.querySelector('#interest-input'),
    location:document.querySelector('#location-input'), collegeType:document.querySelector('#college-type-select'),
    campus:document.querySelector('#campus-select'), profileSummary:document.querySelector('#profile-summary'),
    collegeForm:document.querySelector('#college-form'), editId:document.querySelector('#college-edit-id'),
    name:document.querySelector('#college-name'), suggestions:document.querySelector('#college-suggestions'),
    program:document.querySelector('#college-program'), deadline:document.querySelector('#college-deadline'),
    cost:document.querySelector('#college-cost'), collegeLocation:document.querySelector('#college-location'),
    institutionType:document.querySelector('#college-institution-type'), campusSetting:document.querySelector('#college-campus-setting'),
    fee:document.querySelector('#college-fee'), category:document.querySelector('#college-category'), fit:document.querySelector('#college-fit'),
    support:document.querySelector('#college-support'), notes:document.querySelector('#college-notes'), submit:document.querySelector('#college-submit'),
    cancelEdit:document.querySelector('#college-cancel-edit'), count:document.querySelector('#college-count'), tableBody:document.querySelector('#college-table-body'),
    likely:document.querySelector('#likely-count'), target:document.querySelector('#target-count'), reach:document.querySelector('#reach-count'),
    balanceMessage:document.querySelector('#balance-message'), connect:document.querySelector('#connect-college-plan'),
    save:document.querySelector('#save-college-list'), print:document.querySelector('#print-college-list'), reset:document.querySelector('#reset-college-list')
  };

  let suggestionMatches = [];
  let activeSuggestion = -1;

  function save(showMessage=false) {
    builder.profile = readProfile();
    const ok = saveJSON(COLLEGE_LIST_KEY, builder);
    if (showMessage) showToast(ok ? 'College list saved on this device.' : 'This browser could not save the list.');
    return ok;
  }

  function readProfile() {
    return {
      interest:els.interest?.value.trim() || '', location:els.location?.value.trim() || '',
      collegeType:els.collegeType?.value || defaultState.profile.collegeType, campus:els.campus?.value || defaultState.profile.campus,
      priorities:[...(els.profileForm?.querySelectorAll('input[name="priority"]:checked') || [])].map(input => input.value)
    };
  }

  function populateProfile() {
    els.interest.value = builder.profile.interest || '';
    els.location.value = builder.profile.location || '';
    els.collegeType.value = builder.profile.collegeType || defaultState.profile.collegeType;
    els.campus.value = builder.profile.campus || defaultState.profile.campus;
    els.profileForm.querySelectorAll('input[name="priority"]').forEach(input => { input.checked = builder.profile.priorities?.includes(input.value) || false; });
  }

  function renderProfile() {
    builder.profile = readProfile();
    const p = builder.profile;
    const parts=[];
    if (p.interest) parts.push(`interested in ${p.interest}`);
    parts.push(`considering ${p.collegeType.toLowerCase()}`);
    if (p.location) parts.push(`in or near ${p.location}`);
    parts.push(`with a ${p.campus.toLowerCase()} preference`);
    if (p.priorities.length) parts.push(`prioritizing ${p.priorities.join(', ').toLowerCase()}`);
    els.profileSummary.textContent = window.P2C.getLanguage()==='en' ? `You is ${parts.join(', ')}.` : t('Your preferences are saved. Review and update your college profile at any time.');
    save(false);
  }

  function balanceCounts() {
    return builder.colleges.reduce((counts, college) => {
      const key=(college.category || '').toLowerCase(); if (key in counts) counts[key] += 1; return counts;
    }, { likely:0, target:0, reach:0 });
  }

  function renderBalance() {
    const counts=balanceCounts();
    els.likely.textContent=counts.likely; els.target.textContent=counts.target; els.reach.textContent=counts.reach;
    els.balanceMessage.className='balance-message';
    if (!builder.colleges.length) els.balanceMessage.textContent=t('Add colleges to review list balance.');
    else if (!counts.likely) { els.balanceMessage.classList.add('alert'); els.balanceMessage.textContent=t('Add at least one likely option.'); }
    else if (counts.reach > counts.likely + counts.target) { els.balanceMessage.classList.add('alert'); els.balanceMessage.textContent=t('Consider adding more target or likely options.'); }
    else if (builder.colleges.length < 3) els.balanceMessage.textContent=t('Add colleges to review list balance.');
    else { els.balanceMessage.classList.add('good'); els.balanceMessage.textContent=t('Keep comparing cost, program strength, and student support.'); }
  }

  function collegeRow(c) {
    const institution=[c.institutionType ? t(c.institutionType) : t('Needs research'), c.campusSetting ? t(c.campusSetting) : ''].filter(Boolean).join(' · ');
    return `<tr><td>${escapeHTML(c.name)}</td><td>${escapeHTML(institution)}</td><td>${escapeHTML(c.program || t('Needs research'))}</td><td>${escapeHTML(formatDate(c.deadline))}</td><td>${escapeHTML(t(c.cost || 'Needs research'))}</td><td>${escapeHTML(c.location || t('Needs research'))}</td><td>${escapeHTML(t(c.fee || 'Needs research'))}</td><td>${escapeHTML(t(c.support || 'Needs research'))}</td><td>${escapeHTML(t(c.category || 'Target'))}</td><td>${escapeHTML(t(c.fit || 'Needs more research'))}</td><td><div class="table-actions"><button class="table-action" data-edit-college="${escapeHTML(c.id)}" type="button">${escapeHTML(t('Edit'))}</button><button class="table-action remove" data-remove-college="${escapeHTML(c.id)}" type="button">${escapeHTML(t('Remove'))}</button></div></td></tr>`;
  }

  function renderList() {
    els.count.textContent=t('{count} of 6 colleges saved',{count:builder.colleges.length});
    els.tableBody.innerHTML = builder.colleges.length ? builder.colleges.map(collegeRow).join('') : `<tr class="empty-college-row"><td colspan="11">${escapeHTML(t('No colleges added yet. Start typing a college name to explore an option.'))}</td></tr>`;
    renderBalance();
  }

  function resetForm() {
    els.collegeForm.reset(); els.editId.value=''; els.submit.textContent=t('Add College'); els.cancelEdit.hidden=true;
    els.fee.value='Needs research'; els.category.value='Target'; els.fit.value='Needs more research';
    closeSuggestions();
  }

  function startEdit(id) {
    const c=builder.colleges.find(item => item.id===id); if (!c) return;
    els.editId.value=c.id; els.name.value=c.name || ''; els.program.value=c.program || ''; els.deadline.value=c.deadline || '';
    els.cost.value=c.cost || ''; els.collegeLocation.value=c.location || ''; els.institutionType.value=c.institutionType || '';
    els.campusSetting.value=c.campusSetting || ''; els.fee.value=c.fee || 'Needs research'; els.category.value=c.category || 'Target';
    els.fit.value=c.fit || 'Needs more research'; els.support.value=c.support || ''; els.notes.value=c.notes || '';
    els.submit.textContent=t('Update College'); els.cancelEdit.hidden=false; els.collegeForm.scrollIntoView({behavior:'smooth',block:'start'}); els.name.focus();
  }

  function selectCollege(college) {
    els.name.value=college.name; els.collegeLocation.value=college.location; els.institutionType.value=college.type; els.campusSetting.value=college.setting;
    if (!els.cost.value) els.cost.value=t('Verify current net price and financial support');
    if (!els.support.value) els.support.value=t('Research immigrant/first-generation support, advising, tutoring, and emergency aid');
    els.name.dataset.directoryId=college.id; closeSuggestions(); showToast('Basic college details added. Confirm current information on the college’s official website.');
  }

  function closeSuggestions() {
    suggestionMatches=[]; activeSuggestion=-1; els.suggestions.hidden=true; els.suggestions.innerHTML='';
    els.name.setAttribute('aria-expanded','false'); els.name.removeAttribute('aria-activedescendant');
  }

  function renderSuggestions(query) {
    const q=query.trim().toLowerCase();
    if (q.length < 2) { closeSuggestions(); return; }
    suggestionMatches=COLLEGES.filter(c => c.search.includes(q)).slice(0,8); activeSuggestion=-1;
    if (!suggestionMatches.length) { closeSuggestions(); return; }
    els.suggestions.innerHTML=suggestionMatches.map((c,i)=>`<button id="college-option-${i}" class="autocomplete-option" type="button" role="option" data-suggestion-index="${i}" aria-selected="false"><strong>${escapeHTML(c.name)}</strong><span>${escapeHTML(c.location)} · ${escapeHTML(t(c.type))}</span></button>`).join('');
    els.suggestions.hidden=false; els.name.setAttribute('aria-expanded','true');
  }

  function setActiveSuggestion(index) {
    if (!suggestionMatches.length) return;
    activeSuggestion=(index+suggestionMatches.length)%suggestionMatches.length;
    els.suggestions.querySelectorAll('[role="option"]').forEach((option,i)=>{
      const active=i===activeSuggestion; option.classList.toggle('active',active); option.setAttribute('aria-selected',String(active));
    });
    const id=`college-option-${activeSuggestion}`; els.name.setAttribute('aria-activedescendant',id); document.getElementById(id)?.scrollIntoView({block:'nearest'});
  }

  els.name.addEventListener('input', () => { delete els.name.dataset.directoryId; renderSuggestions(els.name.value); });
  els.name.addEventListener('keydown', event => {
    if (els.suggestions.hidden) return;
    if (event.key==='ArrowDown') { event.preventDefault(); setActiveSuggestion(activeSuggestion+1); }
    else if (event.key==='ArrowUp') { event.preventDefault(); setActiveSuggestion(activeSuggestion-1); }
    else if (event.key==='Enter' && activeSuggestion>=0) { event.preventDefault(); selectCollege(suggestionMatches[activeSuggestion]); }
    else if (event.key==='Escape') closeSuggestions();
  });
  els.suggestions.addEventListener('mousedown', event => {
    const option=event.target.closest('[data-suggestion-index]'); if (!option) return; event.preventDefault(); selectCollege(suggestionMatches[Number(option.dataset.suggestionIndex)]);
  });
  document.addEventListener('click', event => { if (!event.target.closest('.college-name-field')) closeSuggestions(); });

  els.profileForm.addEventListener('input', renderProfile); els.profileForm.addEventListener('change', renderProfile);
  els.collegeForm.addEventListener('submit', event => {
    event.preventDefault(); const id=els.editId.value;
    if (!id && builder.colleges.length>=6) { showToast('This prototype allows up to six colleges.'); return; }
    const college={ id:id || `college-${Date.now()}`, directoryId:els.name.dataset.directoryId || '', name:els.name.value.trim(), program:els.program.value.trim(), deadline:els.deadline.value, cost:els.cost.value.trim(), location:els.collegeLocation.value.trim(), institutionType:els.institutionType.value.trim(), campusSetting:els.campusSetting.value.trim(), fee:els.fee.value, category:els.category.value, fit:els.fit.value, support:els.support.value.trim(), notes:els.notes.value.trim() };
    if (!college.name) return;
    const existing=builder.colleges.findIndex(c=>c.id===id); if (existing>=0) builder.colleges[existing]=college; else builder.colleges.push(college);
    save(false); renderList(); resetForm(); showToast(existing>=0 ? 'College updated.' : 'College added to the comparison list.');
  });
  els.cancelEdit.addEventListener('click', resetForm);
  els.tableBody.addEventListener('click', event => {
    const edit=event.target.closest('[data-edit-college]'); const remove=event.target.closest('[data-remove-college]');
    if (edit) startEdit(edit.dataset.editCollege);
    if (remove) { builder.colleges=builder.colleges.filter(c=>c.id!==remove.dataset.removeCollege); save(false); renderList(); showToast('College removed from the list.'); }
  });
  els.save.addEventListener('click',()=>save(true));
  els.print.addEventListener('click',()=>{ document.body.classList.add('print-college-list'); window.print(); setTimeout(()=>document.body.classList.remove('print-college-list'),250); });
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-college-list'));
  els.reset.addEventListener('click',()=>{
    localStorage.removeItem(COLLEGE_LIST_KEY); builder.profile={...defaultState.profile}; builder.colleges=[]; populateProfile(); renderProfile(); renderList(); resetForm(); showToast('College list reset.');
  });
  els.connect.addEventListener('click',()=>{
    if (!builder.colleges.length) { showToast('Add at least one college before creating a connected plan.'); return; }
    save(false); saveJSON(PLAN_KEY,{stage:'choose',challenge:'start',checked:{},date:''}); window.location.href='my-plan.html?stage=choose&from=list';
  });

  document.addEventListener('p2c:languagechange',()=>{ renderProfile(); renderList(); els.submit.textContent=t(els.editId.value ? 'Update College' : 'Add College'); });
  populateProfile(); renderProfile(); renderList();
})();
