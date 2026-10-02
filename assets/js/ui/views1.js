/* Views: home, brain atlas, neurotransmitter systems, receptor atlas, circuits. */
(function () {
  const U = PA.U, esc = U.esc, V = PA.V = PA.V || {};

  const head = (eyebrow, title, lead, crumbs) => `<div class="page-head">${crumbs ? `<div class="crumbs">${crumbs}</div>` : ''}<div class="eyebrow">${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
  V.head = head;

  /* ================= HOME ================= */
  V.home = function (el) {
    const tiles = [
      ['A', '#/atlas', 'Brain Atlas', 'Click any region; place a drug on the brain.'],
      ['B', '#/nt/5HT', 'Neurotransmitter Systems', 'DA, 5-HT, NE, GABA, glutamate, ACh, histamine, orexin, opioids.'],
      ['C', '#/receptors', 'Receptor Atlas', 'Signalling, location, pre vs post, drugs.'],
      ['D', '#/circuits', 'Psychiatric Circuits', 'Dopamine pathways, reward, sleep–wake, orexin, inverted-U.'],
      ['E–L', '#/class/antidepressant', 'Drug classes', 'Antidepressants → dementia pharmacology.'],
      ['⇅', '#/sort/antipsychotic', 'Sort & rank antipsychotics', 'Re-rank by any receptor or side effect — watch the rows move.'],
      ['M', '#/compare', 'Compare drugs', 'Fingerprints side-by-side, click an adverse effect.'],
      ['N', '#/effects', 'Side-effect explorer', 'Symptom → receptor → drug → why.'],
      ['O', '#/prescriber', 'Prescriber mode', 'Dosing, PK, monitoring (Stahl-based).'],
      ['P', '#/whatif', '"What if…" simulator', 'Manipulate transmission and predict effects.'],
      ['★', '#/drug/mirtazapine', 'Flagship: Mirtazapine', 'Radial receptor map, α2 synapse, dose explorer.'],
      ['★', '#/drug/clozapine', 'Flagship: Clozapine', 'Receptor profile vs multifactorial toxicity.'],
      ['★', '#/partial', 'Partial agonism', 'Why ambient dopamine changes what a drug does.']
    ];
    const brainHtml = PA.Brain.svg({ projections: PA.PROJECTIONS.filter(p => ['DA', '5HT', 'NE'].includes(p.nt)), hideNuclei: true }).svg;
    el.innerHTML = `<div class="hero"><div>
        <div class="page-head"><div class="eyebrow">Interactive psychopharmacology atlas</div><h1>What does this drug do to the brain — and how does that produce both its therapeutic effects and its side effects?</h1>
        <p class="lead">Trace every medication from molecular target to receptor signalling, brain circuit, network effect and clinical outcome. Learn to reason from a receptor profile instead of memorising lists.</p></div>
        <div class="flowline" aria-label="Core teaching model">
          <b>Drug</b> → primary target → receptor / transporter effect → neuronal signalling → region / circuit → network effect → <b>clinical effect</b><br>
          <b>Off-target receptor</b> → physiological consequence → <b>adverse effect</b></div>
        <div class="row" style="margin-top:16px"><a class="btn primary" href="#/drug/mirtazapine">Start with a drug: mirtazapine</a><a class="btn" href="#/receptors/H1">Start with a receptor: H1</a><a class="btn" href="#/effects/akathisia">Start with a symptom: akathisia</a><a class="btn" href="#/atlas/nac">Start with a region: NAc</a></div>
      </div><div class="brain-frame" aria-hidden="true">${brainHtml}</div></div>
      <div class="grid g4">${tiles.map(([k, h, t, p], i) => `<a class="tile" href="${h}" style="--tc:${['var(--nt-DA)', 'var(--nt-5HT)', 'var(--nt-NE)', 'var(--nt-GABA)', 'var(--nt-GLU)', 'var(--nt-ACH)', 'var(--nt-HIS)', 'var(--nt-ORX)', 'var(--nt-OPI)', 'var(--nt-MEL)', 'var(--nt-ECB)', 'var(--nt-DA)', 'var(--nt-5HT)'][i % 13]}"><span class="tk">${k}</span><h3>${esc(t)}</h3><p>${esc(p)}</p></a>`).join('')}</div>
      <div class="grid g2" style="margin-top:22px">
        <div class="card"><h3>Evidence tags used throughout</h3><ul class="clean">${Object.keys(PA.EVIDENCE).map(k => `<li>${U.ev(k)} <span class="small muted">${esc(PA.EVIDENCE[k].desc)}</span></li>`).join('')}</ul></div>
        <div class="card"><h3>An important scientific principle</h3>
          <p>Psychiatric disorders involve <b>distributed networks</b> and interacting systems. Depression is not simply "low serotonin" (Moncrieff 2022); schizophrenia is not simply "too much dopamine" (Howes & Kapur 2009). Neurotransmitters are components of circuits and regulatory systems — where this atlas uses simplified models, they are labelled ${U.ev('SIMP')}.</p>
          <p class="small">${U.refInline(['35854107', '19325164', '27256556'])}</p>
          <h4 style="margin-top:12px">Sources</h4><p class="small">Primary prescribing reference: Stahl SM. <i>Stahl's Essential Psychopharmacology: Prescriber's Guide</i>, 7th ed. (Cambridge University Press, 2021), condensed into structured data. Mechanistic claims link to verified PubMed records (PMID/DOI). Post-2021 regulatory changes are flagged with their source.</p>
          <p class="notice small">${esc(PA.DISCLAIMER)}</p></div></div>`;
  };

  /* ================= BRAIN ATLAS ================= */
  V.atlas = function (el, params) {
    const sel = params[0] && PA.REGION[params[0]] ? params[0] : null;
    const placeId = params[0] === 'place' ? params[1] : (U.store.get('placedDrug', null));
    const placed = placeId && PA.DRUG[placeId] ? PA.DRUG[placeId] : null;
    let ntFilter = U.store.get('atlasNT', ['DA', '5HT', 'NE']);
    el.innerHTML = head('A · Brain Atlas', 'Functional brain map', 'A schematic functional neuroanatomy map optimised for teaching (not MRI-accurate). Lateral structures are projected onto a mid-sagittal view. Click a region, filter projections, or <b>put a drug on the brain</b>.') +
      `<div class="split"><div>
        <div class="card tight" style="margin-bottom:10px"><div class="row">
          <label for="place" class="small"><b>Put a drug on the brain:</b></label>
          <input id="place" list="druglist" placeholder="e.g. mirtazapine, risperidone, bupropion" style="flex:1;min-width:200px;padding:6px 10px;border-radius:8px;border:1px solid var(--line-2);background:var(--surface);color:var(--text)" value="${placed ? esc(placed.name) : ''}">
          <datalist id="druglist">${PA.DRUGS.map(d => `<option value="${esc(d.name)}">`).join('')}</datalist>
          ${placed ? '<button class="btn small" id="clearplace">Clear</button>' : ''}</div>
          <div class="row" style="margin-top:8px"><span class="small muted">Projections:</span>${Object.keys(PA.NT_SYSTEMS).map(k => `<button class="chip" data-nt="${k}" aria-pressed="${ntFilter.includes(k)}">${U.ntDot(k)}${esc(PA.NT[k].short)}</button>`).join('')}</div></div>
        <div id="map"></div>
        <details class="card" style="margin-top:12px"><summary><b>Text list of all regions</b> (accessible alternative)</summary>${PA.Brain.textList()}</details>
      </div><div id="panel" class="sticky"></div></div>`;
    const map = el.querySelector('#map'), panel = el.querySelector('#panel');
    function draw() {
      let lit = {}, projections = PA.PROJECTIONS.filter(p => ntFilter.includes(p.nt));
      if (placed) {
        const rm = U.regionsForDrug(placed);
        Object.entries(rm).forEach(([rid, ts]) => {
          const best = ts.slice().sort((a, b) => b.aff - a.aff)[0];
          const rec = PA.RECEPTOR[best.r];
          lit[rid] = { color: (PA.NT[rec.nt] || PA.NT.OTHER).color, strength: best.aff, badge: ts.sort((a, b) => b.aff - a.aff).slice(0, 2).map(t => `${PA.rl(t.r)} ${U.actGlyph(t.action)}`).join(' · ') + (ts.length > 2 ? ` +${ts.length - 2}` : '') };
        });
        const circs = U.circuitsForDrug(placed);
        projections = PA.PROJECTIONS.filter(p => circs.includes(p.circuit) || ntFilter.includes(p.nt) && false);
        if (!projections.length) projections = PA.PROJECTIONS.filter(p => ntFilter.includes(p.nt));
      }
      PA.Brain.render(map, { selected: sel, lit, dimOthers: !!placed, projections, label: placed ? `${placed.name} placed on the brain` : 'Brain atlas', onSelect: id => { location.hash = '#/atlas/' + id; } });
      panel.innerHTML = sel ? regionPanel(PA.REGION[sel]) : placed ? placePanel(placed) : `<div class="card"><h3>Select a region</h3><p class="muted">Click or tab to any structure. Each region lists its transmitters, projections, receptor populations, functions, disorders and the medications acting there.</p><h4>Try</h4><div class="chips">${['nac', 'vta', 'lc', 'draphe', 'pituitary', 'amygdala', 'tmn', 'dlpfc'].map(id => `<a class="chip" href="#/atlas/${id}">${esc(PA.REGION[id].name)}</a>`).join('')}</div><h4 style="margin-top:12px">Or place a drug</h4><div class="chips">${['mirtazapine', 'risperidone', 'bupropion', 'clozapine', 'methylphenidate', 'suvorexant'].map(id => `<a class="chip" href="#/atlas/place/${id}">${esc(PA.DRUG[id].name)}</a>`).join('')}</div></div>`;
    }
    el.querySelector('#place').addEventListener('change', e => {
      const v = e.target.value.toLowerCase().trim();
      const d = PA.DRUGS.find(x => x.name.toLowerCase() === v) || PA.DRUGS.find(x => x.name.toLowerCase().startsWith(v)) || PA.DRUGS.find(x => x.id === v);
      if (d) { U.store.set('placedDrug', d.id); location.hash = '#/atlas/place/' + d.id; }
    });
    const cp = el.querySelector('#clearplace'); if (cp) cp.addEventListener('click', () => { U.store.set('placedDrug', null); location.hash = '#/atlas'; });
    el.querySelectorAll('[data-nt]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.nt; ntFilter = ntFilter.includes(k) ? ntFilter.filter(x => x !== k) : ntFilter.concat(k);
      U.store.set('atlasNT', ntFilter); b.setAttribute('aria-pressed', ntFilter.includes(k)); draw();
    }));
    if (params[0] === 'place' && placed) U.store.set('placedDrug', placed.id);
    draw();
  };

  function regionPanel(r) {
    const recs = U.uniq(r.receptors || []);
    const drugsBy = recs.map(rid => ({ rid, ds: U.drugsForReceptor(rid).filter(x => x.t.aff >= 3).slice(0, 8) })).filter(x => x.ds.length);
    const circs = PA.CIRCUITS.filter(c => c.regions.includes(r.id));
    const outP = PA.PROJECTIONS.filter(p => p.from === r.id), inP = PA.PROJECTIONS.filter(p => p.to === r.id);
    return `<div class="card"><div class="crumbs">${esc(r.group)}</div><h2>${esc(r.name)} <span class="muted">(${esc(r.abbr)})</span></h2>
      <div class="chips" style="margin-bottom:10px">${(r.nts || []).map(n => `<a class="chip" href="#/nt/${n}">${U.ntDot(n)}${esc((PA.NT[n] || PA.NT.OTHER).name)}</a>`).join('')}</div>
      ${r.children ? `<p class="small">Includes: ${r.children.map(U.regLink).join(', ')}</p>` : ''}
      ${r.note ? `<div class="notice info small" style="margin-bottom:10px">${esc(r.note)}</div>` : ''}
      <dl class="kv"><dt>Inputs</dt><dd>${esc(r.inputs || '')}</dd><dt>Outputs</dt><dd>${esc(r.outputs || '')}</dd></dl>
      ${outP.length || inP.length ? `<h4 style="margin-top:12px">Mapped projections</h4><ul class="clean small">${outP.map(p => `<li>${U.ntLine(p.nt)} → ${U.regLink(p.to)} <span class="muted">${esc(PA.NT[p.nt].short)}</span></li>`).join('')}${inP.map(p => `<li>${U.ntLine(p.nt)} ← ${U.regLink(p.from)} <span class="muted">${esc(PA.NT[p.nt].short)}</span></li>`).join('')}</ul>` : ''}
      <h4 style="margin-top:12px">Receptor populations</h4><div class="chips">${recs.map(rid => PA.RECEPTOR[rid] ? `<a class="chip" href="#/receptors/${rid}">${U.ntDot(PA.RECEPTOR[rid].nt)}${esc(PA.rl(rid))}</a>` : '').join('')}</div>
      <h4 style="margin-top:12px">Psychiatric functions</h4><ul class="bul">${(r.functions || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <h4 style="margin-top:12px">Relevant disorders</h4><ul class="bul">${(r.disorders || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      ${circs.length ? `<h4 style="margin-top:12px">Circuits</h4><div class="chips">${circs.map(c => `<a class="chip" href="#/circuits/${c.id}">${esc(c.name)}</a>`).join('')}</div>` : ''}
      ${drugsBy.length ? `<h4 style="margin-top:12px">Medications acting here (high-affinity targets)</h4>${drugsBy.map(x => `<p class="small" style="margin:.3em 0"><b>${U.recLink(x.rid)}</b>: ${x.ds.map(y => `${U.drugLink(y.d.id)} <span class="muted">${U.actGlyph(y.t.action)}</span>`).join(', ')}</p>`).join('')}` : ''}
    </div>`;
  }

  function placePanel(d) {
    const ms = U.mechsForDrug(d);
    const circs = U.circuitsForDrug(d);
    return `<div class="card"><div class="crumbs">Placed on the brain</div><h2>${U.drugLink(d.id)}</h2>
      ${U.fingerprint(d)}<div style="margin-top:8px">${U.fpLegend()}</div>
      <h4 style="margin-top:12px">Where it acts</h4><ul class="clean small">${U.targets(d).map(t => { const r = PA.RECEPTOR[t.r]; return r ? `<li>${U.actGlyph(t.action)} <b>${U.recLink(t.r)}</b> → ${(r.regions || []).slice(0, 6).map(U.regLink).join(', ') || '<span class="muted">peripheral / intracellular</span>'}</li>` : ''; }).join('')}</ul>
      ${circs.length ? `<h4 style="margin-top:12px">Circuits engaged</h4><div class="chips">${circs.map(c => `<a class="chip" href="#/circuits/${c}">${esc(PA.CIRCUIT[c].name)}</a>`).join('')}</div>` : ''}
      <h4 style="margin-top:12px">Predicted effects</h4><div class="chips">${U.uniq(ms.map(x => x.m.effect)).map(e => `<a class="chip" href="#/effects/${e}">${ms.find(x => x.m.effect === e).m.type === 'ther' ? '✓' : '⚠'} ${esc(PA.EFFECT[e] ? PA.EFFECT[e].name : e)}</a>`).join('')}</div>
      <p style="margin-top:12px"><a class="btn small primary" href="#/drug/${d.id}">Open full ${esc(d.name)} module →</a></p></div>`;
  }

  /* ================= NEUROTRANSMITTER SYSTEMS ================= */
  V.nt = function (el, params) {
    const id = params[0] && PA.NT_SYSTEMS[params[0]] ? params[0] : '5HT';
    const S = PA.NT_SYSTEMS[id];
    const tabs = Object.keys(PA.NT_SYSTEMS).map(k => `<a class="chip" href="#/nt/${k}" aria-current="${k === id}" style="${k === id ? 'border-color:var(--accent);color:var(--text)' : ''}">${U.ntDot(k)}${esc(PA.NT_SYSTEMS[k].title)}</a>`).join('');
    el.innerHTML = head('B · Neurotransmitter systems', `${U.ntLine(id)} ${esc(S.title)}`, esc(S.summary)) +
      `<div class="chips" style="margin-bottom:14px">${tabs}</div>
      <div class="notice" style="margin-bottom:14px"><b>Avoid oversimplification:</b> ${esc(S.caution)} ${U.ev('SIMP')}</div>
      <div class="split"><div id="ntmap"></div><div class="stack" id="ntside"></div></div>
      <div id="ntextra" style="margin-top:18px"></div>
      <h3 style="margin-top:18px">References</h3>${U.refList(S.refs)}`;
    const projections = PA.PROJECTIONS.filter(p => p.nt === id);
    const lit = {}; S.sources.forEach(s => { lit[s] = { color: PA.NT[id].color, strength: 3, badge: 'source' }; });
    PA.Brain.render(el.querySelector('#ntmap'), { projections, lit, label: S.title + ' projections', onSelect: rid => location.hash = '#/atlas/' + rid });
    el.querySelector('#ntside').innerHTML = `<div class="card"><h3>Receptors</h3><p class="small muted">Click a subtype for signalling, location, pre/post roles and drugs.</p>
      <div class="chips">${S.receptors.map(r => `<a class="chip" href="#/receptors/${r}">${esc(PA.rl(r))} <span class="muted">${esc((PA.RECEPTOR[r] || {}).coupling || '')}</span></a>`).join('')}</div></div>
      <div class="card"><h3>Sources</h3><ul class="clean">${S.sources.map(s => `<li>${U.regLink(s)}</li>`).join('')}</ul></div>`;
    const extra = el.querySelector('#ntextra');
    if (id === '5HT') {
      extra.innerHTML = `<h2>Serotonin receptor subtypes</h2><div class="card table-scroll"><table class="data"><thead><tr><th>Receptor</th><th>Type / G protein</th><th>Second messenger</th><th>Net effect</th><th>Key locations</th><th>Drugs (examples)</th></tr></thead><tbody>
        ${['5HT1A', '5HT1B', '5HT2A', '5HT2C', '5HT3', '5HT4', '5HT7'].map(r => { const R = PA.RECEPTOR[r]; return `<tr><td><a href="#/receptors/${r}"><b>${esc(PA.rl(r))}</b></a></td><td>${esc(R.family)} · ${esc(R.coupling)}</td><td class="small">${esc(R.cascade.slice(1, 3).join(' → '))}</td><td>${esc(R.tone)}</td><td class="small">${R.regions.slice(0, 4).map(U.regLink).join(', ')}</td><td class="small">${U.drugsForReceptor(r).slice(0, 5).map(x => U.drugLink(x.d.id)).join(', ')}</td></tr>`; }).join('')}</tbody></table></div>
        <h2 style="margin-top:18px">Autoreceptor vs postsynaptic 5-HT1A</h2><div id="syn"></div>`;
      PA.W.synapse(extra.querySelector('#syn'), { nt: '5HT', autoName: '5-HT1A autoreceptor', title: '5-HT1A: somatodendritic autoreceptor vs postsynaptic receptor' });
    } else if (id === 'NE') {
      extra.innerHTML = `<h2>Adrenergic receptors</h2><div class="grid g3">${['A1', 'A2', 'B1', 'B2', 'B3', 'NET'].map(r => recCard(r)).join('')}</div><h2 style="margin-top:18px">α2 autoreceptor: block it → ↑ NE release</h2><div id="syn"></div>`;
      PA.W.synapse(extra.querySelector('#syn'), { nt: 'NE', autoName: 'α2 autoreceptor', title: 'α2 autoreceptor on noradrenergic terminal' });
    } else if (id === 'DA') {
      extra.innerHTML = `<h2>Place a medication on the dopamine map</h2><div class="card"><div class="chips" id="dasel">${['haloperidol', 'risperidone', 'aripiprazole', 'clozapine', 'methylphenidate', 'amphetamine', 'bupropion', 'valbenazine', 'xanomeline_trospium'].map(k => `<button class="chip" data-d="${k}">${esc(PA.DRUG[k].name)}</button>`).join('')}</div><div id="daout" style="margin-top:12px"></div></div>
        <div class="grid g3" style="margin-top:14px">${['D1', 'D2', 'D3', 'DAT', 'VMAT2'].map(r => recCard(r)).join('')}</div>`;
      const pathways = ['mesolimbic', 'mesocortical', 'nigrostriatal', 'tuberoinfundibular'];
      const daEffect = d => {
        const ms = U.mechsForDrug(d);
        return pathways.map(p => { const pm = ms.filter(x => x.m.circuit === p); return `<tr><td><a href="#/circuits/${p}">${esc(PA.CIRCUIT[p].name)}</a></td><td>${pm.length ? pm.map(x => `${x.m.type === 'ther' ? '✓' : '⚠'} ${esc(PA.EFFECT[x.m.effect].name)} ${U.ev(x.m.ev, { short: true })}`).join('<br>') : '<span class="muted">No major predicted change</span>'}</td></tr>`; }).join('');
      };
      extra.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => {
        extra.querySelectorAll('[data-d]').forEach(x => x.setAttribute('aria-pressed', x === b));
        const d = PA.DRUG[b.dataset.d];
        extra.querySelector('#daout').innerHTML = `<h3>${U.drugLink(d.id)}</h3><table class="data"><thead><tr><th>Pathway</th><th>Predicted change in dopamine signalling</th></tr></thead><tbody>${daEffect(d)}</tbody></table>`;
        const lit = {}; U.targets(d).forEach(t => { const R = PA.RECEPTOR[t.r]; if (R && R.nt === 'DA' || t.r === 'M4') (R.regions || []).forEach(rg => lit[rg] = { color: PA.NT.DA.color, strength: t.aff, badge: `${PA.rl(t.r)} ${U.actGlyph(t.action)}` }); });
        PA.Brain.render(el.querySelector('#ntmap'), { projections, lit, dimOthers: true, label: d.name + ' on dopamine pathways', onSelect: rid => location.hash = '#/atlas/' + rid });
      }));
    } else if (id === 'GABA') {
      extra.innerHTML = `<h2>GABA-A vs GABA-B</h2><div class="grid g2">${recCard('GABAA')}${recCard('GABAB')}</div>
        <h2 style="margin-top:18px">How drugs act on the GABA system</h2><div class="card table-scroll"><table class="data"><thead><tr><th>Drug / class</th><th>Site</th><th>Mechanism</th><th>Direct or indirect?</th></tr></thead><tbody>
        <tr><td>Benzodiazepines</td><td>GABA-A α/γ2 interface</td><td>PAM — ↑ <b>frequency</b> of channel opening; requires GABA (ceiling)</td><td><b>Direct</b> (allosteric) ${U.ev('EST')}</td></tr>
        <tr><td>Barbiturates</td><td>GABA-A (β-subunit TM site)</td><td>↑ <b>duration</b> of opening; at high dose opens channel without GABA → no ceiling</td><td><b>Direct</b> ${U.ev('EST')}</td></tr>
        <tr><td>Z-drugs (zolpidem, zaleplon, eszopiclone)</td><td>Benzodiazepine site, α1-preferring</td><td>PAM — hypnotic with less anxiolysis/muscle relaxation</td><td><b>Direct</b> ${U.ev('STR')}</td></tr>
        <tr><td>Alcohol</td><td>GABA-A (esp. δ-containing) + NMDA, others</td><td>Multiple modulatory actions; endorphin release</td><td><b>Direct (multiple targets)</b> ${U.ev('STR')}</td></tr>
        <tr><td>Neurosteroids (brexanolone, zuranolone)</td><td>GABA-A (incl. extrasynaptic δ)</td><td>PAM at neurosteroid site</td><td><b>Direct</b> ${U.ev('EST')}</td></tr>
        <tr><td>Gabapentin, pregabalin</td><td>α2δ subunit of presynaptic Ca²⁺ channels</td><td>↓ Ca²⁺ entry → ↓ glutamate/NE release. <b>Not</b> GABA receptor agonists</td><td><b>Indirect</b> — modulates excitatory transmission ${U.ev('STR')}</td></tr>
        <tr><td>Valproate</td><td>GABA-T, GAD, NaV, others</td><td>↑ GABA availability (partial), Na⁺ channel block</td><td><b>Indirect</b> ${U.ev('PROP')}</td></tr>
        <tr><td>Tiagabine · vigabatrin</td><td>GAT-1 · GABA-T</td><td>↓ reuptake · ↓ breakdown</td><td><b>Indirect</b> ${U.ev('EST')}</td></tr>
        <tr><td>Baclofen · sodium oxybate</td><td>GABA-B</td><td>Agonist (oxybate partly)</td><td><b>Direct (GABA-B)</b> ${U.ev('EST')}</td></tr></tbody></table></div>
        <div class="card" style="margin-top:14px"><h3>Frequency vs duration</h3>${U.chainFromArray(['Benzodiazepine binds α/γ2', 'GABA binding affinity ↑', 'Channel opens MORE OFTEN', 'Cl⁻ influx ↑ (only when GABA is present)', 'Ceiling effect → wider safety margin'])}${U.chainFromArray(['Barbiturate binds', 'Each opening lasts LONGER', 'High dose: opens channel WITHOUT GABA', 'No ceiling', 'Coma, respiratory arrest in overdose'])}<p class="small">${U.refInline(['2471436'])}</p></div>`;
    } else if (id === 'GLU') {
      extra.innerHTML = `<h2>From glutamate release to plasticity</h2><div class="card"><div class="row"><button class="btn" id="gstep">Next step ▶</button><button class="btn" id="greset">Reset</button><span class="spacer"></span>${U.ev('EST')}</div><div id="gseq" style="margin-top:10px"></div></div>
        <div class="grid g4" style="margin-top:14px">${['NMDA', 'AMPA', 'KAINATE', 'MGLUR'].map(r => recCard(r)).join('')}</div>
        <h2 style="margin-top:18px">Drugs acting on glutamate transmission</h2><div class="card table-scroll"><table class="data"><thead><tr><th>Drug</th><th>Action</th><th>Teaching point</th></tr></thead><tbody>
          <tr><td>${U.drugLink('ketamine')} / ${U.drugLink('esketamine')}</td><td>NMDA open-channel "trapping" block</td><td>Rapid antidepressant (proposed: disinhibition → glutamate burst → AMPA → BDNF/mTOR) ${U.ev('PROP')}</td></tr>
          <tr><td>${U.drugLink('memantine')}</td><td>Low-affinity, fast off-rate, voltage-dependent NMDA block</td><td>Blocks tonic pathological activation, spares synaptic signalling ${U.ev('STR')}</td></tr>
          <tr><td>${U.drugLink('lamotrigine')}</td><td>Use-dependent NaV block</td><td>↓ Presynaptic glutamate release (Leach 1986) ${U.ev('STR')}</td></tr>
          <tr><td>Topiramate · ${U.drugLink('carbamazepine')} · ${U.drugLink('valproate')}</td><td>NaV block; topiramate also AMPA/kainate block</td><td>Glutamatergic anticonvulsants — mood effects vary ${U.ev('PROP')}</td></tr>
          <tr><td>${U.drugLink('acamprosate')}</td><td>Proposed NMDA/mGluR5 modulation</td><td>Mechanism incompletely understood ${U.ev('UNK')}</td></tr>
          <tr><td>${U.drugLink('pregabalin')} · ${U.drugLink('gabapentin')}</td><td>α2δ</td><td>↓ Glutamate release ${U.ev('STR')}</td></tr></tbody></table></div>`;
      const seq = ['Glutamate released from presynaptic terminal', 'Binds AMPA receptors → Na⁺ influx → depolarisation', 'Depolarisation expels Mg²⁺ from the NMDA pore', 'NMDA opens (glutamate + glycine/D-serine bound) → Ca²⁺ influx', 'Ca²⁺ → CaMKII, calcineurin, CREB signalling', 'AMPA receptor insertion & gene expression → synaptic plasticity (LTP)'];
      let k = 0; const show = () => { el.querySelector('#gseq').innerHTML = U.chainFromArray(seq.slice(0, k + 1), seq.slice(0, k + 1).map((_, i) => i === 0 ? 'drug' : i === seq.length - 1 ? 'clinical' : i < 2 ? 'direct' : 'signal')) + (k === 3 ? '<p class="small muted">NMDA = coincidence detector: needs presynaptic glutamate AND postsynaptic depolarisation.</p>' : ''); };
      el.querySelector('#gstep').addEventListener('click', () => { k = Math.min(seq.length - 1, k + 1); show(); });
      el.querySelector('#greset').addEventListener('click', () => { k = 0; show(); }); show();
    } else if (id === 'ORX') {
      extra.innerHTML = `<div class="grid g2">${recCard('OX1R')}${recCard('OX2R')}</div><p style="margin-top:12px"><a class="btn" href="#/circuits/orexin">Open the orexin circuit animation →</a> <a class="btn" href="#/circuits/sleep">Sleep–wake switch →</a></p>`;
    } else if (id === 'OPI') {
      extra.innerHTML = `<div class="grid g3">${['MOR', 'KOR', 'DOR'].map(recCard).join('')}</div><div id="rw" style="margin-top:14px"></div>`;
      PA.W.reward(extra.querySelector('#rw'));
    } else {
      extra.innerHTML = `<div class="grid g3">${S.receptors.map(recCard).join('')}</div>`;
    }
  };

  function recCard(rid) {
    const R = PA.RECEPTOR[rid]; if (!R) return '';
    return `<a class="tile" href="#/receptors/${rid}"><span class="tk">${esc(R.family)} · ${esc(R.coupling)}</span><h3>${esc(PA.rl(rid))}</h3><p>${esc(R.tone)} — ${esc((R.physiology || [])[0] || '')}</p></a>`;
  }
  V.recCard = recCard;

  /* ================= RECEPTOR ATLAS ================= */
  V.receptors = function (el, params) {
    const id = params[0] ? decodeURIComponent(params[0]) : null;
    if (id && PA.RECEPTOR[id]) return receptorDetail(el, PA.RECEPTOR[id]);
    const fams = U.uniq(PA.RECEPTORS.map(r => r.nt));
    el.innerHTML = head('C · Receptor Atlas', 'Searchable receptor database', 'Every receptor follows the same framework: ligand → G protein / channel → intracellular pathway → physiological effect → anatomical location → psychiatric relevance → medications.') +
      `<div class="card tight" style="margin-bottom:14px"><input id="rq" placeholder="Filter receptors (e.g. Gq, H1, 5-HT2, transporter, presynaptic)…" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--line-2);background:var(--surface);color:var(--text)"></div><div id="rlist"></div>`;
    const draw = q => {
      q = (q || '').toLowerCase();
      el.querySelector('#rlist').innerHTML = fams.map(f => {
        const rs = PA.RECEPTORS.filter(r => r.nt === f && (!q || [r.id, r.name, r.family, r.coupling, PA.rl(r.id), r.tone, JSON.stringify(r.sites)].join(' ').toLowerCase().includes(q)));
        if (!rs.length) return '';
        return `<h3 style="margin-top:16px">${U.ntDot(f)} ${esc((PA.NT[f] || PA.NT.OTHER).name)}</h3><div class="grid g4">${rs.map(r => recCard(r.id)).join('')}</div>`;
      }).join('') || '<p class="muted">No matches.</p>';
    };
    el.querySelector('#rq').addEventListener('input', e => draw(e.target.value)); draw('');
  };

  function receptorDetail(el, R) {
    const drugs = U.drugsForReceptor(R.id);
    const mechs = PA.MECHANISMS.filter(m => m.target === R.id);
    const byAction = {}; mechs.forEach(m => m.actions.forEach(a => { (byAction[a] = byAction[a] || []).push(m); }));
    const lit = {}; (R.regions || []).forEach(rg => lit[rg] = { color: (PA.NT[R.nt] || PA.NT.OTHER).color, strength: 3 });
    el.innerHTML = head('C · Receptor Atlas', `${U.ntDot(R.nt)} ${esc(R.name)}`, '', `<a href="#/receptors">Receptor Atlas</a> › ${esc((PA.NT[R.nt] || PA.NT.OTHER).name)}`) +
      `<div class="split"><div class="stack">
        <div class="card"><div class="row"><span class="chip">${esc(R.family)}</span><span class="chip">${esc(R.coupling)}</span><span class="chip">${esc(R.tone)}</span></div>
          <h4 style="margin-top:12px">Signalling cascade</h4>${U.chainFromArray(R.cascade, R.cascade.map((_, i) => i === 0 ? 'direct' : i === R.cascade.length - 1 ? 'network' : 'signal'))}
          <div class="grid g2" style="margin-top:12px">
            <div class="chain-wrap"><h4>Presynaptic</h4><p class="small" style="margin:0">${esc((R.sites && R.sites.pre) || 'No major presynaptic role.')}</p></div>
            <div class="chain-wrap"><h4>Postsynaptic</h4><p class="small" style="margin:0">${esc((R.sites && R.sites.post) || 'No major postsynaptic role.')}</p></div></div></div>
        ${R.synapse ? '<div id="syn"></div>' : ''}
        <div class="card"><h3>Physiological effects</h3><ul class="bul">${(R.physiology || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          <h3 style="margin-top:12px">Psychiatric relevance</h3><ul class="bul">${(R.psych || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          ${R.agonism ? `<p class="small"><b>Agonism:</b> ${esc(R.agonism)}</p>` : ''}${R.antagonism ? `<p class="small"><b>Antagonism:</b> ${esc(R.antagonism)}</p>` : ''}</div>
        ${Object.keys(byAction).length ? `<div class="card"><h3>What happens when drugs act here</h3>${Object.entries(byAction).map(([a, ms]) => `<h4 style="margin-top:12px">${U.actGlyph(a)} ${esc(U.actLabel(a))}</h4>${ms.map(m => U.chain(m, { drug: PA.rl(R.id) + ' ' + PA.ACTIONS[a].verb })).join('')}`).join('')}</div>` : ''}
      </div><div class="stack">
        <div id="rmap"></div>
        <div class="card"><h3>Medications interacting with ${esc(PA.rl(R.id))}</h3>${drugs.length ? `<table class="data"><thead><tr><th>Drug</th><th>Action</th><th>Rel. affinity</th></tr></thead><tbody>${drugs.map(x => `<tr><td>${U.drugLink(x.d.id)}</td><td>${U.actGlyph(x.t.action)} ${esc(U.actLabel(x.t.action))}</td><td>${esc(PA.AFFINITY[x.t.aff].label)}${x.t.primary ? ' ★' : ''}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No drugs in this atlas target it directly.</p>'}</div>
        <div class="card"><h3>References</h3>${U.refList(R.refs)}</div></div></div>`;
    PA.Brain.render(el.querySelector('#rmap'), { lit, dimOthers: true, label: 'Regions expressing ' + R.name, legend: false, onSelect: rg => location.hash = '#/atlas/' + rg });
    if (R.synapse) {
      const nm = { A2: 'α2 autoreceptor', D2: 'D2 autoreceptor', '5HT1A': '5-HT1A autoreceptor', '5HT1B': '5-HT1B terminal autoreceptor', H3: 'H3 autoreceptor' }[R.id];
      PA.W.synapse(el.querySelector('#syn'), { nt: R.synapse.nt, autoName: nm, title: `${PA.rl(R.id)}: presynaptic vs postsynaptic` });
      el.querySelector('#syn').insertAdjacentHTML('beforeend', `<p class="small">${esc(R.synapse.blockEffect)}</p>`);
    }
  }

  /* ================= CIRCUITS ================= */
  V.circuits = function (el, params) {
    const id = params[0] && PA.CIRCUIT[params[0]] ? params[0] : null;
    if (!id) {
      el.innerHTML = head('D · Psychiatric circuits', 'Functional circuit maps', 'Each map shows the regions, transmitters, receptors and direction of a circuit, and animates what happens when a drug is added.') +
        `<div class="grid g3">${PA.CIRCUITS.map(c => `<a class="tile" href="#/circuits/${c.id}"><span class="tk">${U.ntDot(c.nt)} ${esc(PA.NT[c.nt].name)}</span><h3>${esc(c.name)}</h3><p>${esc(c.functions.slice(0, 2).join(' · '))}</p></a>`).join('')}</div>
        <h2 style="margin-top:22px">Adaptation & tolerance</h2><p><a class="btn" href="#/learn/adapt">Chronic exposure animations →</a> <a class="btn" href="#/learn/timecourse">Time course of drug action →</a></p>`;
      return;
    }
    const C = PA.CIRCUIT[id];
    const projections = PA.PROJECTIONS.filter(p => p.circuit === id || (id === 'reward' && ['mesolimbic', 'corticostriatal'].includes(p.circuit)) || (id === 'sleep' && ['sleep', 'orexin', 'arousal'].includes(p.circuit)) || (id === 'pfc_invu' && ['mesocortical', 'noradrenergic'].includes(p.circuit) && ['pfc', 'dlpfc'].includes(p.to)));
    const lit = {}; C.regions.forEach(r => lit[r] = { color: PA.NT[C.nt].color, strength: 2 });
    const drugs = U.uniq(PA.DRUGS.filter(d => U.circuitsForDrug(d).includes(id)).map(d => d.id));
    el.innerHTML = head('D · Psychiatric circuits', esc(C.name), '', '<a href="#/circuits">Circuits</a>') +
      `<div class="split"><div class="stack"><div id="cmap"></div>
        <div class="card"><h3>Normal flow</h3><div id="flow"></div>
          <h3 style="margin-top:14px">${esc(C.block.label)}</h3><div class="row"><button class="btn primary" id="animate">▶ Animate</button><span class="spacer"></span>${U.ev(C.block.ev)}</div><div id="blockflow" style="margin-top:8px"></div></div>
        ${id === 'tuberoinfundibular' ? `<div class="card"><h3>Prolactin under three conditions</h3><div class="grid g3"><div><div class="small">Normal DA</div><div class="meter good"><i style="width:20%"></i></div></div><div><div class="small">D2 antagonist</div><div class="meter bad"><i style="width:85%"></i></div></div><div><div class="small">D2 partial agonist</div><div class="meter good"><i style="width:15%"></i></div></div></div><p class="small muted">Conceptual. Aripiprazole commonly lowers prolactin; risperidone/paliperidone raise it the most.</p></div>` : ''}
        ${id === 'reward' ? '<div id="rw"></div>' : ''}
        ${id === 'pfc_invu' ? invertedU() : ''}
      </div><div class="stack">
        <div class="card"><h3>Functions</h3><ul class="bul">${C.functions.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
          <h3 style="margin-top:10px">Disorders</h3><ul class="bul">${C.disorders.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
          <h3 style="margin-top:10px">Direction</h3><p>${C.path.map(U.regLink).join(' → ')}</p>
          <h3 style="margin-top:10px">Regions</h3><div class="chips">${C.regions.map(r => `<a class="chip" href="#/atlas/${r}">${esc(PA.REGION[r].abbr)}</a>`).join('')}</div>
          <h3 style="margin-top:10px">Receptors</h3><div class="chips">${C.receptors.map(r => `<a class="chip" href="#/receptors/${r}">${esc(PA.rl(r))}</a>`).join('')}</div></div>
        <div class="card"><h3>Drugs with mechanisms in this circuit</h3><div class="chips">${drugs.map(d => `<a class="chip" href="#/drug/${d}">${esc(PA.DRUG[d].name)}</a>`).join('') || '<span class="muted">—</span>'}</div></div>
        <div class="card"><h3>References</h3>${U.refList(C.refs)}</div></div></div>`;
    PA.Brain.render(el.querySelector('#cmap'), { projections, lit, dimOthers: true, label: C.name, onSelect: rg => location.hash = '#/atlas/' + rg });
    el.querySelector('#flow').innerHTML = U.chainFromArray(C.steps, C.steps.map((_, i) => i === 0 ? 'circuit' : i === C.steps.length - 1 ? 'clinical' : 'signal'));
    const bf = el.querySelector('#blockflow');
    const showAll = () => { bf.innerHTML = U.chainFromArray(C.block.chain, C.block.chain.map((_, i) => i === 0 ? 'drug' : i >= C.block.chain.length - 2 ? 'clinical' : 'signal')); };
    el.querySelector('#animate').addEventListener('click', () => {
      if (U.reduced()) return showAll();
      let k = 0; bf.innerHTML = '';
      const tick = () => { k++; bf.innerHTML = U.chainFromArray(C.block.chain.slice(0, k), C.block.chain.slice(0, k).map((_, i) => i === 0 ? 'drug' : i >= C.block.chain.length - 2 ? 'clinical' : 'signal')); if (k < C.block.chain.length) setTimeout(tick, 700); };
      tick();
    });
    showAll();
    if (id === 'reward') PA.W.reward(el.querySelector('#rw'));
    if (id === 'pfc_invu') bindInvertedU(el);
  };

  function invertedU() {
    return `<div class="card"><div class="row"><h3 style="margin:0">Inverted-U: catecholamines and PFC performance</h3><span class="spacer"></span>${U.ev('STR')}</div>
      <div class="slider-row"><label for="iu">Catecholamine level in PFC</label><input id="iu" type="range" min="0" max="100" value="25"><span id="iuv" class="mono"></span></div><div id="iusvg"></div><p id="iut" class="small" aria-live="polite"></p>
      <p class="small">${U.refInline(['19455173', '17448997', '16806100'])}</p></div>`;
  }
  function bindInvertedU(el) {
    const f = x => Math.exp(-Math.pow((x - 55) / 24, 2));
    const upd = () => {
      const v = +el.querySelector('#iu').value;
      const pts = Array.from({ length: 51 }, (_, i) => `${i ? 'L' : 'M'}${20 + i * 9.2},${150 - f(i * 2) * 120}`).join(' ');
      el.querySelector('#iusvg').innerHTML = `<svg viewBox="0 0 500 170" role="img" aria-label="Inverted U curve"><path d="${pts}" style="fill:none;stroke:var(--accent)" stroke-width="3"/><circle cx="${20 + v * 4.6}" cy="${150 - f(v) * 120}" r="8" style="fill:var(--warn)"/><text x="20" y="166" style="fill:var(--muted);font-size:11px">too low (ADHD, fatigue)</text><text x="200" y="20" style="fill:var(--muted);font-size:11px">optimal (α2A + moderate D1)</text><text x="380" y="166" style="fill:var(--muted);font-size:11px">too high (stress)</text></svg>`;
      el.querySelector('#iuv').textContent = v < 35 ? 'low' : v < 75 ? 'optimal' : 'excessive';
      el.querySelector('#iut').textContent = v < 35 ? 'Weak α2A/D1 stimulation: noisy PFC network, distractibility. Stimulants or atomoxetine move the system rightward.' : v < 75 ? 'Optimal: α2A closes HCN channels on spines; moderate D1 sculpts network activity — working memory is strongest.' : 'Excess (stress, stimulant overdose): α1/β1 and excessive D1 → cAMP/PKC signalling opens K⁺ channels and disconnects networks — PFC goes "offline"; habitual responding takes over.';
    };
    el.querySelector('#iu').addEventListener('input', upd); upd();
  }
})();
