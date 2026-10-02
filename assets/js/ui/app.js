/* App shell: router, navigation, global search, theme, reduced motion, prescriber mode. */
(function () {
  const U = PA.U, esc = U.esc, V = PA.V;
  const App = PA.App = {};

  const NAV = [
    ['Explore', [['', '⌂', 'Home'], ['atlas', 'A', 'Brain Atlas'], ['nt/5HT', 'B', 'Neurotransmitter Systems'], ['receptors', 'C', 'Receptor Atlas'], ['circuits', 'D', 'Psychiatric Circuits']]],
    ['Medications', [['class/antidepressant', 'E', 'Antidepressants'], ['class/antipsychotic', 'F', 'Antipsychotics'], ['class/mood', 'G', 'Mood Stabilizers'], ['class/anxiolytic', 'H', 'Anxiolytics'], ['class/hypnotic', 'I', 'Sedative / Hypnotics'], ['class/adhd', 'J', 'ADHD Medications'], ['class/sud', 'K', 'Substance-Use Pharmacology'], ['class/dementia', 'L', 'Cognitive / Dementia']]],
    ['Tools', [['sort/antipsychotic', '⇅', 'Sort & rank drugs'], ['compare', 'M', 'Drug Comparison'], ['effects', 'N', 'Side-Effect Explorer'], ['prescriber', 'O', 'Prescriber Mode'], ['whatif', 'P', '"What if…" Simulator']]],
    ['Learn', [['drug/mirtazapine', '★', 'Mirtazapine module'], ['drug/clozapine', '★', 'Clozapine module'], ['drug/lithium/mechanism', '★', 'Lithium mechanism map'], ['partial', '◐', 'Partial agonism'], ['learn/timecourse', '⏱', 'Time course'], ['learn/adapt', '⟳', 'Adaptation & tolerance'], ['cases', '✚', 'Clinical cases'], ['quiz', '?', 'Quiz'], ['about', 'ⓘ', 'About & references']]]
  ];

  const ROUTES = { '': V.home, atlas: V.atlas, nt: V.nt, receptors: V.receptors, circuits: V.circuits, class: V.cls, drug: V.drug, compare: V.compare, sort: V.sorter, effects: V.effects, prescriber: V.prescriber, whatif: V.whatif, partial: V.partial, learn: V.learn, cases: V.cases, quiz: V.quiz, about: V.about };

  function buildNav() {
    U.$('#nav').innerHTML = NAV.map(([g, items]) => `<div class="nav-group">${esc(g)}</div>${items.map(([h, k, t]) => `<a href="#/${h}" data-nav="${h}"><span class="key">${esc(k)}</span>${esc(t)}</a>`).join('')}`).join('');
  }
  function markNav(path) {
    let best = null, bl = -1;
    U.$$('#nav a').forEach(a => { const h = a.dataset.nav; if ((path === h || path.startsWith(h + '/') || (h && path.startsWith(h))) && h.length > bl) { best = a; bl = h.length; } if (!h && !path) best = a; });
    U.$$('#nav a').forEach(a => a.classList.toggle('active', a === best));
  }

  function route() {
    PA.W.stopAll();
    const raw = location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
    const key = parts[0] || '';
    const view = ROUTES[key] || V.home;
    // fresh container per route: drops any listeners a previous view attached
    const old = U.$('#page'); const el = old.cloneNode(false); old.replaceWith(el);
    el.classList.add('enter');
    try { view(el, parts.slice(1)); } catch (e) { console.error(e); el.innerHTML = `<div class="notice bad">Something went wrong rendering this page: ${esc(e.message)}</div>`; }
    el.insertAdjacentHTML('beforeend', `<div class="foot">${esc(PA.DISCLAIMER)} · Prescribing data condensed from Stahl's Prescriber's Guide (7th ed., 2021) · Mechanistic references via PubMed.</div>`);
    markNav(raw);
    U.$('#sidebar').classList.remove('open');
    if (!App._first) { U.$('#main-content').focus({ preventScroll: true }); window.scrollTo(0, 0); }
    App._first = false;
  }

  /* ---------------- Global search ---------------- */
  const norm = s => String(s).toLowerCase().replace(/[α]/g, 'a').replace(/[β]/g, 'b').replace(/[μ]/g, 'mu').replace(/[κ]/g, 'kappa').replace(/[δ]/g, 'delta').replace(/[-\s_.]/g, '');
  const ALIAS = { alpha1: 'A1', alpha2: 'A2', alpha2a: 'A2', beta1: 'B1', beta2: 'B2', beta3: 'B3', mu: 'MOR', muopioid: 'MOR', kappa: 'KOR', delta: 'DOR', gabaa: 'GABAA', gabab: 'GABAB', nicotinic: 'nAChR_a4b2', a4b2: 'nAChR_a4b2', herg: 'hERG', serotonintransporter: 'SERT', sert: 'SERT', net: 'NET', dat: 'DAT', maoa: 'MAOA', maob: 'MAOB', gsk3: 'GSK3', a2d: 'CaV_a2d', alpha2delta: 'CaV_a2d', ox1: 'OX1R', ox2: 'OX2R', orexin: 'OX2R' };
  function receptorMatch(q) {
    const n = norm(q);
    if (ALIAS[n]) return ALIAS[n];
    const r = PA.RECEPTORS.find(r => norm(r.id) === n || norm(PA.rl(r.id)) === n);
    return r ? r.id : null;
  }
  App.search = function (q) {
    q = q.trim(); if (q.length < 2) return [];
    const nq = norm(q), lq = q.toLowerCase();
    const out = [];
    const add = (group, title, sub, href) => { if (out.some(o => o.href === href || (group === 'Disorder' && o.group === group && o.title === title))) return; out.push({ group, title, sub, href }); };
    const rid = receptorMatch(q);
    if (rid) {
      const R = PA.RECEPTOR[rid];
      add('Receptor', R.name, `${R.family} · ${R.coupling}`, '#/receptors/' + rid);
      if (PA.NT_SYSTEMS[R.nt]) add('Neurotransmitter system', PA.NT_SYSTEMS[R.nt].title, 'System map', '#/nt/' + R.nt);
      PA.CIRCUITS.filter(c => c.receptors.includes(rid)).forEach(c => add('Pathway / circuit', c.name, PA.NT[c.nt].name, '#/circuits/' + c.id));
      U.uniq(PA.MECHANISMS.filter(m => m.target === rid).map(m => m.effect)).forEach(e => PA.EFFECT[e] && add('Effect', PA.EFFECT[e].name, PA.EFFECT[e].kind, '#/effects/' + e));
      U.drugsForReceptor(rid).filter(x => x.t.aff >= 2).forEach(x => add('Medication', x.d.name, `${U.actLabel(x.t.action)} · ${PA.AFFINITY[x.t.aff].label}`, '#/drug/' + x.d.id));
    }
    PA.RECEPTORS.forEach(r => { if (r.id !== rid && (norm(r.name).includes(nq) || norm(PA.rl(r.id)).includes(nq) || norm(r.id).startsWith(nq))) add('Receptor', r.name, r.coupling, '#/receptors/' + r.id); });
    Object.entries(PA.NT_SYSTEMS).forEach(([k, s]) => { if (norm(s.title).includes(nq) || norm(PA.NT[k].short) === nq) add('Neurotransmitter system', s.title, 'System map', '#/nt/' + k); });
    PA.DRUGS.forEach(d => { if (norm(d.name).includes(nq) || norm(d.sub).includes(nq) || norm(PA.CLASSES[d.cls].name).includes(nq)) add('Medication', d.name, d.sub, '#/drug/' + d.id); });
    PA.REGIONS.forEach(r => { if (norm(r.name).includes(nq) || norm(r.abbr) === nq) add('Brain region', r.name, r.group, '#/atlas/' + r.id); });
    PA.CIRCUITS.forEach(c => { if (norm(c.name).includes(nq) || c.functions.some(f => norm(f).includes(nq))) add('Pathway / circuit', c.name, PA.NT[c.nt].name, '#/circuits/' + c.id); });
    PA.EFFECTS.forEach(e => { if (norm(e.name).includes(nq) || (e.aliases || []).some(a => norm(a).includes(nq))) add('Effect', e.name, e.kind, '#/effects/' + e.id); });
    if (lq.length >= 4) {
      PA.REGIONS.forEach(r => (r.disorders || []).forEach(dz => { if (dz.toLowerCase().includes(lq)) add('Disorder', dz.split('(')[0].trim(), 'in ' + r.name, '#/atlas/' + r.id); }));
      PA.CIRCUITS.forEach(c => c.disorders.forEach(dz => { if (dz.toLowerCase().includes(lq)) add('Disorder', dz.split('—')[0].trim(), 'circuit: ' + c.name, '#/circuits/' + c.id); }));
      PA.DRUGS.forEach(d => { const S = PA.stahl[d.stahl]; const ind = (S ? S.indications : (d.rx || {}).indications) || []; const hit = ind.find(i => i.t.toLowerCase().includes(lq)); if (hit) add('Indication', d.name, (hit.fda ? 'FDA: ' : 'off-label: ') + hit.t, '#/drug/' + d.id + '/rx'); });
    }
    if (/\d/.test(q) || /\bmg\b|dose/i.test(q)) {
      const term = lq.replace(/\bdoses?\b/, '').trim();
      const num = (term.match(/\d+(\.\d+)?/) || [])[0];
      const numRe = num ? new RegExp('(^|[^\\d.])' + num.replace('.', '\\.') + '(?![\\d])') : null;
      PA.DRUGS.forEach(d => { const S = PA.stahl[d.stahl]; if (!S || !S.dose) return; const t = S.dose.join(' · '); if (!term || (numRe ? numRe.test(t) : t.toLowerCase().includes(term)) || d.name.toLowerCase().includes(term.replace(/[\d.]+\s*mg/, '').trim() || '\u0000')) add('Dose', d.name, t.slice(0, 90), '#/drug/' + d.id + '/rx'); });
    }
    const order = ['Receptor', 'Neurotransmitter system', 'Pathway / circuit', 'Effect', 'Medication', 'Brain region', 'Disorder', 'Indication', 'Dose'];
    return out.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group)).slice(0, 60);
  };
  function bindSearch() {
    const inp = U.$('#q'), box = U.$('#qres'); let items = [], idx = -1;
    const render = () => {
      if (!items.length) { box.hidden = inp.value.trim().length < 2; box.innerHTML = '<div class="sr-item muted">No results</div>'; return; }
      let g = '', html = '';
      items.forEach((it, i) => { if (it.group !== g) { g = it.group; html += `<div class="sr-group">${esc(g)}</div>`; } html += `<a class="sr-item" role="option" id="sr${i}" aria-selected="${i === idx}" href="${it.href}"><span>${esc(it.title)}</span><span class="sr-sub">${esc(it.sub || '')}</span></a>`; });
      box.innerHTML = html; box.hidden = false;
    };
    inp.addEventListener('input', () => { items = App.search(inp.value); idx = -1; render(); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { idx = Math.min(items.length - 1, idx + 1); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { idx = Math.max(0, idx - 1); render(); e.preventDefault(); }
      else if (e.key === 'Enter') { const it = items[idx >= 0 ? idx : 0]; if (it) { location.hash = it.href; box.hidden = true; inp.blur(); } }
      else if (e.key === 'Escape') { box.hidden = true; }
    });
    box.addEventListener('click', () => { box.hidden = true; });
    document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) box.hidden = true; });
    document.addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); } });
  }

  /* ---------------- Toggles ---------------- */
  function setTheme(t) { document.documentElement.dataset.theme = t; U.store.set('theme', t); U.$('#theme').setAttribute('aria-pressed', t === 'light'); U.$('#theme .lbl').textContent = t === 'light' ? 'Light' : 'Dark'; }
  function setMotion(r) { document.documentElement.classList.toggle('reduced-motion', r); U.store.set('reduced', r); U.$('#motion').setAttribute('aria-pressed', r); }
  App.syncPrescriber = () => { const on = U.store.get('prescriber', false); U.$('#rxmode').setAttribute('aria-pressed', on); };

  App.init = function () {
    buildNav(); bindSearch();
    setTheme(U.store.get('theme', window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
    setMotion(U.store.get('reduced', window.matchMedia('(prefers-reduced-motion: reduce)').matches));
    App.syncPrescriber();
    U.$('#theme').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
    U.$('#motion').addEventListener('click', () => { setMotion(!document.documentElement.classList.contains('reduced-motion')); route(); });
    U.$('#rxmode').addEventListener('click', () => { U.store.set('prescriber', !U.store.get('prescriber', false)); App.syncPrescriber(); route(); });
    U.$('#menu').addEventListener('click', () => U.$('#sidebar').classList.toggle('open'));
    U.$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.closest('.close-x')) U.closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !U.$('#modal').hidden) U.closeModal(); });
    App._first = true;
    window.addEventListener('hashchange', route);
    route();
  };
  document.addEventListener('DOMContentLoaded', App.init);
})();
