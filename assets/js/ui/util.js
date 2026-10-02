/* Shared helpers, inference engine and reusable renderers. */
(function () {
  const U = PA.U = {};
  const esc = U.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.$ = (sel, root) => (root || document).querySelector(sel);
  U.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  U.uniq = a => Array.from(new Set(a));
  U.store = {
    get(k, d) { try { const v = localStorage.getItem('pa.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pa.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  U.reduced = () => document.documentElement.classList.contains('reduced-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Inference engine ---------------- */
  U.targets = d => d.t.map(([r, action, aff, flags]) => ({ r, action, aff, primary: (flags || '').includes('P') }));

  /* Mechanisms a drug inherits from its target profile + its explicit extras. */
  U.mechsForDrug = function (d) {
    const out = []; const seen = new Set();
    const excl = new Set((d.mechOverride && d.mechOverride.exclude) || []);
    U.targets(d).forEach(t => {
      PA.MECHANISMS.forEach(m => {
        if (!m.target || m.target !== t.r || excl.has(m.id) || seen.has(m.id)) return;
        if (!m.actions.includes(t.action)) return;
        if (t.aff < (m.minAff || 2)) return;
        seen.add(m.id); out.push({ m, t });
      });
    });
    (d.extra || []).forEach(id => { const m = PA.MECH[id]; if (m && !seen.has(id) && !excl.has(id)) { seen.add(id); out.push({ m, t: null }); } });
    return out;
  };
  U.drugTarget = (d, rid) => U.targets(d).find(t => t.r === rid);
  U.drugsForReceptor = rid => PA.DRUGS.filter(d => U.drugTarget(d, rid)).map(d => ({ d, t: U.drugTarget(d, rid) })).sort((a, b) => b.t.aff - a.t.aff || a.d.name.localeCompare(b.d.name));
  U.mechsForEffect = eid => PA.MECHANISMS.filter(m => m.effect === eid);
  U.drugsForEffect = function (eid) {
    const key = (PA.AE_KEYS.find(k => k.effect === eid) || {}).k;
    return PA.DRUGS.map(d => {
      const ms = U.mechsForDrug(d).filter(x => x.m.effect === eid);
      const rating = key ? (d.ae || {})[key] : null;
      return { d, ms, rating };
    }).filter(x => x.ms.length || (x.rating != null && x.rating > 0))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.ms.length - a.ms.length);
  };
  U.receptorsForEffect = eid => U.uniq(U.mechsForEffect(eid).map(m => m.target).filter(Boolean));
  U.regionsForDrug = function (d) {
    const map = {};
    U.targets(d).forEach(t => {
      const r = PA.RECEPTOR[t.r]; if (!r) return;
      (r.regions || []).forEach(rid => { (map[rid] = map[rid] || []).push(t); });
    });
    return map;
  };
  U.circuitsForDrug = function (d) {
    const ids = U.mechsForDrug(d).map(x => x.m.circuit).filter(Boolean);
    return U.uniq(ids).filter(id => PA.CIRCUIT[id]);
  };
  U.halfLife = function (d) {
    const s = PA.stahl[d.stahl]; if (!s || !s.pk) return '';
    const l = s.pk.find(x => /half-life/i.test(x)); return l ? l.replace(/\s+/g, ' ') : '';
  };

  /* ---------------- Small renderers ---------------- */
  U.ev = function (code, opts) {
    const e = PA.EVIDENCE[code]; if (!e) return '';
    return `<span class="ev ev-${code}" title="${esc(e.desc)}"><span class="g" aria-hidden="true">${e.glyph}</span>${esc(opts && opts.short ? e.label.split(' ')[0] : e.label)}</span>`;
  };
  U.ntDot = nt => `<span class="nt-dot" style="background:${(PA.NT[nt] || PA.NT.OTHER).color}" aria-hidden="true"></span>`;
  U.ntLine = nt => { const n = PA.NT[nt] || PA.NT.OTHER; return `<svg width="28" height="8" aria-hidden="true"><line x1="1" y1="4" x2="27" y2="4" stroke="${n.color}" stroke-width="3" stroke-dasharray="${n.dash}"/></svg>`; };
  U.actGlyph = a => (PA.ACTIONS[a] || PA.ACTIONS.modulator).glyph;
  U.actLabel = a => (PA.ACTIONS[a] || PA.ACTIONS.modulator).label;
  U.rating = function (v, max) {
    max = max || 3; if (v == null) return '<span class="muted">—</span>';
    let s = `<span class="rating r${v}" role="img" aria-label="${v} of ${max}">`;
    for (let i = 1; i <= max; i++) s += `<i class="${i <= v ? 'on' : ''}"></i>`;
    return s + `</span><span class="rt-label">${['none', 'low', 'moderate', 'high'][v] || ''}</span>`;
  };
  U.lvlPill = v => `<span class="lvl-pill L${v}">${['None', 'Low', 'Moderate', 'High'][v]}</span>`;
  U.recLink = rid => `<a href="#/receptors/${encodeURIComponent(rid)}">${esc(PA.rl(rid))}</a>`;
  U.drugLink = id => PA.DRUG[id] ? `<a href="#/drug/${id}">${esc(PA.DRUG[id].name)}</a>` : esc(id);
  U.effLink = id => PA.EFFECT[id] ? `<a href="#/effects/${id}">${esc(PA.EFFECT[id].name)}</a>` : esc(id);
  U.regLink = id => PA.REGION[id] ? `<a href="#/atlas/${id}">${esc(PA.REGION[id].name)}</a>` : esc(id);

  U.refItem = function (pmid) {
    const r = PA.refs[pmid]; if (!r) return '';
    return `<li>${esc(r.a)} (${esc(r.y)}). ${esc(r.t)} <i>${esc(r.j)}</i>${r.v ? ' ' + esc(r.v) : ''}${r.p ? ':' + esc(r.p) : ''}. <a class="pm" href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener">PMID ${pmid}</a>${r.doi ? ` · <a class="pm" href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener">DOI</a>` : ''}</li>`;
  };
  U.refList = pmids => { const ids = U.uniq((pmids || []).filter(p => PA.refs[p])); return ids.length ? `<ul class="refs">${ids.map(U.refItem).join('')}</ul>` : '<p class="muted small">No specific PubMed reference attached — standard pharmacology / prescribing information.</p>'; };
  U.refInline = pmids => U.uniq((pmids || []).filter(p => PA.refs[p])).map(p => `<a class="chip" href="https://pubmed.ncbi.nlm.nih.gov/${p}/" target="_blank" rel="noopener" title="${esc(PA.refs[p].t)}">${esc(PA.refs[p].a.split(' ')[0])} ${esc(PA.refs[p].y)} · PMID ${p}</a>`).join(' ');

  /* ---------------- Mechanism chain (the core visual) ---------------- */
  let chainSeq = 0;
  U.chain = function (m, opts) {
    opts = opts || {};
    const id = 'ch' + (++chainSeq);
    const steps = [];
    if (opts.drug) steps.push(['drug', opts.drug]);
    m.chain.forEach(s => steps.push(s));
    const thera = m.type === 'ther';
    let html = `<div class="chain-wrap" data-mech="${m.id}">`;
    html += `<div class="chain-head">${opts.title !== false ? `<span class="title">${esc(opts.title || (PA.EFFECT[m.effect] ? PA.EFFECT[m.effect].name : m.effect))}</span>` : ''}
      <span class="chip">${thera ? '✓ therapeutic / protective' : '⚠ adverse'}</span>${U.ev(m.ev)}
      ${m.target ? `<span class="chip">${U.actGlyph(m.actions[0])} ${esc(PA.rl(m.target))}</span>` : '<span class="chip">not a single-receptor effect</span>'}
      <span class="spacer"></span><button class="btn small" data-why="${m.id}" data-why-step="-1" aria-label="Why: full explanation">WHY?</button></div>`;
    html += `<div class="chain" role="list" aria-label="Mechanism chain">`;
    steps.forEach((s, i) => {
      const [k, t] = s;
      const kind = k === 'clinical' ? 'clinical' + (thera ? ' thera' : '') : k;
      html += `<div class="step k-${kind}" role="listitem" style="--i:${i}"><span class="lvl">${esc(PA.STEP_KINDS[k] || k)}</span>${esc(t)}</div>`;
      if (i < steps.length - 1) {
        const whyIdx = opts.drug ? i - 1 : i;
        html += `<div class="arrow" style="--i:${i}">${whyIdx >= 0 ? `<button class="why" data-why="${m.id}" data-why-step="${whyIdx}" aria-label="Why does this step lead to the next?">WHY?</button>` : ''}<span aria-hidden="true">→</span></div>`;
      }
    });
    html += `</div>`;
    if (opts.showWhy) html += `<p class="small muted" style="margin:.5em 0 0">${esc(m.why || '')}</p>`;
    html += `</div>`;
    return html;
  };
  U.chainFromArray = function (arr, kinds) {
    return `<div class="chain">` + arr.map((t, i) => `<div class="step k-${kinds ? kinds[i] : (i === 0 ? 'drug' : i === arr.length - 1 ? 'clinical' : 'signal')}" style="--i:${i}">${esc(t)}</div>${i < arr.length - 1 ? `<div class="arrow" style="--i:${i}"><span aria-hidden="true">→</span></div>` : ''}`).join('') + `</div>`;
  };

  /* WHY modal */
  U.openModal = function (title, body) {
    const bd = U.$('#modal'); U.$('#modal-title').innerHTML = title; U.$('#modal-body').innerHTML = body;
    bd.hidden = false; U._lastFocus = document.activeElement; U.$('#modal .close-x').focus();
  };
  U.closeModal = function () { U.$('#modal').hidden = true; if (U._lastFocus) U._lastFocus.focus(); };
  U.showWhy = function (mid, stepIdx) {
    const m = PA.MECH[mid]; if (!m) return;
    const r = m.target ? PA.RECEPTOR[m.target] : null;
    let body = '';
    if (stepIdx >= 0 && m.chain[stepIdx] && m.chain[stepIdx + 1]) {
      body += `<div class="chain">${[m.chain[stepIdx], m.chain[stepIdx + 1]].map((s, i) => `<div class="step k-${s[0] === 'clinical' ? 'clinical' : s[0]}"><span class="lvl">${esc(PA.STEP_KINDS[s[0]])}</span>${esc(s[1])}</div>${i === 0 ? '<div class="arrow">→</div>' : ''}`).join('')}</div>`;
      body += `<p>${esc((m.whys && m.whys[stepIdx + 1]) || (m.whys && m.whys[stepIdx]) || m.why)}</p>`;
    } else {
      body += U.chain(m, { title: false });
      if (m.whys) body += `<ol class="bul small">${m.whys.map(w => `<li>${esc(w)}</li>`).join('')}</ol>`;
    }
    body += `<p><b>In summary:</b> ${esc(m.why)}</p>`;
    if (r) {
      body += `<h4>Receptor signalling — ${esc(r.name)}</h4>`;
      body += `<p class="small"><b>${esc(r.family)}</b> · ${esc(r.coupling)} · ${esc(r.tone)}</p>`;
      body += U.chainFromArray(r.cascade, r.cascade.map((_, i) => i === 0 ? 'direct' : 'signal'));
      if (r.sites) body += `<p class="small">${r.sites.pre ? `<b>Presynaptic:</b> ${esc(r.sites.pre)}<br>` : ''}${r.sites.post ? `<b>Postsynaptic:</b> ${esc(r.sites.post)}` : ''}</p>`;
    }
    body += `<p>${U.ev(m.ev)} <span class="small muted">${esc(PA.EVIDENCE[m.ev].desc)}</span></p>`;
    body += `<h4>References</h4>${U.refList(m.refs)}`;
    if (m.target) body += `<p><a class="btn small" href="#/receptors/${m.target}">Open ${esc(PA.rl(m.target))} in the receptor atlas →</a> <a class="btn small" href="#/effects/${m.effect}">All drugs causing this effect →</a></p>`;
    U.openModal(`WHY? <span class="muted" style="font-weight:500">${esc(PA.EFFECT[m.effect] ? PA.EFFECT[m.effect].name : '')}</span>`, body);
  };

  /* ---------------- Receptor fingerprint (bars) ---------------- */
  U.fingerprint = function (d, opts) {
    opts = opts || {};
    const hl = new Set(opts.highlight || []);
    const order = opts.order || U.targets(d).map(t => t.r);
    let html = `<div class="fp" role="table" aria-label="Receptor fingerprint of ${esc(d.name)}">`;
    order.forEach(rid => {
      const t = U.drugTarget(d, rid);
      const r = PA.RECEPTOR[rid];
      const color = r ? (PA.NT[r.nt] || PA.NT.OTHER).color : 'var(--nt-OTHER)';
      const w = t ? t.aff * 25 : 0;
      const isHl = hl.has(rid);
      html += `<div class="rn ${isHl ? 'hl' : ''}" role="rowheader"><a href="#/receptors/${encodeURIComponent(rid)}" style="color:inherit">${esc(PA.rl(rid))}</a></div>
        <div class="bar ${isHl ? 'hl' : ''} ${hl.size && !isHl ? 'dimmed' : ''}" role="cell" title="${t ? esc(U.actLabel(t.action) + ' — ' + PA.AFFINITY[t.aff].label + ' relative affinity') : 'No meaningful affinity'}"><i style="width:${w}%;background:${color}${t && t.action === 'partial' ? ';background-image:repeating-linear-gradient(45deg,transparent 0 4px,rgba(0,0,0,.25) 4px 7px)' : ''}"></i></div>
        <div class="act" role="cell">${t ? `${U.actGlyph(t.action)} ${t.aff}/4${t.primary ? ' ★' : ''}` : '—'}</div>`;
    });
    return html + '</div>';
  };
  U.fpLegend = () => `<div class="act-legend small">${['antagonist', 'inverse', 'agonist', 'partial', 'inhibitor', 'releaser', 'pam', 'blocker', 'ligand'].map(a => `<span><b>${PA.ACTIONS[a].glyph}</b> ${PA.ACTIONS[a].label}</span>`).join('')}<span><b>★</b> primary target</span></div><p class="small muted" style="margin-top:6px">Bar length = qualitative relative affinity (1–4) synthesised from published binding data. <b>Not</b> receptor occupancy. Hatched bars = partial agonism.</p>`;

  /* ---------------- Radial target map ---------------- */
  U.radial = function (d, opts) {
    opts = opts || {};
    const ts = U.targets(d);
    const W = 640, H = 500, cx = W / 2, cy = H / 2;
    const Rx = ts.length > 8 ? 240 : 205, Ry = ts.length > 8 ? 190 : 170;
    const SHORT = { 4: 'very high', 3: 'high', 2: 'moderate', 1: 'low' };
    const pos = i => { const a = -Math.PI / 2 + i * 2 * Math.PI / ts.length; return [cx + Rx * Math.cos(a), cy + Ry * Math.sin(a)]; };
    let s = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Radial receptor map for ${esc(d.name)}">`;
    ts.forEach((t, i) => { const [x, y] = pos(i); s += `<line class="spoke" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke-width="${1 + t.aff}" ${t.action === 'partial' ? 'stroke-dasharray="6 4"' : ''}/>`; });
    s += `<g class="center"><circle cx="${cx}" cy="${cy}" r="62"/><text x="${cx}" y="${cy + 5}" text-anchor="middle">${esc(d.name.split(' (')[0].split('–')[0])}</text></g>`;
    ts.forEach((t, i) => {
      const [x, y] = pos(i);
      const r = PA.RECEPTOR[t.r]; const col = r ? (PA.NT[r.nt] || PA.NT.OTHER).color : 'var(--nt-OTHER)';
      const label = (t.primary ? '★ ' : '') + PA.rl(t.r), sub = `${U.actGlyph(t.action)} ${SHORT[t.aff]}`;
      const w = Math.max(64, 14 + 7.2 * Math.max(label.length, sub.length)) + t.aff * 3, h = 40 + t.aff * 2;
      const shape = (PA.ACTIONS[t.action] || {}).shape;
      const box = (rx, extra) => `<rect class="tshape" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${rx}" fill="var(--surface)" stroke="${col}" stroke-width="2.5" ${extra || ''}/>`;
      let sh;
      if (shape === 'square') sh = box(5);
      else if (shape === 'bar') sh = box(2, 'stroke-dasharray="4 2"');
      else if (shape === 'diamond') sh = `<polygon class="tshape" points="${x},${y - h / 2 - 8} ${x + w / 2 + 10},${y} ${x},${y + h / 2 + 8} ${x - w / 2 - 10},${y}" fill="var(--surface)" stroke="${col}" stroke-width="2.5"/>`;
      else if (shape === 'triangle') sh = `<polygon class="tshape" points="${x - w / 2 - 6},${y + h / 2 + 2} ${x + w / 2 + 6},${y + h / 2 + 2} ${x + w / 2 - 10},${y - h / 2 - 4} ${x - w / 2 + 10},${y - h / 2 - 4}" fill="var(--surface)" stroke="${col}" stroke-width="2.5"/>`;
      else if (shape === 'hexagon') sh = `<polygon class="tshape" points="${x - w / 2 - 8},${y} ${x - w / 2 + 6},${y - h / 2} ${x + w / 2 - 6},${y - h / 2} ${x + w / 2 + 8},${y} ${x + w / 2 - 6},${y + h / 2} ${x - w / 2 + 6},${y + h / 2}" fill="var(--surface)" stroke="${col}" stroke-width="2.5"/>`;
      else if (shape === 'half') sh = `<ellipse class="tshape" cx="${x}" cy="${y}" rx="${w / 2 + 4}" ry="${h / 2 + 2}" fill="var(--surface)" stroke="${col}" stroke-width="2.5"/><path d="M${x},${y - h / 2 - 2} A${w / 2 + 4},${h / 2 + 2} 0 0 1 ${x},${y + h / 2 + 2} Z" fill="${col}" opacity=".22"/>`;
      else sh = `<ellipse class="tshape" cx="${x}" cy="${y}" rx="${w / 2 + 4}" ry="${h / 2 + 2}" fill="var(--surface)" stroke="${col}" stroke-width="2.5"/>`;
      s += `<g class="tnode ${opts.selected === t.r ? 'sel' : ''}" data-target="${esc(t.r)}" tabindex="0" role="button" aria-label="${esc(PA.rl(t.r))}: ${esc(U.actLabel(t.action))}, ${PA.AFFINITY[t.aff].label} relative affinity${t.primary ? ', primary target' : ''}">
        <title>${esc(PA.rl(t.r))} — ${esc(U.actLabel(t.action))} (${PA.AFFINITY[t.aff].label})</title>${sh}
        <text x="${x}" y="${y - 2}" text-anchor="middle">${esc(label)}</text>
        <text class="sub" x="${x}" y="${y + 13}" text-anchor="middle">${esc(sub)}</text></g>`;
    });
    return s + '</svg>';
  };

  /* ---------------- Tabs helper ---------------- */
  U.tabs = function (root, tabs, active, onChange) {
    const bar = `<div class="tabs" role="tablist">${tabs.map(t => `<button role="tab" aria-selected="${t.id === active}" data-tab="${t.id}">${esc(t.label)}</button>`).join('')}</div>`;
    root.insertAdjacentHTML('afterbegin', bar);
    root.querySelector('.tabs').addEventListener('click', e => {
      const b = e.target.closest('button[data-tab]'); if (!b) return;
      root.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
      onChange(b.dataset.tab);
    });
  };

  /* Global click delegation for WHY buttons */
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-why]');
    if (w) { e.preventDefault(); U.showWhy(w.dataset.why, parseInt(w.dataset.whyStep, 10)); }
  });
})();
