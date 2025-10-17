---
title: Naming Change & Blends
date: 2025-09-16/18/23
---

# Naming & Change - How tastes shift over time

**Themes**
- Names behave like fashion: popular tastes evolve in orderly, progressive ways, then reverse once saturation is reached (“ratchet effect”).  
- External events can nudge trends, but broad patterns often diffuse socially without central coordination.  
- US given names have diversified over time.

**Explore**
- Try NameGrapher to visualize: a *fad* name (spike), a *U-shaped* revival, an *obsolete* fade-out, and a *new* spelling post-1980s.  
- Compare wording variants in corpora (e.g., Google Books Ngram Viewer) to see analogous “fashion cycles” in language.

**Discussion prompts**
- Why do many families independently converge on similar name choices?  
- What mechanisms could explain progression -> reversal -> slow cyclic return?

---

# Name Blends - Portmanteaux of personal names

**Idea**: Proper names can blend (e.g., *Kim Kardashian* + *Kanye West* -> **Kimye**), following phonological and orthographic pressures.

**Probabilistic constraints (tendencies, not rules)**
1. **Overlap**: Blend where sounds/spelling overlap.  
2. **Onset conservation**: The name with the more complex onset tends to come first.  
3. **Lexical neighborhood**: Prefer outputs that sound like existing words (avoid negative associations).  
4. **Orthographic transparency**: Keep common sound↔spelling correspondences.  
5. **Understandability**: Result should clearly reveal both sources (match syllable count or stress when helpful).

**Try it**
- Justify given celebrity blends using the constraints above.  
- For pairs with two candidate blends, argue which is “better” and why.  
- Create and defend your own blends for the provided pairs.

---

# Trends in Name Data

**Setup**
- Copy the provided US and UK “Top 100/Top 10 by decade” sheets -> *File -> Make a copy*.  
- Inspect structure (esp. the **Rank** column). Use *Data -> Create a filter*.

**String utilities**
- Extract edges: `=RIGHT(cell, n)` and `=LEFT(cell, n)` -> build **First letter** / **Last letters** helper columns.  
- Fill formulas efficiently -> drag the **fill handle**.

**Count/average by criteria (slow path)**
- `=COUNTIFS(range1, "A", range2, "F", range3, "1904")` -> e.g., count girls’ names starting with **A** in 1904.  
- `=AVERAGEIFS(rank_range, first_letter_range, "A", sex_range, "F", year_range, "1904")`.

**Pivot tables (fast path)**
- *Insert -> Pivot table* -> set **Rows -> Year**, optionally **Columns -> Sex**.  
- **Values -> COUNTA** on a flag column (e.g., “Monarch name?”) to count; **Values -> AVERAGE** on **Rank** to track average rank over time.  
- Chart it: select pivot output -> *Insert -> Chart*.

**Mini-project**
- UK: Are girls’ **A-initial** names more/less common in 2014 vs. 1904?  
- US: Build a grouped flag for names ending with the **[o]** sound (various spellings) -> pivot by **Year** to see trend.

---

## References
- Lieberson, *A Matter of Taste* (2000)  
- Labov (2010) on diffusion and ratchet-like change
