(() => {
  'use strict';
  const { showToast, saveJSON, t, PLAN_KEY } = window.P2C;
  const fundingData={
    scholarships:{title:'Build a scholarship search plan',information:'Academic interests, activities, location preferences, and known deadlines.',action:'Create a search log, organize eligibility notes, and break applications into weekly tasks.',next:'Confirm each opportunity’s published requirements and deadline before applying.'},
    institutional:{title:'Ask about college-based support',information:'Admission information, college contact details, and questions about available institutional programs.',action:'Organize questions about grants, scholarships, special programs, and student-support offices.',next:'Contact the appropriate college office for institution-specific eligibility information.'},
    waivers:{title:'Prepare a fee-waiver request',information:'A list of application fees, deadlines, and the instructions shown by each college.',action:'Identify the published waiver process and prepare a clear request or question.',next:'Confirm the waiver procedure before the application deadline.'},
    payments:{title:'Understand payment timing',information:'The college bill, due dates, deposit requirements, and any available payment information.',action:'Create a calendar of charges and prepare questions about payment arrangements.',next:'Ask the college billing or financial-aid office to confirm the available options.'},
    emergency:{title:'Respond to an urgent financial barrier',information:'A description of the immediate barrier and any relevant deadline or notice.',action:'Identify the correct campus or community contact and organize the information needed for a request.',next:'Contact the appropriate office promptly and record the follow-up date.'},
    comparison:{title:'Compare the full college cost',information:'Admission offers, grants, scholarships, charges, deposits, and known remaining costs.',action:'Build a side-by-side comparison and separate confirmed aid from estimates or optional borrowing.',next:'Prepare questions about any amount, condition, or renewal requirement that remains unclear.'}
  };
  const title=document.querySelector('#funding-title'),information=document.querySelector('#funding-information'),action=document.querySelector('#funding-action'),next=document.querySelector('#funding-next');
  let activeKey='scholarships';
  function renderFunding(key){activeKey=key;const item=fundingData[key]||fundingData.scholarships;const translated=window.P2C.getLanguage()!=='en';title.textContent=t(item.title);information.textContent=translated?t('Gather the information you already have.'):t(item.information);action.textContent=translated?t('Organize questions and choose the next step.'):t(item.action);next.textContent=translated?t('Confirm current requirements with the appropriate college office.'):t(item.next);document.querySelectorAll('.funding-chip').forEach(other=>other.classList.toggle('active',other.dataset.funding===key));}
  document.querySelectorAll('.funding-chip').forEach(chip=>chip.addEventListener('click',()=>renderFunding(chip.dataset.funding)));
  document.querySelectorAll('.challenge-card>button').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('.challenge-card');const open=card.classList.toggle('open');button.setAttribute('aria-expanded',String(open));}));
  document.querySelectorAll('.add-to-plan').forEach(button=>button.addEventListener('click',()=>{const challenge=button.dataset.challenge;saveJSON(PLAN_KEY,{stage:challenge==='cost'?'decide':challenge==='transition'?'enroll':'funding',challenge,checked:{},date:''});window.location.href=`my-plan.html?stage=${challenge==='cost'?'decide':challenge==='transition'?'enroll':'funding'}&challenge=${encodeURIComponent(challenge)}`;}));
  document.addEventListener('p2c:languagechange',()=>renderFunding(activeKey));
  renderFunding(activeKey);
  showToast('Select a topic or common challenge to build a focused plan.');
})();
