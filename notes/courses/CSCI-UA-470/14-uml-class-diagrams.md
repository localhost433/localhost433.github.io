---
title: "UML Class Diagrams & Iterative Design"
date: "2026-07-09"
---

## Where this note lands

The UML unit has moved from the outside inward. [Note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) drew the Behavioral view, the use case diagram, which says what the system lets an actor do. [Note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) drew the Interaction view, the sequence diagram, which says how objects collaborate over time to carry one use case out. This note draws the third family both of those deferred, the Structural view: the class diagram (the blueprint of types) and the object diagram (a snapshot of instances).

| Family | Answers | Diagrams | Note |
|---|---|---|---|
| Behavioral | what the system does | Use case, activity, state | [12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) |
| Interaction | how objects talk over time | Sequence, collaboration, timing | [13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) |
| Structural | what the system is made of | Class, object, package, component, deployment | this note |

Rather than introduce class diagrams cold, L14 develops them through a single worked example, a small unit converter, which also shows the iterative design loop that ties all three diagram families together:

> sketch the use cases → realize each as a sequence diagram → notice the duplication → refactor by generalization → read the surviving participants off as classes → instantiate them in an object diagram.

The class diagram is not drawn from thin air. It is derived from the interaction, and it gets simpler every time the model is refactored.

## The example: a unit converter

The application is deliberately tiny. A main window offers two conversions and a quit button; clicking either conversion opens a small dialog that reads a number, converts it, and shows the result.

```artifact src=demos/converter-gui-walkthrough.jsx static
```

- **Main window** — three buttons: `Kg → Lb`, `Cm → Inch`, `Quit`.
- **Kg→Lb dialog** — a field "The value in KG", a "The result" field, and `Convert` / `Cancel`.
- **Cm→Inch dialog** — the same shape with "The value in CM" and "The result".

Even at this size the symmetry is clear: the two dialogs differ only in a label and a formula. The design will spend its energy removing that duplication.

## First cut: two use cases

From the outside, the [note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) viewpoint, the actor is a single `User` with two goals:

```artifact src=demos/converter-use-case-generalize.jsx
```

- `Convert Kg → Lb`
- `Convert Cm → Inch`

Two ovals, one actor, two association lines. This is the honest first draft, one use case per thing the user can do. The redundancy that was visual in the GUIs is now structural in the model: two use cases with the same shape.

## Realizing a use case as a sequence diagram

Pick one use case and write out the collaboration that fulfils it, exactly as in [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams). Three objects participate:

- `b : MainGUI` — the main window that receives the click,
- `k : KgLbGUI` — the dialog it opens,
- `c : Converter` — a worker that owns the arithmetic.

Read top-to-bottom as time:

1. the user clicks `Kg → Lb`; `MainGUI` creates and shows the dialog (`new` / `show()`),
2. the dialog reads the entered amount (`getInput()` → `amount`),
3. on `Convert`, the dialog asks the worker to convert it, in the first draft `convertKgToLb(amount)`,
4. `Converter` runs the formula and returns the result,
5. the dialog displays it.

The habit to take from this note: the objects on the sequence diagram's top row are the classes you are about to declare. `MainGUI`, `KgLbGUI`, and `Converter` earned their place by exchanging messages, so the interaction discovers the structure.

Now draw the second use case, `Convert Cm → Inch`. You get the identical diagram with `k : CmInchGUI` in place of `k : KgLbGUI` and `convertCmToInch(amount)` in place of `convertKgToLb(amount)`. Two diagrams, one shape: the duplication has followed us all the way in.

## Refactoring by generalization

Two use cases with the same shape is the cue that the model is over-specified. Apply generalization, the same hollow-triangle relationship note 12 used for `Phone Order` / `Internet Order` → `Place Order`. Here the parent is a single `Convert` use case, and the two specific conversions become children of it, or collapse into it outright once the differing unit is passed as a parameter:

```artifact src=demos/converter-use-case-final.jsx static
```

The move is to make the unit data rather than identity: instead of two use cases, one parameterized `Convert(amount, targetUnit)`. The actor still has the same power; the model just stopped saying the same thing twice.

## When two sequences become one

Generalizing the use case pays off immediately one level down. With the worker exposing a single `convert(amount, targetUnit)` instead of two unit-specific methods, the two sequence diagrams, which already had the same shape, become literally identical:

```artifact src=demos/converter-sequence-merge.jsx static
```

The dialog class is the only thing that still differs (`KgLbGUI` vs `CmInchGUI`), and even that is a candidate for merging into one `ConverterGUI` that carries its unit as a field. What began as two parallel interactions is now one:

```artifact src=demos/converter-sequence-one.jsx static
```

> This is refactoring in the design, before a line of code exists. Removing a duplicated use case removed a duplicated sequence diagram, which will remove a duplicated method, which removes duplicated code. Modeling duplication is cheaper to delete than coded duplication, which is why the design pass is worth doing.

## From sequence to classes: the class diagram

Now read the surviving participants off as a class diagram, the Structural blueprint. A class is a rectangle with three compartments:

| Compartment | Holds | Example |
|---|---|---|
| Name | the class name | `Converter` |
| Attributes | `visibility name : Type` | `- b1 : JButton` |
| Operations | `visibility name(params) : ReturnType` | `+ show() : void` |

Visibility markers sit in front of every member: `+` public, `−` private, `#` protected, `~` package. Types come after a colon, the reverse of Java/C++ declaration order, and a method with no return writes `: void`.

```artifact src=demos/converter-class-diagram.jsx static
```

The four classes fall straight out of the interaction:

| Class | Key attributes | Key operations |
|---|---|---|
| `MainGUI` | `- b1, b2, b3 : JButton` | `+ whenKgLbClicked() : void`, `+ whenCmInchClicked() : void` |
| `KgLbGUI` | the input/result fields, `- c : Converter` | `+ show() : void`, `+ whenConvertClicked() : void` |
| `CmInchGUI` | the input/result fields, `- c : Converter` | `+ show() : void`, `+ whenConvertClicked() : void` |
| `Converter` | — | `+ convert(amount : float, unit : String) : float` |

The lines between the boxes are **associations**, a structural "knows-about" link drawn as a plain line, optionally arrowed toward the class that is used, with multiplicity like `1` or `*` at the ends. `MainGUI` is associated with each dialog it opens; each dialog is associated with the one `Converter` it delegates to.

Other structural relationships you may meet on a class diagram, from loosest to tightest:

- **Dependency** — dashed arrow.
- **Association** — plain line.
- **Aggregation** — hollow diamond, a "has-a" that can outlive the whole.
- **Composition** — filled diamond, "owns" and dies with the whole.
- **Generalization** — hollow triangle, the same arrow as class inheritance and as the use-case generalization above.

After the refactor, `KgLbGUI` and `CmInchGUI` are the obvious candidates to generalize under a shared `ConverterGUI` parent.

## A snapshot in time: the object diagram

A class diagram is a blueprint; it says nothing about how many objects exist or how they are wired right now. The object diagram is that snapshot, the running system frozen at one instant:

```artifact src=demos/converter-object-diagram.jsx static
```

Its boxes use the underlined `name : Class` convention, the same notation used for participants at the top of a sequence diagram in [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams). A sequence-diagram participant is an object, so an object diagram is the structural still-frame of the interaction the sequence diagram animates.

| | Class diagram | Object diagram |
|---|---|---|
| Shows | types and their relationships | specific instances at one moment |
| A box is | a class (`Converter`) | an object (`c : Converter`, underlined) |
| Middle compartment | attribute declarations | attribute values |
| Lifetime | design-time blueprint | run-time snapshot |

## Where each diagram fits

The three UML notes now cover one diagram from each family, and they stack into a single design:

| Diagram | Family | Reads as | Note |
|---|---|---|---|
| Use case | Behavioral | goals the actor can pursue | [12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) |
| Sequence | Interaction | messages between objects over time | [13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) |
| Class | Structural | the types and how they relate (blueprint) | this note |
| Object | Structural | one runtime snapshot of instances | this note |

The design loop reads left to right, and each arrow removes something. A use case names a goal; a sequence diagram names the objects that meet it; spotting repeated shape drives a generalization that deletes a use case and a sequence; the surviving objects become classes; the classes are instantiated as an object diagram. The point is not to draw all four diagrams, but to use each view to simplify the next.

## What to retain from L14

| Topic | Key test point |
|---|---|
| Class diagram | a class is a three-compartment box: name / attributes / operations |
| Member notation | `visibility name : Type`; operations add `(params) : ReturnType`; type comes after the colon |
| Visibility | `+` public, `−` private, `#` protected, `~` package |
| Deriving classes | the participants on a sequence diagram's top row become the classes |
| Associations | plain lines mean "knows-about"; add multiplicity/arrows for detail |
| Structural relationships | dependency ⟶ association ⟶ aggregation ⟶ composition ⟶ generalization, loosest to tightest |
| Object diagram | instances at one instant, boxes drawn as underlined `name : Class` with attribute values |
| Class vs object | class = design-time blueprint; object = run-time snapshot |
| Generalization | folds repeated use cases / classes under a parent (hollow triangle); the design's tool for deleting duplication |
| Iterative design | refactoring the model (use case → sequence) deletes duplication before it becomes duplicated code |

## Practice

Recognising correct notation is one thing; producing it is another. Build the `Circle` class box yourself — stamp each member's visibility, drop its type after the colon, and choose the line that joins it to `Shape`. The box and its preview update as you go.

```artifact src=demos/practice-14-classbox.jsx
```

That first box ended in a generalization triangle. Now build one that ends in the relationship the exam most often catches people on — the aggregation/composition split, where both lines are diamonds and only the *fill* tells them apart. Reason from the lifetime rule ("does the part die with the whole?") and watch which diamond, and at which end, the preview draws.

```artifact src=demos/practice-14-classbox-compose.jsx
```

Now the other half of the pair. Same diamond, same end — but this time the part *survives* the whole, so the fill flips. Build it and put the two boxes side by side in your head: filled means "dies with," hollow means "outlives."

```artifact src=demos/practice-14-classbox-aggregate.jsx
```

```artifact src=demos/practice-14-derive.jsx
```

```artifact src=demos/practice-14-notation.jsx
```

```artifact src=demos/practice-14-mcq.jsx
```

---

> Where this sits in the course: this closes the UML trilogy that began in [note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) (use case) and [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) (sequence) by adding the Structural family, the class and object diagrams, and shows the iterative loop that turns requirements into a class design. From here the course steps back to consolidate the language itself: the [systematic Java/C++ comparison](note.html?course=CSCI-UA-470&note=15-java-cpp-systematic-comparison) and the [OOP pillars roadmap](note.html?course=CSCI-UA-470&note=16-oop-pillars-roadmap).
