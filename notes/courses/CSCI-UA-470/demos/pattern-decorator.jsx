import React from "react";
import { patternFigure, patternTree } from "@course";

/* note 20 — Decorator, drawn as L19 draws it: Booking on top, a Decorator holding
   `b : booking` below it, and the three add-ons inheriting from Decorator. The
   rejected half is the deck's own top row — a Booking that grows one field per
   add-on, which is the combinatorial trap Bridge just warned about, arriving from a
   different direction.

   The note flags the structural difference from the catalog version (a Decorator
   that also EXTENDS the component, so a decorated booking is still a Booking); the
   figure stays with the slide. pattern-decorator-wrap does the runtime picture. */

const add = (title, rows) => ({ title, sections: [{ rows }] });

const GOOD = patternTree({
  place: "above", contextW: 210, gapY: 46,
  edge: "assoc", edgeLabel: "wraps",
  context: { title: "Booking",
    sections: [{ rows: ["- date : String", "- cost : double"] }, { rows: ["+ cost() : double"] }] },
  parent: { title: "Decorator", abstract: true,
    sections: [{ rows: ["- b : Booking"] }, { rows: ["+ cost() : double"] }] },
  children: [
    add("Flower", ["- color", "- number"]),
    add("Catering", ["- foodType", "- amount"]),
    add("Music", ["- type", "- length"]),
  ],
  cardW: 152, gap: 22,
  note: "every decorator holds a Booking — and every decorator IS what the next one holds",
});
GOOD.ariaLabel = "A Booking class with date, cost and a cost() operation sits above an abstract Decorator that holds a field b of type Booking and offers cost(). Decorator is the parent of Flower, Catering and Music, each adding its own fields.";
GOOD.maxWidth = 700;

export default patternFigure({
  title: "Decorator — features you stack instead of subclass",
  intent: "[ Add different features to existing Object ]",
  bad: {
    lang: "java",
    code: `class Booking { String date;  double cost; }

class Booking { String date;  double cost;  String flower; }

class Booking { String date;  double cost;  String flower;  String food; }

// …and every combination the customer might NOT want is now a field
// that every booking carries, plus a flag saying whether it counts.`,
    note: "The deck crosses out each of these in turn. Adding features by widening the class means one class that knows about every add-on, and every booking paying for all of them — while *combinations* still have to be assembled by hand.",
  },
  good: GOOD,
  client: {
    lang: "java",
    label: "client code",
    code: `Booking b1 = new Booking("01/17/26", 400);
b1 = new Flower(b1, "white", 12);
b1 = new Catering(b1, "vegan", 40);
b1 = new Music(b1, "jazz", 3);

b1.cost();     // Music asks Catering asks Flower asks Booking`,
    note: "Read lines 2–4 as one move repeated: **take what you have, wrap it, keep the same name**. Reorder them, drop one, or run them from a loop over the customer's checkboxes — the combinations are assembled at run time, not declared as classes.",
  },
  caption: {
    cols: [
      { tag: "wraps", kind: "cpp", children: <>A decorator <strong>holds</strong> the thing it decorates and adds its own work around the call it forwards. Nested wrapping is what gives you every combination from three classes.</> },
      { tag: "vs. bridge", kind: "int", children: <>Both defeat a class explosion. Bridge splits <em>two fixed axes</em> apart; Decorator handles an <em>open-ended list of optional extras</em> that stack in any order and any number.</> },
    ],
    punch: "The exam tell is the constructor argument: new Flower(b1, …) takes the object it is decorating. A subclass never takes its own parent as an argument — that is what separates \"wraps\" from \"is a\".",
  },
});
