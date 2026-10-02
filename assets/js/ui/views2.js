/* Views: drug classes, drug module, comparison, side-effect explorer, prescriber mode. */
(function () {
  const U = PA.U, esc = U.esc, V = PA.V;

  const classDrugs = cls => PA.DRUGS.filter(d => d.cls === cls || (d.also || []).includes(cls));

  /* ================= CLASS PAGES ================= */
  V.cls = function (el, params) {
    const cls = PA.CLASSES[params[0]] ? params[0] : 'antidepressant';
    const C = PA.CLASSES[cls]; const ds = classDrugs(cls);
    const subs = U.uniq(ds.map(d => d.cls === cls ? d.sub : 'Also used here (cross-listed)'));
    el.innerHTML = V.head(`${C.section} · ${C.name}`, esc(C.name), classLead(cls)) +
      `<div class="chips" style="margin-bottom:16px">${Object.entries(PA.CLASSES).map(([k, c]) => `<a class="chip" href="#/class/${k}" style="${k === cls ? 'border-color:var(--accent);color:var(--text)' : ''}">${esc(c.section)} · ${esc(c.name)}</a>`).join('')}</div>
      <div id="clsextra"></div>
      ${subs.map(s => `<h2 style="margin-top:20px">${esc(s)}</h2><div class="grid g3">${ds.filter(d => (d.cls === cls ? d.sub : 'Also used here (cross-listed)') === s).map(drugTile).join('')}</div>`).join('')}`;
    const ex = el.querySelector('#clsextra');
    if (cls === 'antipsychotic') apExtras(ex, ds);
    if (cls === 'antidepressant') ex.innerHTML = `<div class="card"><h3>How antidepressant classes differ mechanistically</h3><div class="table-scroll"><table class="data"><thead><tr><th>Class</th><th>Primary action</th><th>Predictable adverse effects (from profile)</th></tr></thead><tbody>
      <tr><td>SSRI</td><td>SERT ✕</td><td>Nausea (5-HT3), sexual dysfunction, activation, bleeding, hyponatremia, discontinuation</td></tr>
      <tr><td>SNRI</td><td>SERT ✕ + NET ✕</td><td>SSRI effects + ↑ BP/HR, sweating, urinary hesitancy</td></tr>
      <tr><td>TCA</td><td>SERT/NET ✕ + H1, M1, α1 ⊣ + NaV ▮</td><td>Sedation, weight, anticholinergic, orthostasis, QRS/QT, lethal overdose</td></tr>
      <tr><td>MAOI</td><td>MAO-A/B ✕ (irreversible)</td><td>Tyramine crisis, serotonin syndrome with interactions, orthostasis, weight (phenelzine)</td></tr>
      <tr><td>Mirtazapine</td><td>α2 ⊣, H1 ⊖, 5-HT2A/2C/3 ⊣</td><td>Sedation, appetite & weight ↑; little sexual dysfunction or nausea</td></tr>
      <tr><td>Bupropion</td><td>NET/DAT ✕ (weak)</td><td>Insomnia, ↓ appetite, seizures (dose); no sexual dysfunction</td></tr></tbody></table></div>
      <p style="margin-top:10px"><a class="btn small" href="#/learn/timecourse">Time course: why weeks? →</a> <a class="btn small" href="#/learn/adapt">Adaptation →</a></p></div>`;
    if (cls === 'mood') ex.innerHTML = `<div class="card"><h3>Lithium has no single definitive target</h3><p>Explore the <a href="#/drug/lithium/mechanism">interactive lithium mechanism map</a> — every node is labelled established, proposed or incompletely understood.</p></div>`;
    if (cls === 'anxiolytic') ex.innerHTML = `<div class="card"><h3>Benzodiazepines vs barbiturates</h3>${U.chainFromArray(['Benzodiazepine (PAM)', '↑ FREQUENCY of Cl⁻ channel opening', 'Requires GABA → ceiling'])}${U.chainFromArray(['Barbiturate', '↑ DURATION of opening; direct gating at high dose', 'No ceiling → narrow therapeutic index'])}<p class="small">${U.refInline(['2471436', '10548105', '11021797'])} · <a href="#/nt/GABA">GABA map: direct vs indirect modulation →</a></p></div>`;
    if (cls === 'hypnotic') ex.innerHTML = `<div class="card"><h3>Where hypnotics act on the sleep–wake switch</h3>${PA.CIRCUIT.sleep.block.chain.map(s => `<p class="small" style="margin:.2em 0">• ${esc(s)}</p>`).join('')}<p style="margin-top:10px"><a class="btn small" href="#/circuits/sleep">Sleep–wake switch map →</a> <a class="btn small" href="#/circuits/orexin">Orexin circuit →</a></p></div>`;
    if (cls === 'adhd') ex.innerHTML = `<div class="card"><h3>DAT, NET and α2A mapped onto PFC, striatum and locus coeruleus</h3><div class="table-scroll"><table class="data"><thead><tr><th>Target</th><th>PFC</th><th>Striatum / NAc</th><th>Locus coeruleus</th></tr></thead><tbody>
      <tr><td>DAT ✕/⇄ (stimulants)</td><td>Minor (little DAT)</td><td><b>↑ DA</b> — attention/motivation; abuse liability</td><td>—</td></tr>
      <tr><td>NET ✕ (atomoxetine, stimulants)</td><td><b>↑ NE AND DA</b> (NET clears PFC DA)</td><td>No ↑ DA in NAc → low abuse</td><td>↑ NE at somatodendritic α2 (↓ firing)</td></tr>
      <tr><td>α2A agonist (guanfacine, clonidine)</td><td><b>Postsynaptic α2A</b> on spines → ↑ network strength</td><td>—</td><td>↓ LC firing → sedation, ↓ BP</td></tr></tbody></table></div>
      <p style="margin-top:10px"><a class="btn small" href="#/circuits/pfc_invu">Inverted-U interactive →</a></p></div>`;
    if (cls === 'sud') { ex.innerHTML = '<div id="rw"></div><div class="grid g3" style="margin-top:14px">' + ['MOR', 'KOR', 'DOR'].map(V.recCard).join('') + '</div><p style="margin-top:10px"><a class="btn small" href="#/circuits/reward">Reward & addiction circuit →</a> <a class="btn small" href="#/learn/adapt">Tolerance & withdrawal →</a></p>'; PA.W.reward(ex.querySelector('#rw')); }
    if (cls === 'dementia') ex.innerHTML = `<div class="card"><p>Cholinesterase inhibitors compensate for basal-forebrain cholinergic loss; memantine is a low-affinity NMDA blocker. Both are symptomatic — not disease-modifying. Anti-amyloid antibodies (lecanemab, donanemab) are outside the scope of Stahl 7th ed. and this module.</p><p><a class="btn small" href="#/atlas/bf">Basal forebrain →</a></p></div>`;
  };
  function classLead(cls) {
    return {
      antidepressant: 'From transporter inhibition to receptor antagonism and glutamatergic modulation. Every adverse-effect profile follows from the receptor fingerprint.',
      antipsychotic: 'All but two act on D2 — the pathway that is affected determines whether the result is therapeutic (mesolimbic), motor (nigrostriatal) or endocrine (tuberoinfundibular). Off-target receptors explain the rest.',
      mood: 'Lithium, anticonvulsants and selected antipsychotics — mechanisms range from established ion-channel actions to incompletely understood intracellular effects.',
      anxiolytic: 'Fast-acting GABA-A modulation, delayed 5-HT1A partial agonism, α2δ ligands, antihistamines and adrenergic blockers.',
      hypnotic: 'Five ways to tip the sleep–wake switch: enhance GABA, block orexin, block histamine, mimic melatonin, block 5-HT2A/α1.',
      adhd: 'Optimising catecholamine signalling in prefrontal–striatal circuits; why more is not always better (inverted-U).',
      sud: 'Drug → receptor/transporter → VTA → NAc dopamine → reinforcement; then tolerance, dependence, withdrawal and adaptation. Treatments exploit agonism, partial agonism, antagonism and aversion.',
      dementia: 'Symptomatic cholinergic and glutamatergic pharmacology.',
      movement: 'Agents treating drug-induced movement disorders.'
    }[cls] || '';
  }
  function drugTile(d) {
    const top = U.targets(d).sort((a, b) => b.aff - a.aff).slice(0, 4).map(t => `${U.actGlyph(t.action)}${PA.rl(t.r)}`).join(' · ');
    return `<a class="tile" href="#/drug/${d.id}"><span class="tk">${esc(d.sub)}${d.flagship ? ' · ★ flagship' : ''}${d.substance ? ' · not prescribing' : ''}</span><h3>${esc(d.name)}</h3><p class="mono" style="font-size:.78rem">${esc(top)}</p></a>`;
  }

  function apExtras(ex, ds) {
    const aps = ['clozapine', 'olanzapine', 'quetiapine', 'risperidone', 'paliperidone', 'aripiprazole', 'brexpiprazole', 'cariprazine', 'ziprasidone', 'lurasidone', 'asenapine', 'lumateperone', 'haloperidol', 'xanomeline_trospium'].map(id => PA.DRUG[id]);
    const recs = ['D2', 'D3', '5HT2A', '5HT2C', '5HT1A', 'H1', 'A1', 'M1', 'M4', '5HT7', 'A2', 'hERG'];
    const aeOpts = [['wt', 'weight_gain'], ['sed', 'sedation'], ['eps', 'eps'], ['prl', 'hyperprolactinemia'], ['orth', 'orthostasis'], ['ach', 'anticholinergic'], ['qt', 'qt'], ['akat', 'akathisia']];
    ex.innerHTML = `<div class="card"><div class="row"><h3 style="margin:0">Receptor fingerprint matrix</h3><span class="spacer"></span><span class="small muted">Highlight receptors relevant to:</span>${aeOpts.map(([k, e]) => `<button class="chip" data-ae="${e}">${esc(PA.EFFECT[e].name.split(' (')[0])}</button>`).join('')}</div>
      <div class="table-scroll" style="margin-top:10px"><table class="data" id="apm"></table></div>
      <p class="small muted">Cell = action glyph + qualitative relative affinity (1–4); shade intensity also encodes affinity. Right-hand columns: clinical ratings (0–3). Click a drug name for its module.</p></div>
      <div class="card" style="margin-top:14px"><h3>Antipsychotic side-effect mechanism map</h3><p class="small">One drug, many receptors, many circuits. Established pharmacology is separated from mechanistic hypotheses by the evidence tag on each chain.</p>
      ${['d2_ml', 'd2_eps', 'd2_prl', 'd2_neg', 'd2_akath', 'd2_td', 'h1_sed', 'h1_wt', '5ht2c_wt', 'a1_orth', 'm_drymouth', 'm_constip', 'm1_cog', '5ht2a_eps', '5ht2a_prl', 'herg_qt'].map(id => U.chain(PA.MECH[id])).join('')}
      <p style="margin-top:10px"><a class="btn small" href="#/partial">Partial dopamine agonists module →</a> <a class="btn small" href="#/drug/clozapine">Clozapine module →</a></p></div>`;
    const draw = hlEffect => {
      const hl = hlEffect ? new Set(U.receptorsForEffect(hlEffect)) : new Set();
      if (hlEffect === 'anticholinergic') hl.add('M1');
      const aeKey = hlEffect ? (PA.AE_KEYS.find(k => k.effect === hlEffect) || {}).k : null;
      ex.querySelector('#apm').innerHTML = `<thead><tr><th>Drug</th>${recs.map(r => `<th style="${hl.has(r) ? 'color:var(--warn)' : ''}">${esc(PA.rl(r))}</th>`).join('')}<th>Wt</th><th>EPS</th><th>PRL</th><th>Sed</th></tr></thead><tbody>${aps.map(d => `<tr><td><a href="#/drug/${d.id}"><b>${esc(d.name.split(' (')[0])}</b></a></td>${recs.map(r => { const t = U.drugTarget(d, r); if (!t) return `<td class="muted" style="${hl.has(r) ? 'outline:1px dashed var(--warn)' : ''}">·</td>`; const R = PA.RECEPTOR[r]; const col = (PA.NT[R.nt] || PA.NT.OTHER).color; return `<td style="background:color-mix(in srgb, ${col} ${t.aff * 18}%, transparent);${hl.has(r) ? 'outline:2px solid var(--warn)' : ''}" title="${esc(U.actLabel(t.action))} · ${PA.AFFINITY[t.aff].label}"><span class="mono">${U.actGlyph(t.action)}${t.aff}</span></td>`; }).join('')}
        ${['wt', 'eps', 'prl', 'sed'].map(k => `<td style="${aeKey === k ? 'outline:2px solid var(--warn)' : ''}">${d.ae[k]}</td>`).join('')}</tr>`).join('')}</tbody>`;
    };
    ex.querySelectorAll('[data-ae]').forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      ex.querySelectorAll('[data-ae]').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', on); draw(on ? b.dataset.ae : null);
    }));
    draw(null);
  }

  /* ================= DRUG MODULE ================= */
  V.drug = function (el, params) {
    const d = PA.DRUG[params[0]]; if (!d) { el.innerHTML = '<p>Drug not found.</p>'; return; }
    const tab = params[1] || (U.store.get('prescriber', false) && !d.substance ? 'rx' : 'mech');
    const S = d.stahl ? PA.stahl[d.stahl] : null;
    const C = PA.CLASSES[d.cls];
    el.innerHTML = `<div class="page-head"><div class="crumbs"><a href="#/class/${d.cls}">${esc(C.name)}</a> › ${esc(d.sub)}</div>
      <div class="eyebrow">${esc(C.section)} · ${esc(d.sub)}${d.flagship ? ' · ★ flagship module' : ''}</div><h1>${esc(d.name)}</h1>
      ${S && S.cls ? `<p class="small muted">${esc(S.cls.join(' · '))}</p>` : ''}
      <div class="chips">${U.targets(d).filter(t => t.primary).map(t => `<a class="chip" href="#/receptors/${t.r}">★ ${U.actGlyph(t.action)} ${esc(PA.rl(t.r))} ${esc(PA.ACTIONS[t.action].verb)}</a>`).join('')}<a class="chip" href="#/atlas/place/${d.id}">⌖ Put on the brain</a><a class="chip" href="#/compare/${d.id}">⇆ Compare</a></div></div>
      <div id="dtabs"></div><div id="dbody"></div>`;
    const tabs = [{ id: 'mech', label: 'Mechanism' }, { id: 'brain', label: 'Brain & circuits' }, { id: 'effects', label: 'Effects & side effects' }, { id: 'dose', label: 'Dose & time course' }, { id: 'rx', label: d.substance ? 'Clinical notes' : 'Prescribing information' }, { id: 'refs', label: 'References' }];
    if (d.id === 'lithium') tabs.splice(1, 0, { id: 'mechanism', label: 'Lithium mechanism map' });
    const body = el.querySelector('#dbody');
    const show = t => { history.replaceState(null, '', `#/drug/${d.id}/${t}`); PA.W.stopAll(); renderTab(body, d, t); };
    U.tabs(el.querySelector('#dtabs'), tabs, tabs.find(x => x.id === tab) ? tab : 'mech', show);
    renderTab(body, d, tabs.find(x => x.id === tab) ? tab : 'mech');
  };

  function renderTab(body, d, tab) {
    const ms = U.mechsForDrug(d);
    if (tab === 'mech') {
      body.innerHTML = `<div class="split"><div class="stack">
          <div class="card radial"><div class="row"><h3 style="margin:0">Radial receptor map</h3><span class="spacer"></span><span class="small muted">Click a target</span></div>${U.radial(d)}${U.fpLegend()}</div>
          ${d.id === 'mirtazapine' ? '<div id="mirt-syn1"></div><div id="mirt-syn2"></div>' : ''}
        </div><div class="stack"><div class="card" id="tdetail"></div>
          <div class="card"><h3>Receptor fingerprint</h3>${U.fingerprint(d)}</div>
          <div class="card"><h3>Key points</h3><ul class="bul">${(d.notes || []).map(n => `<li>${esc(n)}</li>`).join('')}</ul>${labelNotes(d)}</div></div></div>`;
      const showTarget = rid => {
        const t = U.drugTarget(d, rid); const R = PA.RECEPTOR[rid];
        const tm = ms.filter(x => x.t && x.t.r === rid);
        body.querySelectorAll('.tnode').forEach(n => n.classList.toggle('sel', n.dataset.target === rid));
        body.querySelector('#tdetail').innerHTML = `<div class="row"><h3 style="margin:0">${U.actGlyph(t.action)} ${esc(PA.rl(rid))} ${esc(PA.ACTIONS[t.action].verb)}</h3><span class="spacer"></span><span class="chip">${esc(PA.AFFINITY[t.aff].label)} rel. affinity</span></div>
          ${R ? `<p class="small muted">${esc(R.family)} · ${esc(R.coupling)} · ${esc(R.tone)}</p>
          <div class="chain-legend" style="margin:6px 0"><span><i style="border-width:2px;border-color:var(--text-2)"></i>Direct receptor action</span><span><i></i>Downstream consequence</span><span><i style="background:color-mix(in srgb,var(--warn) 25%,var(--surface))"></i>Clinical effect</span></div>` : ''}
          ${tm.length ? tm.map(x => U.chain(x.m, { drug: d.name })).join('') : `<p class="muted small">No major clinical mechanism is attributed to this ${t.aff <= 1 ? 'low-affinity' : ''} action in the atlas.</p>`}
          <p><a class="btn small" href="#/receptors/${rid}">Receptor atlas: ${esc(PA.rl(rid))} →</a></p>`;
      };
      body.querySelector('.radial svg').addEventListener('click', e => { const n = e.target.closest('.tnode'); if (n) showTarget(n.dataset.target); });
      body.querySelector('.radial svg').addEventListener('keydown', e => { const n = e.target.closest('.tnode'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showTarget(n.dataset.target); } });
      showTarget((U.targets(d).find(t => t.primary) || U.targets(d)[0]).r);
      if (d.id === 'mirtazapine') {
        PA.W.synapse(body.querySelector('#mirt-syn1'), { nt: 'NE', autoName: 'α2 autoreceptor', title: 'α2 AUTOreceptor on noradrenergic neuron — block → ↑ NE release' });
        PA.W.synapse(body.querySelector('#mirt-syn2'), { nt: '5HT', autoName: 'α2 heteroreceptor', mode: 'hetero', title: 'α2 HETEROreceptor on serotonergic terminal — block → ↑ 5-HT release', modes: [{ id: 'base', label: 'Baseline (NE brakes 5-HT release)' }, { id: 'blockAuto', label: 'Mirtazapine blocks α2 heteroreceptor' }, { id: 'blockPost', label: 'Also: 5-HT2A/2C/3 blocked postsynaptically' }],
          texts: { base: 'NE from neighbouring fibres acts on α2 heteroreceptors on the 5-HT terminal, restraining 5-HT release.', blockAuto: 'DIRECT: α2 heteroreceptor blockade. DOWNSTREAM: ↑ 5-HT release.', blockPost: 'Proposed "specific serotonergic" synthesis: because mirtazapine blocks 5-HT2A, 5-HT2C and 5-HT3, the extra 5-HT acts preferentially at 5-HT1A (which is not blocked). The postsynaptic bar shows the signal at the blocked subtypes falling. PROPOSED.' } });
      }
    } else if (tab === 'brain') {
      body.innerHTML = `<div class="split"><div id="dmap"></div><div class="stack"><div class="card"><h3>Where ${esc(d.name)} acts</h3><ul class="clean small">${U.targets(d).map(t => { const R = PA.RECEPTOR[t.r]; return `<li>${U.actGlyph(t.action)} <b>${U.recLink(t.r)}</b> (${esc(PA.AFFINITY[t.aff].label)}) → ${R && R.regions.length ? R.regions.map(U.regLink).join(', ') : '<span class="muted">peripheral / intracellular</span>'}</li>`; }).join('')}</ul></div>
        <div class="card"><h3>Circuits engaged</h3>${U.circuitsForDrug(d).map(c => `<p style="margin:.3em 0"><a href="#/circuits/${c}"><b>${esc(PA.CIRCUIT[c].name)}</b></a> — ${ms.filter(x => x.m.circuit === c).map(x => `${x.m.type === 'ther' ? '✓' : '⚠'} ${esc(PA.EFFECT[x.m.effect].name)}`).join('; ')}</p>`).join('') || '<p class="muted">—</p>'}</div></div></div>`;
      const lit = {}; Object.entries(U.regionsForDrug(d)).forEach(([rid, ts]) => { const b = ts.sort((a, c) => c.aff - a.aff)[0]; lit[rid] = { color: (PA.NT[PA.RECEPTOR[b.r].nt] || PA.NT.OTHER).color, strength: b.aff, badge: ts.slice(0, 2).map(t => `${PA.rl(t.r)} ${U.actGlyph(t.action)}`).join(' · ') }; });
      const circs = U.circuitsForDrug(d);
      PA.Brain.render(body.querySelector('#dmap'), { lit, dimOthers: true, projections: PA.PROJECTIONS.filter(p => circs.includes(p.circuit)), label: d.name + ' on the brain', onSelect: rg => location.hash = '#/atlas/' + rg });
    } else if (tab === 'effects') {
      const ther = ms.filter(x => x.m.type === 'ther'), adv = ms.filter(x => x.m.type === 'adv');
      const aeRows = PA.AE_KEYS.map(k => ({ k, v: (d.ae || {})[k.k] })).filter(x => x.v != null);
      const unk = adv.filter(x => x.m.ev === 'UNK');
      body.innerHTML = `<div class="grid g2">
        <div class="card"><h3>Clinical side-effect profile</h3><table class="data"><tbody>${aeRows.map(x => `<tr><td><a href="#/effects/${x.k.effect}">${esc(x.k.label)}</a></td><td>${U.rating(x.v)}</td></tr>`).join('')}</tbody></table><p class="small muted">Relative teaching ratings (0–3) synthesised from Stahl and network meta-analyses; see references.</p>
          ${PA.stahl[d.stahl] ? `<p class="small"><b>Stahl — weight gain:</b> ${esc((PA.stahl[d.stahl].weight || ['—'])[0])}<br><b>Stahl — sedation:</b> ${esc((PA.stahl[d.stahl].sedation || ['—'])[0])}</p>` : ''}</div>
        <div class="card"><h3>Adverse-effect mechanism map</h3><table class="data"><thead><tr><th>Effect</th><th>Explained by</th></tr></thead><tbody>${U.uniq(adv.map(x => x.m.effect)).map(e => { const xs = adv.filter(x => x.m.effect === e); return `<tr><td>${U.effLink(e)}</td><td>${xs.map(x => x.m.target ? `${U.actGlyph(x.t ? x.t.action : x.m.actions[0])} ${esc(PA.rl(x.m.target))} <span class="muted small">(${esc(x.t ? PA.AFFINITY[x.t.aff].label.toLowerCase() : '')})</span> ${U.ev(x.m.ev, { short: true })}` : `<b>Multifactorial / mechanism incompletely established</b> ${U.ev(x.m.ev, { short: true })}`).join('<br>')}</td></tr>`; }).join('')}</tbody></table>
          ${unk.length ? `<p class="small notice" style="margin-top:8px">Effects marked ${U.ev('UNK')} are <b>not</b> adequately explained by a single receptor — the atlas does not force one.</p>` : ''}</div></div>
        <h2 style="margin-top:18px">Therapeutic mechanisms</h2>${ther.map(x => U.chain(x.m, { drug: d.name })).join('') || '<p class="muted">—</p>'}
        <h2 style="margin-top:18px">Adverse-effect mechanisms</h2><div class="chain-legend" style="margin-bottom:8px"><span><i style="border-width:2px;border-color:var(--text-2)"></i>Direct receptor action</span><span><i></i>Downstream</span><span><i style="background:color-mix(in srgb,var(--warn) 25%,var(--surface))"></i>Clinical</span><span>Every arrow has a <b>WHY?</b> button</span></div>
        ${adv.map(x => U.chain(x.m, { drug: d.name })).join('')}`;
    } else if (tab === 'dose') {
      const S = PA.stahl[d.stahl];
      body.innerHTML = `<div class="stack">${d.id === 'mirtazapine' ? '<div id="mdose"></div>' : ''}${d.doseLevels ? '<div id="dlev"></div>' : ''}
        ${!d.doseLevels && d.id !== 'mirtazapine' ? `<div class="notice">No reliable quantitative dose–occupancy data are presented for this drug. ${d.cls === 'antipsychotic' ? 'For D2 antagonists, PET suggests ~65% striatal D2 occupancy for response, ~72% for hyperprolactinemia and ~78% for EPS (haloperidol data; Kapur 2000) — thresholds differ for partial agonists, which need higher occupancy.' : ''}</div>` : ''}
        ${S ? `<div class="card"><h3>Dosing (Stahl)</h3><dl class="kv"><dt>Usual range</dt><dd>${(S.dose || []).map(esc).join('<br>')}</dd><dt>How to dose</dt><dd>${(S.howToDose || []).map(esc).join('<br>')}</dd><dt>Pharmacokinetics</dt><dd>${(S.pk || []).map(esc).join('<br>')}</dd><dt>Onset</dt><dd>${(S.onset || []).map(esc).join('<br>')}</dd></dl></div>` : ''}
        <div class="card"><h3>Time course: binding vs clinical effect</h3><div id="tc"></div></div></div>`;
      if (d.id === 'mirtazapine') PA.W.mirtDose(body.querySelector('#mdose'));
      if (d.doseLevels) PA.W.doseLevels(body.querySelector('#dlev'), d);
      PA.W.timecourse(body.querySelector('#tc'), d.tc);
    } else if (tab === 'rx') {
      body.innerHTML = rxBlock(d);
    } else if (tab === 'refs') {
      const S = PA.stahl[d.stahl];
      const mechRefs = U.uniq(ms.flatMap(x => x.m.refs || []).concat(d.refs || []));
      body.innerHTML = `<div class="card"><h3>Primary prescribing source</h3><p>${d.stahl ? `Stahl SM. <i>Stahl's Essential Psychopharmacology: Prescriber's Guide</i>, 7th ed. Cambridge University Press; 2021 — chapter "${esc(S.title)}" (condensed; consult the book for full text).` : esc((d.rx && d.rx.src) || 'Not a prescribing entry.')}</p>
        ${S && S.reading ? `<h4>Stahl's suggested reading for this chapter</h4><ul class="refs">${S.reading.map(r => `<li>${esc(r)} <a class="pm" target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(r.split('.').slice(1, 2).join('').trim().slice(0, 140))}">search PubMed</a></li>`).join('')}</ul>` : ''}</div>
        <div class="card"><h3>PubMed references for mechanisms on this page (verified PMIDs)</h3>${U.refList(mechRefs)}</div>`;
    } else if (tab === 'mechanism' && d.id === 'lithium') {
      lithiumMap(body);
    }
  }

  function labelNotes(d) {
    return (d.labelNotes || []).map(n => `<div class="notice info small" style="margin-top:8px"><b>${esc(n.src)}:</b> ${esc(n.text)}</div>`).join('');
  }

  /* ---------- Prescribing block ---------- */
  function rxBlock(d) {
    const S = d.stahl ? PA.stahl[d.stahl] : null;
    const R = d.rx;
    if (d.substance) return `<div class="card"><h3>Not a prescribing entry</h3><p>${esc(d.name)} is included for its pharmacology in substance use. Clinical notes:</p><ul class="bul">${(d.notes || []).map(n => `<li>${esc(n)}</li>`).join('')}</ul></div>`;
    const sec = (title, items, cls) => items && items.length ? `<div class="rx-sec ${cls || ''}"><h4>${esc(title)}</h4><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>` : '';
    const ind = (S ? S.indications : R ? R.indications : []) || [];
    let out = `<div class="notice" style="margin-bottom:14px">${esc(PA.DISCLAIMER)}</div><div class="rx-block"><div class="rx-head"><h3>Prescribing information</h3><span class="spacer"></span><span class="small muted">Source: ${S ? "Stahl's Prescriber's Guide, 7th ed. (2021)" : esc(R.src)}</span></div><div class="rx-body">`;
    out += labelNotes(d);
    out += `<div class="rx-sec"><h4>Indications</h4><ul>${ind.map(i => `<li>${i.fda ? '<span class="fda-tag">FDA-APPROVED</span>' : '<span class="off-tag">OFF-LABEL / OTHER USE</span>'}${esc(i.t)}</li>`).join('')}</ul><p class="small muted">Approval flags follow the source's typography (bold = FDA-approved). "Off-label" here includes both evidence-supported and less well-supported uses — check guidelines for the evidence base. Indications approved after 2021 appear in the notes above.</p></div>`;
    if (S) {
      out += `<div class="grid g2">${[sec('Usual dosage range', S.dose), sec('Starting dose & titration', S.howToDose), sec('Formulations', S.forms), sec('Dosing tips', S.tips), sec('Pharmacokinetics (half-life, metabolism)', S.pk), sec('How to stop / tapering', S.howToStop), sec('Renal impairment', S.renal), sec('Hepatic impairment', S.hepatic), sec('Cardiac impairment', S.cardiac), sec('Elderly', S.elderly), sec('Children & adolescents', S.children), sec('Pregnancy', S.pregnancy), sec('Breastfeeding', S.breast), sec('Habit forming', S.habit), sec('Overdose', S.overdose), sec('Long-term use', S.longTerm)].join('')}</div>`;
      out += `<div class="grid g2">${sec('Major interactions', S.interactions)}${sec('Monitoring / tests', S.tests)}</div>`;
      out += `<div class="boxed" style="margin:10px 0">${sec('Do not use (contraindications)', S.doNotUse)}${sec('Life-threatening or dangerous adverse effects', S.lifeThreat)}</div>`;
      out += sec('Other warnings / precautions', S.warnings);
    } else if (R) {
      out += `<div class="grid g2">${sec('Dosing', R.dose)}${sec('Warnings', R.warnings)}</div><div class="boxed">${sec('Do not use', R.doNotUse)}</div>`;
    }
    out += `</div></div>`;
    return out;
  }
  V.rxBlock = rxBlock;

  /* ---------- Lithium mechanism map ---------- */
  function lithiumMap(body) {
    const nodes = [
      { id: 'na', x: 140, y: 60, t: 'Na⁺-like transport (ENaC, Na/K pumps)', ev: 'EST', d: 'Li⁺ uses Na⁺ pathways — explains renal handling, toxicity with Na⁺ depletion, NDI.' },
      { id: 'imp', x: 450, y: 60, t: 'IMPase / IPPase inhibition → inositol depletion', ev: 'PROP', d: 'Berridge 1989: activity-dependent dampening of Gq/PLC signalling.', refs: ['2553271'] },
      { id: 'gsk', x: 760, y: 60, t: 'GSK-3β inhibition', ev: 'STR', d: 'Direct Mg²⁺-competitive and indirect (Akt → pSer9) inhibition — established molecular target (Klein & Melton 1996); therapeutic relevance proposed.', refs: ['8710892'] },
      { id: 'pkc', x: 160, y: 200, t: '↓ PKC / MARCKS signalling', ev: 'PROP', d: 'Downstream of reduced DAG/IP₃; also targeted by valproate. Tamoxifen (PKC inhibitor) showed antimanic signals.' },
      { id: 'circ', x: 740, y: 200, t: 'Circadian clock (REV-ERBα, PER, CRY)', ev: 'PROP', d: 'GSK-3 phosphorylates clock proteins; lithium lengthens circadian period across species.' },
      { id: 'bdnf', x: 760, y: 310, t: 'BDNF, Bcl-2, neurogenesis; ↑ grey matter', ev: 'PROP', d: 'Neuroprotective & neurotrophic effects observed in cells/animals and imaging.' },
      { id: 'nt', x: 140, y: 330, t: 'Monoamine & glutamate modulation', ev: 'UNK', d: '↓ DA and glutamate signalling, ↑ 5-HT function reported — inconsistent.' },
      { id: 'clin', x: 450, y: 405, t: 'Mood stabilisation · anti-suicidal effect', ev: 'CLIN', d: 'Robust clinical efficacy (mania, prophylaxis, suicide reduction) — the mechanistic route remains incompletely understood.', refs: ['23371914'] },
      { id: 'tox', x: 760, y: 410, t: 'Renal, thyroid, tremor, toxicity', ev: 'STR', d: 'Collecting-duct ENaC entry → ↓ aquaporin-2 (NDI); ↓ thyroid hormone release; narrow therapeutic index.', refs: ['22265699', '27900734'] }
    ];
    const edges = [['na', 'tox'], ['imp', 'pkc'], ['gsk', 'circ'], ['gsk', 'bdnf'], ['pkc', 'clin'], ['circ', 'clin'], ['bdnf', 'clin'], ['nt', 'clin'], ['imp', 'clin'], ['na', 'nt']];
    const N = Object.fromEntries(nodes.map(n => [n.id, n]));
    body.innerHTML = `<div class="notice" style="margin-bottom:12px">There is <b>no single definitive molecular target</b> for lithium. Each node is tagged as established, proposed or incompletely understood (Malhi 2013 review). ${U.refInline(['23371914'])}</div>
      <div class="card"><svg viewBox="0 0 900 445" role="group" aria-label="Lithium mechanism network" style="width:100%;height:auto">
        <defs><marker id="li-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" style="fill:var(--muted)"/></marker></defs>
        ${nodes.filter(n => ['na', 'imp', 'gsk', 'nt'].includes(n.id)).map(n => `<line x1="450" y1="215" x2="${n.x}" y2="${n.y}" style="stroke:var(--line-2)" stroke-width="1.5"/>`).join('')}
        ${edges.map(([a, b]) => `<line x1="${N[a].x}" y1="${N[a].y}" x2="${N[b].x}" y2="${N[b].y}" style="stroke:var(--muted)" stroke-width="1.5" stroke-dasharray="${['PROP', 'UNK'].includes(N[b].ev) || ['PROP', 'UNK'].includes(N[a].ev) ? '5 4' : ''}" marker-end="url(#li-arr)"/>`).join('')}
        <circle cx="450" cy="215" r="36" style="fill:var(--surface-3);stroke:var(--accent)" stroke-width="2"/><text x="450" y="221" text-anchor="middle" style="fill:var(--text);font-weight:700;font-size:18px">Li⁺</text>
        ${nodes.map(n => `<g class="tnode" data-li="${n.id}" tabindex="0" role="button" aria-label="${esc(n.t)} — ${esc(PA.EVIDENCE[n.ev].label)}"><rect x="${n.x - 105}" y="${n.y - 26}" width="210" height="52" rx="10" style="fill:var(--surface);stroke:${n.ev === 'EST' || n.ev === 'STR' ? 'var(--good)' : n.ev === 'CLIN' ? 'var(--warn)' : 'var(--line-2)'}" stroke-width="2" ${['PROP', 'UNK'].includes(n.ev) ? 'stroke-dasharray="5 3"' : ''}/>
          <foreignObject x="${n.x - 100}" y="${n.y - 24}" width="200" height="48"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11.5px;line-height:1.25;color:var(--text);text-align:center;padding-top:2px">${esc(n.t)}<br><span style="color:var(--muted);font-size:10px">${PA.EVIDENCE[n.ev].glyph} ${esc(PA.EVIDENCE[n.ev].label)}</span></div></foreignObject></g>`).join('')}
      </svg><div id="lidet" class="notice info" aria-live="polite">Click a node.</div></div>
      <h3 style="margin-top:16px">Linked mechanism chains</h3>${['li_impase', 'li_gsk3', 'li_renal', 'li_thyroid', 'li_tox'].map(id => U.chain(PA.MECH[id], { drug: 'Lithium' })).join('')}`;
    const sh = id => { const n = N[id]; body.querySelector('#lidet').innerHTML = `<b>${esc(n.t)}</b> ${U.ev(n.ev)}<br>${esc(n.d)} ${U.refInline(n.refs || [])}`; };
    body.querySelectorAll('[data-li]').forEach(g => { g.addEventListener('click', () => sh(g.dataset.li)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sh(g.dataset.li); } }); });
  }

  /* ================= COMPARISON ENGINE ================= */
  V.compare = function (el, params) {
    let sel = (params[0] ? params[0].split(',') : U.store.get('cmp', ['olanzapine', 'aripiprazole'])).filter(id => PA.DRUG[id]).slice(0, 4);
    let hlEffect = null;
    el.innerHTML = V.head('M · Drug comparison', 'Compare 2–4 medications mechanistically', 'Fingerprints side-by-side. Click an adverse effect to highlight the receptors and circuits that explain the difference.') +
      `<div class="card tight"><div class="row"><input id="cadd" list="cdl" placeholder="Add a drug…" style="padding:6px 10px;border-radius:8px;border:1px solid var(--line-2);background:var(--surface);color:var(--text)"><datalist id="cdl">${PA.DRUGS.map(d => `<option value="${esc(d.name)}">`).join('')}</datalist><div class="chips" id="csel"></div><span class="spacer"></span>
        <span class="small muted">Presets:</span><button class="chip" data-pre="olanzapine,aripiprazole">olanzapine vs aripiprazole</button><button class="chip" data-pre="risperidone,quetiapine,lurasidone">risperidone · quetiapine · lurasidone</button><button class="chip" data-pre="sertraline,mirtazapine,bupropion,venlafaxine">SSRI · mirtazapine · bupropion · SNRI</button><button class="chip" data-pre="methylphenidate,atomoxetine,guanfacine">ADHD</button></div></div>
      <div class="card tight" style="margin-top:10px"><div class="row"><span class="small"><b>Click an effect to explain differences:</b></span><span class="chips" id="ceff">${PA.AE_KEYS.map(k => `<button class="chip" data-e="${k.effect}">${esc(k.label)}</button>`).join('')}</span></div></div>
      <div id="cexplain" style="margin-top:12px"></div><div id="cgrid" class="cmp-grid" style="margin-top:12px"></div><div id="ctable" class="card table-scroll" style="margin-top:14px"></div>`;
    const draw = () => {
      U.store.set('cmp', sel); history.replaceState(null, '', '#/compare/' + sel.join(','));
      el.querySelector('#csel').innerHTML = sel.map(id => `<span class="chip">${esc(PA.DRUG[id].name)} <button class="close-x" style="padding:0 5px;font-size:.8rem" data-rm="${id}" aria-label="Remove ${esc(PA.DRUG[id].name)}">×</button></span>`).join('');
      const allRecs = U.uniq(sel.flatMap(id => U.targets(PA.DRUG[id]).sort((a, b) => b.aff - a.aff).map(t => t.r)));
      const hl = hlEffect ? U.receptorsForEffect(hlEffect).concat(hlEffect === 'anticholinergic' ? ['M1'] : []) : [];
      const grid = el.querySelector('#cgrid'); grid.style.gridTemplateColumns = `repeat(${Math.max(1, sel.length)}, minmax(0,1fr))`;
      grid.innerHTML = sel.map(id => { const d = PA.DRUG[id]; return `<div class="cmp-col"><h3><a href="#/drug/${id}">${esc(d.name)}</a></h3><p class="small muted">${esc(d.sub)}</p>${U.fingerprint(d, { order: allRecs, highlight: hl })}</div>`; }).join('');
      // explanation
      const ex = el.querySelector('#cexplain');
      if (hlEffect) {
        const E = PA.EFFECT[hlEffect]; const key = (PA.AE_KEYS.find(k => k.effect === hlEffect) || {}).k;
        ex.innerHTML = `<div class="card"><h3>Why do they differ in ${esc(E.name.toLowerCase())}?</h3><p class="small">${esc(E.desc)}</p><div class="grid g${Math.min(4, sel.length)}">${sel.map(id => { const d = PA.DRUG[id]; const ms = U.mechsForDrug(d).filter(x => x.m.effect === hlEffect); return `<div class="chain-wrap"><b>${esc(d.name)}</b> ${key ? U.rating(d.ae[key]) : ''}<ul class="clean small" style="margin-top:6px">${ms.length ? ms.map(x => `<li>${x.m.type === 'ther' ? '↓ mitigates:' : '↑ drives:'} ${x.m.target ? `${U.actGlyph(x.t ? x.t.action : x.m.actions[0])} <b>${esc(PA.rl(x.m.target))}</b> <span class="muted">(${esc(x.t ? PA.AFFINITY[x.t.aff].label.toLowerCase() : '')} affinity)</span>` : '<b>non-receptor mechanism</b>'} ${U.ev(x.m.ev, { short: true })} <button class="why" data-why="${x.m.id}" data-why-step="-1">WHY?</button></li>`).join('') : '<li class="muted">No mechanism in the atlas drives this effect for this drug.</li>'}</ul></div>`; }).join('')}</div></div>`;
      } else ex.innerHTML = '';
      // table
      const row = (label, f) => `<tr><th>${esc(label)}</th>${sel.map(id => `<td>${f(PA.DRUG[id])}</td>`).join('')}</tr>`;
      el.querySelector('#ctable').innerHTML = `<table class="data"><thead><tr><th></th>${sel.map(id => `<th>${esc(PA.DRUG[id].name)}</th>`).join('')}</tr></thead><tbody>
        ${row('Mechanism', d => U.targets(d).filter(t => t.primary).map(t => `${U.actGlyph(t.action)} ${esc(PA.rl(t.r))}`).join(', '))}
        ${row('FDA-approved indications', d => { const S = PA.stahl[d.stahl]; const ind = (S ? S.indications : (d.rx || {}).indications) || []; return `<span class="small">${ind.filter(i => i.fda).map(i => esc(i.t)).join('<br>') || '—'}</span>`; })}
        ${row('Usual dose (Stahl)', d => `<span class="small">${esc(((PA.stahl[d.stahl] || {}).dose || (d.rx || {}).dose || ['—']).slice(0, 2).join(' · '))}</span>`)}
        ${row('Half-life', d => `<span class="small">${esc(U.halfLife(d) || '—')}</span>`)}
        ${PA.AE_KEYS.map(k => row(k.label, d => `<button class="chip" data-e="${k.effect}" style="border:0;background:none;padding:0">${U.rating((d.ae || {})[k.k])}</button>`)).join('')}
        ${row('Monitoring (Stahl)', d => `<span class="small">${esc(((PA.stahl[d.stahl] || {}).tests || ['—']).slice(0, 2).join(' · '))}</span>`)}
        ${row('Key interactions (Stahl)', d => `<span class="small">${esc(((PA.stahl[d.stahl] || {}).interactions || ['—']).slice(0, 2).join(' · '))}</span>`)}
      </tbody></table>`;
      el.querySelectorAll('[data-e]').forEach(b => b.setAttribute('aria-pressed', b.dataset.e === hlEffect));
    };
    el.addEventListener('click', e => {
      const rm = e.target.closest('[data-rm]'); if (rm) { sel = sel.filter(x => x !== rm.dataset.rm); draw(); return; }
      const pre = e.target.closest('[data-pre]'); if (pre) { sel = pre.dataset.pre.split(','); hlEffect = null; draw(); return; }
      const ef = e.target.closest('[data-e]'); if (ef) { hlEffect = hlEffect === ef.dataset.e ? null : ef.dataset.e; draw(); }
    });
    el.querySelector('#cadd').addEventListener('change', e => {
      const v = e.target.value.toLowerCase(); const d = PA.DRUGS.find(x => x.name.toLowerCase() === v || x.name.toLowerCase().startsWith(v));
      if (d && !sel.includes(d.id) && sel.length < 4) { sel.push(d.id); draw(); } e.target.value = '';
    });
    draw();
  };

  /* ================= SIDE-EFFECT EXPLORER ================= */
  V.effects = function (el, params) {
    const id = params[0] && PA.EFFECT[params[0]] ? params[0] : null;
    if (!id) {
      const cats = U.uniq(PA.EFFECTS.map(e => e.kind === 'therapeutic' ? 'Therapeutic effects' : e.cat));
      el.innerHTML = V.head('N · Side-effect mechanism explorer', 'Why does this drug cause this side effect?', 'Search a symptom → see the receptors and pathways → the drugs producing it → why it happens → what to monitor. The same symptom can arise through different mechanisms.') +
        `<div class="card tight" style="margin-bottom:14px"><input id="eq" placeholder="Search (e.g. weight, EPS, QT, sexual, insomnia, bleeding)…" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--line-2);background:var(--surface);color:var(--text)"></div><div id="elist"></div>`;
      const draw = q => {
        q = (q || '').toLowerCase();
        el.querySelector('#elist').innerHTML = cats.map(c => {
          const es = PA.EFFECTS.filter(e => (e.kind === 'therapeutic' ? 'Therapeutic effects' : e.cat) === c && (!q || (e.name + ' ' + (e.aliases || []).join(' ') + ' ' + e.desc).toLowerCase().includes(q)));
          if (!es.length) return '';
          return `<h3 style="margin-top:14px">${esc(c)}</h3><div class="grid g4">${es.map(e => { const rs = U.receptorsForEffect(e.id); return `<a class="tile" href="#/effects/${e.id}"><span class="tk">${e.kind === 'therapeutic' ? '✓' : '⚠'} ${rs.slice(0, 4).map(PA.rl).join(' · ') || 'non-receptor'}</span><h3>${esc(e.name)}</h3></a>`; }).join('')}</div>`;
        }).join('');
      };
      el.querySelector('#eq').addEventListener('input', e => draw(e.target.value)); draw('');
      return;
    }
    const E = PA.EFFECT[id];
    const mechs = U.mechsForEffect(id);
    const causing = mechs.filter(m => m.type === (E.kind === 'therapeutic' ? 'ther' : 'adv'));
    const mitigating = mechs.filter(m => E.kind !== 'therapeutic' && m.type === 'ther');
    const drugs = U.drugsForEffect(id);
    const byMech = {}; causing.forEach(m => { const k = m.target ? `${m.target}|${m.actions.join('/')}` : 'other'; (byMech[k] = byMech[k] || []).push(m); });
    el.innerHTML = V.head('N · Side-effect explorer', `${E.kind === 'therapeutic' ? '✓' : '⚠'} ${esc(E.name)}`, esc(E.desc), '<a href="#/effects">Side-effect explorer</a>') +
      `<div class="split"><div class="stack">
        <div class="card"><h3>Symptom → mechanism → drug trace</h3><p class="small muted">Select a drug to trace its specific route to this effect; the brain map highlights the circuit.</p>
          <div class="chips" id="trace">${drugs.slice(0, 24).map(x => `<button class="chip" data-tr="${x.d.id}">${esc(x.d.name)}${x.rating != null ? ` <span class="muted">${'●'.repeat(x.rating)}</span>` : ''}</button>`).join('')}</div><div id="traceout" style="margin-top:10px"></div></div>
        <div class="card"><h3>Pharmacological routes to ${esc(E.name.toLowerCase())}</h3>${Object.values(byMech).length > 1 ? `<p class="small notice info">${Object.values(byMech).length} different mechanisms produce this effect — one symptom ≠ one receptor.</p>` : ''}${causing.map(m => U.chain(m, { showWhy: true })).join('') || '<p class="muted">No receptor-level mechanism mapped.</p>'}</div>
        ${mitigating.length ? `<div class="card"><h3>Mechanisms that reduce this risk</h3>${mitigating.map(m => U.chain(m)).join('')}</div>` : ''}
      </div><div class="stack"><div id="emap"></div>
        <div class="card"><h3>Drugs producing it</h3><table class="data"><thead><tr><th>Drug</th><th>Rating</th><th>Via</th></tr></thead><tbody>${drugs.slice(0, 40).map(x => `<tr><td>${U.drugLink(x.d.id)}</td><td>${x.rating != null ? U.rating(x.rating) : '—'}</td><td class="small">${x.ms.filter(y => y.m.type === (E.kind === 'therapeutic' ? 'ther' : 'adv')).map(y => y.m.target ? esc(PA.rl(y.m.target)) : 'multifactorial').join(', ') || '<span class="muted">(rating only)</span>'}</td></tr>`).join('')}</tbody></table></div>
        ${E.monitor ? `<div class="card"><h3>What to monitor</h3><ul class="bul">${E.monitor.map(x => `<li>${esc(x)}</li>`).join('')}</ul>${E.manage ? `<h3 style="margin-top:10px">Management considerations</h3><ul class="bul">${E.manage.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>` : ''}
        <div class="card"><h3>References</h3>${U.refList(U.uniq(mechs.flatMap(m => m.refs || [])))}</div></div></div>`;
    const regions = U.uniq(causing.flatMap(m => m.regions || []));
    const drawMap = (rs, label) => { const lit = {}; rs.forEach(r => lit[r] = { color: 'var(--warn)', strength: 3 }); PA.Brain.render(el.querySelector('#emap'), { lit, dimOthers: true, label, legend: false, onSelect: rg => location.hash = '#/atlas/' + rg }); };
    drawMap(regions, 'Regions involved in ' + E.name);
    el.querySelectorAll('[data-tr]').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('[data-tr]').forEach(x => x.setAttribute('aria-pressed', x === b));
      const d = PA.DRUG[b.dataset.tr]; const ms = U.mechsForDrug(d).filter(x => x.m.effect === id);
      el.querySelector('#traceout').innerHTML = ms.length ? ms.map(x => U.chain(x.m, { drug: d.name, title: (x.m.type === 'ther' ? 'Mitigating: ' : '') + PA.EFFECT[id].name })).join('') : `<p class="small muted">${esc(d.name)} is rated for this effect but no specific receptor mechanism is mapped in the atlas — see its drug page.</p>`;
      drawMap(U.uniq(ms.flatMap(x => x.m.regions || [])), d.name + ' → ' + E.name);
    }));
  };

  /* ================= PRESCRIBER MODE ================= */
  V.prescriber = function (el) {
    const on = U.store.get('prescriber', false);
    el.innerHTML = V.head('O · Clinical prescriber mode', 'Prescribing reference', 'Starting dose, therapeutic range, titration, half-life, renal/hepatic considerations and monitoring for every medication — condensed from Stahl\'s Prescriber\'s Guide (7th ed.), with post-2021 regulatory updates flagged.') +
      `<div class="notice" style="margin-bottom:12px">${esc(PA.DISCLAIMER)} Adult dosing unless stated; see each drug for pediatric, pregnancy and special-population notes.</div>
      <div class="card tight"><div class="row"><button class="toggle" id="pmode" aria-pressed="${on}">Prescriber mode: ${on ? 'ON — drug pages open on Prescribing' : 'OFF'}</button><input id="pq" placeholder="Filter drugs…" style="flex:1;padding:6px 10px;border-radius:8px;border:1px solid var(--line-2);background:var(--surface);color:var(--text)"><select id="pc" style="padding:6px;border-radius:8px;background:var(--surface);color:var(--text);border:1px solid var(--line-2)"><option value="">All classes</option>${Object.entries(PA.CLASSES).map(([k, c]) => `<option value="${k}">${esc(c.name)}</option>`).join('')}</select></div></div>
      <div class="card table-scroll" style="margin-top:12px"><table class="data"><thead><tr><th>Drug</th><th>Usual range</th><th>Start / titration</th><th>Half-life</th><th>Renal</th><th>Hepatic</th><th>Monitoring</th></tr></thead><tbody id="ptb"></tbody></table></div>`;
    el.querySelector('#pmode').addEventListener('click', e => { const v = !U.store.get('prescriber', false); U.store.set('prescriber', v); PA.App.syncPrescriber(); V.prescriber(el); });
    const draw = () => {
      const q = el.querySelector('#pq').value.toLowerCase(), c = el.querySelector('#pc').value;
      el.querySelector('#ptb').innerHTML = PA.DRUGS.filter(d => !d.substance && (!c || d.cls === c) && (!q || d.name.toLowerCase().includes(q))).map(d => {
        const S = PA.stahl[d.stahl] || {}; const R = d.rx || {};
        const first = (a, n) => esc((a || ['—']).slice(0, n || 1).join(' · '));
        return `<tr><td><a href="#/drug/${d.id}/rx"><b>${esc(d.name)}</b></a><div class="small muted">${esc(d.sub)}</div></td><td class="small">${first(S.dose || R.dose, 2)}</td><td class="small">${first(S.howToDose || R.dose, 1)}</td><td class="small">${esc(U.halfLife(d) || '—')}</td><td class="small">${first(S.renal)}</td><td class="small">${first(S.hepatic)}</td><td class="small">${first(S.tests, 1)}</td></tr>`;
      }).join('');
    };
    el.querySelector('#pq').addEventListener('input', draw); el.querySelector('#pc').addEventListener('change', draw); draw();
  };
})();
