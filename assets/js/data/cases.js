/* Interactive clinical cases. Step types: 'mc' (multiple choice) or 'map' (click the brain region). */
PA.CASES = [
  { id: 'eps', title: 'Rigidity and tremor after starting an antipsychotic', tags: ['eps', 'D2', 'nigrostriatal'],
    vignette: 'A 24-year-old man with first-episode schizophrenia starts haloperidol 10 mg/day. Two weeks later his psychotic symptoms are improving but he has a mask-like face, cogwheel rigidity and a resting tremor.',
    steps: [
      { type: 'map', q: 'Click the region where the dopamine neurons of the pathway responsible for these symptoms originate.', answer: ['sn'], accept: ['sn', 'caudate', 'putamen', 'dstriatum'],
        explain: 'The nigrostriatal pathway: substantia nigra pars compacta → dorsal striatum (caudate/putamen). D2 blockade here produces drug-induced parkinsonism.', chain: ['Haloperidol', 'D2 blockade (dorsal striatum)', '↓ nigrostriatal DA signalling', 'Indirect pathway disinhibited; ACh excess', 'EPS: rigidity, bradykinesia, tremor'] },
      { type: 'mc', q: 'PET studies with haloperidol suggest EPS risk rises steeply above approximately which striatal D2 occupancy?',
        options: [{ t: '~40%' }, { t: '~65%' }, { t: '~78%', correct: true }, { t: '~95%' }],
        explain: 'Kapur 2000: clinical response > ~65%, hyperprolactinemia > ~72%, EPS > ~78% occupancy. 1–2.5 mg/day haloperidol was often sufficient in first-episode patients.', refs: ['10739409'] },
      { type: 'mc', q: 'Which receptor profile would MOST reduce this risk?',
        options: [{ t: 'Higher-affinity, slowly dissociating D2 antagonist' }, { t: 'D2 partial agonism, or low/transient D2 occupancy with intrinsic antimuscarinic action (e.g. aripiprazole, quetiapine, clozapine)', correct: true }, { t: 'Adding a 5-HT3 antagonist' }, { t: 'Adding an SSRI' }],
        explain: 'Partial agonists keep some D2 signalling; low-occupancy/fast-off drugs (quetiapine, clozapine) rarely exceed the EPS threshold; antimuscarinic activity rebalances striatal DA–ACh. 5-HT2A antagonism is a PROPOSED additional factor.', link: '#/effects/eps' }
    ] },
  { id: 'prl', title: 'Amenorrhea and galactorrhea on risperidone', tags: ['hyperprolactinemia', 'D2', 'tuberoinfundibular'],
    vignette: 'A 29-year-old woman on risperidone 4 mg/day for 6 months reports absent periods, milky nipple discharge and low libido. Prolactin is 96 ng/mL.',
    steps: [
      { type: 'map', q: 'Click the structure where D2 blockade most directly causes this.', answer: ['pituitary'], accept: ['pituitary', 'arcuate'],
        explain: 'Anterior-pituitary lactotrophs (fed by arcuate tuberoinfundibular DA). The pituitary lies outside the BBB, so even poorly brain-penetrant drugs block D2 strongly here.', chain: ['Risperidone', 'D2 blockade on lactotrophs', 'Loss of DA ⊣ prolactin', '↑ Prolactin → ↓ GnRH/LH/FSH', 'Amenorrhea, galactorrhea, ↓ libido'] },
      { type: 'mc', q: 'Why does risperidone raise prolactin more than olanzapine despite both being potent 5-HT2A antagonists?',
        options: [{ t: 'Risperidone has stronger H1 blockade' }, { t: 'Risperidone/9-OH-risperidone are P-gp substrates with relatively higher peripheral (pituitary) vs brain exposure, plus potent D2 binding', correct: true }, { t: 'Olanzapine is a D2 partial agonist' }, { t: 'Risperidone blocks 5-HT3' }],
        explain: 'The 5-HT2A-mediated "offset" of prolactin elevation is a PROPOSED mechanism of limited weight; the pituitary D2 occupancy dominates.', refs: ['15456328'] },
      { type: 'mc', q: 'Which management is most mechanistically targeted (if the antipsychotic is otherwise effective)?',
        options: [{ t: 'Add benztropine' }, { t: 'Switch to, or add, a D2 partial agonist such as aripiprazole', correct: true }, { t: 'Add an SSRI' }, { t: 'Add propranolol' }],
        explain: 'Partial agonism retains enough lactotroph D2 activation to suppress prolactin. Also exclude prolactinoma if levels are very high or symptoms persist.', link: '#/circuits/tuberoinfundibular' }
    ] },
  { id: 'akathisia', title: 'Restlessness after starting aripiprazole', tags: ['akathisia'],
    vignette: 'A 35-year-old woman with bipolar depression started aripiprazole 10 mg. After 5 days she describes an unbearable inner urge to move, cannot sit through dinner, and paces at night. She asks if she is "going crazy".',
    steps: [
      { type: 'mc', q: 'What is the most likely diagnosis?', options: [{ t: 'Worsening anxiety' }, { t: 'Akathisia', correct: true }, { t: 'Tardive dyskinesia' }, { t: 'Serotonin syndrome' }],
        explain: 'Akathisia: subjective inner restlessness + objective motor restlessness, typically days–weeks after starting/increasing a D2 antagonist or partial agonist. Easily mistaken for anxiety or agitation — and associated with suicidality.' },
      { type: 'mc', q: 'How strong is the evidence for a specific mechanism?', options: [{ t: 'Established: D2 blockade in the nigrostriatal pathway' }, { t: 'Mechanism incompletely understood — proposed DA, NE and 5-HT2A contributions', correct: true }, { t: 'Established: H1 blockade' }],
        explain: 'Proposed mechanisms: reduced mesocortical/mesolimbic DA signalling; secondary noradrenergic over-activity (supported by propranolol response); 5-HT2A involvement (supported by mirtazapine response). None is established.', link: '#/effects/akathisia' },
      { type: 'mc', q: 'Which options are evidence-based treatments?', options: [{ t: 'Dose reduction, propranolol, low-dose mirtazapine, or a short-term benzodiazepine', correct: true }, { t: 'Increase the dose to "push through"' }, { t: 'Add a VMAT2 inhibitor' }, { t: 'Add bupropion' }],
        explain: 'Note how each treatment maps to a proposed mechanism (β-adrenergic, 5-HT2A, GABA-A).' }
    ] },
  { id: 'ss', title: 'Agitation, sweating and clonus after adding tramadol', tags: ['serotonin_syndrome', 'nms'],
    vignette: 'A 52-year-old on sertraline 150 mg is given tramadol for back pain. Within 12 hours: agitation, diaphoresis, diarrhoea, temperature 38.4 °C, tremor, hyperreflexia and inducible ankle clonus (worse in legs).',
    steps: [
      { type: 'mc', q: 'Most likely diagnosis?', options: [{ t: 'Neuroleptic malignant syndrome' }, { t: 'Serotonin toxicity', correct: true }, { t: 'Anticholinergic toxicity' }, { t: 'Malignant hyperthermia' }],
        explain: 'Rapid onset (hours), clonus and hyperreflexia (lower > upper limbs), diaphoresis, diarrhoea. NMS: slower onset (days), lead-pipe rigidity, bradyreflexia. Anticholinergic: dry, hot skin, absent bowel sounds, urinary retention.' },
      { type: 'map', q: 'Click a region where excess 5-HT produces the neuromuscular signs (clonus/hyperreflexia).', answer: ['spinal', 'brainstem', 'mraphe'], accept: ['spinal', 'brainstem', 'mraphe', 'draphe'],
        explain: 'Brainstem and spinal 5-HT (caudal raphe → spinal cord) — especially 5-HT2A and 5-HT1A over-stimulation.', chain: ['Sertraline (SERT ✕) + tramadol (SERT ✕, μ agonist)', 'Excess synaptic 5-HT', '5-HT2A/1A over-stimulation in brainstem & spinal cord', 'Clonus, hyperreflexia, hyperthermia, autonomic instability'] },
      { type: 'mc', q: 'Mechanism-based antidote for moderate cases?', options: [{ t: 'Dantrolene' }, { t: 'Bromocriptine' }, { t: 'Cyproheptadine (5-HT2A antagonist)', correct: true }, { t: 'Physostigmine' }],
        explain: 'Stop serotonergic drugs, supportive care, benzodiazepines; cyproheptadine for moderate cases; ICU and paralysis for severe hyperthermia.', refs: ['15784664'] }
    ] },
  { id: 'nms', title: 'Fever and rigidity after IM haloperidol', tags: ['nms'],
    vignette: 'A dehydrated 40-year-old receives repeated IM haloperidol for agitation. Over 3 days: temperature 40 °C, lead-pipe rigidity, fluctuating consciousness, labile BP, CK 18,000 U/L.',
    steps: [
      { type: 'mc', q: 'Diagnosis?', options: [{ t: 'Serotonin syndrome' }, { t: 'Neuroleptic malignant syndrome', correct: true }, { t: 'Catatonia only' }],
        explain: 'Classic NMS tetrad: hyperthermia, rigidity, altered mental status, autonomic instability; ↑ CK. Risk factors here: high-potency agent, IM, rapid escalation, dehydration.' },
      { type: 'mc', q: 'Which statement about mechanism is most accurate?', options: [{ t: 'Established: purely due to muscarinic blockade' }, { t: 'Leading hypothesis: acute central D2 hypofunction (hypothalamic thermoregulation + nigrostriatal rigidity) plus sympathoadrenal dysregulation — incompletely understood', correct: true }, { t: 'Established: excess serotonin' }],
        explain: 'Support: NMS-like syndrome after abrupt withdrawal of levodopa. Treatment: stop antipsychotic, cooling, fluids, benzodiazepines, ± dantrolene/bromocriptine.', refs: ['17541044', '29325237'], link: '#/effects/nms' }
    ] },
  { id: 'disc', title: '"Brain zaps" after stopping paroxetine', tags: ['discontinuation'],
    vignette: 'A 31-year-old stopped paroxetine 40 mg abruptly before a holiday. Three days later: dizziness, electric-shock sensations on moving her eyes, irritability, vivid dreams and nausea.',
    steps: [
      { type: 'mc', q: 'Why is paroxetine especially prone to this?', options: [{ t: 'Long half-life active metabolite' }, { t: 'Short half-life, non-linear kinetics, plus anticholinergic rebound', correct: true }, { t: 'MAO inhibition' }],
        explain: 'Abrupt fall in SERT occupancy against an adapted serotonergic system. Fluoxetine (norfluoxetine t½ 1–2 weeks) is least problematic.' },
      { type: 'mc', q: 'Best strategy?', options: [{ t: 'Reassure only; it never lasts more than a few days' }, { t: 'Reinstate and taper gradually (possibly hyperbolically, with small final doses) or bridge with fluoxetine', correct: true }, { t: 'Start a benzodiazepine long term' }],
        explain: 'Withdrawal may be more frequent, severe and prolonged than once believed (Fava 2015); hyperbolic tapering reflects the hyperbolic SERT occupancy–dose relationship (Horowitz & Taylor 2019).', refs: ['25721705', '30850328'] }
    ] },
  { id: 'bzd', title: 'Seizure after stopping alprazolam', tags: ['withdrawal', 'GABAA'],
    vignette: 'A 58-year-old taking alprazolam 4 mg/day for 6 years runs out of tablets. On day 2 he is tremulous, anxious and sleepless; on day 3 he has a generalised seizure.',
    steps: [
      { type: 'mc', q: 'Which adaptation best explains withdrawal hyperexcitability?', options: [{ t: 'D2 receptor supersensitivity' }, { t: 'GABA-A receptor down-regulation/uncoupling with compensatory ↑ glutamatergic tone', correct: true }, { t: 'H1 receptor up-regulation' }],
        explain: 'Chronic positive allosteric modulation → receptor internalisation, subunit changes, uncoupling of BZD and GABA sites, and opposing excitatory adaptations. Abrupt removal unmasks hyperexcitability.', refs: ['21714826'] },
      { type: 'mc', q: 'Rational management?', options: [{ t: 'Switch to an equivalent dose of a long-acting benzodiazepine (e.g. diazepam) and taper slowly', correct: true }, { t: 'Start an SSRI and stop benzodiazepines' }, { t: 'Give flumazenil' }],
        explain: 'Flumazenil would precipitate withdrawal and seizures. Alprazolam\'s short half-life and high potency make withdrawal abrupt.' }
    ] },
  { id: 'li', title: 'Lithium toxicity after a new antihypertensive', tags: ['li_toxicity'],
    vignette: 'A 67-year-old with bipolar I disorder on stable lithium (level 0.8) is started on hydrochlorothiazide and ibuprofen. Two weeks later: coarse tremor, ataxia, slurred speech, vomiting and confusion. Level 2.4 mmol/L.',
    steps: [
      { type: 'mc', q: 'Why did the level rise?', options: [{ t: 'CYP450 inhibition' }, { t: 'Thiazide-induced Na⁺ depletion ↑ proximal-tubule Li⁺ reabsorption; NSAIDs ↓ renal Li⁺ clearance', correct: true }, { t: 'Increased absorption' }],
        explain: 'Lithium is handled like sodium in the kidney and is not metabolised by the liver — interactions are renal.', link: '#/drug/lithium' },
      { type: 'map', q: 'Click the structure whose dysfunction best explains the ataxia and dysarthria.', answer: ['cerebellum'], accept: ['cerebellum'],
        explain: 'Cerebellar toxicity — occasionally permanent (SILENT: syndrome of irreversible lithium-effectuated neurotoxicity).', chain: ['Thiazide + NSAID', '↑ Renal Li⁺ reabsorption', 'Serum Li⁺ 2.4', 'Cerebellar & cortical toxicity', 'Ataxia, dysarthria, confusion'] }
    ] },
  { id: 'clz', title: 'Clozapine: fever in week 3', tags: ['myocarditis', 'neutropenia', 'clozapine'],
    vignette: 'A 27-year-old with treatment-resistant schizophrenia starts clozapine with rapid titration. In week 3 he develops fever 38.5 °C, HR 125, mild chest discomfort and fatigue. He also drools at night and has not opened his bowels for 4 days.',
    steps: [
      { type: 'mc', q: 'Which tests are most urgent?', options: [{ t: 'Troponin, CRP, ECG (myocarditis) and ANC (neutropenia)', correct: true }, { t: 'Prolactin' }, { t: 'TSH only' }],
        explain: 'Myocarditis typically appears in weeks 2–8; agranulocytosis risk peaks in the first 18 weeks. Both are idiosyncratic — not explained by a single receptor.', refs: ['35067911', '29548760', '34083506'] },
      { type: 'mc', q: 'Which statement about clozapine adverse effects is MOST accurate?', options: [{ t: 'Every adverse effect is explained by one receptor' }, { t: 'Sedation (H1), orthostasis/tachycardia (α1, M2) and weight gain (H1, 5-HT2C) map onto receptors; neutropenia, myocarditis, sialorrhea and GI hypomotility are multifactorial / incompletely understood', correct: true }, { t: 'Sialorrhea is due to strong muscarinic antagonism' }],
        explain: 'Sialorrhea is paradoxical for a potent antimuscarinic drug: proposed M4 agonism, α2 antagonism and impaired swallowing. GI hypomotility can be fatal — treat constipation actively.', link: '#/drug/clozapine' }
    ] },
  { id: 'mirt', title: 'Mirtazapine: sleepy and hungry', tags: ['mirtazapine', 'sedation', 'weight_gain', 'H1'],
    vignette: 'A 70-year-old with depression, insomnia and poor appetite starts mirtazapine 15 mg at night. After 4 weeks mood and sleep are better, but she has gained 3.5 kg and feels groggy in the mornings.',
    steps: [
      { type: 'mc', q: 'Which single receptor action best links her sedation AND weight gain?', options: [{ t: 'α2 antagonism' }, { t: 'H1 inverse agonism/antagonism', correct: true }, { t: '5-HT3 antagonism' }],
        explain: 'H1 blockade → ↓ histaminergic arousal (sedation) and ↓ hypothalamic H1 satiety signalling (appetite/weight). 5-HT2C blockade may add to weight gain.', link: '#/drug/mirtazapine' },
      { type: 'mc', q: 'The family suggests increasing to 45 mg "because higher doses are less sedating". Best response?', options: [{ t: 'Correct — sedation always disappears at 45 mg' }, { t: 'This is a commonly taught clinical impression (H1 is saturated at low doses while noradrenergic effects grow with dose) but it is not a reliable rule; sedation and weight gain often persist, and the dose should be chosen for antidepressant response', correct: true }, { t: 'Higher doses block H1 less' }],
        explain: 'The application\'s dose module is labelled CONCEPTUAL: there are no human receptor-occupancy curves supporting a dose at which sedation reliably reverses.' }
    ] },
  { id: 'achtox', title: 'Confused, hot and dry', tags: ['anticholinergic'],
    vignette: 'An 81-year-old on amitriptyline 75 mg (for pain), oxybutynin and diphenhydramine at night is admitted confused, picking at the air, with dry flushed skin, dilated pupils, HR 118, urinary retention and absent bowel sounds.',
    steps: [
      { type: 'mc', q: 'Syndrome?', options: [{ t: 'Serotonin syndrome' }, { t: 'Anticholinergic toxicity / delirium', correct: true }, { t: 'NMS' }],
        explain: '"Hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter, full as a flask." Cumulative anticholinergic burden from three drugs.' },
      { type: 'map', q: 'Click the source of cholinergic input to cortex/hippocampus whose blockade explains the delirium.', answer: ['bf'], accept: ['bf', 'cortex', 'hippocampus'],
        explain: 'Basal forebrain (nucleus basalis) cholinergic projections — central M1 blockade disrupts attention and memory.', chain: ['Amitriptyline + oxybutynin + diphenhydramine', 'Muscarinic blockade (M1 central; M2/M3 peripheral)', 'Loss of cortical cholinergic modulation', 'Delirium + peripheral anticholinergic signs'] }
    ] },
  { id: 'qt', title: 'QTc 520 ms on citalopram + ...', tags: ['qt', 'hERG'],
    vignette: 'A 74-year-old on citalopram 40 mg is started on IV haloperidol for delirium and has hypokalaemia (K⁺ 3.0) from diuretics. ECG: QTc 520 ms.',
    steps: [
      { type: 'mc', q: 'Shared mechanism of the QT drugs?', options: [{ t: 'Cardiac β1 blockade' }, { t: 'hERG (IKr) potassium channel block → delayed ventricular repolarisation', correct: true }, { t: 'α1 blockade' }],
        explain: 'Most QT-prolonging drugs block hERG. Risk is concentration-dependent and amplified by hypokalaemia, hypomagnesaemia, bradycardia, female sex, age and combinations.', refs: ['14999113'] },
      { type: 'mc', q: 'Which action is MOST appropriate?', options: [{ t: 'Add ondansetron' }, { t: 'Correct K⁺/Mg²⁺; stop/reduce QT-prolonging drugs (citalopram > 20 mg not recommended > 60 y); continuous ECG monitoring', correct: true }, { t: 'Increase haloperidol' }],
        explain: 'FDA: maximum citalopram 20 mg/day over age 60.', link: '#/effects/qt' }
    ] }
];
