# NeuroPharm Atlas

An interactive psychiatric pharmacology and neurocircuitry atlas. Each medication is traced from its molecular targets through receptor signalling and brain circuits to its therapeutic **and** adverse effects:

```
Drug → primary target → receptor/transporter effect → neuronal signalling → region/circuit → network effect → clinical effect
Off-target receptor → physiological consequence → adverse effect
```

The aim is that a learner can reason about an unfamiliar drug from its receptor profile instead of memorising lists of side effects.

## Running it

The app is a static site with no build step and no dependencies.

* **Open `index.html` directly** in a modern browser. It works from `file://`.
* Or serve the folder: `python3 -m http.server 8000`, then open <http://localhost:8000>.
* It deploys as-is to GitHub Pages or any static host.

## What's inside

| Section | Route | Highlights |
|---|---|---|
| A Brain Atlas | `#/atlas` | Schematic map with 36 clickable, keyboard-accessible regions; projection filters by transmitter; **put a drug on the brain** (`#/atlas/place/<drug>`) |
| B Neurotransmitter systems | `#/nt/<DA\|5HT\|NE\|GABA\|GLU\|ACH\|HIS\|ORX\|OPI>` | Projection maps; 5-HT subtype table; animated autoreceptor synapses; dopamine "place a drug" pathway table; GABA direct vs indirect drugs; AMPA→NMDA plasticity stepper |
| C Receptor Atlas | `#/receptors/<id>` | 65 targets: cascade, pre/postsynaptic roles, distribution, drugs, inherited mechanism chains |
| D Circuits | `#/circuits/<id>` | Mesolimbic, mesocortical, nigrostriatal, tuberoinfundibular, reward/addiction, sleep–wake switch, orexin, descending pain, PFC inverted-U. Each animates what a drug does |
| E–L Drug classes | `#/class/<cls>` | Antipsychotic receptor-fingerprint matrix and side-effect mechanism map; ADHD target × region table; reward-circuit drug placer |
| Drug modules | `#/drug/<id>/<tab>` | 94 agents. Radial receptor map, fingerprint, brain view, therapeutic/adverse chains with **WHY?** on every arrow, dose & time course, prescribing information, references |
| Flagships | mirtazapine · clozapine · lithium | α2 auto/heteroreceptor synapses and the conceptual dose explorer; clozapine's "multifactorial / incompletely established" toxicity map; lithium mechanism network |
| ⇅ Sort & rank | `#/sort/<class>` | Rank antipsychotics (or any class) by any receptor's affinity, any side-effect rating, half-life or a 5-HT2A−D2 index; filter by D2 action (antagonist/partial agonist/none); "Ask" presets such as *Which cause the most weight gain?* re-sort and explain which receptor columns account for the ranking. Rows animate into their new order |
| M Compare | `#/compare/a,b,c` | 2–4 drugs; click an adverse effect to highlight the receptors that explain the difference |
| N Side-effect explorer | `#/effects/<id>` | Symptom → mechanisms → drugs → why → monitoring; symptom↔drug traces |
| O Prescriber mode | `#/prescriber` | Dosing/PK/renal/hepatic/monitoring table. When the toggle is on, drug pages open on prescribing information |
| P What-if simulator | `#/whatif` | Combine manipulations (↑DA, block D2, block H1, enhance GABA-A, block NMDA…) and set baseline tone |
| Learn | `#/partial`, `#/learn/timecourse`, `#/learn/adapt` | Partial-agonist model, time course, receptor adaptation/tolerance |
| Cases & quiz | `#/cases`, `#/quiz` | 12 cases including click-the-brain steps; quiz questions generated from the data |

Global search (press `/`) covers regions, receptors (`H1`, `D2`, `α2`, `mu`…), pathways, drugs, effects, disorders, indications and doses.

## Design principles

* **Evidence tags on every mechanism.** Each chain carries one of: *Established pharmacology*, *Strong experimental evidence*, *Clinical association*, *Proposed mechanism*, *Mechanism incompletely understood*, *Simplified teaching model*. Effects without a single-receptor explanation are labelled as such; the app doesn't invent one.
* **Measured Ki for antipsychotics.** `assets/js/data/ki.js` holds in-vitro Ki values (nM) for 13 antipsychotics, taken from each drug's prescribing information (or the original pharmacology paper), with the source shown beside every table. Where a source gives only ranges or nothing (risperidone, paliperidone, haloperidol, chlorpromazine, xanomeline), the qualitative 1–4 grade is kept and labelled as such.
* **No fake precision.** Receptor fingerprints use qualitative 1–4 affinity grades, not occupancy. The dose explorers show Low/Moderate/High *conceptual* engagement and say so. The only numerical occupancy values cited are from PET studies (Kapur 2000; Meyer 2004; Volkow 1998).
* **Not "one transmitter = one disease".** Depression ≠ low serotonin, and schizophrenia ≠ too much dopamine. Simplified models are flagged.
* **Motion with purpose.** Mechanism chains cascade in step by step, bars and meters grow, highlighted regions pulse, transmitter flow is animated along projections, and sorted rows glide to their new rank. All of it switches off under the reduced-motion toggle or `prefers-reduced-motion`.
* **Accessibility.** Colour is never the only cue: transmitters have line styles, drug actions have shapes and glyphs, and evidence levels have glyphs and text. Every map region is a focusable button with a text-list alternative. There is a reduced-motion toggle, and `prefers-reduced-motion` is honoured. Light and dark themes are both available.

## Data architecture

Everything is plain data in `assets/js/data/`. Drugs **inherit** mechanisms from their target profile, so adding a drug means listing its targets:

```
core.js        evidence tags, drug actions, affinity grades, transmitter styles
regions.js     Region { id, name, x/y shape, nts, inputs, outputs, receptors, functions, disorders }
receptors.js   Receptor { id, nt, family, coupling, cascade[], sites{pre,post}, regions[], physiology, psych, refs }
mechanisms.js  Mechanism { target, actions[], effect, type, ev, chain[[kind,text]], whys[], why, regions, circuit, refs, minAff }
effects.js     Effect { id, name, kind, desc, monitor, manage } + drug-specific non-receptor mechanisms
drugs.js       Drug { cls, sub, stahl, t:[[receptor, action, affinity, 'P']], ae{0–3 ratings}, extra[], doseLevels, labelNotes, notes, refs }
circuits.js    projections, transmitter systems, Circuit { regions, path, receptors, functions, disorders, steps, block }
cases.js       clinical cases
refs.js        PubMed references (PMIDs/DOIs, all verified via the NCBI PubMed API)
stahl.js       GENERATED condensed prescribing data (see below)
```

`PA.U.mechsForDrug(drug)` attaches every mechanism whose `target` and `action` match a drug target with affinity ≥ `minAff`, plus `drug.extra`. Rare cases use `mechOverride.exclude`.

**Adding a drug:** add a `D('id', {...})` entry in `drugs.js` with its targets, actions, affinity grades and ratings. Then run the validator.

### Validation

```
node tools/validate.js
```

This checks every cross-reference: receptors, regions, effects, mechanisms, PMIDs, Stahl keys and case answers.

## Prescribing data: Stahl's Prescriber's Guide

The primary prescribing reference is *Stahl's Essential Psychopharmacology: Prescriber's Guide*, 7th ed. (Cambridge University Press, 2021). `assets/js/data/stahl.js` is generated from the repository PDF.

```
pdftotext -layout <book>.pdf  WORK/stahl.txt
pdftohtml -i -noframes -stdout <book>.pdf > WORK/stahl.html
python3 tools/extract_stahl_chapters.py   WORK   # → WORK/stahl.json
python3 tools/extract_stahl_indications.py WORK  # → WORK/ind.json (bold = FDA-approved)
python3 tools/build_stahl.py WORK                # → assets/js/data/stahl.js
```

Only short factual prescribing fields are kept: dose range, titration, formulations, PK, interactions, special populations, monitoring, contraindications and indications. Narrative prose ("Pearls", "How the drug works", etc.) is excluded. Mechanism text in the app is written independently and cited to PubMed.

Changes after the 2021 edition are flagged on the drug pages with their source. They include xanomeline–trospium (2024), cariprazine adjunctive MDD (2024), brexpiprazole for Alzheimer agitation (2023), lumateperone bipolar depression (2021), esketamine monotherapy (2025), the end of the clozapine REMS (2025), and recent boxed-warning updates. Methadone and xanomeline–trospium are not in Stahl's 7th edition, so their entries cite FDA labelling.

## Disclaimer

This is an educational reference, not personalised prescribing advice. Verify all doses, interactions and warnings against current official prescribing information and local guidelines.
