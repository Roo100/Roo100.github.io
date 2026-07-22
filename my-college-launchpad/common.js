(() => {
  'use strict';

  const I18N = window.P2C_I18N || { languages:{en:{name:'English',locale:'en-US',dir:'ltr'}}, messages:{en:{}}, glossary:{en:[]} };
  const LANGUAGE_KEY = 'pathwayToCollegeLanguageV1';
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const originalTitle = document.title;
  const toast = document.querySelector('#toast');
  let toastTimer;
  let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en';
  if (!I18N.languages[currentLanguage]) currentLanguage = 'en';

  function interpolate(text, variables={}) {
    return String(text).replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
  }

  function t(source, variables={}) {
    const translated = I18N.messages[currentLanguage]?.[source] || source;
    return interpolate(translated, variables);
  }

  function showToast(message, variables={}) {
    if (!toast) return;
    toast.textContent = t(message, variables);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function formatDate(value) {
    if (!value) return t('Needs research');
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    const locale = I18N.languages[currentLanguage]?.locale || 'en-US';
    return date.toLocaleDateString(locale, { month:'short', day:'numeric', year:'numeric' });
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return ['SCRIPT','STYLE','TEXTAREA','CODE','PRE'].includes(parent.tagName) || parent.closest('[data-no-translate]');
  }

  function translateTextNode(node) {
    if (shouldSkipTextNode(node)) return;
    const raw = originalText.has(node) ? originalText.get(node) : node.nodeValue;
    if (!originalText.has(node)) originalText.set(node, raw);
    const trimmed = raw.trim();
    if (!trimmed) return;
    const translated = t(trimmed);
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    const nextValue = `${leading}${translated}${trailing}`;
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  }

  function translateAttributes(element) {
    const attrs = ['placeholder','aria-label','title'];
    if (!originalAttributes.has(element)) originalAttributes.set(element, {});
    const originals = originalAttributes.get(element);
    attrs.forEach(attr => {
      if (!element.hasAttribute(attr)) return;
      if (!(attr in originals)) originals[attr] = element.getAttribute(attr);
      element.setAttribute(attr, t(originals[attr]));
    });
  }

  function translateElement(root=document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(translateAttributes);
  }

  function makeLanguageControls() {
    const utilityInner = document.querySelector('.utility-inner');
    if (!utilityInner || document.querySelector('#language-select')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'language-access-controls';
    wrapper.innerHTML = `
      <label for="language-select">Language</label>
      <select id="language-select" aria-label="Choose language">
        ${Object.entries(I18N.languages).map(([code, meta]) => `<option value="${code}" lang="${code}"${code===currentLanguage?' selected':''}>${meta.name}</option>`).join('')}
      </select>
      <button class="glossary-button" id="open-glossary" type="button">Plain-language glossary</button>`;
    utilityInner.appendChild(wrapper);
  }

  function makeLanguageDialog() {
    if (document.querySelector('#language-dialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'language-dialog';
    dialog.className = 'language-dialog';
    dialog.setAttribute('aria-labelledby','language-dialog-title');
    dialog.innerHTML = `
      <div class="dialog-topline"></div>
      <button class="dialog-close" id="close-language-dialog" type="button" aria-label="Close">×</button>
      <span class="feature-label">Language access prototype</span>
      <h2 id="language-dialog-title">Choose the language you would like to use.</h2>
      <p>You can change your language at any time.</p>
      <div class="language-choice-grid">
        ${Object.entries(I18N.languages).map(([code, meta]) => `<button type="button" data-language-choice="${code}" lang="${code}"><strong>${meta.name}</strong></button>`).join('')}
      </div>
      <button class="text-button language-english-button" type="button" data-language-choice="en">Continue in English</button>`;
    document.body.appendChild(dialog);
    dialog.querySelector('#close-language-dialog')?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click', event => {
      const r=dialog.getBoundingClientRect();
      const inside=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
      if(!inside) dialog.close();
    });
    dialog.querySelectorAll('[data-language-choice]').forEach(button => button.addEventListener('click', () => {
      setLanguage(button.dataset.languageChoice, true);
      dialog.close();
    }));
    if (!localStorage.getItem(LANGUAGE_KEY)) setTimeout(() => dialog.showModal?.(), 350);
  }

  function makeGlossaryDialog() {
    if (document.querySelector('#glossary-dialog')) return;
    const dialog=document.createElement('dialog');
    dialog.id='glossary-dialog';
    dialog.className='glossary-dialog';
    dialog.setAttribute('aria-labelledby','glossary-dialog-title');
    dialog.innerHTML=`<div class="dialog-topline"></div><button class="dialog-close" id="close-glossary" type="button" aria-label="Close">×</button><span class="feature-label">Plain-language glossary</span><h2 id="glossary-dialog-title">Plain-language glossary</h2><div class="glossary-list" id="glossary-list"></div>`;
    document.body.appendChild(dialog);
    dialog.querySelector('#close-glossary')?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();const inside=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;if(!inside)dialog.close();});
    renderGlossary();
  }

  function renderGlossary() {
    const list=document.querySelector('#glossary-list');
    if(!list) return;
    const items=I18N.glossary[currentLanguage] || I18N.glossary.en || [];
    list.innerHTML=items.map(([term,definition])=>`<article><h3>${escapeHTML(term)}</h3><p>${escapeHTML(definition)}</p></article>`).join('');
  }

  function makeTranslationNotice() {
    let notice=document.querySelector('#translation-review-note');
    if (!notice) {
      notice=document.createElement('div');
      notice.id='translation-review-note';
      notice.className='translation-review-note';
      notice.setAttribute('role','note');
      const header=document.querySelector('.site-header');
      header?.insertAdjacentElement('afterend',notice);
    }
    notice.hidden=currentLanguage==='en';
    notice.innerHTML=`<div class="container"><strong>${t('Language access prototype')}</strong><span>${t('All page content and interactive tools are translated in this prototype. Translations should be reviewed with fluent speakers and community partners before public use.')}</span></div>`;
  }

  function updateLanguageUI() {
    const meta=I18N.languages[currentLanguage] || I18N.languages.en;
    document.documentElement.lang=currentLanguage;
    document.documentElement.dir=meta.dir || 'ltr';
    document.title=t(originalTitle);
    const selector=document.querySelector('#language-select');
    if(selector) selector.value=currentLanguage;
    translateElement(document.body);
    renderGlossary();
    makeTranslationNotice();
  }

  function setLanguage(code, announce=false) {
    if(!I18N.languages[code]) code='en';
    currentLanguage=code;
    localStorage.setItem(LANGUAGE_KEY,code);
    updateLanguageUI();
    document.dispatchEvent(new CustomEvent('p2c:languagechange',{detail:{language:code}}));
    if(announce) showToast('Translation changed to {language}.',{language:I18N.languages[code].name});
  }

  const translationObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
        else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
      });
    }
  });
  translationObserver.observe(document.body, { childList:true, subtree:true });

  const page = document.body.dataset.page;
  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-navigation');
  menuToggle?.addEventListener('click', () => {
    const open = primaryNav?.classList.toggle('open') || false;
    menuToggle.setAttribute('aria-expanded', String(open));
    const label = menuToggle.querySelector('.sr-only');
    if (label) label.textContent = t(open ? 'Close navigation' : 'Open navigation');
  });
  primaryNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  makeLanguageControls();
  makeLanguageDialog();
  makeGlossaryDialog();
  document.querySelector('#language-select')?.addEventListener('change',event=>setLanguage(event.target.value,true));
  document.querySelector('#open-glossary')?.addEventListener('click',()=>document.querySelector('#glossary-dialog')?.showModal?.());
  updateLanguageUI();

  window.P2C = {
    showToast,
    escapeHTML,
    loadJSON,
    saveJSON,
    formatDate,
    t,
    translateElement,
    setLanguage,
    getLanguage:()=>currentLanguage,
    getLocale:()=>I18N.languages[currentLanguage]?.locale || 'en-US',
    COLLEGE_LIST_KEY: 'pathwayToCollegeListV2',
    PLAN_KEY: 'pathwayToCollegePlanV2'
  };
})();
