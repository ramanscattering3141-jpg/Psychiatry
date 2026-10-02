/* Measured binding affinities (Ki, nM) for antipsychotics.
 * Lower Ki = tighter binding. Values are copied from the cited source for each drug — mostly the
 * pharmacodynamics section (12.1/12.2) of the US prescribing information, which reports in-vitro Ki at
 * cloned human receptors. Labs, tissues and radioligands differ, so compare values across drugs as
 * approximate (≈ within 2–3-fold), not exact.
 * Row: { r: receptor id in PA.RECEPTOR (or null), lbl: display label, ki } or { lo, hi } for a range,
 *      gt: true for "greater than" (no appreciable binding at that concentration).
 * Drugs whose source gives no individual numbers keep only the qualitative grade in drugs.js.
 */
PA.KI_SRC = {
  abilify:   { label: 'ABILIFY (aripiprazole) US prescribing information, §12.2', url: 'https://www.otsuka-us.com/media/static/Abilify-PI.pdf' },
  rexulti:   { label: 'REXULTI (brexpiprazole) US prescribing information, §12.2', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/205422s009lbl.pdf' },
  maeda:     { label: 'Maeda K et al. J Pharmacol Exp Ther 2014;350:589–604', url: 'https://doi.org/10.1124/jpet.114.213793' },
  vraylar:   { label: 'VRAYLAR (cariprazine) US prescribing information, §12.2; Kiss B et al. J Pharmacol Exp Ther 2010;333:328–40', url: 'https://doi.org/10.1124/jpet.109.160432' },
  latuda:    { label: 'LATUDA (lurasidone) US prescribing information, §12.2', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lurasidone' },
  ishibashi: { label: 'Ishibashi T et al. J Pharmacol Exp Ther 2010;334:171–81', url: 'https://doi.org/10.1124/jpet.110.167346' },
  saphris:   { label: 'SAPHRIS (asenapine) US prescribing information, §12.2', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=asenapine' },
  geodon:    { label: 'GEODON (ziprasidone) US prescribing information, §12.2', url: 'https://labeling.pfizer.com/showlabeling.aspx?id=584' },
  zyprexa:   { label: 'ZYPREXA (olanzapine) US prescribing information, §12.2', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2014/020592s062021086s040021253s048lbl.pdf' },
  seroquel:  { label: 'SEROQUEL (quetiapine) Canadian product monograph, Pharmacodynamics', url: 'https://pdf.hres.ca/dpd_pm/00001972.PDF' },
  clozaril:  { label: 'CLOZARIL (clozapine) US prescribing information, §12.2', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clozapine' },
  caplyta:   { label: 'CAPLYTA (lumateperone) US prescribing information, §12.2', url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=db730b06-6351-47fd-8183-e61e61bbead5' },
  nuplazid:  { label: 'NUPLAZID (pimavanserin) US prescribing information, §12.2', url: 'https://www.nuplazid.com/pdf/nuplazid-prescribing-information.pdf' },
  risperdal: { label: 'RISPERDAL (risperidone) US prescribing information, §12.2 (reports ranges only)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=risperidone' }
};

PA.KI = {
  aripiprazole: { src: 'abilify', rows: [
    { r: 'D2', ki: 0.34 }, { r: 'D3', ki: 0.8 }, { r: '5HT1A', ki: 1.7 }, { r: '5HT2A', ki: 3.4 },
    { r: '5HT2C', ki: 15 }, { r: '5HT7', ki: 39 }, { r: 'D4', ki: 44 }, { r: 'A1', lbl: 'α1', ki: 57 },
    { r: 'H1', ki: 61 }, { r: 'SERT', ki: 98 }, { r: 'M1', lbl: 'Muscarinic', ki: 1000, gt: true, note: 'IC50' }] },
  brexpiprazole: { src: 'rexulti', rows: [
    { r: '5HT1A', ki: 0.12 }, { r: 'A1', lbl: 'α1B', ki: 0.17 }, { r: 'D2', ki: 0.30 }, { r: '5HT2A', ki: 0.47 },
    { r: 'A2', lbl: 'α2C', ki: 0.59 }, { r: 'D3', ki: 1.1 }, { r: '5HT2B', ki: 1.9 }, { r: null, lbl: 'α1D', ki: 2.6 },
    { r: '5HT7', ki: 3.7 }, { r: null, lbl: 'α1A', ki: 3.8 }, { r: 'H1', ki: 19 },
    { r: 'M1', ki: 1000, gt: true, src: 'maeda' }] },
  cariprazine: { src: 'vraylar', rows: [
    { r: 'D3', ki: 0.085 }, { r: 'D2', lbl: 'D2L', ki: 0.49 }, { r: null, lbl: 'D2S', ki: 0.69 }, { r: '5HT2B', ki: 0.58 },
    { r: '5HT1A', ki: 2.6 }, { r: '5HT2A', ki: 18.8 }, { r: 'H1', ki: 23.2 }, { r: '5HT2C', ki: 134 },
    { r: 'A1', lbl: 'α1A', ki: 155 }, { r: 'M1', lbl: 'Muscarinic', ki: 1000, gt: true, note: 'IC50' }] },
  lurasidone: { src: 'latuda', rows: [
    { r: '5HT2A', ki: 0.5 }, { r: '5HT7', ki: 0.5 }, { r: 'D2', ki: 1 }, { r: '5HT1A', ki: 6.4 },
    { r: 'A2', lbl: 'α2C', ki: 10.8 }, { r: 'A1', lbl: 'α1', ki: 48, src: 'ishibashi' }, { r: '5HT2C', ki: 415, src: 'ishibashi' },
    { r: 'H1', ki: 1000, gt: true, note: 'IC50' }, { r: 'M1', ki: 1000, gt: true, note: 'IC50' }] },
  asenapine: { src: 'saphris', rows: [
    { r: '5HT2C', ki: 0.03 }, { r: '5HT2A', ki: 0.07 }, { r: '5HT7', ki: 0.11 }, { r: '5HT2B', ki: 0.18 },
    { r: '5HT6', ki: 0.25 }, { r: null, lbl: 'α2B', ki: 0.33 }, { r: 'D3', ki: 0.42 }, { r: 'H1', ki: 1.0 },
    { r: 'D4', ki: 1.1 }, { r: 'A1', lbl: 'α1A', ki: 1.2 }, { r: 'A2', lbl: 'α2A', ki: 1.2 }, { r: null, lbl: 'α2C', ki: 1.2 },
    { r: 'D2', ki: 1.3 }, { r: 'D1', ki: 1.4 }, { r: null, lbl: '5-HT5A', ki: 1.6 }, { r: '5HT1A', ki: 2.5 },
    { r: '5HT1B', ki: 2.7 }, { r: null, lbl: 'H2', ki: 6.2 }, { r: 'M1', ki: 8128 }] },
  ziprasidone: { src: 'geodon', rows: [
    { r: '5HT2A', ki: 0.4 }, { r: '5HT2C', ki: 1.3 }, { r: '5HT1D', ki: 2 }, { r: '5HT1A', ki: 3.4 },
    { r: 'D2', ki: 4.8 }, { r: 'D3', ki: 7.2 }, { r: 'A1', lbl: 'α1', ki: 10 }, { r: 'H1', ki: 47 }] },
  olanzapine: { src: 'zyprexa', rows: [
    { r: '5HT2A', ki: 4 }, { r: '5HT6', ki: 5 }, { r: 'H1', ki: 7 }, { r: '5HT2C', ki: 11 },
    { r: 'D2', lbl: 'D1–D4', lo: 11, hi: 31 }, { r: 'A1', lbl: 'α1', ki: 19 }, { r: null, lbl: '5-HT3', ki: 57 },
    { r: 'M1', ki: 73 }, { r: null, lbl: 'M2', ki: 96 }, { r: 'M3', ki: 132 }, { r: 'M4', ki: 32 }, { r: null, lbl: 'M5', ki: 48 }] },
  quetiapine: { src: 'seroquel', rows: [
    { r: 'H1', ki: 10 }, { r: 'A1', lbl: 'α1', ki: 13 }, { r: '5HT2A', lbl: '5-HT2', ki: 288 }, { r: 'D2', ki: 531 },
    { r: '5HT1A', ki: 557 }, { r: 'D1', ki: 558 }, { r: 'A2', lbl: 'α2', ki: 782 }],
    note: 'Parent drug only. The active metabolite norquetiapine adds H1 binding (~3.4 nM) and moderate NET inhibition (10–100 nM; Jensen 2008).' },
  clozapine: { src: 'clozaril', rows: [
    { r: 'H1', ki: 1.1 }, { r: 'A1', lbl: 'α1A', ki: 1.6 }, { r: '5HT6', ki: 4 }, { r: '5HT2A', ki: 5.4 },
    { r: 'M1', ki: 6.2 }, { r: '5HT7', ki: 6.3 }, { r: '5HT2C', ki: 9.4 }, { r: 'D4', ki: 24 },
    { r: 'A2', lbl: 'α2A', ki: 90 }, { r: '5HT3', ki: 95 }, { r: '5HT1A', ki: 120 }, { r: 'D2', ki: 160 },
    { r: 'D1', ki: 270 }, { r: null, lbl: 'D5', ki: 454 }, { r: 'D3', ki: 555 }] },
  lumateperone: { src: 'caplyta', rows: [
    { r: '5HT2A', ki: 0.54 }, { r: 'D2', ki: 32 }, { r: 'SERT', ki: 33 }, { r: 'D1', ki: 41 },
    { r: 'A1', lbl: 'α1A / α1B', ki: 100, le: true }, { r: 'D4', ki: 100, le: true }],
    note: 'Low binding (< 50% inhibition at 100 nM) at muscarinic and histaminergic receptors.' },
  pimavanserin: { src: 'nuplazid', rows: [
    { r: '5HT2A', ki: 0.087 }, { r: '5HT2C', ki: 0.44 }, { r: 'SIGMA1', ki: 120 },
    { r: 'D2', lbl: 'D2 (and 5-HT2B, muscarinic, histamine, adrenergic)', ki: 300, gt: true }] },
  risperidone: { src: 'risperdal', rows: [
    { r: '5HT2A', lbl: '5-HT2, D2, α1, α2, H1', lo: 0.12, hi: 7.3 }, { r: '5HT1A', lbl: '5-HT1A/1C/1D', lo: 47, hi: 253 },
    { r: 'D1', lbl: 'D1, σ', lo: 620, hi: 800 }, { r: 'M1', lbl: 'Muscarinic', ki: 10000, gt: true }],
    rangeOnly: true }
};

/* Representative single number for sorting and bar length (geometric mean of a range). */
PA.kiValue = row => row.lo != null ? Math.sqrt(row.lo * row.hi) : row.ki;
/* Ki for one receptor of one drug, from rows with an exact receptor match (not range-only rows covering several receptors). */
PA.kiFor = (drugId, rid) => {
  const K = PA.KI[drugId]; if (!K || K.rangeOnly) return null;
  const rows = K.rows.filter(x => x.r === rid);
  if (!rows.length) return null;
  return rows.reduce((a, b) => (PA.kiValue(b) < PA.kiValue(a) ? b : a));
};
PA.kiText = row => {
  if (!row) return '';
  const f = v => v >= 100 ? Math.round(v).toLocaleString('en-US') : String(+v.toPrecision(3));
  if (row.lo != null) return `${f(row.lo)}–${f(row.hi)}`;
  return (row.gt ? '>' : row.le ? '≤' : '') + f(row.ki);
};
