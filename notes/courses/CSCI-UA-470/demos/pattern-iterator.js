/* AUTO-GENERATED from pattern-iterator.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { patternFigure, patternTree, ab } from "@course";

/* note 21 — Iterator, and the deck's rejected half is INTERFACE BLOAT rather than an
   if-chain: a Collection that grew one traversal method per question anyone ever
   asked of it. The fix moves the traversal out into its own hierarchy, so a new
   order is a new class and `Collection` never reopens.

   The Java tie is worth the note's space: this is `java.util.Iterator`, and the
   for-each loop is sugar over exactly this pair of methods. */

const GOOD = patternTree({
  contextW: 218,
  gapX: 48,
  edge: "assoc",
  edgeLabel: "walks",
  context: {
    title: "Collection",
    sections: [{
      rows: ["- items : List<Item>"]
    }, {
      rows: ["+ addItem(i)"]
    }]
  },
  parent: {
    title: "Iterator",
    abstract: true,
    sections: [{
      rows: [ab("+ hasNext() : boolean"), ab("+ getNext() : Item")]
    }]
  },
  children: ["SizeIterator", "AgeIterator", "HeightIterator"].map(t => ({
    title: t,
    sections: [{
      rows: ["+ hasNext() : boolean", "+ getNext() : Item"]
    }]
  })),
  cardW: 176,
  gap: 16,
  note: "a new traversal order is a new class — Collection is never reopened"
});
GOOD.ariaLabel = "A Collection class holding items and offering addItem is joined by an association labelled walks to an abstract Iterator declaring hasNext and getNext. SizeIterator, AgeIterator and HeightIterator each inherit from Iterator and implement both methods.";
GOOD.maxWidth = 800;
export default patternFigure({
  title: "Iterator — traversal is a class, not a method",
  intent: "[Get the next Item of a collection]",
  bad: {
    lang: "java",
    code: `class Collection {
    List<Item> items;

    Item getNextItemBasedOnIndex()  { ... }
    Item getNextItemBasedOnSize()   { ... }
    Item getNextItemBasedOnAge()    { ... }
    boolean hasNextBySize()         { ... }
    boolean hasNextByAge()          { ... }
    // …and each one needs its own cursor field, too
}`,
    note: "Every question anyone ever asked of this collection became a method on it. The class now has two jobs — **hold** the items and **walk** them — and only one of them keeps growing."
  },
  good: GOOD,
  client: {
    lang: "java",
    label: "client code",
    code: `Collection c = new Collection();
c.addItem(new Item(...));
c.addItem(new Item(...));

Iterator i;
// i = new SizeIterator(c);
// i = new AgeIterator(c);
i = new HeightIterator(c);

while (i.hasNext()) process(i.getNext());`,
    note: "The loop is written once, against the abstract `Iterator`. The commented lines are the whole flexibility: change which one is uncommented and the same loop walks the same collection in a different order."
  },
  caption: {
    cols: [{
      tag: "collection",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Goes back to one job: ", /*#__PURE__*/React.createElement("strong", null, "holding"), " the items. Note 16's Single Responsibility, arrived at from the traversal side.")
    }, {
      tag: "iterator",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Holds the ", /*#__PURE__*/React.createElement("strong", null, "cursor"), " \u2014 which is why two iterators can walk the same collection at once, something a method on ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Collection"), " could never manage.")
    }],
    punch: "This is the pattern you have already been using: the course's simplified java.util.Iterator view centers on hasNext() and next(), and a for-each loop is sugar that asks a collection for one and drives it. Everything the deck rejects is what the Java Collections API deliberately does not do."
  }
});