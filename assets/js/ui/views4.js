/* View: sortable / rankable drug explorer (antipsychotics by default). */
(function () {
  const U = PA.U, esc = U.esc, V = PA.V;

  const CLASS_COLS = {
    antipsychotic: ['D2', 'D3', '5HT2A', '5HT2C', '5HT1A', '5HT7', 'H1', 'A1', 'A2', 'M1', 'M4', 'hERG'],
    antidepressant: ['SERT', 'NET', 'DAT', 'MAOA', 'A2', '5HT2A', '5HT2C', '5HT3', '5HT1A', 'H1', 'M1', 'A1', 'NaV', 'NMDA'],
    adhd: ['DAT', 'NET', 'VMAT2', 'A2'],
    hypnotic: ['GABAA', 'OX2R', 'OX1R', 'MT1', 'H1', '5HT2A', 'A1', 'M1'],
    anxiolytic: ['GABAA', '5HT1A', 'CaV_a2d', 'H1', 'B1', 'A1'],
    mood: ['NaV', 'IMPase', 'GSK3', 'HDAC', 'GABAT', 'CaV_T'],
    sud: ['MOR', 'KOR', 'nAChR_a4b2', 'ALDH', 'A2', 'NMDA', 'DAT', 'CB1']
  };
  const AE_SHOW = ['wt', 'met', 'sed', 'eps', 'akat', 'prl', 'qt', 'ach', 'orth', 'sex'];
  const SHORT_AE = { wt: 'Wt', met: 'Metab', sed: 'Sed', eps: 'EPS', akat: 'Akath', prl: 'PRL', qt: 'QT', ach: 'ACh ⊣', orth: 'Orth', sex: 'Sex' };
  const QUESTIONS = {
    antipsychotic: [
      { q: 'Which cause the most weight gain?', sort: 'ae:wt', dir: -1, hl: ['H1', '5HT2C', 'M1'], insight: 'The top of the list shares very high H1 + 5-HT2C (often muscarinic) blockade — clozapine, olanzapine. Ziprasidone shows 5-HT2C alone is not enough without strong H1.' },
      { q: 'Lowest EPS risk?', sort: 'ae:eps', dir: 1, hl: ['D2', 'M1', '5HT2A'], insight: 'Low-EPS drugs either occupy D2 weakly/transiently (clozapine, quetiapine, lumateperone), are partial agonists, have intrinsic antimuscarinic action — or do not touch D2 at all (xanomeline–trospium).' },
      { q: 'Prolactin-sparing?', sort: 'ae:prl', dir: 1, hl: ['D2'], insight: 'Look at the D2 column glyph: partial agonists (◐) and low-occupancy drugs spare prolactin; potent D2 antagonists (risperidone, paliperidone, haloperidol) raise it most.' },
      { q: 'Most sedating?', sort: 'ae:sed', dir: -1, hl: ['H1', 'A1'], insight: 'Sedation tracks H1 (and α1) blockade: clozapine, quetiapine, olanzapine, chlorpromazine.' },
      { q: 'Orthostatic hypotension?', sort: 'ae:orth', dir: -1, hl: ['A1'], insight: 'α1 blockade drives orthostasis — slow titration matters for clozapine, quetiapine, chlorpromazine.' },
      { q: 'QT liability?', sort: 'ae:qt', dir: -1, hl: ['hERG'], insight: 'Drugs flagged with hERG block (ziprasidone, haloperidol IV, pimavanserin) lead; aripiprazole, brexpiprazole and lurasidone are low.' },
      { q: 'Strongest D2 binding?', sort: 'r:D2', dir: -1, hl: ['D2'], insight: 'High D2 affinity is shared by antagonists AND partial agonists — the action glyph (⊣ vs ◐) determines EPS/prolactin consequences, not affinity alone.' },
      { q: '5-HT2A ≫ D2 ("atypicality" index)', sort: 'ratio', dir: -1, hl: ['5HT2A', 'D2'], insight: 'Crude teaching index (5-HT2A grade − D2 grade). Meltzer\'s ratio predicts some atypicality, but amisulpride (no 5-HT2A) is also low-EPS — a proposed, not sufficient, explanation.' }
    ],
    antidepressant: [
      { q: 'Least sexual dysfunction?', sort: 'ae:sex', dir: 1, hl: ['SERT', '5HT2A', '5HT2C'], insight: 'Drugs without strong SERT inhibition (bupropion, mirtazapine, agomelatine) or with 5-HT2 blockade rank lowest.' },
      { q: 'Most sedating?', sort: 'ae:sed', dir: -1, hl: ['H1', 'A1', '5HT2A'], insight: 'H1 blockade dominates: TCAs, mirtazapine, trazodone.' },
      { q: 'Most anticholinergic?', sort: 'ae:ach', dir: -1, hl: ['M1'], insight: 'Tertiary-amine TCAs and paroxetine carry muscarinic affinity.' },
      { q: 'Most weight gain?', sort: 'ae:wt', dir: -1, hl: ['H1', '5HT2C'], insight: 'H1 + 5-HT2C again: mirtazapine, amitriptyline, phenelzine.' },
      { q: 'Strongest SERT inhibition', sort: 'r:SERT', dir: -1, hl: ['SERT'], insight: 'SERT affinity alone does not separate drugs much — the off-target columns explain their different profiles.' }
    ]
  };

  function halfLifeHours(d) {
    const s = U.halfLife(d); if (!s) return null;
    const m = s.match(/(\d+(?:\.\d+)?)\s*(?:–|-|to)?\s*(\d+(?:\.\d+)?)?\s*(hours|hour|h\b|days|day|minutes|min)/i);
    if (!m) return null;
    const a = parseFloat(m[1]), b = m[2] ? parseFloat(m[2]) : a; const mid = (a + b) / 2;
    return /day/i.test(m[3]) ? mid * 24 : /min/i.test(m[3]) ? mid / 60 : mid;
  }

  V.sorter = function (el, params) {
    let cls = PA.CLASSES[params[0]] || params[0] === 'all' ? (params[0] || 'antipsychotic') : 'antipsychotic';
    let sortKey = 'r:D2', dir = -1, hl = ['D2'], d2filter = 'all', minAff = 0, query = '', insight = '';
    el.innerHTML = V.head('M · Sort & rank', 'Drug explorer — sort by receptor affinity or side effect',
      'Click any column header (or a question below) to re-rank. Rows glide into their new order so you can see which receptor pattern travels with which clinical effect.') +
      `<div class="card tight sorter-controls">
        <div class="row"><span class="small strong">Class</span><div class="chips" id="sclass">${['antipsychotic', 'antidepressant', 'adhd', 'hypnotic', 'anxiolytic', 'mood', 'sud'].map(k => `<button class="chip" data-cls="${k}" aria-pressed="${k === cls}">${esc(PA.CLASSES[k].name)}</button>`).join('')}</div></div>
        <div class="row" style="margin-top:8px"><span class="small strong">Ask</span><div class="chips" id="squest"></div></div>
        <div class="row" style="margin-top:8px">
          <label class="small strong" for="ssort">Sort by</label><select id="ssort" class="sel"></select>
          <button class="btn small" id="sdir" aria-label="Toggle sort direction">↓ High → low</button>
          <span id="d2wrap" class="row"><span class="small strong">D2 action</span>${['all', 'antagonist', 'partial', 'none'].map(k => `<button class="chip" data-d2="${k}" aria-pressed="${k === 'all'}">${k === 'all' ? 'All' : k === 'antagonist' ? '⊣ Antagonist' : k === 'partial' ? '◐ Partial agonist' : '∅ No D2 action'}</button>`).join('')}</span>
          <input id="sq" class="inp" placeholder="Filter by name…" style="max-width:180px">
        </div></div>
      <div id="sinsight" aria-live="polite"></div>
      <div class="card sorter-card"><div class="sorter-scroll"><div id="sgrid" class="sorter" role="table" aria-label="Sortable drug table"></div></div>
        <div class="sorter-legend small">${[4, 3, 2, 1].map(a => `<span><i class="dot a${a}"></i>${PA.AFFINITY[a].label}</span>`).join('')}<span><b>⊣</b> antagonist</span><span><b>◐</b> partial agonist</span><span><b>✕</b> inhibitor</span><span><b>→</b> agonist</span><span><b>⊕</b> PAM</span>
        <span class="muted">Circle size & intensity = qualitative relative affinity (not occupancy). For antipsychotics the small number under each circle is the measured Ki in nM, and sorting by a receptor ranks by Ki (drugs without a measured value go last). Side-effect pips = 0–3 clinical rating.</span></div></div>`;
    const grid = el.querySelector('#sgrid');
    const cols = () => (cls === 'all' ? U.uniq(PA.DRUGS.flatMap(d => U.targets(d).map(t => t.r))).slice(0, 16) : CLASS_COLS[cls] || []);
    const drugs = () => PA.DRUGS.filter(d => (cls === 'all' || d.cls === cls) && !d.substance);

    function value(d, key) {
      if (key === 'name') return d.name;
      if (key === 'ratio') { const a = (U.drugTarget(d, '5HT2A') || {}).aff || 0, b = (U.drugTarget(d, 'D2') || {}).aff || 0; return a - b; }
      if (key === 'hl') return halfLifeHours(d);
      if (key.startsWith('r:')) {
        const t = U.drugTarget(d, key.slice(2));
        if (useKi()) { const k = t && U.ki(d, key.slice(2)); return k ? -Math.log10(PA.kiValue(k)) : null; }
        return t ? t.aff : 0;
      }
      if (key.startsWith('ae:')) return (d.ae || {})[key.slice(3)];
      return 0;
    }
    /* rank antipsychotics by measured Ki (as pKi) when sorting by a receptor */
    const useKi = () => cls === 'antipsychotic';
    function label(key) {
      if (key === 'name') return 'Name';
      if (key === 'ratio') return '5-HT2A − D2 index';
      if (key === 'hl') return 'Half-life';
      if (key.startsWith('r:')) return PA.rl(key.slice(2)) + (useKi() ? ' Ki (nM)' : ' affinity');
      return (PA.AE_KEYS.find(k => k.k === key.slice(3)) || {}).label;
    }
    function fillSelect() {
      const s = el.querySelector('#ssort');
      s.innerHTML = `<optgroup label="Receptor affinity">${cols().map(r => `<option value="r:${r}">${esc(PA.rl(r))}</option>`).join('')}</optgroup>
        <optgroup label="Side effect (clinical rating)">${AE_SHOW.map(k => `<option value="ae:${k}">${esc(PA.AE_KEYS.find(x => x.k === k).label)}</option>`).join('')}</optgroup>
        <optgroup label="Other"><option value="hl">Half-life</option>${cls === 'antipsychotic' ? '<option value="ratio">5-HT2A − D2 index</option>' : ''}<option value="name">Name</option></optgroup>`;
      s.value = sortKey;
      el.querySelector('#squest').innerHTML = (QUESTIONS[cls] || []).map((q, i) => `<button class="chip q" data-q="${i}">${esc(q.q)}</button>`).join('') || '<span class="small muted">Use the column headers to sort.</span>';
      el.querySelector('#d2wrap').style.display = cls === 'antipsychotic' ? '' : 'none';
    }

    function rowHtml(d, rank, maxV) {
      const v = value(d, sortKey);
      const kiMode = sortKey.startsWith('r:') && useKi();
      const pct = sortKey === 'name' ? 0 : v == null ? 0 : kiMode ? U.kiPct(Math.pow(10, -v)) : sortKey === 'hl' ? Math.min(100, Math.log10(1 + v) / Math.log10(1 + maxV) * 100) : sortKey === 'ratio' ? (v + 4) / 8 * 100 : sortKey.startsWith('ae:') ? v / 3 * 100 : v / 4 * 100;
      const kiRow = kiMode && U.ki(d, sortKey.slice(2));
      const t0 = kiMode && U.drugTarget(d, sortKey.slice(2));
      const vtxt = sortKey === 'name' ? '' : kiMode ? (kiRow ? PA.kiText(kiRow) + ' nM' : t0 ? 'no Ki · ' + PA.AFFINITY[t0.aff].label : 'none') : v == null ? '—' : sortKey === 'hl' ? (v >= 48 ? (v / 24).toFixed(v / 24 < 10 ? 1 : 0) + ' d' : v.toFixed(v < 10 ? 1 : 0) + ' h') : sortKey === 'ratio' ? (v > 0 ? '+' : '') + v : sortKey.startsWith('r:') ? (v ? PA.AFFINITY[v].label : 'none') : ['none', 'low', 'mod', 'high'][v];
      const barCls = sortKey.startsWith('ae:') ? 'warm' : sortKey === 'ratio' ? 'violet' : '';
      const d2 = U.drugTarget(d, 'D2');
      return `<div class="srow" role="row" data-id="${d.id}">
        <div class="scell rank" role="cell">${rank}</div>
        <div class="scell sname" role="rowheader"><a href="#/drug/${d.id}">${esc(d.name.split(' (')[0])}</a><span class="ssub">${esc(d.sub)}${cls === 'antipsychotic' ? ` · D2 ${d2 ? U.actGlyph(d2.action) : '∅'}` : ''}</span></div>
        <div class="scell sval" role="cell"><div class="sbar ${barCls}"><i style="--w:${pct.toFixed(0)}%${sortKey.startsWith('ae:') && v != null ? ';background:' + ['var(--good)', 'var(--good)', 'var(--warn)', 'var(--bad)'][v] : ''}"></i></div><span class="mono">${esc(vtxt)}</span></div>
        ${cols().map(r => { const t = U.drugTarget(d, r); const R = PA.RECEPTOR[r]; const k = t && useKi() && U.ki(d, r); const col = (PA.NT[R.nt] || PA.NT.OTHER).color;
          return `<div class="scell rc ${hl.includes(r) ? 'hl' : ''} ${sortKey === 'r:' + r ? 'sorted' : ''}" role="cell" title="${t ? esc(`${d.name}: ${U.actLabel(t.action)} at ${PA.rl(r)} — ${k ? 'Ki ' + PA.kiText(k) + ' nM' : PA.AFFINITY[t.aff].label}`) : 'no meaningful affinity'}">${t ? `<span class="aff a${t.aff}" style="--c:${col}"><b>${U.actGlyph(t.action)}</b></span>${k ? `<span class="kin mono">${esc(PA.kiText(k))}</span>` : ''}` : '<span class="none">·</span>'}</div>`; }).join('')}
        ${AE_SHOW.map(k => { const x = (d.ae || {})[k]; return `<div class="scell ae ${sortKey === 'ae:' + k ? 'sorted' : ''}" role="cell" title="${esc(PA.AE_KEYS.find(y => y.k === k).label)}: ${['none', 'low', 'moderate', 'high'][x] || '—'}"><span class="pips p${x}">${[1, 2, 3].map(i => `<i class="${i <= x ? 'on' : ''}"></i>`).join('')}</span></div>`; }).join('')}
      </div>`;
    }
    function header() {
      const th = (key, txt, cls2, title) => `<button class="scell sh ${cls2 || ''} ${sortKey === key ? 'sorted' : ''}" data-sort="${key}" role="columnheader" aria-sort="${sortKey === key ? (dir < 0 ? 'descending' : 'ascending') : 'none'}" title="${esc(title || 'Sort by ' + txt)}">${esc(txt)}${sortKey === key ? (dir < 0 ? ' ▾' : ' ▴') : ''}</button>`;
      return `<div class="srow shead" role="row"><div class="scell rank">#</div>${th('name', 'Drug', 'sname')}<div class="scell sval sh-static">${esc(label(sortKey))}</div>
        ${cols().map(r => th('r:' + r, PA.rl(r), 'rc ' + (hl.includes(r) ? 'hl' : ''), PA.RECEPTOR[r].name)).join('')}
        ${AE_SHOW.map(k => th('ae:' + k, SHORT_AE[k], 'ae', 'Sort by ' + PA.AE_KEYS.find(x => x.k === k).label + ' (clinical rating)')).join('')}</div>`;
    }
    function rows() {
      let ds = drugs().filter(d => !query || d.name.toLowerCase().includes(query));
      if (cls === 'antipsychotic' && d2filter !== 'all') ds = ds.filter(d => { const t = U.drugTarget(d, 'D2'); return d2filter === 'none' ? !t : t && t.action === (d2filter === 'antagonist' ? 'antagonist' : 'partial'); });
      ds.sort((a, b) => {
        const va = value(a, sortKey), vb = value(b, sortKey);
        if (sortKey === 'name') return dir < 0 ? va.localeCompare(vb) : vb.localeCompare(va);
        if (va == null && vb == null) return 0; if (va == null) return 1; if (vb == null) return -1;
        return (vb - va) * (dir < 0 ? 1 : -1) || a.name.localeCompare(b.name);
      });
      return ds;
    }

    /* FLIP-animated render */
    function render(animate) {
      const before = {};
      if (animate && !U.reduced()) grid.querySelectorAll('.srow[data-id]').forEach(r => { before[r.dataset.id] = r.getBoundingClientRect().top; });
      const ds = rows();
      const maxHL = Math.max(1, ...ds.map(d => halfLifeHours(d) || 0));
      grid.style.setProperty('--ncols', cols().length); grid.style.setProperty('--nae', AE_SHOW.length);
      grid.innerHTML = header() + ds.map((d, i) => rowHtml(d, i + 1, maxHL)).join('') + (ds.length ? '' : '<p class="muted" style="padding:12px">No drugs match.</p>');
      if (animate && !U.reduced()) {
        grid.querySelectorAll('.srow[data-id]').forEach((r, i) => {
          const b = before[r.dataset.id]; const a = r.getBoundingClientRect().top;
          if (b == null) { r.animate([{ opacity: 0, transform: 'translateX(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 350, delay: i * 18, easing: 'ease-out', fill: 'backwards' }); return; }
          const dy = b - a; if (Math.abs(dy) < 1) return;
          r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
          if (Math.abs(dy) > 4) r.animate([{ backgroundColor: 'color-mix(in srgb, var(--accent) 16%, transparent)' }, { backgroundColor: 'transparent' }], { duration: 900 });
        });
      }
      el.querySelector('#sdir').textContent = sortKey === 'name' ? (dir < 0 ? 'A → Z' : 'Z → A') : (dir < 0 ? '↓ High → low' : '↑ Low → high');
      el.querySelector('#sinsight').innerHTML = insight ? `<div class="insight"><span class="insight-ico" aria-hidden="true">💡</span><div>${esc(insight)}<div class="small muted" style="margin-top:4px">Highlighted columns are the receptors that explain this ranking — click any drug for its mechanism chains.</div></div></div>` : '';
      history.replaceState(null, '', '#/sort/' + cls);
    }

    function setSort(key, animate, keepInsight) {
      if (key === sortKey) dir = -dir; else { sortKey = key; dir = key === 'name' ? -1 : -1; }
      if (!keepInsight) { insight = ''; hl = key.startsWith('r:') ? [key.slice(2)] : key === 'ratio' ? ['5HT2A', 'D2'] : (key.startsWith('ae:') ? U.receptorsForEffect((PA.AE_KEYS.find(k => k.k === key.slice(3)) || {}).effect).filter(r => cols().includes(r)) : []); el.querySelectorAll('.chip.q').forEach(c => c.setAttribute('aria-pressed', 'false')); }
      el.querySelector('#ssort').value = sortKey;
      render(animate);
    }

    el.addEventListener('click', e => {
      const h = e.target.closest('[data-sort]'); if (h) return setSort(h.dataset.sort, true);
      const c = e.target.closest('[data-cls]'); if (c) { cls = c.dataset.cls; el.querySelectorAll('[data-cls]').forEach(x => x.setAttribute('aria-pressed', x === c)); sortKey = 'r:' + cols()[0]; dir = -1; hl = [cols()[0]]; insight = ''; fillSelect(); render(true); return; }
      const q = e.target.closest('[data-q]'); if (q) { const Q = QUESTIONS[cls][+q.dataset.q]; sortKey = Q.sort; dir = Q.dir; hl = Q.hl; insight = Q.insight; el.querySelectorAll('.chip.q').forEach(x => x.setAttribute('aria-pressed', x === q)); el.querySelector('#ssort').value = sortKey; render(true); return; }
      const f = e.target.closest('[data-d2]'); if (f) { d2filter = f.dataset.d2; el.querySelectorAll('[data-d2]').forEach(x => x.setAttribute('aria-pressed', x === f)); render(true); return; }
      if (e.target.id === 'sdir') { dir = -dir; render(true); }
    });
    el.querySelector('#ssort').addEventListener('change', e => { const k = e.target.value; sortKey = '__'; setSort(k, true); });
    el.querySelector('#sq').addEventListener('input', e => { query = e.target.value.toLowerCase(); render(true); });
    fillSelect(); render(false);
  };
})();
