---
title: Phonology
date: 2025-05-22/27
---

# Phonology

The study of the structures and patterns of speech sounds, at a more abstract level than phonetics.

---

## Phones, Phonemes, Allophones

---

### Phone

Basic unit of speech sound, concrete, what we hear. (Correspond to individual IPA symbols)

- IPA is a list of universal phones, but no language would use every phone.
- Two languages may use the same tone, but used differently.
  - Difference between the **underlying sound** and how it is **phonetically realized**.

---

### Phoneme
Phoneme is the smallest contrastive unit.

---

#### Checking for minimal pairs
- A minimal pair is word tuple where everything is identical except for a single sound.

Word pair where everything is identical except for a sound is called a minimal pair.

---

##### Contrastive distribution
There is a minimal pair, that two phones can occur in the same phonological context.

---

##### Complementary distribution
If there are no minimal pairs, it is *not* contrastive. That is a complementary distribution, meaning these two are used in different phonological contexts.

---

##### Free Variation
Can occur in the same context, but do *not* result in a contrast in meaning.

---

### Allophones

Two sounds are in complementary distribution that represent the same underlying sounds.

---

#### Phonemes are not universal
Different ways to pronounce the phonemes are called allophones.
Phonemes and their allophones are language-specific.

one phone can be an allophone of more than one phoneme (Sounds like some type of polymorphism to me)

---

## Phonotactics
- How languages differ in their phonemic inventory.
- Differ how they use phonemes.

How phonemes can be sequenced.

---

### Syllables
- Smallest prosodic unit in most languages.

```
syllable
|--rime
|  |--coda
|  |--nucleus                - Have to be there (usually vowels)
|--onset
```

#### Phonotactic constraints of English

---

### Sonority hierarchy
Sounds are ranked based on how 'loud' phones are.

---

### Tests
- Look for minimal pairs
  - Y: are phonemes
  - N: Allophones for the same phoneme
- Environments the words occur
  - In complementary or not

```java
/*********************************************************************
 * ASSUMPTIONS
 * ----------
 * Types Word, Sound, Environment, Lexicon, Meaning already exist.
 * Helper functions already exist (shown below).
 *     List<Pair<Word,Word>>   findMinimalPairs(Sound a, Sound b, Lexicon L)
 *     Set<Environment>        environmentsOf(Sound x, Lexicon L)
 *     boolean                 overlap(Set<Environment> A, Set<Environment> B)
 *********************************************************************/

enum DistributionType { CONTRASTIVE, COMPLEMENTARY, FREE_VARIATION }

class PhonologicalAnalyzer {

    /**
     * @param s1
     * @param s2
     * @param lexicon  corpus
     * @return         CONTRASTIVE → distinct phonemes
     *                 COMPLEMENTARY → allophones of one phoneme
     *                 FREE_VARIATION → context-overlap without meaning contrast
     */
    public static DistributionType classifyPair(Sound s1,
                                                Sound s2,
                                                Lexicon lexicon) {

        /* ---------- Search for minimal pairs ---------- */
        List<Pair<Word,Word>> minimalPairs = findMinimalPairs(s1, s2, lexicon);

        if (!minimalPairs.isEmpty()) {
            return DistributionType.CONTRASTIVE;
        }

        /* ---------- Compare environments ---------- */
        Set<Environment> env1 = environmentsOf(s1, lexicon);
        Set<Environment> env2 = environmentsOf(s2, lexicon);

        boolean shareContext = overlap(env1, env2);

        if (!shareContext) {
            // Never co-occur in the same environment -> complementary
            return DistributionType.COMPLEMENTARY;
        }

        /* ---------- Same environments, no meaning-contrast ---------- */
        // Since no minimal pairs -> free variation
        return DistributionType.FREE_VARIATION;
    }
}
```
A java style psuedocode for the process (this is added at Jun 14, after I felt this piece of note was not too good and I didn't do this process well on the exam).

---

## Phonological Rules

---

### Examples

---

#### Flapping rule
```
/t/ -> [r] | 'V_V
/t/ -> [t] | *elsewhere
```

---

#### Aspiration
```
/t/ -> [t^h] | _.'
/t/ -> [t] | elsewhere*
```

`/p/`, `/t/`, `/d/` follows this pattern with aspiration in English.

---

### Natural classes
Groups of phones that can be defined by some phonetic similarity.

|              | **Obstruent** | **Sonorant** | **Noncontinuant** | **Continuant** | **Sibilant** |
| :----------: | :-----------: | :----------: | :---------------: | :------------: | :----------: |
|     Stop     |       x       |              |         x         |                |              |
|   Affricate  |       x       |              |         x         |                |       x      |
|   Fricative  |       x       |              |                   |       x        |       x      |
|     Nasal    |               |       x      |         x         |                |              |
|  Approximant |               |       x      |                   |       x        |              |

---

#### Feature specifications (based on the manner of articulation)
To determine the minimal distinguishing feature between two sounds.
- Continuants vs. Noncontinuants
- Obstruents vs. Sonorants
- Sibilants.

---

## Phonological Rules

Humans have the tendency to increase the place of articulation.

Some common phonological processes:
- **Assimilation**: two nearby sounds become more similar.
  - Ex. In English, nasals undergo assimilation
  - Plurals have the same process (classification with sibilant and voicing)
- **Dissimilation**: two nearby sounds become more different.
- **Insertion** (epenthesis) : Adding a phone.
- **Deletion**: An underlying phoneme is removed when pronouncing a word. (Some rules govern these behaviours)
- **Metathesis**: Two sounds are switched.