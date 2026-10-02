/* Drug database.
 * t: target tuples [receptorId, action, affinity(1–4 qualitative), flags]  — flag 'P' = primary/defining target.
 *    Affinity grades are QUALITATIVE teaching ranks synthesised from published binding data (PDSP Ki database,
 *    Stahl), NOT receptor-occupancy measurements.
 * ae: relative clinical side-effect ratings 0–3 (teaching approximations from Stahl's Prescriber's Guide and
 *     network meta-analyses: Huhn 2019 for antipsychotics, Cipriani 2018 for antidepressants).
 * extra: drug-specific mechanisms not inherited from a single receptor action (see effects.js).
 * stahl: key into PA.stahl (prescribing data). Drugs without a Stahl chapter carry `rx` from the FDA label.
 * doseLevels: conceptual dose-dependent engagement (Low/Mod/High) — clearly labelled as conceptual.
 */
PA.CLASSES = {
  antidepressant: { name: 'Antidepressants', section: 'E', subs: ['SSRI', 'SNRI', 'TCA', 'MAOI', 'Atypical', 'Rapid-acting (glutamatergic)'] },
  antipsychotic:  { name: 'Antipsychotics', section: 'F', subs: ['Second-generation (atypical)', 'D2 partial agonist', 'First-generation', 'Non-D2 mechanism'] },
  mood:           { name: 'Mood stabilizers', section: 'G', subs: ['Lithium', 'Anticonvulsant'] },
  anxiolytic:     { name: 'Anxiolytics', section: 'H', subs: ['Benzodiazepine', 'Non-benzodiazepine'] },
  hypnotic:       { name: 'Sedative / hypnotics', section: 'I', subs: ['Benzodiazepine', 'Z-drug', 'Melatonin agonist', 'Orexin antagonist', 'Sedating antidepressant / antipsychotic'] },
  adhd:           { name: 'ADHD medications', section: 'J', subs: ['Stimulant', 'Non-stimulant', 'Wake-promoting'] },
  sud:            { name: 'Substance-use pharmacology', section: 'K', subs: ['Treatment: opioid use disorder', 'Treatment: alcohol use disorder', 'Treatment: nicotine', 'Substance (not a prescribing entry)'] },
  dementia:       { name: 'Cognitive / dementia', section: 'L', subs: ['Cholinesterase inhibitor', 'NMDA antagonist'] },
  movement:       { name: 'Movement-disorder agents', section: '·', subs: ['VMAT2 inhibitor', 'Anticholinergic'] }
};

PA.DRUGS = [];
function D(id, o) { o.id = id; PA.DRUGS.push(o); }

/* ======================= ANTIDEPRESSANTS ======================= */
const SSRI_REFS = ['15121647', '29477251', '19440080', '15014625'];
D('fluoxetine', { name: 'Fluoxetine', cls: 'antidepressant', sub: 'SSRI', stahl: 'fluoxetine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['5HT2C', 'antagonist', 2], ['NET', 'inhibitor', 1]],
  ae: { sed: 0, wt: 1, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 2 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: SSRI_REFS,
  notes: ['Active metabolite norfluoxetine (t½ ~1–2 weeks) → "self-tapering", fewest discontinuation symptoms but 5-week washout before an MAOI.', 'Potent CYP2D6 inhibitor (also 3A4 via norfluoxetine) — raises TCAs, many antipsychotics, β-blockers.', '5-HT2C antagonism proposed to contribute to its activating profile.'] });
D('sertraline', { name: 'Sertraline', cls: 'antidepressant', sub: 'SSRI', stahl: 'sertraline',
  t: [['SERT', 'inhibitor', 4, 'P'], ['DAT', 'inhibitor', 1], ['SIGMA1', 'agonist', 2]],
  ae: { sed: 1, wt: 1, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: SSRI_REFS,
  notes: ['Weak DAT inhibition (clinical relevance debated).', 'GI effects (diarrhoea) relatively common.', 'Moderate CYP2D6 inhibition at higher doses.'] });
D('escitalopram', { name: 'Escitalopram', cls: 'antidepressant', sub: 'SSRI', stahl: 'escitalopram',
  t: [['SERT', 'inhibitor', 4, 'P'], ['hERG', 'blocker', 1]],
  ae: { sed: 1, wt: 1, met: 0, eps: 0, akat: 1, prl: 0, qt: 1, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: SSRI_REFS,
  notes: ['S-enantiomer of citalopram; most SERT-selective SSRI (also binds an allosteric SERT site).', 'Dose-related QTc prolongation (less than citalopram).', 'Few CYP interactions.'] });
D('citalopram', { name: 'Citalopram', cls: 'antidepressant', sub: 'SSRI', stahl: 'citalopram',
  t: [['SERT', 'inhibitor', 4, 'P'], ['H1', 'antagonist', 1], ['hERG', 'blocker', 2]],
  ae: { sed: 1, wt: 1, met: 0, eps: 0, akat: 1, prl: 0, qt: 2, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: SSRI_REFS,
  labelNotes: [{ src: 'FDA Drug Safety Communication (2011, revised 2012)', text: 'Dose-dependent QT prolongation: maximum 40 mg/day; 20 mg/day in patients > 60 years, CYP2C19 poor metabolisers, hepatic impairment, or with cimetidine.' }],
  notes: ['Racemate: R-citalopram may oppose S-citalopram at SERT.', 'Weak H1 antagonism (R-enantiomer) — mild sedation in some.'] });
D('paroxetine', { name: 'Paroxetine', cls: 'antidepressant', sub: 'SSRI', stahl: 'paroxetine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['M1', 'antagonist', 2], ['NET', 'inhibitor', 2]],
  ae: { sed: 2, wt: 2, met: 1, eps: 0, akat: 1, prl: 0, qt: 0, ach: 2, orth: 0, sex: 3, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: SSRI_REFS,
  notes: ['Most anticholinergic SSRI → sedation, constipation, dry mouth; more weight gain.', 'Short half-life + nonlinear kinetics → prominent discontinuation symptoms.', 'Potent CYP2D6 inhibitor (mechanism-based) — e.g. reduces tamoxifen activation.', 'Possible ↑ cardiac malformation risk in first trimester (label).'] });
D('fluvoxamine', { name: 'Fluvoxamine', cls: 'antidepressant', sub: 'SSRI', stahl: 'fluvoxamine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['SIGMA1', 'agonist', 3]],
  ae: { sed: 2, wt: 1, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: SSRI_REFS,
  notes: ['Potent CYP1A2 and CYP2C19 inhibitor (also 3A4) — dangerous with clozapine, theophylline, tizanidine, ramelteon, agomelatine.', 'US approval: OCD.', 'σ1 agonism — proposed relevance uncertain.'] });

D('venlafaxine', { name: 'Venlafaxine', cls: 'antidepressant', sub: 'SNRI', stahl: 'venlafaxine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 2, 'P']],
  ae: { sed: 1, wt: 1, met: 0, eps: 0, akat: 1, prl: 0, qt: 1, ach: 0, orth: 0, sex: 3, seiz: 1, ins: 2 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['29477251', '30016772'],
  doseLevels: { note: 'Commonly taught: venlafaxine behaves like an SSRI at low doses, with clinically meaningful NET inhibition emerging at higher doses (~≥ 150–225 mg/day). Supported by its ~30-fold SERT>NET selectivity and dose-dependent BP effects; the exact threshold is not precisely defined.', ev: 'SIMP',
    levels: [{ dose: '75 mg/day', engaged: { SERT: 3, NET: 1 } }, { dose: '150 mg/day', engaged: { SERT: 3, NET: 2 } }, { dose: '225–375 mg/day', engaged: { SERT: 3, NET: 3 } }] },
  notes: ['Dose-dependent ↑ BP (monitor).', 'Short half-life → marked discontinuation symptoms; use XR.', 'More toxic in overdose than SSRIs.'] });
D('desvenlafaxine', { name: 'Desvenlafaxine', cls: 'antidepressant', sub: 'SNRI', stahl: 'desvenlafaxine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 2, 'P']],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 2 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['29477251'],
  notes: ['Active metabolite of venlafaxine (O-desmethylvenlafaxine); minimal CYP metabolism → few PK interactions.', 'Renally cleared — adjust in renal impairment.'] });
D('duloxetine', { name: 'Duloxetine', cls: 'antidepressant', sub: 'SNRI', stahl: 'duloxetine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 3, 'P']],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic', 'dul_hep'], tc: 'antidepressant', refs: ['29477251'],
  notes: ['Approved for diabetic peripheral neuropathic pain, fibromyalgia, chronic musculoskeletal pain — descending inhibition mechanism.', 'Moderate CYP2D6 inhibitor; CYP1A2 substrate (fluvoxamine contraindicated).', 'Avoid in heavy alcohol use / chronic liver disease.'] });
D('levomilnacipran', { name: 'Levomilnacipran', cls: 'antidepressant', sub: 'SNRI', stahl: 'levomilnacipran',
  t: [['NET', 'inhibitor', 4, 'P'], ['SERT', 'inhibitor', 3, 'P']],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['29477251'],
  notes: ['More potent at NET than SERT (unlike other SNRIs) — ↑ HR, urinary hesitancy, sweating.', 'Enantiomer of milnacipran.'] });

const TCA_EXTRA = ['ad_suic'];
D('amitriptyline', { name: 'Amitriptyline', cls: 'antidepressant', sub: 'TCA', stahl: 'amitriptyline',
  t: [['SERT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 3, 'P'], ['H1', 'antagonist', 4], ['M1', 'antagonist', 4], ['A1', 'antagonist', 4], ['5HT2A', 'antagonist', 3], ['5HT2C', 'antagonist', 3], ['NaV', 'blocker', 3], ['hERG', 'blocker', 2]],
  ae: { sed: 3, wt: 3, met: 1, eps: 0, akat: 0, prl: 0, qt: 2, ach: 3, orth: 3, sex: 2, seiz: 2, ins: 0 },
  extra: TCA_EXTRA, tc: 'antidepressant', refs: ['14999113', '29477251'],
  doseLevels: { note: 'Low doses (10–50 mg) used for neuropathic pain, migraine prophylaxis and sleep engage H1/5-HT2/α1/M1 strongly with partial reuptake inhibition; antidepressant doses (150–300 mg) add full SERT/NET inhibition — and full toxicity. Conceptual, not occupancy data.', ev: 'SIMP',
    levels: [{ dose: '10–25 mg', engaged: { H1: 3, M1: 2, A1: 2, '5HT2A': 2, SERT: 1, NET: 1 } }, { dose: '50–100 mg', engaged: { H1: 3, M1: 3, A1: 3, '5HT2A': 3, SERT: 2, NET: 2 } }, { dose: '150–300 mg', engaged: { H1: 3, M1: 3, A1: 3, '5HT2A': 3, SERT: 3, NET: 3, NaV: 2 } }] },
  notes: ['Tertiary amine — demethylated to nortriptyline (NET-preferring).', 'A "receptor profile in one molecule": SERT/NET + H1 + M1 + α1 + NaV — predict sedation, weight gain, anticholinergic effects, orthostasis, and lethality in overdose.', 'Narrow overdose margin: ~10× daily dose can be fatal.'] });
D('nortriptyline', { name: 'Nortriptyline', cls: 'antidepressant', sub: 'TCA', stahl: 'nortriptyline',
  t: [['NET', 'inhibitor', 4, 'P'], ['SERT', 'inhibitor', 2], ['H1', 'antagonist', 3], ['M1', 'antagonist', 2], ['A1', 'antagonist', 2], ['NaV', 'blocker', 3], ['hERG', 'blocker', 2]],
  ae: { sed: 2, wt: 2, met: 1, eps: 0, akat: 0, prl: 0, qt: 2, ach: 2, orth: 1, sex: 1, seiz: 1, ins: 0 },
  extra: TCA_EXTRA, tc: 'antidepressant', refs: ['14999113'],
  notes: ['Secondary amine: less anticholinergic & orthostatic than amitriptyline — preferred TCA in elderly when a TCA is needed.', 'Therapeutic window: plasma level ~50–150 ng/mL.'] });
D('imipramine', { name: 'Imipramine', cls: 'antidepressant', sub: 'TCA', stahl: 'imipramine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 3, 'P'], ['H1', 'antagonist', 3], ['M1', 'antagonist', 3], ['A1', 'antagonist', 3], ['NaV', 'blocker', 3], ['hERG', 'blocker', 2]],
  ae: { sed: 2, wt: 2, met: 1, eps: 0, akat: 0, prl: 0, qt: 2, ach: 3, orth: 3, sex: 2, seiz: 2, ins: 0 },
  extra: TCA_EXTRA, tc: 'antidepressant', refs: ['14999113'],
  notes: ['The first TCA (1950s); metabolised to desipramine.', 'Approved also for childhood enuresis.'] });
D('clomipramine', { name: 'Clomipramine', cls: 'antidepressant', sub: 'TCA', stahl: 'clomipramine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 2], ['H1', 'antagonist', 3], ['M1', 'antagonist', 3], ['A1', 'antagonist', 3], ['D2', 'antagonist', 1], ['NaV', 'blocker', 3], ['hERG', 'blocker', 2]],
  ae: { sed: 3, wt: 2, met: 1, eps: 0, akat: 0, prl: 1, qt: 2, ach: 3, orth: 2, sex: 3, seiz: 3, ins: 0 },
  extra: TCA_EXTRA, tc: 'antidepressant', refs: ['14999113'],
  notes: ['Most serotonergic TCA — approved for OCD.', 'Desmethylclomipramine is NET-selective.', 'Highest seizure risk among TCAs (dose-related); serotonin syndrome risk with MAOIs.'] });
D('desipramine', { name: 'Desipramine', cls: 'antidepressant', sub: 'TCA', stahl: 'desipramine',
  t: [['NET', 'inhibitor', 4, 'P'], ['SERT', 'inhibitor', 1], ['H1', 'antagonist', 1], ['M1', 'antagonist', 2], ['A1', 'antagonist', 1], ['NaV', 'blocker', 3], ['hERG', 'blocker', 2]],
  ae: { sed: 1, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 2, ach: 1, orth: 1, sex: 1, seiz: 1, ins: 1 },
  extra: TCA_EXTRA, tc: 'antidepressant', refs: ['14999113'],
  notes: ['Most NET-selective TCA.', 'Case reports of sudden death in children — caution.'] });

D('phenelzine', { name: 'Phenelzine', cls: 'antidepressant', sub: 'MAOI', stahl: 'phenelzine',
  t: [['MAOA', 'inhibitor', 4, 'P'], ['MAOB', 'inhibitor', 4], ['GABAT', 'inhibitor', 2]],
  ae: { sed: 2, wt: 3, met: 1, eps: 0, akat: 0, prl: 0, qt: 0, ach: 1, orth: 3, sex: 3, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['15784664'],
  notes: ['Irreversible, non-selective (hydrazine) MAOI.', 'Also ↑ brain GABA (GABA-T inhibition by metabolite) — anxiolytic contribution proposed.', 'Tyramine diet & drug-interaction counselling mandatory.'] });
D('tranylcypromine', { name: 'Tranylcypromine', cls: 'antidepressant', sub: 'MAOI', stahl: 'tranylcypromine',
  t: [['MAOA', 'inhibitor', 4, 'P'], ['MAOB', 'inhibitor', 4], ['NET', 'releaser', 1]],
  ae: { sed: 0, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 2, sex: 2, seiz: 0, ins: 3 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['15784664'],
  notes: ['Irreversible non-hydrazine MAOI with amphetamine-like structure — activating.', 'Tyramine pressor sensitivity high.'] });
D('isocarboxazid', { name: 'Isocarboxazid', cls: 'antidepressant', sub: 'MAOI', stahl: 'isocarboxazid',
  t: [['MAOA', 'inhibitor', 4, 'P'], ['MAOB', 'inhibitor', 4]],
  ae: { sed: 1, wt: 2, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 1, orth: 2, sex: 2, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['15784664'], notes: ['Irreversible hydrazine MAOI; least commonly used.'] });
D('selegiline', { name: 'Selegiline (transdermal)', cls: 'antidepressant', sub: 'MAOI', stahl: 'selegiline',
  t: [['MAOB', 'inhibitor', 4, 'P'], ['MAOA', 'inhibitor', 3, 'P']],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 1, sex: 1, seiz: 0, ins: 2 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['15784664'],
  doseLevels: { note: 'Dose determines selectivity: oral 5–10 mg is MAO-B-selective (Parkinson disease); the 6 mg/24 h transdermal patch inhibits brain MAO-A and MAO-B while largely sparing gut MAO-A (no dietary restriction at 6 mg); higher patch doses (9–12 mg) need tyramine precautions. Conceptual levels.', ev: 'CLIN',
    levels: [{ dose: 'Oral 5–10 mg', engaged: { MAOB: 3, MAOA: 1 } }, { dose: 'Patch 6 mg/24 h', engaged: { MAOB: 3, MAOA: 2 } }, { dose: 'Patch 9–12 mg/24 h', engaged: { MAOB: 3, MAOA: 3 } }] },
  notes: ['Transdermal route bypasses gut MAO-A first-pass — the formulation changes the safety profile.'] });

D('mirtazapine', { name: 'Mirtazapine', cls: 'antidepressant', sub: 'Atypical', stahl: 'mirtazapine', flagship: true,
  t: [['A2', 'antagonist', 4, 'P'], ['H1', 'inverse', 4, 'P'], ['5HT2A', 'antagonist', 3], ['5HT2C', 'antagonist', 3], ['5HT3', 'antagonist', 3], ['A1', 'antagonist', 1], ['M1', 'antagonist', 1]],
  ae: { sed: 3, wt: 3, met: 1, eps: 0, akat: 0, prl: 0, qt: 0, ach: 1, orth: 1, sex: 0, seiz: 0, ins: 0 },
  extra: ['ad_suic', 'mirt_neut'], tc: 'antidepressant', refs: ['8636062', '11607047', '9017762', '12629531', '29477251'],
  also: ['hypnotic'],
  notes: ['α2 antagonist (NaSSA): increases NE and 5-HT release by removing presynaptic brakes rather than by reuptake inhibition.', 'Very high H1 affinity → sedation and appetite/weight gain at every clinical dose.', '5-HT2A/2C/3 blockade → low sexual dysfunction & nausea; useful in combination with SNRIs ("California rocket fuel").', 'Linear pharmacokinetics over 15–80 mg (label).'] });
D('bupropion', { name: 'Bupropion', cls: 'antidepressant', sub: 'Atypical', stahl: 'bupropion',
  t: [['NET', 'inhibitor', 2, 'P'], ['DAT', 'inhibitor', 2, 'P'], ['nAChR_a4b2', 'antagonist', 2]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 1, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 2, ins: 2 },
  extra: ['ad_suic', 'bup_seiz'], tc: 'antidepressant', refs: ['29477251'],
  notes: ['NDRI: weak NET/DAT inhibitor; active metabolites (hydroxybupropion) contribute substantially.', 'PET: modest striatal DAT occupancy (~20–25%) at clinical doses — low abuse potential orally.', 'No serotonergic action → no sexual dysfunction; weight neutral/loss.', 'Strong CYP2D6 inhibitor.', 'Also approved for smoking cessation (nicotinic antagonism + catecholaminergic actions).'] });
D('trazodone', { name: 'Trazodone', cls: 'antidepressant', sub: 'Atypical', stahl: 'trazodone',
  t: [['5HT2A', 'antagonist', 4, 'P'], ['A1', 'antagonist', 3], ['H1', 'antagonist', 2], ['SERT', 'inhibitor', 2, 'P'], ['5HT1A', 'partial', 2], ['5HT2C', 'antagonist', 2], ['A2', 'antagonist', 1]],
  ae: { sed: 3, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 1, ach: 0, orth: 2, sex: 1, seiz: 0, ins: 0 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['20095366'], also: ['hypnotic'],
  doseLevels: { note: 'Stahl (2009) describes trazodone as "multifunctional": at low (hypnotic) doses 25–150 mg its most potent actions — 5-HT2A, H1 and α1 blockade — dominate; SERT inhibition requires antidepressant doses (150–600 mg). This is based on relative binding affinities and widely taught — treat the levels as conceptual.', ev: 'SIMP',
    levels: [{ dose: '25–100 mg (hypnotic)', engaged: { '5HT2A': 3, A1: 2, H1: 2, SERT: 1 } }, { dose: '150–300 mg', engaged: { '5HT2A': 3, A1: 3, H1: 2, SERT: 2 } }, { dose: '300–600 mg', engaged: { '5HT2A': 3, A1: 3, H1: 3, SERT: 3 } }] },
  notes: ['SARI: serotonin 2A antagonist / reuptake inhibitor.', 'Widely used off-label at low dose for insomnia.', 'Priapism (α1) — rare but warn patients.'] });
D('vortioxetine', { name: 'Vortioxetine', cls: 'antidepressant', sub: 'Atypical', stahl: 'vortioxetine',
  t: [['SERT', 'inhibitor', 4, 'P'], ['5HT3', 'antagonist', 4], ['5HT7', 'antagonist', 3], ['5HT1D', 'antagonist', 3], ['5HT1B', 'partial', 3], ['5HT1A', 'agonist', 3]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 0 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['25016186', '29477251'],
  notes: ['"Multimodal": SERT inhibition plus several 5-HT receptor actions (Sanchez 2015).', 'Proposed pro-cognitive effects in MDD (5-HT7/5-HT3 antagonism, 5-HT1A agonism) — proposed.', 'Nausea is the most common adverse effect (dose-related) despite 5-HT3 antagonism.', 'Long half-life (~66 h).'] });
D('vilazodone', { name: 'Vilazodone', cls: 'antidepressant', sub: 'Atypical', stahl: 'vilazodone',
  t: [['SERT', 'inhibitor', 4, 'P'], ['5HT1A', 'partial', 4, 'P']],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 1 },
  extra: ['ad_suic'], tc: 'antidepressant', refs: ['7940983'],
  notes: ['SPARI: SERT inhibitor + 5-HT1A partial agonist — designed to bypass the autoreceptor "brake" (proposed faster onset not clearly demonstrated).', 'Take with food (bioavailability).', 'Diarrhoea/nausea common.'] });
D('agomelatine', { name: 'Agomelatine', cls: 'antidepressant', sub: 'Atypical', stahl: 'agomelatine',
  t: [['MT1', 'agonist', 4, 'P'], ['MT2', 'agonist', 4, 'P'], ['5HT2C', 'antagonist', 2, 'P']],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['ad_suic', 'ago_hep'], tc: 'antidepressant', refs: ['20577266'],
  labelNotes: [{ src: 'Regulatory status', text: 'Approved in the EU/UK/Australia (Valdoxan); NOT approved in the USA.' }],
  notes: ['Melatonergic agonist + 5-HT2C antagonist (de Bodinat 2010).', 'No sexual dysfunction or discontinuation syndrome; LFT monitoring required.', 'CYP1A2 substrate — fluvoxamine/ciprofloxacin contraindicated.'] });
D('esketamine', { name: 'Esketamine (intranasal)', cls: 'antidepressant', sub: 'Rapid-acting (glutamatergic)', stahl: 'esketamine',
  t: [['NMDA', 'blocker', 3, 'P']],
  ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['ad_suic'], tc: 'ketamine', refs: ['29532791'],
  labelNotes: [{ src: 'FDA (2025)', text: 'Approved as monotherapy for treatment-resistant depression in adults (January 2025), in addition to use with an oral antidepressant; administered only in certified healthcare settings under a REMS with ≥ 2 h observation.' }],
  notes: ['S-enantiomer of ketamine (higher NMDA affinity).', 'Dissociation, sedation, ↑ BP peak ~40 min post-dose.'] });
D('ketamine', { name: 'Ketamine', cls: 'antidepressant', sub: 'Rapid-acting (glutamatergic)', stahl: 'ketamine',
  t: [['NMDA', 'blocker', 3, 'P'], ['MOR', 'agonist', 1]],
  ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'ketamine', refs: ['29532791', '20716669'],
  notes: ['IV racemic ketamine for depression is OFF-LABEL (approved as an anaesthetic).', 'Open-channel "trapping" NMDA blocker.', 'Misuse liability; cystitis with chronic heavy use.'] });

/* ======================= ANTIPSYCHOTICS ======================= */
const AP_EXTRA = ['ap_dementia', 'd2_dystonia'];
const AP_REFS = ['10739409', '31303314', '23810019', '2571717'];
D('clozapine', { name: 'Clozapine', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'clozapine', flagship: true,
  t: [['D2', 'antagonist', 2, 'P'], ['D1', 'antagonist', 2], ['D4', 'antagonist', 3], ['5HT2A', 'inverse', 4, 'P'], ['5HT2C', 'inverse', 3], ['5HT1A', 'partial', 2], ['5HT6', 'antagonist', 3], ['5HT7', 'antagonist', 3], ['H1', 'inverse', 4], ['M1', 'antagonist', 4], ['M4', 'partial', 2], ['A1', 'antagonist', 4], ['A2', 'antagonist', 3]],
  ae: { sed: 3, wt: 3, met: 3, eps: 0, akat: 0, prl: 0, qt: 1, ach: 3, orth: 3, sex: 1, seiz: 3, ins: 0 },
  extra: ['clz_neut', 'clz_myo', 'clz_seiz', 'clz_sial', 'clz_gi', 'ap_metab', 'ap_dementia'], tc: 'antipsychotic',
  refs: ['31303314', '34083506', '35067911', '29548760', '2006003', '12629531', '19931306'],
  labelNotes: [{ src: 'FDA (2025)', text: 'The Clozapine REMS program was eliminated in 2025; neutropenia monitoring recommendations remain in labelling — follow current prescribing information and local protocols for ANC monitoring.' }],
  notes: ['Low D2 occupancy at therapeutic doses (often < 60%) with fast D2 dissociation → virtually no EPS or prolactin rise.', 'Most effective drug for treatment-resistant schizophrenia; reduces suicidal behaviour.', 'Metabolised by CYP1A2: SMOKING induces 1A2 — stopping smoking can raise levels ~50%; fluvoxamine and ciprofloxacin raise levels dangerously.', 'N-desmethylclozapine (norclozapine) is an M1 agonist — proposed relevance to cognition/sialorrhea.'] });
D('olanzapine', { name: 'Olanzapine', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'olanzapine',
  t: [['D2', 'antagonist', 3, 'P'], ['5HT2A', 'inverse', 4, 'P'], ['5HT2C', 'inverse', 3], ['5HT6', 'antagonist', 3], ['H1', 'inverse', 4], ['M1', 'antagonist', 3], ['A1', 'antagonist', 2], ['D1', 'antagonist', 2]],
  ae: { sed: 2, wt: 3, met: 3, eps: 1, akat: 1, prl: 1, qt: 1, ach: 2, orth: 1, sex: 1, seiz: 1, ins: 0 },
  extra: ['ap_metab', 'olz_pdss', ...AP_EXTRA], tc: 'antipsychotic', refs: [...AP_REFS, '12629531', '17360666', '7700379', '19931306'],
  notes: ['Combined very high H1 + 5-HT2C antagonism + muscarinic blockade → among the highest weight & metabolic liability.', 'CYP1A2 substrate — smoking lowers levels.', 'Olanzapine/samidorphan combination attenuates (not abolishes) weight gain.'] });
D('quetiapine', { name: 'Quetiapine', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'quetiapine',
  t: [['D2', 'antagonist', 1, 'P'], ['5HT2A', 'antagonist', 2, 'P'], ['H1', 'antagonist', 4], ['A1', 'antagonist', 3], ['A2', 'antagonist', 2], ['5HT1A', 'partial', 1], ['NET', 'inhibitor', 2], ['5HT2C', 'antagonist', 1], ['M1', 'antagonist', 1]],
  ae: { sed: 3, wt: 2, met: 2, eps: 0, akat: 0, prl: 0, qt: 1, ach: 1, orth: 2, sex: 1, seiz: 0, ins: 0 },
  extra: ['ap_metab', ...AP_EXTRA], tc: 'antipsychotic', refs: [...AP_REFS], also: ['hypnotic'],
  doseLevels: { note: 'Quetiapine\'s most potent action is H1 blockade; D2 occupancy is low and transient. At low doses (25–100 mg, used off-label for sleep) H1/α1 effects dominate; antidepressant effects in bipolar depression (300 mg) are attributed partly to norquetiapine NET inhibition and 5-HT2C/5-HT1A actions (proposed); antipsychotic doses (400–800 mg) are needed for meaningful D2 occupancy. Conceptual — note that low-dose use still carries metabolic risk.', ev: 'SIMP',
    levels: [{ dose: '25–100 mg', engaged: { H1: 3, A1: 2, '5HT2A': 1, D2: 0, NET: 1 } }, { dose: '300 mg', engaged: { H1: 3, A1: 3, '5HT2A': 2, D2: 1, NET: 2 } }, { dose: '600–800 mg', engaged: { H1: 3, A1: 3, '5HT2A': 3, D2: 2, NET: 2 } }] },
  notes: ['Norquetiapine (active metabolite) inhibits NET and is a 5-HT1A partial agonist.', 'Low-dose "sleep" use exposes patients to metabolic risk without good evidence — a common prescribing pitfall.'] });
D('risperidone', { name: 'Risperidone', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'risperidone',
  t: [['D2', 'antagonist', 4, 'P'], ['5HT2A', 'inverse', 4, 'P'], ['5HT7', 'antagonist', 3], ['A1', 'antagonist', 3], ['A2', 'antagonist', 3], ['H1', 'antagonist', 2], ['5HT2C', 'antagonist', 2]],
  ae: { sed: 1, wt: 2, met: 1, eps: 2, akat: 1, prl: 3, qt: 1, ach: 0, orth: 2, sex: 2, seiz: 0, ins: 1 },
  extra: ['ap_metab', ...AP_EXTRA], tc: 'antipsychotic', refs: [...AP_REFS, '15456328'],
  notes: ['Behaves "atypically" at low doses (≤ 4–6 mg) but EPS rises with dose — illustrating that atypicality is dose-dependent.', 'Among the highest prolactin elevation (pituitary outside BBB; P-gp substrate with relatively limited brain penetration).', 'CYP2D6 → 9-hydroxyrisperidone (= paliperidone).'] });
D('paliperidone', { name: 'Paliperidone', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'paliperidone',
  t: [['D2', 'antagonist', 4, 'P'], ['5HT2A', 'inverse', 4, 'P'], ['5HT7', 'antagonist', 3], ['A1', 'antagonist', 3], ['A2', 'antagonist', 2], ['H1', 'antagonist', 2]],
  ae: { sed: 1, wt: 2, met: 1, eps: 2, akat: 1, prl: 3, qt: 1, ach: 0, orth: 1, sex: 2, seiz: 0, ins: 1 },
  extra: ['ap_metab', ...AP_EXTRA], tc: 'antipsychotic', refs: [...AP_REFS, '15456328'],
  notes: ['9-hydroxyrisperidone; minimal hepatic metabolism — renally excreted (adjust for renal impairment).', 'Monthly, 3-monthly and 6-monthly LAI formulations.'] });
D('aripiprazole', { name: 'Aripiprazole', cls: 'antipsychotic', sub: 'D2 partial agonist', stahl: 'aripiprazole',
  t: [['D2', 'partial', 4, 'P'], ['D3', 'partial', 4], ['5HT1A', 'partial', 3], ['5HT2A', 'antagonist', 3], ['5HT2B', 'inverse', 4], ['5HT2C', 'partial', 2], ['5HT7', 'antagonist', 3], ['H1', 'antagonist', 2], ['A1', 'antagonist', 2]],
  ae: { sed: 0, wt: 1, met: 0, eps: 1, akat: 2, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 1 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['12065741', '31303314', '15456328'],
  notes: ['D2 partial agonist with relatively high intrinsic activity among the "-pips/-razines" — more activating, more akathisia.', 'Requires ~ > 85–90% D2 occupancy for efficacy (partial agonist) yet low EPS.', 'Can lower prolactin; FDA warning (2016) for impulse-control problems.', 'Very long half-life (~75 h; dehydro-aripiprazole ~94 h).'] });
D('brexpiprazole', { name: 'Brexpiprazole', cls: 'antipsychotic', sub: 'D2 partial agonist', stahl: 'brexpiprazole',
  t: [['D2', 'partial', 4, 'P'], ['D3', 'partial', 4], ['5HT1A', 'partial', 4], ['5HT2A', 'antagonist', 4], ['A1', 'antagonist', 4], ['A2', 'antagonist', 3], ['5HT7', 'antagonist', 3], ['H1', 'antagonist', 2]],
  ae: { sed: 1, wt: 1, met: 0, eps: 1, akat: 1, prl: 0, qt: 0, ach: 0, orth: 1, sex: 0, seiz: 0, ins: 1 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['31303314'],
  labelNotes: [{ src: 'FDA (2023)', text: 'Approved for agitation associated with dementia due to Alzheimer disease (May 2023) — the first FDA-approved drug for this indication; the class boxed warning on mortality in elderly patients with dementia still applies.' }],
  notes: ['Lower intrinsic activity at D2 than aripiprazole + stronger 5-HT2A/5-HT1A/α1 actions → less akathisia/activation (proposed rationale).'] });
D('cariprazine', { name: 'Cariprazine', cls: 'antipsychotic', sub: 'D2 partial agonist', stahl: 'cariprazine',
  t: [['D3', 'partial', 4, 'P'], ['D2', 'partial', 4, 'P'], ['5HT1A', 'partial', 3], ['5HT2B', 'antagonist', 4], ['5HT2A', 'antagonist', 2], ['H1', 'antagonist', 2], ['5HT2C', 'antagonist', 1], ['A1', 'antagonist', 1]],
  ae: { sed: 1, wt: 1, met: 0, eps: 2, akat: 2, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 1 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['20093397', '31303314'],
  labelNotes: [{ src: 'FDA (2024)', text: 'Approved as adjunctive treatment of major depressive disorder in adults (December 2024), in addition to schizophrenia and bipolar I (manic/mixed and depressive episodes).' }],
  notes: ['D3-preferring D2/D3 partial agonist (Kiss 2010).', 'Active metabolite didesmethylcariprazine has t½ ~1–3 weeks → effects (and adverse effects such as akathisia) can appear late and persist after stopping.'] });
D('ziprasidone', { name: 'Ziprasidone', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'ziprasidone',
  t: [['D2', 'antagonist', 3, 'P'], ['5HT2A', 'antagonist', 4, 'P'], ['5HT2C', 'antagonist', 4], ['5HT1A', 'agonist', 3], ['5HT1D', 'antagonist', 3], ['SERT', 'inhibitor', 2], ['NET', 'inhibitor', 2], ['A1', 'antagonist', 2], ['H1', 'antagonist', 2], ['hERG', 'blocker', 2]],
  ae: { sed: 1, wt: 0, met: 0, eps: 1, akat: 1, prl: 1, qt: 2, ach: 0, orth: 1, sex: 1, seiz: 0, ins: 1 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['31303314', '14999113'],
  notes: ['Weight & metabolic neutral despite 5-HT2C antagonism — illustrating that 5-HT2C alone (without strong H1) is not sufficient.', 'Must be taken with ≥ 500 kcal meal (absorption doubles).', 'Moderate QTc prolongation.'] });
D('lurasidone', { name: 'Lurasidone', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'lurasidone',
  t: [['D2', 'antagonist', 4, 'P'], ['5HT2A', 'antagonist', 4, 'P'], ['5HT7', 'antagonist', 4], ['5HT1A', 'partial', 3], ['A2', 'antagonist', 3], ['5HT2C', 'antagonist', 1]],
  ae: { sed: 1, wt: 0, met: 0, eps: 2, akat: 2, prl: 1, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 1 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['31303314'],
  notes: ['Negligible H1 and muscarinic affinity → low weight/metabolic burden; akathisia & EPS more common.', 'Take with food (≥ 350 kcal).', 'CYP3A4 substrate — strong inhibitors and inducers contraindicated.', 'Approved for bipolar depression; 5-HT7 antagonism proposed to contribute.'] });
D('asenapine', { name: 'Asenapine (sublingual / transdermal)', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'asenapine',
  t: [['5HT2A', 'antagonist', 4, 'P'], ['5HT2C', 'antagonist', 4], ['5HT7', 'antagonist', 4], ['5HT6', 'antagonist', 4], ['D2', 'antagonist', 4, 'P'], ['D3', 'antagonist', 4], ['A2', 'antagonist', 4], ['A1', 'antagonist', 3], ['H1', 'antagonist', 4]],
  ae: { sed: 2, wt: 1, met: 1, eps: 1, akat: 1, prl: 1, qt: 1, ach: 0, orth: 1, sex: 1, seiz: 0, ins: 0 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['31303314'],
  notes: ['Sublingual: < 2% oral bioavailability (first-pass) — do not swallow; no food/drink for 10 min.', 'Oral hypoesthesia; weight gain less than predicted from H1 affinity in short-term trials.'] });
D('lumateperone', { name: 'Lumateperone', cls: 'antipsychotic', sub: 'Second-generation (atypical)', stahl: 'lumateperone',
  t: [['5HT2A', 'antagonist', 4, 'P'], ['D2', 'antagonist', 2, 'P'], ['SERT', 'inhibitor', 2], ['D1', 'modulator', 2], ['A1', 'antagonist', 2]],
  ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['25120104'],
  labelNotes: [{ src: 'FDA (2021)', text: 'Approved for bipolar I/II depression (monotherapy and adjunct to lithium/valproate) in December 2021, in addition to schizophrenia.' }],
  notes: ['~60-fold higher affinity for 5-HT2A than D2; low striatal D2 occupancy (~40%) at 42 mg.', 'Proposed presynaptic D2 partial agonism with postsynaptic antagonism, plus D1-dependent glutamate modulation (Snyder 2015) — proposed.', 'Low EPS, prolactin and metabolic liability; somnolence common.'] });
D('haloperidol', { name: 'Haloperidol', cls: 'antipsychotic', sub: 'First-generation', stahl: 'haloperidol',
  t: [['D2', 'antagonist', 4, 'P'], ['D3', 'antagonist', 3], ['A1', 'antagonist', 2], ['SIGMA1', 'antagonist', 3], ['5HT2A', 'antagonist', 1], ['hERG', 'blocker', 2]],
  ae: { sed: 1, wt: 1, met: 0, eps: 3, akat: 3, prl: 3, qt: 2, ach: 0, orth: 0, sex: 2, seiz: 0, ins: 0 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['10739409', '31303314'],
  notes: ['The reference high-potency D2 antagonist: PET thresholds (65% response, 72% prolactin, 78% EPS) come from haloperidol (Kapur 2000).', 'IV use: QT prolongation/torsades — ECG monitoring.'] });
D('chlorpromazine', { name: 'Chlorpromazine', cls: 'antipsychotic', sub: 'First-generation', stahl: 'chlorpromazine',
  t: [['D2', 'antagonist', 3, 'P'], ['5HT2A', 'antagonist', 3], ['H1', 'antagonist', 4], ['M1', 'antagonist', 3], ['A1', 'antagonist', 4], ['5HT2C', 'antagonist', 2], ['hERG', 'blocker', 2]],
  ae: { sed: 3, wt: 2, met: 2, eps: 2, akat: 1, prl: 2, qt: 2, ach: 3, orth: 3, sex: 2, seiz: 2, ins: 0 },
  extra: [...AP_EXTRA], tc: 'antipsychotic', refs: ['31303314'],
  notes: ['First antipsychotic (1952). Low-potency phenothiazine: "dirty" receptor profile predicts sedation, orthostasis, anticholinergic effects; intrinsic antimuscarinic action moderates EPS.', 'Photosensitivity, cholestatic jaundice, retinal/corneal deposits.'] });
D('pimavanserin', { name: 'Pimavanserin', cls: 'antipsychotic', sub: 'Non-D2 mechanism', stahl: 'pimavanserin',
  t: [['5HT2A', 'inverse', 4, 'P'], ['5HT2C', 'inverse', 2], ['hERG', 'blocker', 2]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 2, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['ap_dementia'], tc: 'antipsychotic', refs: ['18571247'],
  notes: ['Selective 5-HT2A inverse agonist with no D2 affinity — approved for hallucinations/delusions of Parkinson disease psychosis.', 'Does not worsen parkinsonism — shows that some psychosis can be treated without D2 blockade.'] });
D('xanomeline_trospium', { name: 'Xanomeline–trospium', cls: 'antipsychotic', sub: 'Non-D2 mechanism', stahl: null,
  t: [['M4', 'agonist', 3, 'P'], ['M1', 'agonist', 3, 'P']],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 1, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: [], tc: 'antipsychotic', refs: ['38104575'], mechOverride: { exclude: ['m_drymouth', 'm_constip', 'm_urinary', 'm_vision', 'm_tachy', 'm1_cog', 'm_eps_protect'] },
  notes: ['Xanomeline: M1/M4-preferring muscarinic agonist (central). Trospium: peripherally restricted muscarinic ANTAGONIST added to blunt cholinergic GI/autonomic effects.', 'First antipsychotic without D2 receptor action (FDA approval September 2024); not in Stahl 7th edition (2021).', 'Adverse effects: nausea, dyspepsia, vomiting, constipation, hypertension, tachycardia; urinary retention (trospium); avoid in hepatic impairment, urinary retention, narrow-angle glaucoma.'],
  rx: { src: 'FDA prescribing information (Cobenfy, 2024) — not covered by Stahl 7th ed.; verify against current label.',
    dose: ['Starting: xanomeline 50 mg/trospium 20 mg twice daily for ≥ 2 days, then 100 mg/20 mg twice daily for ≥ 5 days', 'May increase to 125 mg/30 mg twice daily based on tolerability', 'Take at least 1 hour before or 2 hours after a meal'],
    indications: [{ t: 'Schizophrenia (adults)', fda: true }],
    doNotUse: ['Urinary retention', 'Moderate or severe hepatic impairment', 'Gastric retention', 'Untreated narrow-angle glaucoma', 'Hypersensitivity to components'],
    warnings: ['Urinary retention risk (older adults, BPH)', 'Hepatic impairment ↑ exposure', 'Angioedema reported with trospium', 'Increases in heart rate'] } });

/* ======================= MOOD STABILIZERS ======================= */
D('lithium', { name: 'Lithium', cls: 'mood', sub: 'Lithium', stahl: 'lithium', flagship: true,
  t: [['IMPase', 'inhibitor', 3, 'P'], ['GSK3', 'inhibitor', 3, 'P']],
  ae: { sed: 1, wt: 2, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 1, ins: 0 },
  extra: ['li_tremor'], tc: 'lithium', refs: ['2553271', '8710892', '23371914', '22265699', '27900734'],
  labelNotes: [{ src: 'FDA label (2018 update)', text: 'Approved as monotherapy for acute manic/mixed episodes and maintenance treatment of bipolar I disorder in patients aged ≥ 7 years. (The Stahl PDF typography does not bold every approved indication.)' }],
  notes: ['No single definitive molecular target — see the lithium mechanism map.', 'Narrow therapeutic index: trough 0.6–1.0 (maintenance) — 12-h post-dose levels.', 'Robust anti-suicidal effect in mood disorders (clinical association).', 'Renally cleared; NOT hepatically metabolised.'] });
D('valproate', { name: 'Valproate (divalproex)', cls: 'mood', sub: 'Anticonvulsant', stahl: 'valproate',
  t: [['NaV', 'blocker', 2, 'P'], ['GABAT', 'inhibitor', 2], ['HDAC', 'inhibitor', 2], ['CaV_T', 'blocker', 2]],
  ae: { sed: 2, wt: 3, met: 1, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 0 },
  extra: ['vpa_hep', 'vpa_nh3', 'vpa_wt', 'vpa_terat'], tc: 'lithium', refs: ['11473107'],
  notes: ['Broad mechanism; which action is antimanic is unknown.', 'Inhibits UGT/CYP2C9: doubles lamotrigine levels (halve lamotrigine dose).', 'Boxed warnings: hepatotoxicity, pancreatitis, teratogenicity.'] });
D('carbamazepine', { name: 'Carbamazepine', cls: 'mood', sub: 'Anticonvulsant', stahl: 'carbamazepine',
  t: [['NaV', 'blocker', 3, 'P']],
  ae: { sed: 2, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 1, orth: 0, sex: 1, seiz: 0, ins: 0 },
  extra: ['cbz_sjs', 'cbz_ind', 'cbz_na'], tc: 'lithium', refs: ['15057820'],
  notes: ['Potent CYP3A4 inducer incl. autoinduction.', 'Aplastic anaemia/agranulocytosis (boxed); SJS/TEN with HLA-B*15:02 (boxed).', 'Teratogenic (neural tube defects).'] });
D('lamotrigine', { name: 'Lamotrigine', cls: 'mood', sub: 'Anticonvulsant', stahl: 'lamotrigine',
  t: [['NaV', 'blocker', 3, 'P']],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 1 },
  extra: ['lmt_rash'], tc: 'lithium', refs: ['3757936'],
  notes: ['Prevents bipolar DEPRESSIVE relapse more than mania; not effective for acute mania.', 'Slow titration over ~6 weeks to limit SJS risk; halve with valproate; double with carbamazepine/estrogen-containing contraceptives (↓ levels).', 'Weight neutral, no sexual dysfunction.'] });
D('oxcarbazepine', { name: 'Oxcarbazepine', cls: 'mood', sub: 'Anticonvulsant', stahl: 'oxcarbazepine',
  t: [['NaV', 'blocker', 3, 'P']],
  ae: { sed: 2, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['cbz_na'], tc: 'lithium', refs: [],
  notes: ['Off-label in bipolar disorder (evidence weaker than carbamazepine).', 'Less enzyme induction than carbamazepine; more hyponatremia.'] });

/* ======================= ANXIOLYTICS ======================= */
const BZD_EXTRA = [];
const BZD = (id, name, stahl, extra, notes, ae) => D(id, { name, cls: 'anxiolytic', sub: 'Benzodiazepine', stahl,
  t: [['GABAA', 'pam', 4, 'P']], ae: ae || { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 0 },
  extra: extra || [], tc: 'benzo', refs: ['2471436', '10548105', '11021797', '21714826'], also: ['hypnotic'], notes,
  labelNotes: [{ src: 'FDA boxed warning (2020)', text: 'Class boxed warning: risks of abuse, misuse, addiction, physical dependence and withdrawal reactions; and profound sedation/respiratory depression/death with concomitant opioids.' }] });
BZD('lorazepam', 'Lorazepam', 'lorazepam', [], ['Intermediate half-life (10–20 h); glucuronidated (no CYP, no active metabolites) — preferred in hepatic impairment & elderly.', 'IV/IM for status epilepticus, catatonia (lorazepam challenge), alcohol withdrawal.']);
BZD('diazepam', 'Diazepam', 'diazepam', [], ['Long-acting with active metabolite desmethyldiazepam (t½ up to 100+ h) — smooth taper substitution; accumulates in elderly.', 'Rapid onset (lipophilic) → high reinforcement.']);
BZD('clonazepam', 'Clonazepam', 'clonazepam', [], ['Long half-life (30–40 h); panic disorder, seizure disorders, off-label for akathisia & REM sleep behaviour disorder.']);
BZD('alprazolam', 'Alprazolam', 'alprazolam', [], ['Short half-life, rapid onset → interdose rebound anxiety and high misuse liability; difficult withdrawal.', 'CYP3A4 substrate — ketoconazole contraindicated.']);
BZD('midazolam', 'Midazolam', 'midazolam', [], ['Very short-acting; procedural sedation, status epilepticus (IM/intranasal/buccal). Marked anterograde amnesia.']);
D('buspirone', { name: 'Buspirone', cls: 'anxiolytic', sub: 'Non-benzodiazepine', stahl: 'buspirone',
  t: [['5HT1A', 'partial', 4, 'P'], ['D2', 'antagonist', 1]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'antidepressant', refs: ['7940983', '18571247'],
  notes: ['Delayed anxiolysis (2–4 weeks) — no sedation, dependence, withdrawal or respiratory depression; not cross-tolerant with benzodiazepines.', 'Short half-life — 2–3× daily dosing.', 'CYP3A4 substrate (grapefruit juice ↑ levels).'] });
D('hydroxyzine', { name: 'Hydroxyzine', cls: 'anxiolytic', sub: 'Non-benzodiazepine', stahl: 'hydroxyzine',
  t: [['H1', 'inverse', 4, 'P'], ['5HT2A', 'antagonist', 1], ['M1', 'antagonist', 1], ['hERG', 'blocker', 1]],
  ae: { sed: 3, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 1, ach: 1, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['12563283'], also: ['hypnotic'],
  notes: ['First-generation antihistamine used for anxiety, pruritus, sleep — anxiolysis largely via sedation.', 'EMA (2015) restricted use due to QT risk (max 100 mg/day adults; avoid in elderly).'] });
D('pregabalin', { name: 'Pregabalin', cls: 'anxiolytic', sub: 'Non-benzodiazepine', stahl: 'pregabalin',
  t: [['CaV_a2d', 'ligand', 4, 'P']],
  ae: { sed: 2, wt: 2, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['8621444'],
  labelNotes: [{ src: 'FDA (2019)', text: 'Warning: serious breathing difficulties with gabapentinoids in patients with respiratory risk factors or co-use of opioids/CNS depressants. Schedule V controlled substance in the USA.' }, { src: 'Regulatory status', text: 'Approved for generalised anxiety disorder in the EU/UK; off-label for anxiety in the USA.' }],
  notes: ['Linear absorption (unlike gabapentin); renally cleared — reduce dose in renal impairment.', 'Misuse/dependence potential.'] });
D('gabapentin', { name: 'Gabapentin', cls: 'anxiolytic', sub: 'Non-benzodiazepine', stahl: 'gabapentin',
  t: [['CaV_a2d', 'ligand', 4, 'P']],
  ae: { sed: 2, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['8621444'],
  labelNotes: [{ src: 'FDA (2019)', text: 'Warning: serious breathing difficulties with gabapentinoids in patients with respiratory risk factors or co-use of opioids/CNS depressants.' }],
  notes: ['Saturable absorption (L-amino acid transporter) — non-linear PK.', 'Off-label for anxiety, insomnia, alcohol use disorder.'] });
D('propranolol', { name: 'Propranolol', cls: 'anxiolytic', sub: 'Non-benzodiazepine', stahl: 'propranolol',
  t: [['B1', 'antagonist', 4, 'P'], ['B2', 'antagonist', 4, 'P'], ['5HT1A', 'antagonist', 1]],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 1, sex: 1, seiz: 0, ins: 1 },
  tc: 'benzo', refs: [],
  notes: ['Off-label for performance anxiety, akathisia, lithium tremor.', 'Lipophilic — vivid dreams, fatigue; contraindicated in asthma.'] });
D('prazosin', { name: 'Prazosin', cls: 'anxiolytic', sub: 'Non-benzodiazepine', stahl: 'prazosin',
  t: [['A1', 'antagonist', 4, 'P']],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 3, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: [],
  notes: ['Off-label for PTSD-related nightmares — trial evidence mixed (large 2018 VA RCT negative).', '"First-dose" syncope — start 1 mg at bedtime.'] });

/* ======================= HYPNOTICS ======================= */
D('zolpidem', { name: 'Zolpidem', cls: 'hypnotic', sub: 'Z-drug', stahl: 'zolpidem',
  t: [['GABAA', 'pam', 4, 'P']], ae: { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['z_complex'], tc: 'benzo', refs: ['10548105'], mechOverride: { exclude: ['gaba_anx'] },
  labelNotes: [{ src: 'FDA (2013; 2019)', text: 'Recommended initial dose for women lowered to 5 mg IR (6.25 mg ER) due to next-morning impairment (2013); boxed warning for complex sleep behaviours (2019).' }],
  notes: ['α1-preferring benzodiazepine-site agonist → hypnotic without much anxiolytic or muscle-relaxant effect.', 'Short half-life (~2.5 h).'] });
D('eszopiclone', { name: 'Eszopiclone', cls: 'hypnotic', sub: 'Z-drug', stahl: 'eszopiclone',
  t: [['GABAA', 'pam', 4, 'P']], ae: { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['z_complex'], tc: 'benzo', refs: ['10548105'],
  notes: ['Less α1-selective than zolpidem; t½ ~6 h (sleep maintenance).', 'Unpleasant metallic taste.'] });
D('zaleplon', { name: 'Zaleplon', cls: 'hypnotic', sub: 'Z-drug', stahl: 'zaleplon',
  t: [['GABAA', 'pam', 4, 'P']], ae: { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  extra: ['z_complex'], tc: 'benzo', refs: ['10548105'], mechOverride: { exclude: ['gaba_anx'] },
  notes: ['Ultra-short (t½ ~1 h) — sleep onset or middle-of-night dosing with ≥ 4 h remaining.'] });
D('temazepam', { name: 'Temazepam', cls: 'hypnotic', sub: 'Benzodiazepine', stahl: 'temazepam',
  t: [['GABAA', 'pam', 4, 'P']], ae: { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['21714826'], notes: ['Intermediate half-life; glucuronidated.'],
  labelNotes: [{ src: 'FDA boxed warning (2020)', text: 'Class boxed warning: abuse, misuse, addiction, dependence, withdrawal; opioid co-use.' }] });
D('ramelteon', { name: 'Ramelteon', cls: 'hypnotic', sub: 'Melatonin agonist', stahl: 'ramelteon',
  t: [['MT1', 'agonist', 4, 'P'], ['MT2', 'agonist', 4, 'P']], ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['20577266'], notes: ['Sleep-onset insomnia; no abuse potential; not scheduled.', 'Fluvoxamine (CYP1A2) contraindicated.'] });
D('suvorexant', { name: 'Suvorexant', cls: 'hypnotic', sub: 'Orexin antagonist', stahl: 'suvorexant',
  t: [['OX2R', 'antagonist', 4, 'P'], ['OX1R', 'antagonist', 4, 'P']], ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['17299454', '25526970'], notes: ['Dual orexin receptor antagonist (DORA).', 'Contraindicated in narcolepsy; occasional sleep paralysis, hypnagogic hallucinations.', 'CYP3A4 substrate.'] });
D('lemborexant', { name: 'Lemborexant', cls: 'hypnotic', sub: 'Orexin antagonist', stahl: 'lemborexant',
  t: [['OX2R', 'antagonist', 4, 'P'], ['OX1R', 'antagonist', 3, 'P']], ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['17299454'], notes: ['DORA; relatively faster OX2R binding kinetics.'] });
D('doxepin', { name: 'Doxepin (low-dose)', cls: 'hypnotic', sub: 'Sedating antidepressant / antipsychotic', stahl: 'doxepin',
  t: [['H1', 'antagonist', 4, 'P'], ['SERT', 'inhibitor', 2], ['NET', 'inhibitor', 3], ['M1', 'antagonist', 3], ['A1', 'antagonist', 3]],
  ae: { sed: 3, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'benzo', refs: ['12563283'],
  doseLevels: { note: 'Classic teaching example: at 3–6 mg doxepin is relatively selective for H1 (sub-nM affinity) and approved for sleep-maintenance insomnia; at antidepressant doses (75–300 mg) it behaves as a full TCA with SERT/NET, M1 and α1 effects. Conceptual levels — not occupancy data.', ev: 'CLIN',
    levels: [{ dose: '3–6 mg', engaged: { H1: 3, M1: 0, A1: 0, SERT: 0, NET: 0 } }, { dose: '25–50 mg', engaged: { H1: 3, M1: 1, A1: 1, SERT: 1, NET: 1 } }, { dose: '150–300 mg', engaged: { H1: 3, M1: 3, A1: 3, SERT: 2, NET: 3 } }] },
  notes: ['Rating shown for low-dose hypnotic use; antidepressant doses carry full TCA burden.'] });

/* ======================= ADHD ======================= */
const STIM_LABEL = [{ src: 'FDA (2023)', text: 'Updated boxed warning for all prescription stimulants: risks of abuse, misuse and addiction; assess risk before and during treatment.' }];
D('methylphenidate', { name: 'Methylphenidate', cls: 'adhd', sub: 'Stimulant', stahl: 'methylphenidate',
  t: [['DAT', 'inhibitor', 4, 'P'], ['NET', 'inhibitor', 3, 'P']],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 2 },
  extra: ['stim_growth'], tc: 'stimulant', refs: ['9766762', '16806100', '19455173'], labelNotes: STIM_LABEL,
  notes: ['Reuptake BLOCKER (not releaser).', 'Oral therapeutic doses → ~50–70% striatal DAT occupancy (Volkow 1998); slow oral kinetics limit euphoria compared with IV.', 'Many ER formulations (OROS, beads, patch).'] });
D('amphetamine', { name: 'Amphetamine (mixed salts)', cls: 'adhd', sub: 'Stimulant', stahl: 'amphetamine',
  t: [['DAT', 'releaser', 4, 'P'], ['NET', 'releaser', 4, 'P'], ['VMAT2', 'releaser', 3], ['TAAR1', 'agonist', 2], ['SERT', 'releaser', 1]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 3 },
  extra: ['stim_growth'], tc: 'stimulant', refs: ['15955613', '19455173'], labelNotes: STIM_LABEL,
  notes: ['Releaser: substrate for DAT/NET; disrupts VMAT2 storage → reverse transport of DA/NE.', 'd-isomer more DA-selective; l-isomer more NE.', 'Psychosis/mania risk somewhat higher than methylphenidate.'] });
D('lisdexamfetamine', { name: 'Lisdexamfetamine', cls: 'adhd', sub: 'Stimulant', stahl: 'lisdexamfetamine',
  t: [['DAT', 'releaser', 4, 'P'], ['NET', 'releaser', 4, 'P'], ['VMAT2', 'releaser', 3]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 2 },
  extra: ['stim_growth'], tc: 'stimulant', refs: ['15955613'], labelNotes: STIM_LABEL,
  notes: ['Prodrug: lysine cleaved in red blood cells → d-amphetamine. Rate-limited conversion smooths the rise in DA (lower immediate euphoria if injected/snorted).', 'Also approved for binge-eating disorder.'] });
D('atomoxetine', { name: 'Atomoxetine', cls: 'adhd', sub: 'Non-stimulant', stahl: 'atomoxetine',
  t: [['NET', 'inhibitor', 4, 'P'], ['SERT', 'inhibitor', 1]],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 1 },
  extra: ['atx_suic'], tc: 'antidepressant', refs: ['12431845'],
  notes: ['Selective NET inhibitor → ↑ NE and DA in PFC but not in NAc (Bymaster 2002) — not a controlled substance.', 'Full effect takes 4–6+ weeks.', 'CYP2D6 substrate: poor metabolisers have ~10× exposure.'] });
D('guanfacine', { name: 'Guanfacine (ER)', cls: 'adhd', sub: 'Non-stimulant', stahl: 'guanfacine',
  t: [['A2', 'agonist', 4, 'P']],
  ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 2, sex: 0, seiz: 0, ins: 0 },
  tc: 'stimulant', refs: ['17448997', '19455173'],
  notes: ['α2A-selective agonist — strengthens PFC network connectivity (Wang 2007).', 'Taper to avoid rebound hypertension.', 'CYP3A4 substrate.'] });
D('clonidine', { name: 'Clonidine (ER)', cls: 'adhd', sub: 'Non-stimulant', stahl: 'clonidine',
  t: [['A2', 'agonist', 4, 'P']],
  ae: { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 2, sex: 0, seiz: 0, ins: 0 },
  tc: 'stimulant', refs: ['17448997', '12668290'], also: ['sud'],
  notes: ['Non-selective α2 (A/B/C) agonist + imidazoline I1 — more sedation and hypotension than guanfacine.', 'Off-label for opioid withdrawal, tics, hyperarousal, sleep onset in ADHD.'] });
D('modafinil', { name: 'Modafinil', cls: 'adhd', sub: 'Wake-promoting', stahl: 'modafinil',
  t: [['DAT', 'inhibitor', 2, 'P']],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 2 },
  tc: 'stimulant', refs: [],
  notes: ['Weak DAT inhibitor; downstream activation of orexin/histamine arousal systems proposed.', 'Approved for narcolepsy, OSA residual sleepiness, shift-work disorder; off-label in ADHD.', 'CYP3A4 inducer — reduces hormonal contraceptive efficacy; rare SJS.'] });

/* ======================= SUBSTANCE USE ======================= */
D('buprenorphine', { name: 'Buprenorphine (± naloxone)', cls: 'sud', sub: 'Treatment: opioid use disorder', stahl: 'buprenorphine',
  t: [['MOR', 'partial', 4, 'P'], ['KOR', 'antagonist', 3]],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 1, ach: 0, orth: 0, sex: 1, seiz: 0, ins: 1 },
  tc: 'opioid', refs: ['23321159'],
  notes: ['Very high MOR affinity & slow dissociation → displaces full agonists (precipitated withdrawal if started too early) and blocks them.', 'Ceiling effect on respiratory depression (not on combination with BZDs/alcohol).', 'Naloxone in sublingual combo is poorly bioavailable orally — deters injection.'] });
D('methadone', { name: 'Methadone', cls: 'sud', sub: 'Treatment: opioid use disorder', stahl: null,
  t: [['MOR', 'agonist', 4, 'P'], ['NMDA', 'antagonist', 2], ['hERG', 'blocker', 2], ['SERT', 'inhibitor', 1]],
  ae: { sed: 2, wt: 1, met: 0, eps: 0, akat: 0, prl: 1, qt: 2, ach: 0, orth: 1, sex: 2, seiz: 0, ins: 0 },
  tc: 'opioid', refs: ['23321159', '14999113'],
  notes: ['Full MOR agonist with long, variable half-life (~8–59 h) — accumulates during induction (deaths cluster in the first 2 weeks).', 'QTc prolongation (hERG) — ECG monitoring.', 'Many CYP interactions (3A4, 2B6).', 'Not in Stahl 7th edition; in the USA dispensing for OUD is restricted to certified opioid treatment programs.'],
  rx: { src: 'FDA methadone labelling & SAMHSA TIP 63 (federal guidance) — not covered by Stahl 7th ed.; verify against current label/regulations.',
    dose: ['OUD induction: initial single dose 20–30 mg; total first-day dose generally not to exceed 40 mg', 'Titrate cautiously over days–weeks (accumulation)', 'Usual maintenance often 60–120 mg/day (individualised)'],
    indications: [{ t: 'Opioid use disorder (detoxification and maintenance; certified OTP in USA)', fda: true }, { t: 'Severe pain requiring opioid (specific formulations)', fda: true }],
    doNotUse: ['Significant respiratory depression', 'Acute/severe bronchial asthma in unmonitored setting', 'Known/suspected GI obstruction/paralytic ileus'],
    warnings: ['Boxed: life-threatening respiratory depression, QT prolongation, neonatal opioid withdrawal syndrome, interactions with CYP inhibitors/inducers, risks with benzodiazepines'] } });
D('naltrexone', { name: 'Naltrexone', cls: 'sud', sub: 'Treatment: alcohol use disorder', stahl: 'naltrexone',
  t: [['MOR', 'antagonist', 4, 'P'], ['KOR', 'antagonist', 3]],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 1 },
  tc: 'opioid', refs: ['19710631'],
  notes: ['Oral daily or monthly XR injection (OUD after ≥ 7–10 days opioid-free; AUD).', 'Loss of tolerance → overdose risk if opioids are used after stopping.'] });
D('acamprosate', { name: 'Acamprosate', cls: 'sud', sub: 'Treatment: alcohol use disorder', stahl: 'acamprosate',
  t: [['NMDA', 'modulator', 1, 'P'], ['MGLUR', 'modulator', 1]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'opioid', refs: [],
  notes: ['Mechanism proposed: normalises the glutamate/GABA imbalance of protracted alcohol withdrawal — incompletely understood.', 'Renally cleared (contraindicated if CrCl ≤ 30); no hepatic metabolism.', 'Best for maintaining abstinence once achieved.'] });
D('disulfiram', { name: 'Disulfiram', cls: 'sud', sub: 'Treatment: alcohol use disorder', stahl: 'disulfiram',
  t: [['ALDH', 'inhibitor', 4, 'P']],
  ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'opioid', refs: [], notes: ['Aversive therapy — works best when supervised.', 'Hepatotoxicity, neuropathy; psychosis at high doses (dopamine β-hydroxylase inhibition).'] });
D('varenicline', { name: 'Varenicline', cls: 'sud', sub: 'Treatment: nicotine', stahl: 'varenicline',
  t: [['nAChR_a4b2', 'partial', 4, 'P'], ['nAChR_a7', 'agonist', 2]],
  ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 2 },
  tc: 'opioid', refs: ['15887955'],
  labelNotes: [{ src: 'FDA (2016)', text: 'Boxed warning for neuropsychiatric events REMOVED in 2016 after the EAGLES trial.' }],
  notes: ['Most effective single smoking-cessation pharmacotherapy.', 'Nausea common; renally cleared.'] });
D('lofexidine', { name: 'Lofexidine', cls: 'sud', sub: 'Treatment: opioid use disorder', stahl: 'lofexidine',
  t: [['A2', 'agonist', 4, 'P']],
  ae: { sed: 2, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 1, ach: 0, orth: 2, sex: 0, seiz: 0, ins: 0 },
  tc: 'opioid', refs: ['23321159'], notes: ['α2A agonist approved for opioid-withdrawal symptoms (less hypotension than clonidine).', 'Does not treat craving.'] });
/* Substances — pharmacology only, not prescribing entries */
const SUB = (id, name, t, notes, refs, ae) => D(id, { name, cls: 'sud', sub: 'Substance (not a prescribing entry)', stahl: null, substance: true, t, notes, refs: refs || ['19710631', '2899326', '26816013'], tc: 'addiction', ae: ae || { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 } });
SUB('opioids', 'Opioids (heroin, fentanyl, oxycodone…)', [['MOR', 'agonist', 4, 'P'], ['KOR', 'agonist', 1], ['DOR', 'agonist', 1]], ['Disinhibition of VTA DA neurons via MOR on GABA interneurons (Johnson & North 1992).', 'Fentanyl analogues: high potency, rapid onset — overdose epidemic.', 'Naloxone reverses respiratory depression (short duration — re-sedation risk).'], ['1346804', '23321159', '19710631'], { sed: 3, wt: 0, met: 0, eps: 0, akat: 0, prl: 1, qt: 0, ach: 0, orth: 1, sex: 2, seiz: 0, ins: 0 });
SUB('alcohol', 'Alcohol (ethanol)', [['GABAA', 'modulator', 2, 'P'], ['NMDA', 'antagonist', 2, 'P'], ['5HT3', 'modulator', 1]], ['No single receptor — GABA-A enhancement, NMDA inhibition, endorphin release.', 'Withdrawal: glutamatergic hyperexcitability — seizures, delirium tremens (treat with benzodiazepines; thiamine before glucose).'], ['19710631', '2899326'], { sed: 3, wt: 1, met: 1, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 2, seiz: 2, ins: 1 });
SUB('nicotine', 'Nicotine', [['nAChR_a4b2', 'agonist', 4, 'P'], ['nAChR_a7', 'agonist', 2]], ['Activates and then desensitises α4β2 receptors; chronic exposure up-regulates them.', 'Induces CYP1A2 via polycyclic hydrocarbons in SMOKE (not nicotine itself) — relevant to clozapine/olanzapine levels.'], ['10985354', '15887955', '2899326']);
SUB('cannabis', 'Cannabis (THC)', [['CB1', 'partial', 3, 'P']], ['THC is a CB1 partial agonist; CBD has distinct, poorly understood pharmacology.', 'Cannabinoid hyperemesis syndrome with chronic heavy use.'], ['11279497', '2899326'], { sed: 2, wt: 1, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 1, sex: 0, seiz: 0, ins: 0 });
SUB('cocaine', 'Cocaine', [['DAT', 'inhibitor', 4, 'P'], ['SERT', 'inhibitor', 3], ['NET', 'inhibitor', 3], ['NaV', 'blocker', 2]], ['Reuptake blocker (like methylphenidate) but with rapid route of administration → intense euphoria.', 'Local anaesthetic Na⁺-channel block → arrhythmia; vasoconstriction → MI, stroke.'], ['9766762', '2899326', '19710631'], { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 1, ach: 0, orth: 0, sex: 1, seiz: 2, ins: 3 });
SUB('methamphetamine', 'Methamphetamine', [['DAT', 'releaser', 4, 'P'], ['NET', 'releaser', 4], ['VMAT2', 'releaser', 4], ['SERT', 'releaser', 2]], ['Releaser (like amphetamine) with greater CNS penetration; neurotoxicity to DA terminals at high doses.', 'Prolonged psychosis in some users.'], ['15955613', '19710631'], { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 1, seiz: 1, ins: 3 });

/* ======================= DEMENTIA ======================= */
D('donepezil', { name: 'Donepezil', cls: 'dementia', sub: 'Cholinesterase inhibitor', stahl: 'donepezil',
  t: [['AChE', 'inhibitor', 4, 'P']], ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 1, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 1 },
  tc: 'ache', refs: [], notes: ['Selective, reversible AChE inhibitor; t½ ~70 h (once daily).', 'Bedtime dosing can cause vivid dreams — switch to morning.'] });
D('rivastigmine', { name: 'Rivastigmine', cls: 'dementia', sub: 'Cholinesterase inhibitor', stahl: 'rivastigmine',
  t: [['AChE', 'inhibitor', 4, 'P']], ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'ache', refs: [], notes: ['"Pseudo-irreversible" AChE + butyrylcholinesterase inhibitor; transdermal patch has fewer GI effects.', 'Approved also for Parkinson disease dementia.'] });
D('galantamine', { name: 'Galantamine', cls: 'dementia', sub: 'Cholinesterase inhibitor', stahl: 'galantamine',
  t: [['AChE', 'inhibitor', 3, 'P'], ['nAChR_a4b2', 'pam', 2]], ae: { sed: 0, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'ache', refs: [], notes: ['Reversible AChE inhibitor; proposed nicotinic allosteric potentiation (debated).'] });
D('memantine', { name: 'Memantine', cls: 'dementia', sub: 'NMDA antagonist', stahl: 'memantine',
  t: [['NMDA', 'blocker', 3, 'P']], ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'ache', refs: ['16424917'], mechOverride: { exclude: ['nmda_ket', 'nmda_dissoc'] },
  notes: ['Low-affinity, uncompetitive, fast off-rate NMDA blocker (Lipton 2006) — contrast with ketamine.', 'Moderate–severe Alzheimer disease; renally cleared.'] });

/* ======================= MOVEMENT ======================= */
D('valbenazine', { name: 'Valbenazine', cls: 'movement', sub: 'VMAT2 inhibitor', stahl: 'valbenazine',
  t: [['VMAT2', 'inhibitor', 4, 'P']], ae: { sed: 2, wt: 0, met: 0, eps: 1, akat: 1, prl: 0, qt: 1, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'antipsychotic', refs: ['28320223'], notes: ['Tardive dyskinesia and Huntington chorea; once daily.', 'CYP2D6/3A4 substrate.'] });
D('deutetrabenazine', { name: 'Deutetrabenazine', cls: 'movement', sub: 'VMAT2 inhibitor', stahl: 'deutetrabenazine',
  t: [['VMAT2', 'inhibitor', 4, 'P']], ae: { sed: 1, wt: 0, met: 0, eps: 1, akat: 1, prl: 0, qt: 1, ach: 0, orth: 0, sex: 0, seiz: 0, ins: 1 },
  tc: 'antipsychotic', refs: [], notes: ['Deuterium substitution slows CYP2D6 metabolism → smoother levels than tetrabenazine.', 'Boxed warning: depression/suicidality in Huntington disease.'] });
D('benztropine', { name: 'Benztropine', cls: 'movement', sub: 'Anticholinergic', stahl: 'benztropine',
  t: [['M1', 'antagonist', 4, 'P'], ['DAT', 'inhibitor', 2], ['H1', 'antagonist', 2]], ae: { sed: 1, wt: 0, met: 0, eps: 0, akat: 0, prl: 0, qt: 0, ach: 3, orth: 0, sex: 0, seiz: 0, ins: 0 },
  tc: 'antipsychotic', refs: [], notes: ['Treats parkinsonism and acute dystonia; NOT tardive dyskinesia (may worsen it).', 'Anticholinergic cognitive burden — avoid long-term in elderly.'] });

PA.DRUG = Object.fromEntries(PA.DRUGS.map(d => [d.id, d]));
