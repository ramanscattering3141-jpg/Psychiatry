/* Views: what-if simulator, partial agonism, learning modules, cases, quiz, references. */
(function () {
  const U = PA.U, esc = U.esc, V = PA.V;

  /* ================= WHAT-IF SIMULATOR ================= */
  PA.WHATIF = {
    incDA: { label: 'Increase dopamine', nt: 'DA', fx: [
      { r: 'nac', d: '↑', t: 'Reward, motivation, salience ↑ — excess: aberrant salience, psychosis-like (D2), reinforcement (D1)', ev: 'STR' },
      { r: 'caudate', d: '↑', t: 'Movement facilitation; excess → dyskinesias, stereotypy', ev: 'EST' },
      { r: 'dlpfc', d: '±', t: 'Depends on baseline tone (inverted-U): low → working memory improves; high → impairs', ev: 'STR', tone: true },
      { r: 'pituitary', d: '↓', t: 'Prolactin ↓ (D2 on lactotrophs)', ev: 'EST' },
      { r: 'ap', d: '↑', t: 'Nausea (CTZ D2)', ev: 'EST' }],
      teach: 'Same transmitter, opposite outcomes: D1 (Gs) vs D2 (Gi) receptors, ventral vs dorsal striatum, and the PFC inverted-U.' },
    decDA: { label: 'Decrease dopamine', nt: 'DA', fx: [
      { r: 'nac', d: '↓', t: 'Anhedonia, amotivation; reduced positive psychotic symptoms if they were present', ev: 'STR' },
      { r: 'putamen', d: '↓', t: 'Parkinsonism (bradykinesia, rigidity, tremor)', ev: 'EST' },
      { r: 'pituitary', d: '↑', t: 'Prolactin ↑', ev: 'EST' },
      { r: 'hypothalamus', d: '↑', t: 'Thermoregulatory instability (NMS-like risk with abrupt severe loss)', ev: 'PROP' }],
      teach: 'Global DA reduction (e.g. reserpine, VMAT2 inhibition) produces motor, motivational and endocrine effects simultaneously.' },
    inc5HT: { label: 'Increase serotonin', nt: '5HT', fx: [
      { r: 'draphe', d: '↓', t: 'Acutely: 5-HT1A AUTOreceptors slow raphe firing (brake)', ev: 'STR' },
      { r: 'amygdala', d: '±', t: 'Acute anxiety possible (5-HT2C); chronic anxiolysis after adaptation', ev: 'PROP' },
      { r: 'ap', d: '↑', t: 'Nausea (5-HT3)', ev: 'STR' },
      { r: 'spinal', d: '↑', t: 'Delayed ejaculation; at toxic levels clonus/hyperreflexia', ev: 'STR' },
      { r: 'vta', d: '↓', t: 'DA release restrained (5-HT2C on GABA interneurons) → emotional blunting, ↓ libido', ev: 'PROP' },
      { r: 'pvn', d: '↑', t: 'ADH ↑ → SIADH-type hyponatremia (elderly)', ev: 'CLIN' }],
      teach: 'Fourteen receptor subtypes with opposing coupling: "more serotonin" acts simultaneously at inhibitory 5-HT1A, excitatory 5-HT2A/2C and ion-channel 5-HT3 receptors — producing therapeutic and adverse effects at once.' },
    incNE: { label: 'Increase norepinephrine', nt: 'NE', fx: [
      { r: 'lc', d: '↓', t: 'α2 autoreceptors reduce LC firing (negative feedback)', ev: 'EST' },
      { r: 'dlpfc', d: '±', t: 'Moderate NE (α2A) strengthens working memory; high NE (α1, β) impairs', ev: 'STR', tone: true },
      { r: 'amygdala', d: '↑', t: 'Arousal, emotional memory consolidation (β)', ev: 'STR' },
      { r: 'spinal', d: '↓', t: 'Pain transmission ↓ (descending α2 inhibition)', ev: 'STR' },
      { r: 'brainstem', d: '↑', t: 'Peripheral sympathetic: ↑ BP, HR, sweating', ev: 'EST' }],
      teach: 'Receptor affinity sets the order of engagement: high-affinity α2A first (helpful), lower-affinity α1/β at high levels (harmful to PFC).' },
    blockD2: { label: 'Block D2', nt: 'DA', fx: [
      { r: 'nac', d: '↓', t: 'Antipsychotic effect (mesolimbic)', ev: 'STR', k: 'ther' },
      { r: 'putamen', d: '↓', t: 'EPS (nigrostriatal)', ev: 'EST' },
      { r: 'pituitary', d: '↑', t: 'Hyperprolactinemia (tuberoinfundibular)', ev: 'EST' },
      { r: 'ap', d: '↓', t: 'Antiemetic', ev: 'EST', k: 'ther' },
      { r: 'pfc', d: '↓', t: 'Possible secondary negative/cognitive worsening', ev: 'PROP' }],
      teach: 'A single receptor action has pathway-specific consequences — the central lesson of antipsychotic pharmacology.' },
    blockH1: { label: 'Block H1', nt: 'HIS', fx: [
      { r: 'cortex', d: '↓', t: 'Arousal ↓ → sedation', ev: 'EST' },
      { r: 'thalamus', d: '↓', t: 'Thalamocortical arousal ↓', ev: 'EST' },
      { r: 'arcuate', d: '↑', t: 'Appetite ↑ (hypothalamic AMPK) → weight gain', ev: 'STR' }],
      teach: 'Two circuits, one receptor: arousal (cortex/thalamus) and feeding (hypothalamus).' },
    blockM1: { label: 'Block muscarinic (M1–M3)', nt: 'ACH', fx: [
      { r: 'hippocampus', d: '↓', t: 'Memory encoding ↓; delirium risk', ev: 'EST' },
      { r: 'cortex', d: '↓', t: 'Attention ↓', ev: 'EST' },
      { r: 'putamen', d: '↑', t: 'EPS risk ↓ (rebalances striatal ACh/DA)', ev: 'CLIN', k: 'ther' }],
      periph: 'Peripheral: dry mouth, constipation, urinary retention, blurred vision, tachycardia.',
      teach: 'Central M1 vs peripheral M2/M3 effects; antimuscarinic action is protective for EPS but harmful for cognition.' },
    blockA1: { label: 'Block α1', nt: 'NE', fx: [
      { r: 'cortex', d: '↓', t: 'Arousal ↓ (contributes to sedation)', ev: 'PROP' },
      { r: 'draphe', d: '↓', t: 'Excitatory drive to 5-HT neurons ↓', ev: 'STR' }],
      periph: 'Peripheral: vasodilation → orthostatic hypotension, reflex tachycardia, priapism, nasal congestion.',
      teach: 'Mostly a peripheral (vascular) story — but central α1 contributes to arousal.' },
    activateGABAA: { label: 'Enhance GABA-A', nt: 'GABA', fx: [
      { r: 'amygdala', d: '↓', t: 'Anxiety ↓ (α2/α3)', ev: 'STR', k: 'ther' },
      { r: 'cortex', d: '↓', t: 'Sedation, anticonvulsant (α1)', ev: 'STR' },
      { r: 'hippocampus', d: '↓', t: 'Anterograde amnesia (α1/α5)', ev: 'STR' },
      { r: 'cerebellum', d: '↓', t: 'Ataxia, falls', ev: 'CLIN' },
      { r: 'brainstem', d: '↓', t: 'Respiratory drive ↓ (dangerous with opioids)', ev: 'EST' },
      { r: 'vta', d: '↑', t: 'DA neurons disinhibited (interneurons inhibited) → reinforcement', ev: 'STR' }],
      teach: 'Enhancing inhibition everywhere can paradoxically INCREASE output where the inhibited cells are themselves inhibitory (VTA disinhibition).' },
    blockNMDA: { label: 'Block NMDA', nt: 'GLU', fx: [
      { r: 'pfc', d: '±', t: 'Low dose: glutamate burst (interneuron disinhibition) → rapid antidepressant (proposed); higher: dissociation', ev: 'PROP' },
      { r: 'hippocampus', d: '↓', t: 'LTP / memory encoding impaired', ev: 'EST' },
      { r: 'thalamus', d: '±', t: 'Disrupted sensory gating → perceptual changes', ev: 'STR' },
      { r: 'habenula', d: '↓', t: 'Burst firing ↓ (proposed antidepressant mechanism)', ev: 'PROP' }],
      teach: 'Kinetics matter: ketamine (trapping) vs memantine (fast off-rate) produce very different effects at the same receptor.' },
    block5HT2A: { label: 'Block 5-HT2A', nt: '5HT', fx: [
      { r: 'cortex', d: '↓', t: 'Hallucinogenic-like signalling ↓ (pimavanserin)', ev: 'CLIN', k: 'ther' },
      { r: 'thalamus', d: '↑', t: 'Slow-wave sleep ↑', ev: 'CLIN', k: 'ther' },
      { r: 'putamen', d: '↑', t: 'Proposed ↑ nigrostriatal DA release → less EPS', ev: 'PROP', k: 'ther' }],
      teach: 'Several widely taught 5-HT2A effects are proposed rather than established — check the evidence tags.' },
    blockA2: { label: 'Block α2', nt: 'NE', fx: [
      { r: 'lc', d: '↑', t: 'Autoreceptor brake removed → NE release ↑', ev: 'STR' },
      { r: 'draphe', d: '↑', t: 'Heteroreceptor brake on 5-HT terminals removed → 5-HT ↑', ev: 'STR' },
      { r: 'dlpfc', d: '↓', t: 'Postsynaptic α2A blockade would weaken PFC networks (opposite of guanfacine)', ev: 'STR' }],
      teach: 'Presynaptic vs postsynaptic: the same receptor blocked at two sites has opposite functional consequences.' },
    activateMOR: { label: 'Activate μ-opioid', nt: 'OPI', fx: [
      { r: 'vta', d: '↑', t: 'GABA interneurons inhibited → DA disinhibited → reward', ev: 'STR' },
      { r: 'brainstem', d: '↓', t: 'Respiratory depression', ev: 'EST' },
      { r: 'lc', d: '↓', t: 'LC firing ↓ (withdrawal = rebound hyperactivity)', ev: 'STR' },
      { r: 'spinal', d: '↓', t: 'Nociceptive transmission ↓ (analgesia)', ev: 'EST', k: 'ther' }],
      periph: 'Peripheral: constipation, miosis.',
      teach: 'A Gi-coupled inhibitory receptor can still INCREASE dopamine — through disinhibition.' }
  };
  V.whatif = function (el) {
    let sel = U.store.get('whatif', ['blockD2']); let tone = 'normal';
    el.innerHTML = V.head('P · "What happens if…" simulator', 'Manipulate neurotransmission', 'Select one or more manipulations. The map shows predicted regional effects (▲ increase, ▼ decrease, ◆ depends). Learn why the same transmitter does different things depending on receptor subtype, location, pre- vs postsynaptic site, circuit and baseline tone.') +
      `<div class="notice" style="margin-bottom:12px">Qualitative teaching predictions, not a biophysical simulation. ${U.ev('SIMP')}</div>
      <div class="card tight"><div class="chips">${Object.entries(PA.WHATIF).map(([k, w]) => `<button class="chip" data-w="${k}" aria-pressed="${sel.includes(k)}">${U.ntDot(w.nt)}${esc(w.label)}</button>`).join('')}</div>
        <div class="row" style="margin-top:8px"><span class="small">Baseline PFC catecholamine tone:</span>${['low', 'normal', 'high'].map(t => `<button class="chip" data-tone="${t}" aria-pressed="${t === tone}">${t}</button>`).join('')}<span class="spacer"></span><button class="btn small" id="wclear">Clear</button></div></div>
      <div class="split" style="margin-top:12px"><div id="wmap"></div><div id="wout" class="stack"></div></div>`;
    const draw = () => {
      U.store.set('whatif', sel);
      const lit = {}; const rows = [];
      sel.forEach(k => { const w = PA.WHATIF[k]; w.fx.forEach(f => {
        let txt = f.t, dir = f.d;
        if (f.tone) { if (tone === 'low') { dir = '↑'; txt = 'Low baseline → moving toward the optimum: working memory/attention IMPROVE'; } else if (tone === 'high') { dir = '↓'; txt = 'High baseline (stress) → beyond the optimum: PFC function IMPAIRED'; } }
        rows.push({ k, w, f, txt, dir });
        const prev = lit[f.r];
        const sym = dir === '↑' ? '▲' : dir === '↓' ? '▼' : '◆';
        lit[f.r] = { color: f.k === 'ther' ? 'var(--good)' : dir === '±' ? 'var(--accent)' : 'var(--warn)', strength: 3, badge: (prev ? prev.badge + ' ' : '') + sym + ' ' + PA.NT[w.nt].short };
      }); });
      PA.Brain.render(el.querySelector('#wmap'), { lit, dimOthers: true, legend: false, label: 'Predicted effects', onSelect: r => location.hash = '#/atlas/' + r });
      el.querySelector('#wout').innerHTML = sel.length ? sel.map(k => { const w = PA.WHATIF[k]; return `<div class="card"><h3>${U.ntDot(w.nt)} ${esc(w.label)}</h3><table class="data"><tbody>${rows.filter(r => r.k === k).map(r => `<tr><td>${U.regLink(r.f.r)}</td><td style="font-size:1.1em">${r.dir === '↑' ? '▲' : r.dir === '↓' ? '▼' : '◆'}</td><td class="small">${esc(r.txt)} ${U.ev(r.f.ev, { short: true })}</td></tr>`).join('')}</tbody></table>${w.periph ? `<p class="small"><b>Periphery:</b> ${esc(w.periph)}</p>` : ''}<p class="small notice info">${esc(w.teach)}</p></div>`; }).join('') + (sel.length > 1 ? `<div class="card"><h3>Combined</h3><p class="small">Regions with several badges receive opposing or additive influences — e.g. D2 blockade + muscarinic blockade in the putamen (EPS ↓ by antimuscarinic action), or 5-HT ↑ + 5-HT2A blockade (adverse 5-HT2A effects shielded).</p></div>` : '') : '<div class="card muted">Select a manipulation.</div>';
    };
    el.addEventListener('click', e => {
      const w = e.target.closest('[data-w]'); if (w) { const k = w.dataset.w; sel = sel.includes(k) ? sel.filter(x => x !== k) : sel.concat(k); w.setAttribute('aria-pressed', sel.includes(k)); draw(); }
      const t = e.target.closest('[data-tone]'); if (t) { tone = t.dataset.tone; el.querySelectorAll('[data-tone]').forEach(x => x.setAttribute('aria-pressed', x === t)); draw(); }
      if (e.target.id === 'wclear') { sel = []; el.querySelectorAll('[data-w]').forEach(x => x.setAttribute('aria-pressed', 'false')); draw(); }
    });
    draw();
  };

  /* ================= PARTIAL AGONISTS ================= */
  V.partial = function (el) {
    el.innerHTML = V.head('F · Partial dopamine agonists', 'Aripiprazole, brexpiprazole, cariprazine', 'Partial agonism — not "dopamine stabilisation" — is the pharmacology. A partial agonist\'s net effect depends on how much endogenous dopamine is present.') +
      `<div id="pa"></div><div class="grid g3" style="margin-top:14px">${['aripiprazole', 'brexpiprazole', 'cariprazine'].map(id => { const d = PA.DRUG[id]; return `<div class="card"><h3><a href="#/drug/${id}">${esc(d.name)}</a></h3>${U.fingerprint(d)}<ul class="bul small" style="margin-top:8px">${d.notes.slice(0, 2).map(n => `<li>${esc(n)}</li>`).join('')}</ul></div>`; }).join('')}</div>
      <div class="card" style="margin-top:14px"><h3>Clinical consequences of partial agonism</h3>${['d2p_stab', 'd2p_prl', 'd2_akath', 'd2p_impulse'].map(id => U.chain(PA.MECH[id])).join('')}<p class="small">Intrinsic activity ranking commonly cited: aripiprazole > cariprazine ≈ brexpiprazole (lower). Higher intrinsic activity → more activation/akathisia, less sedation (proposed relationship). ${U.ev('PROP')}</p>
      <p class="small">Buprenorphine (μ-opioid) and varenicline (α4β2 nicotinic) follow the same logic: <a href="#/drug/buprenorphine">buprenorphine</a> · <a href="#/drug/varenicline">varenicline</a></p></div>`;
    PA.W.partial(el.querySelector('#pa'));
  };

  /* ================= LEARN: time course & adaptation ================= */
  V.learn = function (el, params) {
    const which = params[0] || 'timecourse';
    if (which === 'adapt') {
      el.innerHTML = V.head('Learn · Adaptation & tolerance', 'What chronic exposure does to receptors', 'Repeated agonism → desensitisation & internalisation; repeated antagonism → compensatory up-regulation. Adaptation is not identical across drugs — or even across effects of the same drug.') +
        `<div class="grid g2">${Object.keys(PA.ADAPT).map(k => `<div id="ad-${k}"></div>`).join('')}</div>`;
      Object.keys(PA.ADAPT).forEach(k => PA.W.adapt(el.querySelector('#ad-' + k), k));
    } else {
      el.innerHTML = V.head('Learn · Time course', 'Receptor binding is immediate — clinical response often is not', 'Immediately: binding. Hours–days: changes in neurotransmission. Days–weeks: network adaptation. Weeks+: clinical effects. Especially important for antidepressants and antipsychotics.') +
        Object.entries({ antidepressant: 'Antidepressants (SSRIs/SNRIs)', antipsychotic: 'Antipsychotics', ketamine: 'Ketamine / esketamine', benzo: 'Benzodiazepines', stimulant: 'Stimulants', lithium: 'Lithium', opioid: 'Opioids', addiction: 'Addictive drugs' }).map(([k, t]) => `<div class="card"><h3>${esc(t)}</h3><div id="tc-${k}"></div></div>`).join('');
      Object.keys(PA.TIMECOURSE).forEach(k => { const n = el.querySelector('#tc-' + k); if (n) PA.W.timecourse(n, k); });
    }
  };

  /* ================= CLINICAL CASES ================= */
  V.cases = function (el, params) {
    const c = PA.CASES.find(x => x.id === params[0]);
    if (!c) {
      el.innerHTML = V.head('Clinical case mode', 'Interactive cases', 'Make the pharmacology clinically meaningful: identify the pathway on the brain, the receptor, and the mechanism-based fix.') +
        `<div class="grid g3">${PA.CASES.map(x => `<a class="tile" href="#/cases/${x.id}"><span class="tk">${x.steps.length} steps</span><h3>${esc(x.title)}</h3><p>${esc(x.vignette.slice(0, 110))}…</p></a>`).join('')}</div>`;
      return;
    }
    el.innerHTML = V.head('Clinical case', esc(c.title), '', '<a href="#/cases">Cases</a>') + `<div class="card"><p>${esc(c.vignette)}</p></div><div id="steps"></div>`;
    const wrap = el.querySelector('#steps'); let i = 0;
    const renderStep = () => {
      const s = c.steps[i]; const id = 'st' + i;
      wrap.insertAdjacentHTML('beforeend', `<div class="case-step active" id="${id}"><h3>Step ${i + 1}. ${esc(s.q)}</h3>${s.type === 'map' ? `<div class="mapq"></div><p class="small muted">Click a region on the map (or use Tab + Enter).</p>` : s.options.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.t)}</button>`).join('')}<div class="feedback" aria-live="polite"></div></div>`);
      const node = wrap.querySelector('#' + id);
      const finish = ok => {
        node.querySelector('.feedback').innerHTML = `<div class="notice ${ok ? 'info' : 'bad'}"><b>${ok ? 'Correct.' : 'Not quite.'}</b> ${esc(s.explain)}</div>${s.chain ? U.chainFromArray(s.chain) : ''}${s.refs ? `<p class="small">${U.refInline(s.refs)}</p>` : ''}${s.link ? `<p><a class="btn small" href="${s.link}">Explore →</a></p>` : ''}
          ${i < c.steps.length - 1 ? '<button class="btn primary next">Next step ▶</button>' : '<p><b>Case complete.</b> <a href="#/cases">More cases →</a></p>'}`;
        const nx = node.querySelector('.next'); if (nx) nx.addEventListener('click', () => { nx.remove(); node.classList.remove('active'); i++; renderStep(); });
      };
      if (s.type === 'map') {
        let done = false;
        PA.Brain.render(node.querySelector('.mapq'), { legend: false, label: 'Click to answer', onSelect: rid => {
          if (done) return; done = true;
          const ok = (s.accept || s.answer).includes(rid);
          const lit = {}; s.answer.forEach(a => lit[a] = { color: 'var(--good)', strength: 3, badge: 'answer' }); if (!ok) lit[rid] = { color: 'var(--bad)', strength: 3, badge: 'your choice' };
          PA.Brain.render(node.querySelector('.mapq'), { lit, legend: false, label: 'Answer' });
          finish(ok);
        } });
      } else {
        node.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
          if (node.dataset.done) return; node.dataset.done = 1;
          const o = s.options[+b.dataset.k]; b.classList.add(o.correct ? 'correct' : 'wrong');
          node.querySelectorAll('.opt').forEach((x, k) => { if (s.options[k].correct) x.classList.add('correct'); });
          finish(!!o.correct);
        }));
      }
    };
    renderStep();
  };

  /* ================= QUIZ (generated from data) ================= */
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
  const GEN = {
    mechanism() { // blocking X in Y produces?
      const m = rnd(PA.MECHANISMS.filter(x => x.target && x.type === 'adv' && x.ev !== 'UNK'));
      const correct = PA.EFFECT[m.effect].name;
      const wrong = shuffle(PA.EFFECTS.filter(e => e.kind === 'adverse' && e.id !== m.effect && !U.mechsForEffect(e.id).some(x => x.target === m.target))).slice(0, 3).map(e => e.name);
      return { kind: 'Mechanism prediction', q: `${PA.ACTIONS[m.actions[0]].label} action at ${PA.rl(m.target)}${m.circuit ? ` (${m.circuit.replace('_', ' ')} system)` : ''} most directly produces which effect?`, opts: shuffle([correct, ...wrong]), a: correct, explain: m, };
    },
    map() {
      const m = rnd(PA.MECHANISMS.filter(x => x.target && (x.regions || []).length && ['d2_eps', 'd2_prl', 'd2_ml', 'h1_wt', 'mor_reward', 'mor_resp', 'a2_auto', 'net_pfc', 'orx_sleep', 'sert_ss', 'gaba_anx', 'm1_cog', 'a2a_pfc'].includes(x.id)));
      return { kind: 'Circuit identification (click the brain)', q: `Where does "${m.chain[0][1]}" act to produce ${PA.EFFECT[m.effect].name.toLowerCase()}? Click the region.`, map: m.regions, explain: m };
    },
    receptor() {
      const d = rnd(PA.DRUGS.filter(x => !x.substance && U.mechsForDrug(x).some(y => y.m.target && y.t && y.m.type === 'adv')));
      const x = rnd(U.mechsForDrug(d).filter(y => y.m.target && y.t && y.m.type === 'adv'));
      const correct = `${PA.rl(x.m.target)} ${PA.ACTIONS[x.t.action].verb}`;
      const wrong = shuffle(U.targets(d).filter(t => !U.mechsForDrug(d).some(y => y.m.effect === x.m.effect && y.m.target === t.r)).map(t => `${PA.rl(t.r)} ${PA.ACTIONS[t.action].verb}`).concat(['5-HT3 antagonism', 'MAO-B inhibition', 'NMDA blockade'])).filter(o => o !== correct).slice(0, 3);
      return { kind: 'Receptor identification', q: `Which action of ${d.name} best explains ${PA.EFFECT[x.m.effect].name.toLowerCase()}?`, opts: shuffle([correct, ...wrong]), a: correct, explain: x.m };
    },
    sideeffect() {
      const keys = ['wt', 'sed', 'eps', 'prl', 'ach', 'orth', 'qt'];
      const k = rnd(keys); const lab = PA.AE_KEYS.find(x => x.k === k);
      const pool = shuffle(PA.DRUGS.filter(d => d.ae && !d.substance && ['antipsychotic', 'antidepressant'].includes(d.cls)));
      const top = pool.find(d => d.ae[k] === 3); if (!top) return GEN.mechanism();
      const lows = pool.filter(d => d.ae[k] <= 1).slice(0, 3);
      return { kind: 'Side-effect prediction', q: `Based on receptor profile, which drug carries the HIGHEST ${lab.label.toLowerCase()} liability?`, opts: shuffle([top.name, ...lows.map(d => d.name)]), a: top.name, explainText: `${top.name}: ${U.targets(top).filter(t => U.receptorsForEffect(lab.effect).includes(t.r)).map(t => `${PA.rl(t.r)} ${U.actGlyph(t.action)} (${PA.AFFINITY[t.aff].label})`).join(', ') || 'see profile'}. Compare the fingerprints to see why.` };
    },
    dose() {
      const pool = shuffle(PA.DRUGS.filter(d => PA.stahl[d.stahl] && PA.stahl[d.stahl].dose && PA.stahl[d.stahl].dose[0].length < 60 && d.cls !== 'sud'));
      const d = pool[0]; const correct = PA.stahl[d.stahl].dose[0];
      const wrong = pool.slice(1).filter(x => PA.stahl[x.stahl].dose[0] !== correct).slice(0, 3).map(x => PA.stahl[x.stahl].dose[0]);
      return { kind: 'Dose selection', q: `Per Stahl's Prescriber's Guide, what is the usual dosage range of ${d.name}?`, opts: shuffle([correct, ...wrong]), a: correct, explainText: `${d.name}: ${PA.stahl[d.stahl].dose.join(' · ')}. Always verify against current labelling.` };
    },
    compare() {
      const pairs = [['olanzapine', 'aripiprazole', 'weight gain', 'olanzapine', 'Olanzapine combines very high H1 and 5-HT2C antagonism (plus muscarinic); aripiprazole has modest H1 and partial agonism at D2.'], ['risperidone', 'quetiapine', 'hyperprolactinemia', 'risperidone', 'Risperidone: potent D2 blockade with high pituitary exposure; quetiapine: low, transient D2 occupancy.'], ['haloperidol', 'clozapine', 'EPS', 'haloperidol', 'Haloperidol: high-affinity D2 antagonist (>78% occupancy common). Clozapine: low D2 occupancy, fast dissociation, strong antimuscarinic action.'], ['sertraline', 'bupropion', 'sexual dysfunction', 'sertraline', 'SERT inhibition ↑ 5-HT (inhibitory to sexual function); bupropion has no serotonergic action.'], ['amitriptyline', 'nortriptyline', 'orthostatic hypotension', 'amitriptyline', 'Amitriptyline has much higher α1 affinity than its metabolite nortriptyline.']];
      const p = rnd(pairs);
      return { kind: 'Drug comparison', q: `Which causes more ${p[2]}: ${PA.DRUG[p[0]].name} or ${PA.DRUG[p[1]].name}?`, opts: shuffle([PA.DRUG[p[0]].name, PA.DRUG[p[1]].name]), a: PA.DRUG[p[3]].name, explainText: p[4], link: `#/compare/${p[0]},${p[1]}` };
    },
    case() {
      const c = rnd(PA.CASES); const s = c.steps.find(x => x.type === 'mc');
      return { kind: 'Clinical case interpretation', q: `${c.vignette} — ${s.q}`, opts: shuffle(s.options.map(o => o.t)), a: s.options.find(o => o.correct).t, explainText: s.explain, link: '#/cases/' + c.id };
    }
  };
  V.quiz = function (el) {
    let score = 0, n = 0;
    el.innerHTML = V.head('Quiz mode', 'Questions generated from the pathways', 'Mechanism prediction, circuit identification (click the brain), receptor identification, side-effect prediction, dose selection, drug comparison and case interpretation.') +
      `<div class="card tight"><div class="row"><span class="small">Question types:</span><div class="chips" id="qt">${Object.keys(GEN).map(k => `<button class="chip" data-g="${k}" aria-pressed="true">${k}</button>`).join('')}</div><span class="spacer"></span><span class="score" id="score">0 / 0</span></div></div><div id="qbox" style="margin-top:12px"></div>`;
    let enabled = new Set(Object.keys(GEN));
    el.querySelector('#qt').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; const k = b.dataset.g; if (enabled.has(k) && enabled.size > 1) enabled.delete(k); else enabled.add(k); b.setAttribute('aria-pressed', enabled.has(k)); });
    const next = () => {
      const Q = GEN[rnd(Array.from(enabled))]();
      const box = el.querySelector('#qbox');
      box.innerHTML = `<div class="card"><div class="small muted">${esc(Q.kind)}</div><h3>${esc(Q.q)}</h3>${Q.map ? '<div id="qmap"></div>' : Q.opts.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}<div class="feedback" aria-live="polite"></div></div>`;
      const fb = ok => {
        n++; if (ok) score++; el.querySelector('#score').textContent = `${score} / ${n}`;
        box.querySelector('.feedback').innerHTML = `<div class="notice ${ok ? 'info' : 'bad'}"><b>${ok ? 'Correct.' : 'Incorrect.'}</b> ${Q.explain ? '' : esc(Q.explainText || '')}</div>${Q.explain ? U.chain(Q.explain, { showWhy: true }) : ''}${Q.link ? `<a class="btn small" href="${Q.link}">Explore →</a> ` : ''}<button class="btn primary" id="qn">Next question ▶</button>`;
        box.querySelector('#qn').addEventListener('click', next); box.querySelector('#qn').focus();
      };
      if (Q.map) {
        let done = false;
        PA.Brain.render(box.querySelector('#qmap'), { legend: false, label: 'Click the region', onSelect: rid => {
          if (done) return; done = true; const ok = Q.map.includes(rid) || (PA.REGION[rid].children || []).some(c => Q.map.includes(c));
          const lit = {}; Q.map.forEach(r => lit[r] = { color: 'var(--good)', strength: 3, badge: '✓' }); if (!ok) lit[rid] = { color: 'var(--bad)', strength: 3, badge: '✗' };
          PA.Brain.render(box.querySelector('#qmap'), { lit, legend: false, label: 'Answer' }); fb(ok);
        } });
      } else box.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
        if (box.dataset.done === String(n)) return; box.dataset.done = String(n);
        const ok = Q.opts[+b.dataset.i] === Q.a; b.classList.add(ok ? 'correct' : 'wrong');
        box.querySelectorAll('.opt').forEach(x => { if (Q.opts[+x.dataset.i] === Q.a) x.classList.add('correct'); }); fb(ok);
      }));
    };
    next();
  };

  /* ================= REFERENCES / ABOUT ================= */
  V.about = function (el) {
    el.innerHTML = V.head('About & references', 'Sources, methods and limitations', '') +
      `<div class="grid g2"><div class="card"><h3>Primary prescribing source</h3><p>Stahl SM. <i>Stahl's Essential Psychopharmacology: Prescriber's Guide</i>. 7th ed. Cambridge University Press; 2021. ISBN 978-1-108-92601-0. The repository's PDF was parsed into structured fields (dosage range, titration, formulations, PK, interactions, special populations, monitoring, contraindications, indications with FDA-approval typography) and condensed; narrative prose is not reproduced.</p>
        <h3>Post-2021 updates flagged in the app</h3><ul class="bul small"><li>Xanomeline–trospium approved for schizophrenia (FDA, Sept 2024)</li><li>Cariprazine: adjunctive MDD (FDA, Dec 2024)</li><li>Brexpiprazole: agitation in Alzheimer dementia (FDA, May 2023)</li><li>Lumateperone: bipolar depression (FDA, Dec 2021)</li><li>Esketamine monotherapy for TRD (FDA, Jan 2025)</li><li>Clozapine REMS eliminated (FDA, 2025)</li><li>Stimulant boxed-warning update (FDA, 2023); benzodiazepine class boxed warning (FDA, 2020); gabapentinoid respiratory warning (FDA, 2019)</li></ul>
        <p class="small muted">Regulatory status changes — always check current official labelling.</p></div>
        <div class="card"><h3>Methods</h3><ul class="bul small"><li><b>Receptor fingerprints</b>: qualitative 1–4 affinity grades synthesised from published binding data (PDSP Ki database, Stahl). Not occupancy.</li><li><b>Side-effect ratings</b> (0–3): teaching approximations from Stahl and network meta-analyses (Huhn 2019; Leucht 2013; Cipriani 2018).</li><li><b>Mechanisms</b>: each chain is evidence-tagged; drugs inherit mechanisms automatically from their target profile (target + action + minimum affinity), plus drug-specific non-receptor mechanisms.</li><li><b>Dose–engagement</b>: shown as Low/Moderate/High conceptual levels only. The only numerical occupancy values cited come from PET studies (Kapur 2000; Meyer 2004; Volkow 1998).</li><li><b>Simulations</b> (synapse, partial agonist, inverted-U, adaptation): conceptual models with illustrative parameters.</li></ul>
          <div class="notice">${esc(PA.DISCLAIMER)}</div></div></div>
      <div class="card" style="margin-top:14px"><h3>All PubMed references (${Object.keys(PA.refs).length}, PMIDs verified via the NCBI PubMed API)</h3><ul class="refs">${Object.keys(PA.refs).sort((a, b) => PA.refs[a].a.localeCompare(PA.refs[b].a)).map(U.refItem).join('')}</ul></div>`;
  };
})();
