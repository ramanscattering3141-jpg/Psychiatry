/* Core vocabularies shared by every data module. */
window.PA = window.PA || {};

/* Evidence tags — every mechanism carries one. */
PA.EVIDENCE = {
  EST:  { label: 'Established pharmacology', glyph: '●', desc: 'Direct molecular action demonstrated repeatedly (binding, functional assays, human PET/clinical pharmacology). Textbook-level consensus.' },
  STR:  { label: 'Strong experimental evidence', glyph: '◆', desc: 'Robust, replicated experimental evidence (animal, cellular, human imaging) linking the mechanism to the effect, though not every step is proven in patients.' },
  CLIN: { label: 'Clinical association', glyph: '▲', desc: 'The clinical effect is well documented (trials, pharmacovigilance), but the mechanistic link is inferred from pharmacology rather than demonstrated directly.' },
  PROP: { label: 'Proposed mechanism', glyph: '◇', desc: 'A plausible, widely taught hypothesis with partial support. Competing explanations exist.' },
  UNK:  { label: 'Mechanism incompletely understood', glyph: '?', desc: 'The effect is real but its mechanism is unknown, multifactorial, or contested. Do not force a single-receptor explanation.' },
  SIMP: { label: 'Simplified teaching model', glyph: '≈', desc: 'A deliberately simplified conceptual model used for teaching. Useful for reasoning, not a literal description of biology.' }
};

/* Drug actions — each has a shape + glyph so meaning never depends on colour. */
PA.ACTIONS = {
  antagonist:   { label: 'Antagonist', glyph: '⊣', shape: 'square',   verb: 'blockade' },
  inverse:      { label: 'Inverse agonist / antagonist', glyph: '⊖', shape: 'square', verb: 'inverse agonism' },
  agonist:      { label: 'Agonist', glyph: '→', shape: 'circle',   verb: 'agonism' },
  partial:      { label: 'Partial agonist', glyph: '◐', shape: 'half',     verb: 'partial agonism' },
  inhibitor:    { label: 'Reuptake / enzyme inhibitor', glyph: '✕', shape: 'diamond',  verb: 'inhibition' },
  releaser:     { label: 'Releaser / reverse transport', glyph: '⇄', shape: 'hexagon',  verb: 'reverse transport' },
  pam:          { label: 'Positive allosteric modulator', glyph: '⊕', shape: 'triangle', verb: 'positive allosteric modulation' },
  blocker:      { label: 'Channel blocker', glyph: '▮', shape: 'bar',      verb: 'channel block' },
  modulator:    { label: 'Modulator / other', glyph: '∿', shape: 'circle',   verb: 'modulation' },
  ligand:       { label: 'Binds subunit (ligand)', glyph: '◎', shape: 'circle', verb: 'binding' }
};

/* Qualitative relative affinity grades used in fingerprints. NOT occupancy. */
PA.AFFINITY = {
  4: { label: 'Very high', desc: 'Among the drug\'s most potent actions (low-nM or sub-nM Ki); expected to be engaged at all clinical doses.' },
  3: { label: 'High', desc: 'Potent action likely engaged at usual clinical doses.' },
  2: { label: 'Moderate', desc: 'May contribute at usual or higher doses.' },
  1: { label: 'Low', desc: 'Weak action; clinical relevance doubtful or limited to high exposure.' }
};

/* Neurotransmitter systems. `dash` gives each a distinct line style. */
PA.NT = {
  DA:   { id: 'DA',   name: 'Dopamine',        color: 'var(--nt-DA)',   dash: '',             short: 'DA' },
  '5HT':{ id: '5HT',  name: 'Serotonin',       color: 'var(--nt-5HT)',  dash: '9 5',          short: '5-HT' },
  NE:   { id: 'NE',   name: 'Norepinephrine',  color: 'var(--nt-NE)',   dash: '2 5',          short: 'NE' },
  GABA: { id: 'GABA', name: 'GABA',            color: 'var(--nt-GABA)', dash: '11 4 2 4',     short: 'GABA' },
  GLU:  { id: 'GLU',  name: 'Glutamate',       color: 'var(--nt-GLU)',  dash: '16 6',         short: 'Glu' },
  ACH:  { id: 'ACH',  name: 'Acetylcholine',   color: 'var(--nt-ACH)',  dash: '5 3',          short: 'ACh' },
  HIS:  { id: 'HIS',  name: 'Histamine',       color: 'var(--nt-HIS)',  dash: '1 4 7 4',      short: 'HA' },
  ORX:  { id: 'ORX',  name: 'Orexin (hypocretin)', color: 'var(--nt-ORX)', dash: '13 3 3 3', short: 'Orx' },
  OPI:  { id: 'OPI',  name: 'Endogenous opioids', color: 'var(--nt-OPI)', dash: '4 2 1 2',   short: 'Opioid' },
  MEL:  { id: 'MEL',  name: 'Melatonin',       color: 'var(--nt-MEL)',  dash: '3 3',          short: 'Mel' },
  ECB:  { id: 'ECB',  name: 'Endocannabinoids', color: 'var(--nt-ECB)', dash: '6 2',          short: 'eCB' },
  OTHER:{ id: 'OTHER',name: 'Other / ion & enzyme targets', color: 'var(--nt-OTHER)', dash: '', short: 'Other' }
};

/* Chain step kinds — the core teaching grammar (direct vs downstream). */
PA.STEP_KINDS = {
  drug:     'Drug',
  direct:   'Direct molecular action',
  signal:   'Cellular signaling',
  circuit:  'Circuit / region',
  network:  'Network / physiology',
  clinical: 'Clinical effect'
};

PA.DISCLAIMER = 'Educational reference only — not personalised prescribing advice. Verify all doses, interactions and warnings against current official prescribing information and local guidelines.';
