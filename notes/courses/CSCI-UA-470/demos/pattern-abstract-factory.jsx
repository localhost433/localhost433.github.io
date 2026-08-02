import React from "react";
import { patternFigure, patternTree } from "@course";

/* note 19 — Abstract Factory, drawn the way L18 draws it: the Factory picture from
   the previous slide, repeated once per FAMILY. Shapes, Vehicles, Animals. The
   members are stripped off every card on purpose — the slide's whole argument is
   that the three rows are the SAME SHAPE, and members would only distract from the
   repetition. The dashed fourth subclass in each row is the deck's purple box: the
   product you may add later without a client hearing about it.

   The note's prose carries the "beyond the slide" aside — GoF's Abstract Factory is
   one factory INTERFACE with a concrete factory per family, not three unrelated
   factory classes — so the figure itself stays faithful to what was taught. */

const kid = (title) => ({ title, sections: [] });
const kids = (names, extra) => [...names.map(kid), { ...kid(extra), dashed: true }];

const FAMILIES = [
  { factory: "ShapeFactory", type: "Shape", get: "getShape(type)", rand: "getRandomShape()",
    names: ["Circle", "Rect", "Triangle"], extra: "Cylinder" },
  { factory: "VehicleFactory", type: "Vehicle", get: "getVehicle(type)", rand: "getRandomVehicle()",
    names: ["Car", "Flight", "Bike"], extra: "Truck" },
  { factory: "AnimalFactory", type: "Animal", get: "getAnimal(type)", rand: "getRandomAnimal()",
    names: ["Cat", "Dog", "Fish"], extra: "Bird" },
];

const rows = FAMILIES.map((f) => patternTree({
  contextW: 224, gapX: 42, edge: "depend",
  context: { title: f.factory,
    sections: [{ rows: [`+ ${f.get} : ${f.type}`, `+ ${f.rand} : ${f.type}`] }] },
  parent: { title: f.type, abstract: true, sections: [] },
  children: kids(f.names, f.extra),
  cardW: 102, gap: 12,
}));

const W = Math.max(...rows.map((r) => r.width));
const H = rows.reduce((a, r) => a + r.height, 0);
let y = 0;
const placed = rows.map((r, i) => {
  const at = y; y += r.height;
  return (
    <React.Fragment key={i}>
      {i > 0 ? (
        <line x1={14} y1={at} x2={W - 14} y2={at}
          style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1, strokeDasharray: "3 4" }} />
      ) : null}
      <g transform={`translate(0, ${at})`}>{r.node}</g>
    </React.Fragment>
  );
});

export default patternFigure({
  title: "Abstract Factory — the same door, once per family",
  intent: "[produce a family of related objects without specifying their concrete class]",
  good: {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, maxWidth: 760,
    node: <g>{placed}</g>,
    ariaLabel: "Three stacked copies of the Factory structure, one per product family. ShapeFactory depends on an abstract Shape with subclasses Circle, Rect, Triangle and a dashed Cylinder. VehicleFactory depends on Vehicle with Car, Flight, Bike and a dashed Truck. AnimalFactory depends on Animal with Cat, Dog, Fish and a dashed Bird. Every row has the same shape.",
    note: "Members are stripped from the product cards deliberately: the lesson is the **repetition**, not the contents. Read down the left column and you see three factories with the same two operations; read across a row and you see one Factory pattern.",
  },
  goodTag: "three families",
  client: {
    lang: "java",
    label: "client code",
    code: `// programmer-1
Shape s;
s = ShapeFactory.getShape(criteria);

// programmer-2
Shape s;
s = ShapeFactory.getRandomShape();

// programmer-3
Animal a;
a = AnimalFactory.getRandomAnimal();`,
    note: "programmer-3 has never seen the Shape family and does not need to. Each family has its own door, and the doors have the same shape — so knowing one factory is knowing all of them.",
  },
  caption: {
    cols: [
      { tag: "factory", kind: "cpp", children: <>Answers <em>which concrete class</em> inside <strong>one</strong> hierarchy. There is one product type, and the client holds it.</> },
      { tag: "abstract f.", kind: "int", children: <>Answers the same question <strong>across several related hierarchies</strong>. Add a family and you add a factory — you do not touch the existing ones.</> },
    ],
    punch: "The exam-usable difference is the count: one product hierarchy behind the door means Factory; several related ones, each behind its own matching door, means Abstract Factory.",
  },
});
