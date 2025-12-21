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

 
# Trends in Name Data

**Pivot tables (fast path)**
- *Insert -> Pivot table* -> set **Rows -> Year**, optionally **Columns -> Sex**.  
- **Values -> COUNTA** on a flag column (e.g., “Monarch name?”) to count how many in each year.  
- Or **Values -> AVERAGE** on **Rank** to track average rank over time.  
- Chart it: select pivot output -> *Insert -> Chart*.

**Mini-project**
- UK: Are girls’ **A-initial** names more/less common in 2014 vs. 1904?  
- US: Build a grouped flag for names ending with the **[o]** sound (various spellings) -> pivot by **Year** to see trend.

---

# Name Blends - Portmanteaux of personal names

**Definition**
- A **blend** is a new word formed by merging parts of two names (e.g., *Brangelina*).
- Blends are a subtype of portmanteau formation; they are not just concatenation.

**Observed constraints**
- **Overlap is preferred** when possible.
- **Onset conservation**: the beginning of the first name often remains intact.
- **Prosodic well-formedness**: blends prefer plausible English syllable/stress patterns.
- **Similarity / neighborhood effects**: blends tend to preserve recognizable pieces so the sources stay recoverable.

**Examples**
- *Renesmee* (Bella + Renee + Esme).
- Celebrity couple names (*Kimye*, *Bennifer*).

**Why they work**
- They compress two identities into one label.
- They feel “name-like” when they follow phonotactic and stress patterns.

---

## References
- Lieberson, *A Matter of Taste* (2000)  
- Labov (2010) on diffusion and ratchet-like change
