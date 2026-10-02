/* Schematic functional brain map (mid-sagittal teaching projection). */
(function () {
  const U = PA.U, esc = U.esc;
  const B = PA.Brain = {};

  const OUTLINE = {
    temporal: 'M468,370 C520,352 610,352 700,372 C738,384 738,422 702,436 C640,456 540,452 492,432 C462,418 452,388 468,370 Z',
    cerebrum: 'M150,318 C122,230 160,128 268,84 C380,40 566,36 696,78 C800,112 868,188 872,268 C875,322 846,356 800,362 C752,368 712,356 676,350 C640,346 610,346 590,352 C560,362 540,372 520,372 C490,372 470,380 450,392 C425,404 380,402 340,390 C296,376 252,390 214,380 C178,370 158,350 150,318 Z',
    brainstem: 'M596,340 C602,400 610,470 618,548 L654,548 C664,470 674,410 692,350 C668,342 620,338 596,340 Z',
    spinal: 'M618,546 L654,546 L652,628 Q636,636 620,628 Z',
    cc: 'M300,236 C330,190 430,166 540,170 C612,174 664,200 670,236 C662,252 642,248 632,234 C602,206 472,196 382,212 C342,220 324,240 312,252 Z',
    gyri: ['M230,112 C262,152 248,192 282,216', 'M360,68 C382,110 368,150 392,176', 'M482,54 C498,96 488,134 506,160', 'M602,62 C614,100 600,140 618,166', 'M716,96 C708,136 720,176 702,206', 'M796,152 C772,186 784,226 760,256', 'M180,250 C210,262 222,290 206,320', 'M520,402 C560,392 620,394 668,410', 'M500,420 C548,428 618,430 690,420']
  };

  function regionShape(r) {
    if (r.r) return `<circle class="shape" cx="${r.x}" cy="${r.y}" r="${r.r}"/>`;
    const rot = r.rot ? ` transform="rotate(${r.rot} ${r.x} ${r.y})"` : '';
    return `<ellipse class="shape" cx="${r.x}" cy="${r.y}" rx="${r.rx}" ry="${r.ry}"${rot}/>`;
  }

  function projPath(p) {
    const a = PA.REGION[p.from], b = PA.REGION[p.to];
    if (!a || !b) return null;
    const x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const off = Math.min(90, len * 0.22);
    // bend toward the dorsal (upper) side for a natural arc
    let nx = -dy / len, ny = dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
    const cx = mx + nx * off, cy = my + ny * off;
    // shorten end to stop at region edge
    const tr = (b.r || Math.min(b.rx, b.ry)) + 4;
    const ex = x2 - (x2 - cx) / Math.hypot(x2 - cx, y2 - cy) * tr;
    const ey = y2 - (y2 - cy) / Math.hypot(x2 - cx, y2 - cy) * tr;
    return `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
  }

  B.svg = function (opts) {
    opts = opts || {};
    const lit = opts.lit || {};
    const litIds = Object.keys(lit);
    const projections = opts.projections === 'all' ? PA.PROJECTIONS : (opts.projections || []);
    const nts = U.uniq(projections.map(p => p.nt));
    let s = `<svg viewBox="0 0 1000 640" role="group" aria-label="${esc(opts.label || 'Schematic brain map')}">`;
    s += `<defs>${Object.values(PA.NT).map(n => `<marker id="arr-${n.id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${n.color}"/></marker>`).join('')}
      <radialGradient id="glow" r="0.5"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs>`;
    s += `<path class="brain-outline" d="${OUTLINE.temporal}" opacity=".75"/>`;
    s += `<path class="brain-outline" d="${OUTLINE.cerebrum}"/>`;
    s += `<g aria-hidden="true">${OUTLINE.gyri.map(d => `<path class="brain-detail" d="${d}"/>`).join('')}</g>`;
    s += `<ellipse class="brain-outline" cx="770" cy="425" rx="88" ry="56"/>`;
    s += `<g aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<path class="brain-detail" d="M${700 + i * 6},${392 + i * 14} C740,${380 + i * 14} 800,${380 + i * 14} ${846 - i * 6},${396 + i * 12}"/>`).join('')}</g>`;
    s += `<path class="brain-outline" d="${OUTLINE.brainstem}"/>`;
    s += `<path class="brain-outline" d="${OUTLINE.spinal}"/>`;
    s += `<path d="${OUTLINE.cc}" style="fill:var(--brain-detail)" aria-hidden="true"/>`;
    s += `<line x1="450" y1="382" x2="440" y2="404" style="stroke:var(--brain-stroke)" stroke-width="3" aria-hidden="true"/>`;
    s += `<text class="brain-label-faint" x="170" y="420">rostral ←</text><text class="brain-label-faint" x="800" y="560">→ caudal</text>`;
    s += `<text class="brain-label-faint" x="700" y="610">schematic projection</text>`;

    // projections
    s += `<g class="projections">`;
    projections.forEach(p => {
      const d = projPath(p); if (!d) return;
      const n = PA.NT[p.nt] || PA.NT.OTHER;
      const faded = opts.focusCircuit && p.circuit !== opts.focusCircuit ? ' faded' : '';
      const title = `${n.name}: ${PA.REGION[p.from].name} → ${PA.REGION[p.to].name}${p.circuit && PA.CIRCUIT[p.circuit] ? ' (' + PA.CIRCUIT[p.circuit].name + ')' : ''}`;
      s += `<path class="proj${faded}" d="${d}" style="stroke:${n.color}" stroke-dasharray="${n.dash}" marker-end="url(#arr-${n.id})"><title>${esc(title)}</title></path>`;
      if (opts.flow !== false && !faded) s += `<path class="proj flow anim" d="${d}" style="stroke:${n.color}" stroke-width="4.5" stroke-dasharray="2 24" aria-hidden="true"/>`;
    });
    s += `</g>`;

    // regions: umbrellas first, then others, small nuclei last
    const order = PA.REGIONS.slice().sort((a, b) => (b.umbrella ? 1 : 0) - (a.umbrella ? 1 : 0) || (a.small ? 1 : 0) - (b.small ? 1 : 0));
    s += `<g class="regions">`;
    order.forEach(r => {
      if (opts.hideNuclei && r.group === 'Hypothalamic nuclei') return;
      const L = lit[r.id];
      const cls = ['region', r.umbrella ? 'umbrella' : '', r.small ? 'small' : '', opts.selected === r.id ? 'selected' : '', L ? 'lit' : '', opts.dimOthers && litIds.length && !L && opts.selected !== r.id ? 'dim' : ''].join(' ');
      const style = L && L.color ? ` style="--lit:${L.color}"` : '';
      let shape = regionShape(r);
      if (L && L.color) shape = shape.replace('class="shape"', `class="shape" style="stroke:${L.color};fill:color-mix(in srgb, ${L.color} ${r.umbrella ? 6 : (L.strength ? 12 + L.strength * 9 : 30)}%, ${r.umbrella ? 'transparent' : 'var(--region-fill)'})"`);
      const glow = L && !r.umbrella && !U.reduced() ? `<circle cx="${r.x}" cy="${r.y}" r="${(r.r || Math.max(r.rx, r.ry)) + 18}" fill="url(#glow)" aria-hidden="true"/>` : '';
      const lx = r.umbrella ? r.x - (r.rx || 0) + 8 : r.x;
      const ly = r.umbrella ? r.y - (r.ry || 0) + 14 : r.y + 4;
      const anchor = r.umbrella ? 'start' : 'middle';
      const label = r.umbrella ? r.abbr : r.abbr;
      s += `<g class="${cls}" data-region="${r.id}" tabindex="0" role="button" aria-pressed="${opts.selected === r.id}" aria-label="${esc(r.name)}${L && L.badge ? ' — ' + esc(L.badge) : ''}"${style}>
        <title>${esc(r.name)}${L && L.badge ? ' — ' + esc(L.badge) : ''}</title>${glow}${shape}
        <text class="lbl" x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(label)}</text>`;
      if (L && L.badge && !r.umbrella && (!r.small || opts.smallBadges)) {
        const bw = Math.min(150, 8 + L.badge.length * 5.6);
        const by = r.y - (r.r || r.ry) - 18;
        s += `<rect class="badge-bg" x="${r.x - bw / 2}" y="${by - 11}" width="${bw}" height="15" rx="4"/><text class="badge-tx" x="${r.x}" y="${by}" text-anchor="middle">${esc(L.badge)}</text>`;
      }
      s += `</g>`;
    });
    s += `</g></svg>`;
    return { svg: s, nts };
  };

  B.legend = function (nts) {
    if (!nts || !nts.length) return '';
    return `<div class="map-legend" aria-label="Line-style legend">${nts.map(id => { const n = PA.NT[id]; return `<span>${U.ntLine(id)} ${esc(n.name)}</span>`; }).join('')}<span class="muted">Arrow = direction of projection · dashed outline = umbrella region</span></div>`;
  };

  /* Render into element with interaction */
  B.render = function (el, opts) {
    const out = B.svg(opts);
    el.innerHTML = `<div class="brain-frame">${opts.toolbar || ''}${out.svg}${opts.legend !== false ? B.legend(out.nts) : ''}</div>`;
    const handler = e => {
      const g = e.target.closest('[data-region]'); if (!g) return;
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (opts.onSelect) opts.onSelect(g.dataset.region);
    };
    el.querySelector('svg').addEventListener('click', handler);
    el.querySelector('svg').addEventListener('keydown', handler);
    return el;
  };

  /* Text alternative listing every region */
  B.textList = function (onlyIds) {
    const groups = {};
    PA.REGIONS.forEach(r => { if (onlyIds && !onlyIds.includes(r.id)) return; (groups[r.group] = groups[r.group] || []).push(r); });
    return Object.entries(groups).map(([g, rs]) => `<h4 style="margin-top:12px">${esc(g)}</h4><div class="region-list">${rs.map(r => `<a href="#/atlas/${r.id}">${esc(r.name)} <span class="muted">(${esc(r.abbr)})</span></a>`).join('')}</div>`).join('');
  };
})();
