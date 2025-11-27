---
title: AvianLexiconAtlas – Guest Lecture
date: 2025-11-25
---

Prof. Erin S. Morrison (NYU Liberal Studies)  
Based on Morrison et al. (2025), PLoS One 20(5)

# Overview

**Core goal**  
Build a database (**AvianLexiconAtlas**) that categorizes what **English-language common bird names** actually describe, across all **10,906 recognized bird species**.  

**Motivating questions**

- When you see a bird’s **common name**, what information does it communicate?
- Are names mostly about **appearance**, **behavior**, **place**, or **people**?
- Do naming patterns differ across **bird families** and **geographic regions**?
- Can specialized terminology in names become a **learning barrier** for non-experts?

The project uses a set of **standard descriptive categories** to code each species’ common name and makes the data publicly available at *avianlexiconatlas.com* (with glossary and gazetteer).   

---

# Naming Examples: What Would You Call This Bird?

**Elicitation examples from lecture**  

1. **New World oriole (genus *Icterus*)**  
   - Students asked to propose a name based on picture alone.  
   - Actual English name: **Yellow Oriole (*Icterus nigrogularis*)** – highlights **color** (physical trait).

2. **Tanager (genus *Piranga*)**  
   - Male bright red, female dull yellow-green.  
   - Actual English name: **Scarlet Tanager (*Piranga olivacea*)** – again emphasizes **male plumage** (physical trait of the male only).

3. **Goose (genus *Branta*)**  
   - Actual English name: **Barnacle Goose (*Branta leucopsis*)**.  
   - Name reflects a **historical myth** that these geese grew from barnacles on driftwood; example of **miscellaneous / human-centered** terminology (not a real biological trait).

These examples set up the distinction between **what you might expect** a name to say (color, behavior, habitat) and what it **actually** encodes (myths, geography, commemorations, etc.).  

---

# Descriptive Categories in AvianLexiconAtlas

Each English common name is assigned to one of several **high-level categories**, based on what the name seems to be describing.   

## Avian physical traits

- Names describing **visible characteristics** of the bird.
- Subdivided by **which sex** the trait is based on:
  - **Both sexes**: e.g. *Black Swan*, *Orange-bellied Antwren*.
  - **Male only**: trait salient in males (e.g. bright male plumage).
  - **Female only**: trait salient in females.
- Also includes **size descriptors** such as *Giant Kingbird*.  

## Avian natural history

- Names referencing how/where the bird **lives or behaves**:
  - **Behavior**: e.g. *Whistling Warbler*.  
  - **Habitat / geography as ecological context**: e.g. *Mississippi Kite*.  
  - **Other natural-history traits** (diet, microhabitat): e.g. *Glacier Finch*.  

## Human-centered terminology

- Names foregrounding **human categories** rather than bird traits:
  - **Person’s name** (eponyms): e.g. *Meyer’s Parrot*, *Audubon’s Oriole*.  
  - **Local language**: Anglicized spelling/pronunciation of an indigenous term.  
  - **Miscellaneous**: Mythical, historical, or otherwise non-biological terms (e.g. *Barnacle Goose* and its medieval barnacle myth).  

A crowdsourced **glossary** explains specialized descriptors, and a **gazetteer** lists geographic place names used in bird names (both available with the dataset).   

---

# Dataset & Coding

- Scope: **All 10,906 species** with English common names.  
- Multiple teams of coders independently assigned each species name to a **single primary category**.   
- Duplicate datasets allowed the team to assess **reliability**:
  - Which categories coders agreed on,
  - Which were prone to disagreements.

The project also links each species to its **phylogenetic position** (family-level cladogram) to examine how naming patterns correlate with **evolutionary relationships**.  

---

# Main Findings

## 1. Most bird names describe physical traits

- Bar chart for all species shows **physical-trait names** are the largest group by far, compared to **natural history** and **human-centered** names.  
- This suggests that English bird names are predominantly about **appearance** (color, pattern, size) rather than ecology or people.

## 2. Reuse of common terms across species

- Many words recur in large numbers of names:
  - e.g. *African* (69 species), *Common* (68), *Lesser* (65), *Black* (64).  
- A word cloud in the slides visualizes frequent descriptors:
  - Some are **physical traits** (e.g. *Black*, *White-throated*),
  - Others are **geographic** (e.g. *African*, *Philippine*),
  - Others are **human-centered** or vague (e.g. *Common*, *Northern*).

Implication: common names form a **limited descriptive vocabulary** that gets recombined across species.

## 3. Specialized/historical terms can be learning barriers

- Many common names use **specialized anatomical or historical terms** unfamiliar to beginners.
- To reduce this barrier, AvianLexiconAtlas provides:
  - A **glossary** for technical descriptors (e.g. “lores,” “mantled”),
  - A **gazetteer** for place names referenced.   

## 4. Reliability issues: physical trait descriptors are hardest

- In duplicate coding, **906 species** had **mismatched category assignments** between datasets.  
- Most disagreements involved:
  - Distinguishing between **“both sexes” vs “male only”** physical traits.
- Example from slides: the **Rose Robin** has differently colored male and female; whether the name describes “both” or “male-only” can be ambiguous.  

This shows that seemingly simple labels like “color term for both sexes” vs “male-only trait” can be **subtle to code consistently**.

## 5. Phylogenetic clustering of name categories

- Using Fritz & Purvis’s **D statistic**, the team tested whether name categories are **clumped** across the bird family tree.  
  - D = 0 → clumped as expected under Brownian motion,  
  - D = 1 → random.  
- Results:
  - **Physical trait** names: D ≈ 0.729  
  - **Natural history**: D ≈ 0.745  
  - **Human-centered**: D ≈ 0.875  
- Interpretation:
  - Closely related species tend to share the **same naming category** more than chance, especially for physical traits and natural history.
  - Human-centered names are **less clumped**, closer to random distribution.

So, naming practices appear to be shaped partly by **biological relatedness** (e.g. visually similar groups getting physical-trait names).

## 6. Regional differences in category frequencies

- A bar chart by **breeding range** shows that the **proportions** of categories (physical, natural history, human-centered) vary across:
  - Nearctic, Neotropical, Palearctic, Afrotropical, Oriental, Australasian, Oceania regions, etc.  
- Some regions rely more on **geographic** or **human-centered** terms, others more on **physical traits**.

This suggests that naming conventions are also influenced by **regional traditions** and **history of ornithology**.

---

# Future Directions

The lecture ends with several research directions and resources:   

1. **Finer-grained trait coding**  
   - Within “physical traits”, distinguish more detailed aspects:
     - Color terms, patterns, body parts (crest, tail, throat, etc.).
   - Slide with labeled bird diagram (“field marks”) suggests subcategories like crown, rump, upper-tail coverts, etc.

2. **Regional and multilingual comparisons**  
   - Compare **English common names** with **non-English** common names:
     - Are other languages more likely to use **behavioral**, **habitat**, or **cultural** descriptors?
     - How do colonial histories shape who gets to name species and in which language?

3. **Educational applications**  
   - Use the dataset and glossary to design tools for:
     - Teaching bird ID (by emphasizing the descriptive content of names),
     - Helping beginners decode specialized terminology.

4. **Open database & community contribution**  
   - AvianLexiconAtlas is available at *avianlexiconatlas.com* for viewing/downloading.
   - Researchers, students, and birders can:
     - Explore naming patterns,
     - Propose new analyses,
     - Potentially contribute additional coding or languages.

---

# Key Takeaways

- English bird common names overwhelmingly emphasize **physical traits**, but also reflect **behavior**, **habitat**, **geography**, and **human-centered** history (people, myths, local languages).
- Systematically coding names reveals patterns in:
  - **Descriptive focus** (appearance vs natural history vs human-centered),
  - **Reuse of common descriptors** (“Black”, “Common”, “African”, etc.),
  - **Reliability issues** in how we interpret names,
  - **Phylogenetic** and **regional** clustering of naming styles.
- AvianLexiconAtlas turns everyday bird names into a **quantitative dataset** for studying how people linguistically represent biodiversity.
