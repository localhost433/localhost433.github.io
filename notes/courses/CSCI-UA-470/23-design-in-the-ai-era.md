---
title: "The SDLC, the Roles & Design in the AI Era"
date: "2026-08-05"
---

## Zooming out

The last lecture does not add material. It puts the whole course on one board and asks a question the syllabus never had to answer before: *given that a model can write the code, why did we spend a semester on how to draw it?*

The board's answer runs through the development process, so that comes first.

## 1 · The process

Software gets built in phases, and the board names seven of them. What matters is not the list — every textbook has one — but **what each phase hands to the next**, because that is where this course has been living.

```artifact src=demos/sdlc-roles-ai.jsx
```

Switch the knob to *who owns it* and the syllabus falls out of the picture. An analyst turns wishes into use cases ([L12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)); a designer turns use cases into a model — class diagrams, sequence diagrams, the relationships, and the judgment about which designs survive change ([L13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams)–[L20](note.html?course=CSCI-UA-470&note=21-behavioral-patterns)); a programmer turns the model into code ([L15](note.html?course=CSCI-UA-470&note=15-uml-to-code)); a tester checks the code against the use cases the analyst wrote. The board calls the first two **architects**, because both of them produce descriptions rather than running programs.

That chain is UML's whole justification. A notation exists so that a description survives the handoff between two people who do not share a head — which is why the notation rules are worth memorising, and why a diagram only its author can read has failed at its one job.

Two lectures sit outside the design phase and are worth placing while the board is up. The **languages** ([L01](note.html?course=CSCI-UA-470&note=01-foundations)–[L11](note.html?course=CSCI-UA-470&note=11-jvm-runtime)) are the implementation phase's tools, and the board draws each one's toolchain: C++ source through a compiler to a native binary the OS runs directly; Java source through `javac` to bytecode, and bytecode through a JVM that interprets and then JIT-compiles it. Those two pictures are [note 01](note.html?course=CSCI-UA-470&note=01-foundations)'s build pipeline and [note 11](note.html?course=CSCI-UA-470&note=11-jvm-runtime)'s runtime architecture, and the consolidated rules are in [the Java/C++ comparison](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison).

## 2 · Where we are in 2026

The rest of the lecture is one argument, and it starts from a claim about the present. The deck's figures, as given: something near **41%** of newly committed code is now AI-generated, on the order of **256 billion** lines; code duplication is up about **48%**; refactoring activity is down about **60%**. And the catch — AI-generated code carries roughly **2.7× more vulnerabilities**, with a security flaw appearing in **45%** of samples across a hundred-odd models.

> **On these numbers —** the deck gives them without sources, and they are worth reading as a description of a direction rather than as measurements to quote. Two of them do most of the work regardless of the exact figure, because they point the same way: duplication rising while refactoring falls is a system producing more structure than anyone is tidying. The deck's own framing is that teams which adopted AI tooling in 2023–24 are hitting month 12–18 now, which is when architectural shortcuts stop being cheap.

The lecture's summary of it: **output soared, structure did not follow.**

## 3 · The answer, in one sentence

> SOLID and design patterns describe the physics of software complexity — not the author of the code.

This is the load-bearing claim, and it is worth unpacking because it is what makes the rest an argument rather than a preference. Every principle in [note 16](note.html?course=CSCI-UA-470&note=16-solid) is a statement about **systems**, not about typists. A class with five reasons to change is expensive to modify no matter who wrote it. An abstraction still marks the seam along which one part can be replaced without disturbing another. Coupling still decides how far a change travels.

None of those facts mention authorship. So a change in *who* emits the characters cannot repeal them — which is the reply to the objection that the principles are old and the tooling is new.

## 4 · The reframe: a pattern name is a compressed instruction

The deck's sharpest practical point is not about principles at all. It is that the catalog you just spent three lectures memorising is now also **vocabulary for the prompt**.

Ask for *"discounts at checkout"* and you get a tangle of `if`/`else` inside one method — which is, precisely, [L20](note.html?course=CSCI-UA-470&note=21-behavioral-patterns)'s rejected half. Ask for *"discounts at checkout — apply the Strategy pattern: a `DiscountPolicy` interface with Percentage, BOGO and None implementations, selected at run time"* and the first attempt is extensible, testable, and reviewable.

The same holds one level up. *"Write a `UserService` that registers users"* returns one class doing validation, persistence, email and billing — five reasons to change, hard to test or trust. *"Given these interfaces — `UserRepository`, `EmailSender`, `AuditLog` — implement a `UserRegistrar` that depends only on them"* returns something injected, mockable, and doing one job.

Nothing changed except the words. In both cases the model did exactly what it was asked; the difference is that the second prompt carried a **design**, and a pattern name is the shortest way to carry one.

## 5 · Four reasons the design skills survive

The deck's spine, and the part worth remembering as four separate arguments rather than one mood.

**System design is still a human job.** A model generates implementations. It does not decide what should exist, where the boundaries fall, or what the system has to become in two years. Those are design decisions, and they are judgments about the *future* — information no amount of context supplies.

**Architecture is how you steer.** The interfaces you define are the guardrails the generated code has to fit inside. A tight interface ([ISP](note.html?course=CSCI-UA-470&note=16-solid)) leaves little room to invent surprises; callers depending on the abstraction ([DIP](note.html?course=CSCI-UA-470&note=16-solid)) means you can mock, swap or regenerate freely; one responsibility ([SRP](note.html?course=CSCI-UA-470&note=16-solid)) means you can verify a unit without holding the whole system in your head. You define the contract; the AI fills the body.

**You cannot trust what you cannot isolate.** When generated code fails, structure is what shrinks the search space. A tangled `UserService` holding validation, email, payment, billing, logging, notifications and analytics has a blast radius the size of itself — a bug can be anywhere in it. Boundaries turn "somewhere in the system" into "in this unit".

**The bottleneck moved to reading.** The old loop was *think → write → review a little*, and you understood the code because you had typed every line of it. The new loop is *specify → generate → review everything*, and understanding is no longer a by-product of anything. Generation is nearly free; attention is not. So the readability that good design buys stops being a nicety and becomes the constraint on how fast you can go.

## 6 · How to work this way

Four steps, and the deck is explicit that your leverage is concentrated in the first and third — the two the model cannot do for you.

| | Step | What it is |
|---|---|---|
| 1 | **Specify** | define the interfaces, the boundaries, and the pattern to use — this is the design work |
| 2 | **Generate** | hand over the contract and let the model fill the implementation inside it |
| 3 | **Review** | read the output against the principles: one job? depends on abstractions? reject if not |
| 4 | **Refactor** | fold the unit in and tidy the seams — nothing cleans up after itself |

### SOLID as a review rubric

The most directly usable thing in the lecture: the five principles turned into six questions to run every generated unit past. If a unit fails one, send it back **with the principle named** in the next prompt.

| | Question |
|---|---|
| **SRP** | Does this unit have exactly one reason to change? |
| **OCP** | Can I add the next feature without editing this code? |
| **LSP** | Would any subtype it uses behave as its interface promises? |
| **ISP** | Does it depend on interfaces it fully uses — nothing fatter? |
| **DIP** | Does it depend on abstractions I control, not concrete details? |
| **Patterns** | Is the intent obvious — a named pattern, not a clever tangle? |

The rubric is worth practising on, because none of these failures announces itself. Generated code that violates every line of it still compiles, still passes its tests, and still does what was asked.

## 7 · The objections, taken seriously

The deck steel-mans three, which is more useful than the claims themselves.

*"AI will refactor the mess later."* It can help — but it optimises for the current prompt, not the system's future, so somebody still has to know what good looks like and ask for it. And the trend runs the other way: refactoring activity is down, not up.

*"The principles are old; AI is new."* SOLID describes coupling, cohesion and change. New authorship does not repeal that, because the problem the principles describe has not changed.

*"I'll just regenerate broken code."* Regeneration is non-deterministic — ask twice, get two implementations — so it can break callers. Stable abstractions (DIP, ISP) are exactly what let you throw a body away safely. The plan is fine; it just has design as a precondition.

## 8 · What changes and what doesn't

| What changes | What doesn't |
|---|---|
| typing code becomes cheap and fast | complexity still has to be managed |
| your day shifts to specifying and reviewing | coupling and cohesion still set the cost of change |
| design mistakes propagate faster than ever | abstractions still define the boundaries |
| reading unfamiliar code becomes the core skill | judgment about good design is still human |

The right-hand column is this course. The left-hand column is why it matters more than it used to: a bad boundary now gets replicated across a codebase in an afternoon rather than a quarter.

## What to retain from L22

| Topic | Key test point |
|---|---|
| The process | seven phases — requirements, analysis, design, implementation, testing, deployment, maintenance |
| Where the course sits | use cases are **Analysis**; UML, SOLID and the patterns are **Design** |
| The roles | analyst → designer → programmer → tester; the first two are the **architects** |
| The handoffs | each is a **document in a shared notation** — which is what UML is for |
| The one-sentence claim | SOLID and patterns describe the **physics of complexity**, not the author of the code |
| The reframe | a pattern name is a **compressed instruction** — naming Strategy in a prompt changes what comes back |
| Reason 1 | deciding what should exist and where boundaries fall is still human |
| Reason 2 | your interfaces are the **guardrails**: ISP bounds the output, DIP makes it swappable, SRP makes it reviewable |
| Reason 3 | structure shrinks the **blast radius** — you cannot trust what you cannot isolate |
| Reason 4 | the bottleneck moved from **writing** to **reading**; generation is free, attention is not |
| The loop | specify → generate → review → refactor; your leverage is at 1 and 3 |
| The rubric | six questions (SRP/OCP/LSP/ISP/DIP/Patterns) run over every generated unit |
| The regeneration answer | regeneration is non-deterministic, so a **stable abstraction** is what makes it safe |
| The honest summary | typing gets cheap; complexity, coupling, boundaries and judgment do not move |

## Practice

Start with the rubric, applied the way the deck says to apply it. Every one of these six units compiles and passes its tests, so structure is the only thing left to judge.

```artifact src=demos/practice-23-rubric.jsx
```

Then the graded pass over both halves of the lecture — the process, and the argument:

```artifact src=demos/practice-23-mcq.jsx
```

---

> Where this sits in the course: the last lecture, and a frame for all the others. The pillars ([the roadmap](note.html?course=CSCI-UA-470&note=18-oop-pillars-roadmap)) and the two languages ([L01](note.html?course=CSCI-UA-470&note=01-foundations)–[L11](note.html?course=CSCI-UA-470&note=11-jvm-runtime)) are the implementation phase; the UML unit ([L12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[L15](note.html?course=CSCI-UA-470&note=15-uml-to-code)), [SOLID](note.html?course=CSCI-UA-470&note=16-solid) and the pattern catalog ([L18](note.html?course=CSCI-UA-470&note=19-creational-patterns)–[L21](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii)) are the design phase; and the [Password Keeper](note.html?course=CSCI-UA-470&note=password-keeper) runs analysis through implementation on one program. For final review, the language rules are consolidated in [the Java/C++ comparison](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison).
