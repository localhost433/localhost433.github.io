import React from "react";
import { DiagramSvg, treeLayout, ClassTree, cls, CodeBlock, CompareCaption } from "@course";

/* note 16 — LSP, via the lecture's two broken hierarchies. Vehicle promises
   turnAcOn()/turnAcOff() to every child, and Bike cannot keep the promise;
   Bird promises fly(), and Ostrich cannot. The diagrams LOOK legal — the
   compiler accepts both — which is the point: substitutability is a semantic
   contract, not a syntactic one. The code pane shows where it detonates. */

const vehicle = cls("Vehicle",
  ["- color", "- model", "- year"],
  ["+ move() : void", "+ stop() : void", "+ turnAcOn() : void", "+ turnAcOff() : void"]);
const LV = treeLayout({
  cx: 250, topY: 16,
  parent: vehicle,
  children: [cls("Car", [], []), cls("Truck", [], []), { ...cls("Bike", [], ["turnAcOn() ?!"]), dashed: true }],
  cardW: 118, gap: 18,
});

const bird = cls("Bird", ["- color"], ["+ fly() : void", "+ eat() : void", "+ move() : void"]);
const LB = treeLayout({
  cx: 760, topY: 16,
  parent: bird,
  children: [cls("Eagle", [], []), cls("Parrot", [], []), { ...cls("Ostrich", [], ["fly() ?!"]), dashed: true }],
  cardW: 118, gap: 18,
});

const CODE = `Vehicle v;
v = new Car();      // OK
v = new Truck();    // OK
v = new Bike();     // compiles… but
v.turnAcOn();       // ?!  a bike has no AC

Bird b;
b = new Eagle();    // OK
b = new Parrot();   // OK
b = new Ostrich();  // compiles… but
b.fly();            // ?!  an ostrich can't fly`;

const H = Math.round(Math.max(LV.bottom, LB.bottom) + 34);

export default function SolidLsp() {
  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>Liskov Substitution — every child must keep the parent's promises</div>

      <DiagramSvg viewBox={`0 0 1020 ${H}`} maxWidth={760}
        ariaLabel="Two hierarchies that violate the Liskov Substitution Principle. Left: Vehicle declares move, stop, turnAcOn, turnAcOff; children Car and Truck are fine, but the dashed Bike cannot honour turnAcOn. Right: Bird declares fly, eat, move; Eagle and Parrot are fine, but the dashed Ostrich cannot fly. Both trees compile — the violation is semantic.">
        <ClassTree layout={LV} />
        <ClassTree layout={LB} />
        <text x={250} y={H - 10} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
          the promise is in the parent: EVERY vehicle can turnAcOn()
        </text>
        <text x={760} y={H - 10} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
          fix: move fly() down, or split FlyingBird out of Bird
        </text>
      </DiagramSvg>

      <CodeBlock code={CODE} lang="java" />

      <CompareCaption
        cols={[
          { tag: "syntax", kind: "cpp", children: <>The compiler is satisfied: <code className="mm-ic">Bike</code> is-a <code className="mm-ic">Vehicle</code>, <code className="mm-ic">Ostrich</code> is-a <code className="mm-ic">Bird</code>, and upcasting is always legal.</> },
          { tag: "semantics", kind: "java", children: <>LSP asks more: anywhere a <code className="mm-ic">Bird</code> works, <em>any</em> subclass must work. If a child must stub, throw, or do nothing for an inherited method, the parent promised too much.</> },
        ]}
        punch="If you have to ask which subclass you got, substitution has already failed."
      />
    </div>
  );
}
