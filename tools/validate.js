// Data-integrity checks: node tools/validate.js
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, console }; ctx.window = ctx; vm.createContext(ctx);
['core','refs','regions','receptors','mechanisms','effects','drugs','circuits','cases','stahl'].forEach(f =>
  vm.runInContext(fs.readFileSync(`assets/js/data/${f}.js`, 'utf8'), ctx, { filename: f }));
const PA = ctx.PA; const errs = [];
const chkR = (id, where) => { if (!PA.RECEPTOR[id]) errs.push(`unknown receptor ${id} in ${where}`); };
const chkG = (id, where) => { if (!PA.REGION[id]) errs.push(`unknown region ${id} in ${where}`); };
const chkRef = (p, where) => { if (!PA.refs[p]) errs.push(`unknown PMID ${p} in ${where}`); };
PA.REGIONS.forEach(r => { (r.receptors||[]).forEach(x => chkR(x, 'region '+r.id)); (r.children||[]).forEach(x => chkG(x, 'region children '+r.id)); });
PA.RECEPTORS.forEach(r => { (r.regions||[]).forEach(x => chkG(x, 'receptor '+r.id)); (r.refs||[]).forEach(p => chkRef(p, 'receptor '+r.id)); if (!PA.NT[r.nt]) errs.push('bad nt '+r.id); });
PA.MECHANISMS.forEach(m => { if (m.target) chkR(m.target, 'mech '+m.id); if (!PA.EFFECT[m.effect]) errs.push(`unknown effect ${m.effect} in mech ${m.id}`); if (!PA.EVIDENCE[m.ev]) errs.push('bad ev '+m.id);
  (m.regions||[]).forEach(x => chkG(x, 'mech '+m.id)); (m.refs||[]).forEach(p => chkRef(p, 'mech '+m.id)); (m.actions||[]).forEach(a => { if (!PA.ACTIONS[a]) errs.push('bad action '+a+' '+m.id); });
  if (m.whys && m.whys.length !== m.chain.length - 1 && m.whys.length !== m.chain.length) errs.push(`whys length ${m.whys.length} vs chain ${m.chain.length} in ${m.id}`); });
const ids = new Set(); PA.MECHANISMS.forEach(m => { if (ids.has(m.id)) errs.push('dup mech '+m.id); ids.add(m.id); });
PA.DRUGS.forEach(d => { d.t.forEach(([r,a,aff]) => { chkR(r, 'drug '+d.id); if (!PA.ACTIONS[a]) errs.push('bad action '+a+' drug '+d.id); if (!(aff>=1&&aff<=4)) errs.push('bad aff '+d.id); });
  (d.extra||[]).forEach(x => { if (!PA.MECH[x]) errs.push(`unknown extra ${x} in ${d.id}`); });
  (d.refs||[]).forEach(p => chkRef(p, 'drug '+d.id)); if (d.stahl && !PA.stahl[d.stahl]) errs.push('missing stahl '+d.id);
  if (!d.stahl && !d.rx && !d.substance) errs.push('no rx source '+d.id); if (!PA.CLASSES[d.cls]) errs.push('bad class '+d.id);
  ((d.mechOverride||{}).exclude||[]).forEach(x => { if (!PA.MECH[x]) errs.push('bad exclude '+x); });
  if (d.doseLevels) d.doseLevels.levels.forEach(l => Object.keys(l.engaged).forEach(r => chkR(r, 'doseLevels '+d.id))); });
PA.PROJECTIONS.forEach(p => { chkG(p.from, 'proj'); chkG(p.to, 'proj'); if (!PA.NT[p.nt]) errs.push('bad proj nt'); });
PA.CIRCUITS.forEach(c => { c.regions.forEach(x => chkG(x, 'circuit '+c.id)); c.path.forEach(x => chkG(x, 'circuit path '+c.id)); c.receptors.forEach(x => chkR(x, 'circuit '+c.id)); c.refs.forEach(p => chkRef(p, 'circuit '+c.id)); });
Object.entries(PA.NT_SYSTEMS).forEach(([k,s]) => { s.sources.forEach(x => chkG(x,'nt '+k)); s.receptors.forEach(x => chkR(x,'nt '+k)); s.refs.forEach(p => chkRef(p,'nt '+k)); });
PA.CASES.forEach(c => c.steps.forEach(s => { (s.answer||[]).concat(s.accept||[]).forEach(x => chkG(x, 'case '+c.id)); (s.refs||[]).forEach(p => chkRef(p,'case '+c.id)); if (s.type==='mc' && !s.options.some(o=>o.correct)) errs.push('no correct option '+c.id); }));
PA.AE_KEYS.forEach(k => { if (!PA.EFFECT[k.effect]) errs.push('ae key effect '+k.effect); });
PA.DRUGS.forEach(d => PA.AE_KEYS.forEach(k => { if (d.ae && d.ae[k.k] == null) errs.push(`missing ae.${k.k} in ${d.id}`); }));
// orphan effects (no mechanism and not referenced)
console.log(`${PA.DRUGS.length} drugs · ${PA.RECEPTORS.length} receptors · ${PA.REGIONS.length} regions · ${PA.MECHANISMS.length} mechanisms · ${PA.EFFECTS.length} effects · ${PA.CIRCUITS.length} circuits · ${Object.keys(PA.refs).length} refs · ${PA.CASES.length} cases`);
if (errs.length) { console.log(errs.join('\n')); process.exit(1); } else console.log('OK — all cross-references resolve');
