/* Interactive teaching widgets. Every simulation is labelled as a conceptual model. */
(function () {
  const U = PA.U, esc = U.esc;
  const W = PA.W = {};
  const timers = new Set();
  W.stopAll = () => { timers.forEach(t => cancelAnimationFrame(t.id)); timers.clear(); };

  /* =====================================================================
     SYNAPSE — presynaptic vs postsynaptic receptor teaching animation
     ===================================================================== */
  W.synapse = function (el, cfg) {
    // cfg: { nt, autoName, mode: 'auto'|'hetero', title }
    const nt = PA.NT[cfg.nt] || PA.NT.OTHER;
    const modes = cfg.modes || [
      { id: 'base', label: 'Baseline' },
      { id: 'blockAuto', label: `Block ${cfg.autoName || 'autoreceptor'}` },
      { id: 'agoAuto', label: `Stimulate ${cfg.autoName || 'autoreceptor'}` },
      { id: 'blockReuptake', label: 'Block reuptake transporter' },
      { id: 'blockPost', label: 'Block postsynaptic receptor' }
    ];
    el.innerHTML = `<div class="card synapse">
      <div class="row" style="margin-bottom:8px"><h3 style="margin:0">${esc(cfg.title || 'Presynaptic vs postsynaptic receptors')}</h3><span class="spacer"></span>${U.ev('SIMP')}</div>
      <div class="chips" role="radiogroup" aria-label="Synapse condition">${modes.map((m, i) => `<button class="chip" role="radio" aria-pressed="${i === 0}" aria-checked="${i === 0}" data-mode="${m.id}">${esc(m.label)}</button>`).join('')}</div>
      <div class="split even" style="margin-top:10px;align-items:center">
        <div><svg viewBox="0 0 420 300" aria-label="Animated synapse diagram">
          <defs><clipPath id="cleft-${cfg.nt}"><rect x="40" y="120" width="340" height="80"/></clipPath></defs>
          ${cfg.mode === 'hetero' ? `<path class="mem" d="M330,10 L410,10 L410,90 Q370,112 330,90 Z"/><text x="338" y="40" style="font-size:10px">NE fibre</text>` : ''}
          <path class="mem" d="M90,10 L330,10 L330,90 Q210,128 90,90 Z"/>
          <text x="110" y="34">Presynaptic terminal ${cfg.mode === 'hetero' ? '(5-HT)' : '(' + esc(nt.short) + ')'}</text>
          <g class="vesicles">${[0, 1, 2, 3, 4].map(i => `<circle cx="${150 + i * 34}" cy="${62 + (i % 2) * 10}" r="11" style="fill:none;stroke:${nt.color}" stroke-width="1.5"/>`).join('')}</g>
          <!-- autoreceptor -->
          <g id="auto-${cfg.nt}"><rect x="96" y="${cfg.mode === 'hetero' ? 94 : 92}" width="26" height="16" rx="4" style="fill:var(--surface);stroke:${cfg.mode === 'hetero' ? 'var(--nt-NE)' : nt.color}" stroke-width="2"/><text x="72" y="128" style="font-size:10px">${esc(cfg.autoName || 'autoreceptor')}</text></g>
          <!-- transporter -->
          <g id="tr-${cfg.nt}"><rect x="296" y="90" width="22" height="18" rx="3" style="fill:var(--surface);stroke:var(--text-2)" stroke-width="1.5"/><text x="286" y="128" style="font-size:10px">reuptake</text></g>
          <path class="mem" d="M60,220 L360,220 L360,292 L60,292 Z"/>
          <text x="110" y="280">Postsynaptic neuron</text>
          ${[0, 1, 2, 3].map(i => `<rect class="post-rec" x="${120 + i * 56}" y="212" width="24" height="14" rx="4" style="fill:var(--surface);stroke:${nt.color}" stroke-width="2"/>`).join('')}
          <g id="parts-${cfg.nt}" clip-path="url(#cleft-${cfg.nt})"></g>
          <g id="block-${cfg.nt}"></g>
        </svg></div>
        <div class="stack">
          <div><div class="small muted">Release from terminal</div><div class="meter"><i id="m-rel-${cfg.nt}"></i></div></div>
          <div><div class="small muted">Synaptic ${esc(nt.short)} concentration</div><div class="meter warn"><i id="m-c-${cfg.nt}"></i></div></div>
          <div><div class="small muted">Postsynaptic signal</div><div class="meter good"><i id="m-post-${cfg.nt}"></i></div></div>
          <p class="small" id="syn-text-${cfg.nt}" aria-live="polite"></p>
        </div>
      </div>
      <p class="small muted">Conceptual animation with illustrative parameters — not a quantitative model.</p></div>`;
    const texts = cfg.texts || {
      base: `${cfg.mode === 'hetero' ? 'Neighbouring NE fibres activate α2 HETEROreceptors on the 5-HT terminal, restraining 5-HT release.' : `Released ${nt.short} acts on postsynaptic receptors AND on presynaptic ${cfg.autoName || 'autoreceptors'}, which feed back to limit further release (a thermostat).`}`,
      blockAuto: `${cfg.mode === 'hetero' ? 'Blocking α2 heteroreceptors (mirtazapine) removes the NE brake on the 5-HT terminal → ↑ 5-HT release.' : `Blocking the ${cfg.autoName || 'autoreceptor'} removes negative feedback → ↑ release. DIRECT effect: receptor blockade. DOWNSTREAM effect: more transmitter.`}`,
      agoAuto: `Stimulating the presynaptic receptor (e.g. clonidine at α2; buspirone acutely at 5-HT1A somatodendritic receptors) → ↓ firing & release.`,
      blockReuptake: `Reuptake inhibition ↑ synaptic concentration — but the extra transmitter also activates the autoreceptor brake, partially limiting the rise (one rationale for delayed SSRI onset until autoreceptors desensitise).`,
      blockPost: `Postsynaptic blockade: release may even rise, but the signal reaching the next neuron falls.`
    };
    const parts = el.querySelector('#parts-' + cfg.nt);
    const st = { mode: 'base', C: 0.4, particles: [] };
    function params() {
      const m = st.mode;
      return { autoGain: m === 'blockAuto' ? 0 : m === 'agoAuto' ? 1.6 : 0.8, reuptake: m === 'blockReuptake' ? 0.15 : 1, post: m === 'blockPost' ? 0.15 : 1, agoDrive: m === 'agoAuto' ? 0.5 : 0 };
    }
    function steady() {
      const p = params(); let C = 0.4, rel = 0.5;
      for (let i = 0; i < 400; i++) { const fb = cfg.mode === 'hetero' ? (p.autoGain > 0 ? 0.45 * p.autoGain / 0.8 : 0) : p.autoGain * C * 0.6 + p.agoDrive; rel = Math.max(0.05, 0.9 - fb); C += 0.05 * (rel - p.reuptake * C * 1.1); }
      return { C: Math.min(1, C), rel: Math.min(1, rel), post: Math.min(1, C * p.post) };
    }
    function drawBlock() {
      const g = el.querySelector('#block-' + cfg.nt); const m = st.mode;
      let s = '';
      if (m === 'blockAuto') s = `<text x="100" y="118" style="font-size:16px;fill:var(--bad);font-weight:700">⊣</text>`;
      if (m === 'agoAuto') s = `<text x="100" y="118" style="font-size:14px;fill:var(--good);font-weight:700">→</text>`;
      if (m === 'blockReuptake') s = `<text x="300" y="122" style="font-size:16px;fill:var(--bad);font-weight:700">✕</text>`;
      if (m === 'blockPost') s = [0, 1, 2, 3].map(i => `<text x="${124 + i * 56}" y="244" style="font-size:14px;fill:var(--bad);font-weight:700">⊣</text>`).join('');
      g.innerHTML = s;
    }
    function update() {
      const ss = steady();
      el.querySelector('#m-rel-' + cfg.nt).style.width = (ss.rel * 100).toFixed(0) + '%';
      el.querySelector('#m-c-' + cfg.nt).style.width = (ss.C * 100).toFixed(0) + '%';
      el.querySelector('#m-post-' + cfg.nt).style.width = (ss.post * 100).toFixed(0) + '%';
      el.querySelector('#syn-text-' + cfg.nt).textContent = texts[st.mode] || '';
      st.target = ss; drawBlock();
      if (U.reduced()) { // static particles
        const n = Math.round(ss.C * 26);
        parts.innerHTML = Array.from({ length: n }, (_, i) => `<circle cx="${70 + (i * 37) % 290}" cy="${130 + (i * 23) % 62}" r="3.2" style="fill:${nt.color}"/>`).join('');
      }
    }
    el.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
      el.querySelectorAll('[data-mode]').forEach(x => { x.setAttribute('aria-pressed', x === b); x.setAttribute('aria-checked', x === b); });
      st.mode = b.dataset.mode; update();
    }));
    update();
    const t = { id: 0 }; timers.add(t);
    let last = 0;
    function frame(ts) {
      if (!document.body.contains(el)) { timers.delete(t); return; }
      if (!U.reduced()) {
        const dt = Math.min(50, ts - last || 16); last = ts;
        const ss = st.target;
        if (Math.random() < ss.rel * 0.5 * dt / 16) st.particles.push({ x: 140 + Math.random() * 150, y: 108, vx: (Math.random() - .5) * .6, vy: .6 + Math.random() * .5, life: 0 });
        const maxN = 14 + ss.C * 30;
        st.particles.forEach(p => { p.x += p.vx * dt / 16; p.y += p.vy * dt / 16; if (p.y > 205) { p.vy = -Math.abs(p.vy) * .3; } if (p.y < 115) p.vy = Math.abs(p.vy); p.life += dt; });
        st.particles = st.particles.filter(p => p.life < 900 + ss.C * 2600).slice(-Math.round(maxN));
        parts.innerHTML = st.particles.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.2" style="fill:${nt.color}"/>`).join('');
      }
      t.id = requestAnimationFrame(frame);
    }
    t.id = requestAnimationFrame(frame);
  };

  /* =====================================================================
     PARTIAL AGONIST — conceptual competitive-binding model
     ===================================================================== */
  W.partial = function (el) {
    const IA = 0.3; // illustrative intrinsic activity
    el.innerHTML = `<div class="card">
      <div class="row"><h3 style="margin:0">Partial agonism at D2: why ambient dopamine matters</h3><span class="spacer"></span>${U.ev('SIMP')}</div>
      <p class="small muted">Simplified conceptual model: competitive binding of dopamine (full agonist, efficacy 1.0) and a drug at a fixed high concentration; drug efficacy = 0 (antagonist) or ${IA} (illustrative partial agonist). Real intrinsic activities and binding are more complex (Burris 2002 measured aripiprazole as a high-affinity partial agonist).</p>
      <div class="slider-row"><label for="pa-da">Ambient dopamine</label><input id="pa-da" type="range" min="0" max="100" value="70"><span id="pa-da-v" class="mono"></span></div>
      <div class="grid g3" style="margin-top:14px">
        <div><div class="small">Dopamine alone</div><div class="meter"><i id="pa-b0"></i></div><div class="mono small" id="pa-t0"></div></div>
        <div><div class="small">+ Full D2 antagonist</div><div class="meter bad"><i id="pa-b1"></i></div><div class="mono small" id="pa-t1"></div></div>
        <div><div class="small">+ D2 partial agonist</div><div class="meter good"><i id="pa-b2"></i></div><div class="mono small" id="pa-t2"></div></div>
      </div>
      <div id="pa-chart" style="margin-top:14px"></div>
      <div id="pa-text" class="notice info" aria-live="polite" style="margin-top:10px"></div>
      <div class="grid g2" style="margin-top:12px">
        <div class="chain-wrap"><b>High-dopamine environment</b> (e.g. associative striatum in psychosis)${U.chainFromArray(['Partial agonist occupies D2', 'Competes with endogenous DA', 'Its lower efficacy replaces DA\'s full efficacy', 'LOWER net D2 signalling → antipsychotic'])}</div>
        <div class="chain-wrap"><b>Low-dopamine environment</b> (e.g. pituitary, possibly mesocortical)${U.chainFromArray(['Partial agonist occupies D2', 'Little DA to compete with', 'Its intrinsic activity provides some signal', 'HIGHER net signalling than complete blockade → less prolactin rise, less EPS'])}</div>
      </div></div>`;
    const sig = (da, drug, ia) => { const a = da, b = drug; const tot = 1 + a + b; return (a / tot) * 1 + (b / tot) * ia; };
    const DRUG = 20; // drug concentration relative to its Kd (high occupancy)
    function chart(cur) {
      const w = 520, h = 190, pad = 34; const xs = v => pad + v / 100 * (w - pad - 10), ys = v => h - pad - v * (h - pad - 10);
      const line = f => Array.from({ length: 51 }, (_, i) => { const v = i * 2; return `${i ? 'L' : 'M'}${xs(v).toFixed(1)},${ys(f(v)).toFixed(1)}`; }).join(' ');
      const daK = v => v / 10; // ambient DA relative to its Kd
      return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Net D2 signal versus ambient dopamine for three conditions">
        <line x1="${pad}" y1="${h - pad}" x2="${w - 10}" y2="${h - pad}" style="stroke:var(--line-2)"/><line x1="${pad}" y1="10" x2="${pad}" y2="${h - pad}" style="stroke:var(--line-2)"/>
        <text x="${w / 2}" y="${h - 6}" text-anchor="middle" style="fill:var(--muted);font-size:11px">ambient dopamine →</text>
        <text x="12" y="${h / 2}" transform="rotate(-90 12 ${h / 2})" text-anchor="middle" style="fill:var(--muted);font-size:11px">net D2 signal</text>
        <path d="${line(v => sig(daK(v), 0, 0))}" style="fill:none;stroke:var(--accent)" stroke-width="2.5"/>
        <path d="${line(v => sig(daK(v), DRUG, 0))}" style="fill:none;stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="7 4"/>
        <path d="${line(v => sig(daK(v), DRUG, IA))}" style="fill:none;stroke:var(--good)" stroke-width="2.5" stroke-dasharray="2 4"/>
        <line x1="${xs(cur)}" y1="10" x2="${xs(cur)}" y2="${h - pad}" style="stroke:var(--text-2)" stroke-dasharray="3 3"/>
        <text x="${w - 14}" y="${ys(sig(10, 0, 0)) - 6}" text-anchor="end" style="fill:var(--accent);font-size:11px">DA alone (solid)</text>
        <text x="${w - 14}" y="${ys(sig(10, DRUG, IA)) - 6}" text-anchor="end" style="fill:var(--good);font-size:11px">+ partial agonist (dotted) — plateaus near its own efficacy</text>
        <text x="${w - 14}" y="${ys(sig(10, DRUG, 0)) - 6}" text-anchor="end" style="fill:var(--bad);font-size:11px">+ antagonist (dashed)</text></svg>`;
    }
    function upd() {
      const v = +el.querySelector('#pa-da').value; const da = v / 10;
      const s0 = sig(da, 0, 0), s1 = sig(da, DRUG, 0), s2 = sig(da, DRUG, IA);
      el.querySelector('#pa-da-v').textContent = v < 25 ? 'low' : v < 60 ? 'moderate' : 'high';
      [s0, s1, s2].forEach((s, i) => { el.querySelector('#pa-b' + i).style.width = (s * 100).toFixed(0) + '%'; el.querySelector('#pa-t' + i).textContent = (s * 100).toFixed(0) + '% of max'; });
      el.querySelector('#pa-chart').innerHTML = chart(v);
      el.querySelector('#pa-text').innerHTML = s2 < s0 ? `<b>Here the partial agonist LOWERS net signalling</b> (${(s0 * 100).toFixed(0)}% → ${(s2 * 100).toFixed(0)}%) by displacing dopamine — functionally antagonist-like.` : `<b>Here the partial agonist RAISES net signalling</b> (${(s0 * 100).toFixed(0)}% → ${(s2 * 100).toFixed(0)}%) — functionally agonist-like. A full antagonist would drive it to ${(s1 * 100).toFixed(0)}%.`;
    }
    el.querySelector('#pa-da').addEventListener('input', upd); upd();
  };

  /* =====================================================================
     MIRTAZAPINE DOSE MODULE — conceptual, explicitly non-quantitative
     ===================================================================== */
  W.mirtDose = function (el) {
    const doses = [7.5, 15, 30, 45];
    // conceptual engagement levels (0–3) — NOT occupancy
    const eng = {
      H1: [3, 3, 3, 3], A2: [1, 2, 2, 3], '5HT2A': [1, 2, 3, 3], '5HT2C': [1, 2, 3, 3], '5HT3': [1, 2, 3, 3]
    };
    el.innerHTML = `<div class="card">
      <div class="row"><h3 style="margin:0">Mirtazapine dose explorer</h3><span class="spacer"></span>${U.ev('SIMP')}</div>
      <div class="notice" style="margin:8px 0 12px"><b>Conceptual pharmacology — relative contribution of receptor-mediated effects; not a measured receptor-occupancy curve.</b> No human PET data define mirtazapine occupancy at each receptor across doses. Levels below reflect the rank order of binding affinities (H1 highest; then α2 and 5-HT2/5-HT3) combined with dose-proportional exposure.</div>
      <div class="slider-row"><label for="md-dose">Daily dose (evening)</label><input id="md-dose" type="range" min="0" max="3" step="1" value="1" aria-valuetext="15 mg"><span id="md-v" class="mono"></span></div>
      <div class="small muted" style="margin:4px 0 12px">Licensed range 15–45 mg/day (7.5 mg shown for educational context; Stahl notes some patients tolerate/require higher doses — outside label).</div>
      <div class="grid g2">
        <div>
          <h4>Relative steady-state exposure</h4>
          <div class="meter"><i id="md-exp"></i></div>
          <p class="small muted">Label: linear pharmacokinetics over 15–80 mg; t½ 20–40 h (longer in women/elderly; ↓ clearance in hepatic/renal impairment). Bar = dose ÷ 45 mg; inter-individual variation is large.</p>
          <h4 style="margin-top:14px">Conceptual receptor engagement</h4>
          <table class="data"><tbody id="md-eng"></tbody></table>
        </div>
        <div>
          <h4>What this means (and does not mean)</h4>
          <div id="md-text" aria-live="polite"></div>
        </div>
      </div></div>`;
    const rows = [['H1', 'H1 inverse agonism', 'Sedation; appetite ↑'], ['A2', 'α2 antagonism (auto + hetero)', '↑ NE and 5-HT release'], ['5HT2A', '5-HT2A antagonism', 'Sleep depth ↑; less sexual dysfx'], ['5HT2C', '5-HT2C antagonism', 'Appetite ↑; PFC DA/NE disinhibition'], ['5HT3', '5-HT3 antagonism', 'Less nausea']];
    function upd() {
      const i = +el.querySelector('#md-dose').value; const d = doses[i];
      el.querySelector('#md-dose').setAttribute('aria-valuetext', d + ' mg');
      el.querySelector('#md-v').textContent = d + ' mg';
      el.querySelector('#md-exp').style.width = (d / 45 * 100).toFixed(0) + '%';
      el.querySelector('#md-eng').innerHTML = rows.map(([k, n, e]) => `<tr><td>${esc(n)}</td><td>${U.lvlPill(eng[k][i])}</td><td class="small muted">${esc(e)}</td></tr>`).join('');
      const msgs = [
        `<p><b>7.5 mg</b> — below the licensed range. Clinicians often report that very low doses are <i>at least as sedating</i> as higher ones (Stahl dosing tip: halving a 15 mg tablet "may actually increase sedation"). The proposed reason: H1 receptors (highest affinity) are already strongly engaged, while noradrenergic α2 effects that could offset sedation are small.</p>`,
        `<p><b>15 mg</b> — usual starting dose. H1 effects are prominent → sedation and appetite increase are common from the first night. α2 and 5-HT2/3 actions are engaged but less fully (conceptually).</p>`,
        `<p><b>30 mg</b> — typical therapeutic dose. With rising exposure, α2-mediated noradrenergic activation contributes more, which <i>may</i> partly counterbalance sedation in some patients.</p>`,
        `<p><b>45 mg</b> — licensed maximum. All actions more fully engaged. Many patients remain sedated and continue to gain weight — H1 effects do not switch off.</p>`
      ];
      el.querySelector('#md-text').innerHTML = msgs[i] + `
        <div class="notice"><b>Avoid the oversimplification</b> "15 mg sedating / 45 mg activating". It is a commonly taught <i>clinical impression</i> ${U.ev('CLIN')} with a plausible <i>proposed</i> rationale ${U.ev('PROP')}, not an established dose–response law. Sedation reflects H1 blockade, α1/5-HT2A actions, exposure (age, hepatic/renal function, CYP interactions), tolerance and individual sensitivity.</div>
        <p class="small">Clinical use: choose the dose for antidepressant response and tolerability; if sedation is unwanted, a dose increase is not a reliable remedy.</p>
        <div class="small">${U.refInline(['8636062', '11607047', '9017762'])}</div>`;
    }
    el.querySelector('#md-dose').addEventListener('input', upd); upd();
  };

  /* =====================================================================
     DOSE-LEVEL TABLE for any drug with doseLevels
     ===================================================================== */
  W.doseLevels = function (el, d) {
    const dl = d.doseLevels; if (!dl) return;
    const keys = U.uniq(dl.levels.flatMap(l => Object.keys(l.engaged)));
    el.innerHTML = `<div class="card"><div class="row"><h3 style="margin:0">Dose-dependent pharmacology</h3><span class="spacer"></span>${U.ev(dl.ev)}</div>
      <p class="small">${esc(dl.note)}</p>
      <div class="slider-row"><label for="dl-${d.id}">Dose</label><input id="dl-${d.id}" type="range" min="0" max="${dl.levels.length - 1}" step="1" value="0"><span class="mono" id="dlv-${d.id}"></span></div>
      <table class="data" style="margin-top:10px"><thead><tr><th>Target</th><th>Conceptual engagement</th></tr></thead><tbody id="dlt-${d.id}"></tbody></table>
      <p class="small muted">Low / Moderate / High = conceptual engagement inferred from relative affinities and dose — not measured occupancy.</p></div>`;
    const upd = () => {
      const i = +el.querySelector('#dl-' + d.id).value; const L = dl.levels[i];
      el.querySelector('#dlv-' + d.id).textContent = L.dose;
      el.querySelector('#dlt-' + d.id).innerHTML = keys.map(k => `<tr><td>${U.recLink(k)}</td><td>${U.lvlPill(L.engaged[k] || 0)}</td></tr>`).join('');
    };
    el.querySelector('#dl-' + d.id).addEventListener('input', upd); upd();
  };

  /* =====================================================================
     ADAPTATION / TOLERANCE
     ===================================================================== */
  PA.ADAPT = {
    benzo: { title: 'Benzodiazepines (GABA-A PAM)', receptor: 'GABAA', nt: 'GABA',
      stages: [
        { t: 'First dose', surface: 10, desens: 0, intern: 0, signal: 95, note: 'Full positive allosteric modulation; strong sedation & anxiolysis.' },
        { t: '1–2 weeks', surface: 9, desens: 2, intern: 1, signal: 75, note: 'Tolerance to SEDATION develops quickly; anxiolysis partly maintained.', ev: 'CLIN' },
        { t: 'Months', surface: 7, desens: 3, intern: 3, signal: 60, note: 'Uncoupling of BZD and GABA sites, subunit composition changes, internalisation; compensatory ↑ glutamatergic tone.', ev: 'STR' },
        { t: 'Abrupt stop', surface: 7, desens: 3, intern: 3, signal: 20, note: 'Drug removed from an adapted system → rebound anxiety, insomnia, tremor, seizures. Taper slowly.', ev: 'EST' }],
      caution: 'Tolerance develops at different rates for different effects (sedation/anticonvulsant faster than anxiolysis) — adaptation is effect-specific.', refs: ['21714826'] },
    ssri: { title: 'SSRIs (SERT inhibition)', receptor: '5HT1A', nt: '5HT',
      stages: [
        { t: 'Day 1', surface: 10, desens: 0, intern: 0, signal: 40, note: 'SERT blocked immediately; ↑ 5-HT at raphe somata activates 5-HT1A AUTOreceptors → ↓ firing. Terminal 5-HT rises only modestly.' },
        { t: '1 week', surface: 9, desens: 2, intern: 1, signal: 55, note: 'Early side effects (nausea via 5-HT3, activation) — often transient as receptors adapt.', ev: 'CLIN' },
        { t: '2–6 weeks', surface: 6, desens: 3, intern: 3, signal: 85, note: 'Autoreceptors desensitise/down-regulate → firing recovers → sustained ↑ 5-HT release; downstream plasticity.', ev: 'PROP' },
        { t: 'Abrupt stop', surface: 6, desens: 3, intern: 3, signal: 25, note: 'Discontinuation symptoms as SERT occupancy falls against an adapted system.', ev: 'CLIN' }],
      caution: 'Autoreceptor desensitisation is one PROPOSED explanation for delayed onset; network and plasticity changes also contribute.', refs: ['7940983', '25721705'] },
    ap: { title: 'Antipsychotics (chronic D2 blockade)', receptor: 'D2', nt: 'DA',
      stages: [
        { t: 'Days', surface: 10, desens: 0, intern: 0, signal: 30, note: 'D2 blocked; acute EPS/dystonia risk. Initial ↑ DA neuron firing (autoreceptor blockade).' },
        { t: 'Weeks', surface: 11, desens: 0, intern: 0, signal: 30, note: '"Depolarisation block" of DA neurons proposed in animal models; antipsychotic response consolidates.', ev: 'PROP' },
        { t: 'Months–years', surface: 14, desens: 0, intern: 0, signal: 35, note: 'Compensatory ↑ D2 receptor density/sensitivity (supersensitivity) — proposed basis of tardive dyskinesia and of "supersensitivity psychosis".', ev: 'PROP' },
        { t: 'Abrupt stop', surface: 14, desens: 0, intern: 0, signal: 100, note: 'Unblocked supersensitive receptors → withdrawal dyskinesia, rebound psychosis risk.', ev: 'CLIN' }],
      caution: 'Unlike agonist drugs, antagonists cause UP-regulation rather than desensitisation.', refs: ['14992963'] },
    opioid: { title: 'Opioids (MOR agonism)', receptor: 'MOR', nt: 'OPI',
      stages: [
        { t: 'First dose', surface: 10, desens: 0, intern: 0, signal: 95, note: 'Gi/o → ↓ cAMP; GIRK; ↓ release. Analgesia, euphoria, respiratory depression.' },
        { t: 'Days', surface: 8, desens: 3, intern: 2, signal: 70, note: 'GRK phosphorylation, β-arrestin binding → desensitisation; internalisation (agonist-dependent: fentanyl > morphine).', ev: 'STR' },
        { t: 'Weeks', surface: 7, desens: 4, intern: 3, signal: 55, note: 'Adenylyl cyclase superactivation (↑ cAMP) — tolerance & dependence; constipation/miosis show little tolerance.', ev: 'STR' },
        { t: 'Abrupt stop', surface: 7, desens: 2, intern: 2, signal: 10, note: 'cAMP overshoot in LC → withdrawal hyperexcitability; ↓ mesolimbic DA, ↑ dynorphin/CRF → dysphoria.', ev: 'STR' }],
      caution: 'MOR regulation differs by agonist and cell type (Williams 2013).', refs: ['23321159', '19710631'] }
  };
  W.adapt = function (el, key) {
    const A = PA.ADAPT[key]; const nt = PA.NT[A.nt];
    el.innerHTML = `<div class="card"><div class="row"><h3 style="margin:0">${esc(A.title)}</h3><span class="spacer"></span>${U.recLink(A.receptor)}</div>
      <div class="slider-row" style="margin-top:8px"><label for="ad-${key}">Exposure</label><input id="ad-${key}" type="range" min="0" max="${A.stages.length - 1}" value="0"><span class="mono" id="adv-${key}"></span></div>
      <div class="split even" style="margin-top:10px;align-items:center"><div id="ads-${key}"></div><div><div class="small muted">Net signalling (conceptual)</div><div class="meter"><i id="adm-${key}"></i></div><p id="adt-${key}" aria-live="polite" style="margin-top:10px"></p></div></div>
      <p class="small muted">${esc(A.caution)}</p><div class="small">${U.refInline(A.refs)}</div></div>`;
    const draw = s => {
      const total = s.surface + s.intern; let x = 20; let svg = `<svg viewBox="0 0 400 150" role="img" aria-label="${s.surface} surface receptors, ${s.desens} desensitised, ${s.intern} internalised">
        <rect x="10" y="60" width="380" height="16" rx="4" style="fill:var(--surface-3);stroke:var(--line-2)"/><text x="12" y="52" style="font-size:11px;fill:var(--muted)">cell membrane</text><text x="12" y="140" style="font-size:11px;fill:var(--muted)">cytoplasm (internalised)</text>`;
      for (let i = 0; i < s.surface; i++) {
        const des = i < s.desens; const cx = 30 + i * (340 / Math.max(10, s.surface));
        svg += `<g><rect x="${cx - 7}" y="48" width="14" height="38" rx="5" style="fill:${des ? 'var(--surface)' : nt.color};stroke:${nt.color}" stroke-width="2" ${des ? 'stroke-dasharray="3 2"' : ''}/>${des ? `<text x="${cx}" y="44" text-anchor="middle" style="font-size:9px;fill:var(--muted)">desens.</text>` : ''}</g>`;
      }
      for (let i = 0; i < s.intern; i++) svg += `<circle cx="${60 + i * 40}" cy="112" r="11" style="fill:none;stroke:${nt.color}" stroke-dasharray="3 2"/><rect x="${55 + i * 40}" y="106" width="10" height="12" rx="3" style="fill:${nt.color};opacity:.5"/>`;
      return svg + '</svg>';
    };
    const upd = () => {
      const i = +el.querySelector('#ad-' + key).value; const s = A.stages[i];
      el.querySelector('#adv-' + key).textContent = s.t;
      el.querySelector('#ads-' + key).innerHTML = draw(s);
      el.querySelector('#adm-' + key).style.width = s.signal + '%';
      el.querySelector('#adt-' + key).innerHTML = `${esc(s.note)} ${s.ev ? U.ev(s.ev) : ''}`;
    };
    el.querySelector('#ad-' + key).addEventListener('input', upd); upd();
  };

  /* =====================================================================
     VTA DISINHIBITION — drug → reward circuit
     ===================================================================== */
  PA.REWARD_DRUGS = {
    none: { label: 'No drug', act: null, da: 30, text: 'Tonic DA firing restrained by local GABA interneurons.' },
    opioid: { label: 'Opioid (μ agonist)', act: 'gaba', da: 85, text: 'MOR on GABA interneurons → GIRK hyperpolarisation → interneurons silenced → DA neurons DISINHIBITED → ↑ NAc DA (Johnson & North 1992). Plus DA-independent MOR reward in NAc.', refs: ['1346804'], ev: 'STR' },
    bzd: { label: 'Benzodiazepine', act: 'gaba', da: 60, text: 'α1-GABA-A on VTA interneurons enhanced → interneurons inhibited → DA disinhibited (proposed basis of BZD reinforcement).', ev: 'STR' },
    cannabis: { label: 'THC (CB1)', act: 'gabaterm', da: 55, text: 'CB1 on GABA terminals ↓ GABA release → DA disinhibited (hijacked retrograde endocannabinoid signalling).', refs: ['11279497'], ev: 'STR' },
    nicotine: { label: 'Nicotine', act: 'da', da: 70, text: 'α4β2 nAChRs on DA neurons directly depolarise them; LTP of glutamate inputs (Mansvelder 2000); rapid desensitisation.', refs: ['10985354'], ev: 'STR' },
    alcohol: { label: 'Alcohol', act: 'gaba', da: 55, text: 'Multiple: GABA-A on interneurons, endorphin release (→ MOR), NMDA inhibition. No single receptor.', ev: 'STR' },
    cocaine: { label: 'Cocaine', act: 'terminal', da: 95, text: 'DAT blocked at NAc terminals → DA accumulates (acts downstream of firing).', refs: ['9766762'], ev: 'EST' },
    amph: { label: 'Amphetamine', act: 'terminal', da: 100, text: 'DAT reversal + VMAT2 disruption → impulse-independent DA efflux at terminals.', refs: ['15955613'], ev: 'EST' }
  };
  W.reward = function (el) {
    el.innerHTML = `<div class="card"><div class="row"><h3 style="margin:0">Put a drug on the reward circuit</h3><span class="spacer"></span>${U.ev('SIMP')}</div>
      <div class="chips" style="margin:8px 0">${Object.entries(PA.REWARD_DRUGS).map(([k, v], i) => `<button class="chip" data-rd="${k}" aria-pressed="${i === 0}">${esc(v.label)}</button>`).join('')}</div>
      <div class="split even" style="align-items:center"><div id="rw-svg"></div><div><div class="small muted">NAc dopamine (conceptual)</div><div class="meter warn"><i id="rw-m"></i></div><p id="rw-t" aria-live="polite" style="margin-top:8px"></p><div id="rw-r" class="small"></div></div></div>
      <h4 style="margin-top:12px">With repeated use</h4>${U.chainFromArray(['Repeated DA surges', 'Synaptic plasticity; ↓ D2 availability', 'Tolerance; reward deficit', 'Withdrawal: ↑ CRF, dynorphin (KOR)', 'Craving, compulsive use'], ['drug', 'signal', 'network', 'network', 'clinical'])}</div>`;
    const svg = k => {
      const a = PA.REWARD_DRUGS[k].act;
      const hl = x => a === x ? 'stroke:var(--warn);stroke-width:3.5' : 'stroke:var(--line-2);stroke-width:1.5';
      return `<svg viewBox="0 0 420 220" role="img" aria-label="VTA circuit: GABA interneuron inhibits dopamine neuron which projects to nucleus accumbens">
        <text x="20" y="20" style="font-size:12px;fill:var(--muted)">VTA</text><text x="330" y="20" style="font-size:12px;fill:var(--muted)">NAc</text>
        <circle cx="80" cy="70" r="26" style="fill:var(--surface);${hl('gaba')}"/><text x="80" y="74" text-anchor="middle" style="font-size:11px;fill:var(--nt-GABA)">GABA</text>
        <line x1="80" y1="96" x2="110" y2="132" style="stroke:var(--nt-GABA)" stroke-width="2.5" stroke-dasharray="11 4 2 4"/><text x="104" y="118" style="font-size:16px;fill:var(--nt-GABA)">⊣</text>
        <rect x="102" y="136" width="18" height="8" style="fill:var(--surface);${hl('gabaterm')}"/>
        <circle cx="130" cy="160" r="30" style="fill:var(--surface);${hl('da')}"/><text x="130" y="164" text-anchor="middle" style="font-size:11px;fill:var(--nt-DA)">DA neuron</text>
        <path d="M160,160 C230,160 260,90 320,90" style="fill:none;stroke:var(--nt-DA)" stroke-width="3" marker-end="url(#rw-arr)"/>
        <defs><marker id="rw-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--nt-DA)"/></marker></defs>
        <rect x="320" y="64" width="80" height="52" rx="10" style="fill:var(--surface);${hl('terminal')}"/><text x="360" y="94" text-anchor="middle" style="font-size:11px;fill:var(--text-2)">DA terminal</text>
        ${a ? `<text x="${a === 'gaba' ? 46 : a === 'gabaterm' ? 96 : a === 'da' ? 96 : 330}" y="${a === 'gaba' ? 40 : a === 'gabaterm' ? 132 : a === 'da' ? 205 : 140}" style="font-size:11px;fill:var(--warn);font-weight:700">drug acts here</text>` : ''}
      </svg>`;
    };
    const upd = k => {
      const v = PA.REWARD_DRUGS[k];
      el.querySelector('#rw-svg').innerHTML = svg(k);
      el.querySelector('#rw-m').style.width = v.da + '%';
      el.querySelector('#rw-t').innerHTML = esc(v.text) + ' ' + (v.ev ? U.ev(v.ev) : '');
      el.querySelector('#rw-r').innerHTML = U.refInline(v.refs || []);
    };
    el.querySelectorAll('[data-rd]').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('[data-rd]').forEach(x => x.setAttribute('aria-pressed', x === b)); upd(b.dataset.rd); }));
    upd('none');
  };

  /* =====================================================================
     TIME COURSE
     ===================================================================== */
  PA.TIMECOURSE = {
    antidepressant: ['Transporter/receptor binding (e.g. ~80% SERT occupancy) within hours of the first dose', 'Acute ↑ synaptic monoamines; autoreceptor brakes engaged; early side effects (nausea, activation)', 'Autoreceptor desensitisation, receptor & gene-expression changes, BDNF-related plasticity (proposed)', 'Clinical antidepressant/anxiolytic effect typically emerges over 2–6+ weeks; early partial improvement predicts response'],
    antipsychotic: ['D2 occupancy reached within hours (peak levels)', 'Calming/sedation and reduced agitation within hours–days (partly H1/α1)', 'Reduced aberrant salience; DA neuron adaptations (proposed)', 'Positive symptoms improve over weeks (some within week 1); negative/cognitive symptoms largely unchanged'],
    benzo: ['GABA-A PAM within minutes of absorption', 'Rapid anxiolysis/sedation (minutes–hours)', 'Tolerance to sedation (days–weeks); receptor adaptations', 'Dependence with long-term use — withdrawal on abrupt stop'],
    stimulant: ['DAT/NET blockade or reversal within 30–60 min', '↑ Striatal & PFC catecholamines during dosing interval', 'Same-day improvement in attention; titrate over 1–3 weeks', 'Little tolerance to therapeutic effect in most; appetite/sleep effects persist'],
    lithium: ['Li⁺ distributes to tissues; steady state ~5 days', 'Enzyme inhibition (IMPase, GSK-3) and second-messenger changes (proposed)', 'Gene-expression, circadian and neuroprotective adaptations (proposed)', 'Antimanic effect 1–3 weeks; prophylaxis over months–years'],
    ketamine: ['NMDA channel block during infusion/spray (minutes)', 'Glutamate burst, AMPA activation, BDNF release (proposed, hours)', 'mTORC1 → synaptogenesis in PFC (rodent, hours–days)', 'Antidepressant effect within hours; fades over ~1 week without repeat dosing'],
    opioid: ['MOR agonism (minutes)', 'Analgesia, euphoria, respiratory depression', 'Desensitisation, cAMP superactivation (days–weeks)', 'Tolerance, dependence; withdrawal on cessation'],
    ache: ['AChE inhibition within hours', '↑ Synaptic ACh', 'Steady state ~2–3 weeks (donepezil)', 'Modest cognitive/global benefit over weeks–months'],
    addiction: ['Drug binds target (seconds–minutes)', 'NAc DA surge → reinforcement', 'Repeated use: plasticity, habit circuits, stress systems', 'Tolerance, withdrawal, craving, relapse vulnerability (months–years)']
  };
  W.timecourse = function (el, key) {
    const tc = PA.TIMECOURSE[key] || PA.TIMECOURSE.antidepressant;
    const when = ['Immediately', 'Hours – days', 'Days – weeks', 'Weeks +'];
    el.innerHTML = `<div class="timeline" role="list">${tc.map((t, i) => `<div class="tstage" role="listitem"><div class="when">${when[i]}</div><div class="small">${esc(t)}</div></div>`).join('')}</div>
      <p class="small muted" style="margin-top:8px">Receptor pharmacology and clinical response are not temporally identical: binding is immediate, clinical effects often require downstream adaptation.</p>`;
  };
})();
