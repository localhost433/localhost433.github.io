import React from "react";
import { patternFigure, patternTree, SvgCode, svgCodeSize } from "@course";

/* note 20 — Flyweight. The deck's teaching device is that the client loop is
   character-for-character IDENTICAL before and after; the only change is inside
   `getVehicle`, where a `repo` is consulted before anything is allocated. So the
   figure spends its space on that method body rather than on the class picture,
   which is just a factory over a two-subclass hierarchy.

   The heap companion (pattern-flyweight-heap) shows the consequence: a thousand
   requests, a handful of objects. */

const BODY = [
  "vehicle v;",
  "VehicleKey key = new VehicleKey(type, color);",
  "if (repo.containsKey(key))",
  "    v = repo.get(key);",
  "else {",
  "    v = (type == car) ? new Car(color)",
  "                      : new Bike(color);",
  "    repo.put(key, v);",
  "}",
  "return v;",
];

const T = patternTree({
  contextW: 268, gapX: 46, edge: "depend",
  context: { title: "VehicleFactory",
    sections: [{ rows: ["- repo : Map<VehicleKey, vehicle>"] },
      { rows: ["+ getVehicle(type, color) : vehicle"] }] },
  parent: { title: "vehicle", abstract: true,
    sections: [{ rows: ["- color"] }, { rows: ["+ show()"] }] },
  children: [
    { title: "CAR", sections: [{ rows: ["+ show()"] }] },
    { title: "Bike", sections: [{ rows: ["+ show()"] }] },
  ],
  cardW: 128, gap: 22,
});

const body = svgCodeSize(BODY, "getVehicle(type, color)");
const W = Math.round(Math.max(T.width, 14 + body.w + 14));
const H = Math.round(T.height + body.h + 8);

export default patternFigure({
  title: "Flyweight — ask a thousand times, allocate five",
  intent: "[ Improves the performance ]",
  bad: {
    lang: "java",
    code: `// inside getVehicle, before the pattern
if (type == car) return new Car(color);
else             return new Bike(color);

// the game loop, running every frame
while (true) {
    v = VehicleFactory.getVehicle(random_type, random_color);
    v.show();
}`,
    note: "A thousand vehicles on screen means a thousand objects allocated — even though only a handful of *distinct* (type, colour) pairs exist. The duplicates carry identical state and differ in nothing but their address.",
  },
  good: {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, maxWidth: 780,
    ariaLabel: "VehicleFactory now holds a map keyed by the type and colour pair and depends on an abstract vehicle class with subclasses CAR and Bike. Its getVehicle body checks the pair first, returns the cached vehicle if that exact key is present, and only constructs and caches a new one otherwise.",
    node: (
      <g>
        {T.node}
        <SvgCode x={14} y={T.height - 6} lines={BODY} title="getVehicle(type, color)" />
      </g>
    ),
  },
  client: {
    lang: "java",
    label: "client code — unchanged",
    code: `while (true) {
    v = VehicleFactory.getVehicle(random_type, random_color);
    v.show();
}`,
    note: "Identical to the rejected version, deliberately. Flyweight is invisible from the outside: no caller opts in, no caller can tell whether the vehicle it just received is new or shared.",
  },
  caption: {
    cols: [
      { tag: "shared", kind: "cpp", children: <>Two callers asking for a <em>red car</em> get the <strong>same object</strong>. That is safe only because the shared state is the state that defines it — type and colour.</> },
      { tag: "cost", kind: "int", children: <>The factory grows a field and a lookup; the program loses a thousand allocations and the garbage they become. The trade is memory-for-lookup, and it only pays when duplicates are common.</> },
    ],
    punch: "The catch the deck leaves implicit: anything that must differ per vehicle — a position, a speed, a health bar — cannot live on a shared object. Flyweight works exactly as far as the objects are interchangeable.",
  },
});
