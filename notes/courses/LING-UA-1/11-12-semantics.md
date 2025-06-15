---
title: Semantics
date: 2025-06-10/11
---

# Semantics

## Goal
### Understand:
- Meanings are out in the world
- Meaning of a sentence is its truth condition.
- Principle of compositionality
- Three different semantic relations

### Do:
- Venn Diagrams
- Distinguish semantic relations

## Semantics vs. Pragmatics
- Semantics is the study of linguistic meaning independent of the context.  
- Pragmatics is the study of linguistic meaning dependent on context  

## Defining semantics
Hypothesis 1: meanings are paraphrases (circular)  
Hypothesis 2: Meanings are concepts and ideas (Different ideas in different people's mind, hard to represent some words.)  
Hypothesis 3: Meanings are out in the world.

## Sentence meanings and truth conditions

### Truth is relative
Given a certain condition, we can judge the truth value of a sentence.  
We only need to know *what the world should be like* for a sentence to actually be true or false.

### Possible worlds
For each way the world *could have been*, there is a distinct possible world.  
Only talk about *logically* possible ways that would have turned out.  
Ex. $2 + 2 \neq 5$ (I was thinking this maybe could be true in a quaternary system, but then I realized 5 isn't even a defined digit under that. There is only $2_4 + 2_4 = 10_4$)

### Connectives
- negation *not* reverses the truth.
- logical connectives *and* require both conjuncts to be true.
- logical connectives *or* require one of the two conjuncts to be true.

## Composing meanings

### Establishing truth conditions
Meaning of a sentence is its truth conditions.
- Determining the meaning of a sentence by the meanings of the words it contains and the way they are combined. This is called the **principle of compositionality**.
- There is an order of operations establishing the conditions.

(The reason I think that there's the logical aspect, because the word in languages doesn't have a connection to it's meaning. So there is the need of building the logic constructively from ground up, not using established languages)

### Common semantic building blocks
- Names (proper nouns) refer to specific individuals in the world (**referent**)
- Common nouns refer to the *collection* of individuals in the world.
- Verb phrases that combine with a subject noun to form a sentence are called **predicates**.
    - Under what conditions it applies to any given individual.
    - What the world must be like for it to apply to any given individual.
    - In what kinds of logically possible situations it would be possible.

### Set theory
Venn diagrams to model the set of individuals.  
**Inclusive** and **Exclusive or**.  
but is logically equivalent to and, but it conveys an extra meaning of unexpectedness or contrast.

### Quantifiers
To relate predicates to other predicates, examples:
- every (subset)
- some (non-empty intersection)
- no (no intersection)
- numerals (exact quantity of the shared elements)

## Entailment
- When one sentence follows from another.  
  - (Implication that are one/two directional)  
  - A formal definition of **entailment**: $S_1$ entails $S_2$ iff ($S_1$ is true $\implies$ $S_2$ is true).  
  - A formal definition of being **synonymous** (iff): $S_1$ is equivalent to $S_2$ iff they entail each other.  
- When sentences are contradictory.  
  - a formal definition of being **contradictions**: $S_1$ contradicts $S_2$ iff no possible world in which ($S_1$ and $S_2$ are true).  

Relation of entailment is given just by the meaning of a sentence, independent of context. However, in actual conversation speakers often rely on context when communicating.  

## Presuppositions
Speakers often consider certain background assumptions to be **shared** between the conversation participants (or at least they will talk as if they are).  
- These background assumptions are **presuppositions**.  
- Presuppositions rely on context, thus have to do with pragmatics.  

### Triggers
1. Factive verbs (realize, regret, etc.)  
2. Definite determiners (the)  
3. Possessive case 's and possessive pronouns  
4. Cleft sentences (It was... that...)  
5. Iterative (additive particles) (again, too)  
6. Contrasts  
7. Comparatives (-er)  
8. Temporal (time word) classes ($\pm$ Past, before, etc.)  
9. Change of state words (stop, begin, etc.)  
10. Counterfactual conditionals introduces by *if*  

## Implicatures
What the listener can infer by reason based on what the speaker says in a given context.  
Language as a **cooperative endeavor**.  

### Grice's Maxims
What does the hearer assume the speaker is doing:
1. Maxim of Quality
   - **True**
   - Do not say what you believe is false. (lying)
   - Do not say that for which you lack adequate evidence.
2. Maxim of Quantity
   - **Informative**
   - Informative as is required (for the current purpose of exchange).
   - Do not make it more informative than is required.
3. Maxim of Relevance
   - **Relevance**
4. Maxim of Manner
   - **Perspicuous/ Specific**
   - Avoid ambiguity
   - Avoid obscurity
   - Be brief
   - Be orderly

### Chatacteristic of implicatures
1. Implicatures are implied, not said.
2. Meaning is the result of the context.
3. Implicatures are **cancellable** or defeasible.

### Implicature vs. Entailment vs. Presupposition
- Implicature is possible to cancel, not the other two. 

Does B have to be true regardless of the condition of A?
True: Presupposition
Does B have to be true if A is true?
True: Entailment
False: Implicature.

A java style psuedocode of this process:
```java
/*********************************************************************
 * ASSUMPTIONS
 * ----------
 * Types Sentence, Context already exist.
 * Helper functions already exist:
 *     boolean isTrueRegardless(Sentence B, Sentence A, Context C)
 *     boolean isTrueIf(Sentence A, Sentence B, Context C)
 *********************************************************************/

enum SemanticRelation { PRESUPPOSITION, ENTAILMENT, IMPLICATURE }

class SemanticAnalyzer {

   /**
    * @param A       first sentence
    * @param B       second sentence
    * @param C       context
    * @return        PRESUPPOSITION -> B must be true regardless of A
    *                ENTAILMENT     -> B must be true if A is true
    *                IMPLICATURE    -> B is inferred but not guaranteed
    */
   public static SemanticRelation classifyRelation(Sentence A,
                                                   Sentence B,
                                                   Context C) {
      // if B true regardless, Presupposition
      if (TruthEvaluator.isTrueRegardless(B, A, C)) {
         return SemanticRelation.PRESUPPOSITION;
      }

      // Now the truth value of B is dependent on A;
      // if (A true -> B true), Entailment
      if (TruthEvaluator.isTrueIf(A, B, C)) {
         return SemanticRelation.ENTAILMENT;
      }

      // otherwise, Implicature
      return SemanticRelation.IMPLICATURE;
   }
}
```
(Now I feel like psuedocode is a good way to understand sth, however sometimes it's really hard to implement, for example, I wanted to writeout the helper isTrueRegardless as isTrue, but on second thought the meaning become fuzzy, and I need to define the params precisely.)

Or a summary:
- Entailment: B necessarily follows from A
- Presupposition: Assumed background information
- Implicature: Information you infer that is not necessarily explicit.