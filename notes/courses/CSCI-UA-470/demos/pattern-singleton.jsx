import React from "react";
import { patternFigure, DiagramCard, diagramCardHeight, UmlLink, SvgCode, svgCodeSize, st } from "@course";

/* note 19 — Singleton, L18's first creational pattern. The deck teaches it with no
   domain dressing at all: the class is literally named `Singleton`, the clients are
   s1/s2/s3, and the whole lesson is the two access marks plus one static door. Kept
   faithful to that, because the exam will use exactly these names.

   The card is the course's first STATIC members drawn in UML — underlined, per note
   14's notation table — and the pseudocode callout is the deck's own lazy init. The
   `new Singleton()` line in the client half is the slide's red "KO": it is the one
   thing a private constructor exists to forbid. */

const CARD = {
  title: "Singleton",
  sections: [
    { rows: [st("- instance : Singleton = NULL")] },
    { rows: ["- Singleton()", st("+ getInstance() : Singleton")] },
  ],
};

const BODY = [
  "if (instance == NULL)",
  "    instance = new Singleton();",
  "return instance;",
];

const PAD = 14, CARD_W = 236, GAP = 52;
const cardH = diagramCardHeight(CARD.sections, { title: true });
const body = svgCodeSize(BODY, "getInstance()");
const axis = PAD + Math.max(cardH, body.h) / 2;
const cardY = axis - cardH / 2;
const bodyX = PAD + CARD_W + GAP;
const W = Math.round(bodyX + body.w + PAD);
const H = Math.round(Math.max(cardY + cardH, axis + body.h / 2) + PAD);

const GOOD = {
  width: W, height: H, viewBox: `0 0 ${W} ${H}`,
  ariaLabel: "The Singleton class box: a private static instance field initialised to NULL, a private constructor, and a public static getInstance() returning Singleton. A dashed arrow points to getInstance's body: if instance is NULL, create it; then return instance.",
  node: (
    <g>
      <DiagramCard x={PAD} y={cardY} w={CARD_W} title={CARD.title} sections={CARD.sections} neutral />
      <UmlLink from={{ x: PAD + CARD_W, y: axis }} to={{ x: bodyX, y: axis }} kind="depend" />
      <SvgCode x={bodyX} y={axis - body.h / 2} lines={BODY} title="getInstance()" />
    </g>
  ),
};

export default patternFigure({
  title: "Singleton — one instance, one door in",
  intent: "[used when there is a need to create only one Instance of a class]",
  bad: {
    lang: "java",
    code: `class Singleton {
    public Singleton() { }        // anyone may call it
}

Singleton s1 = new Singleton();   // one object
Singleton s2 = new Singleton();   // a second
Singleton s3 = new Singleton();   // a third — the rule is already broken`,
    note: "Nothing here is *wrong* Java. That is the problem: an ordinary public constructor is an open invitation, and \"there should only ever be one\" is a comment nobody has to obey.",
  },
  good: GOOD,
  client: {
    lang: "java",
    label: "client code",
    code: `Singleton s1;
s1 = new Singleton();             // KO — the constructor is private
s1 = Singleton.getInstance();

Singleton s2;
s2 = Singleton.getInstance();     // the same object

Singleton s3;
s3 = Singleton.getInstance();     // still the same object`,
  },
  caption: {
    cols: [
      { tag: "private", kind: "cpp", children: <>Both the field and the <strong>constructor</strong> are private. That single mark is what makes the pattern enforceable rather than advisory — <code className="mm-ic">new Singleton()</code> stops compiling outside the class.</> },
      { tag: "static", kind: "java", children: <>The field and <code className="mm-ic">getInstance()</code> are <strong>static</strong>, so they belong to the class, not to an object — which they must, since there is no object to call the first one on.</> },
    ],
    punch: "s1, s2, and s3 are three names for one object. The pattern does not make copying hard; it makes a second object impossible.",
  },
});
