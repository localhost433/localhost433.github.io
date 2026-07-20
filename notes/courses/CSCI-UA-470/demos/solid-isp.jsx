import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, CrossOut, diagramCardHeight, ab, cls } from "@course";

/* note 16 — ISP. Left, crossed out: one fat Movable interface with move() AND
   jump(), realized by Vehicle, Person, and Bird — forcing Vehicle to stub
   jump() with an empty body (the lecture's `{}` margin note). Right: the
   interface split in two; every class now implements exactly the methods it
   can honour. Dashed edges are realization, as in note 15. */

const iface = (title, methods) => ({
  title, abstract: true,
  sections: [{ rows: methods.map(ab) }],
});

const fat = iface("«interface» Movable", ["+ move()", "+ jump()"]);
const movable = iface("«interface» Movable", ["+ move()"]);
const jumpable = iface("«interface» Jump-able", ["+ jump()"]);

const veh = cls("Vehicle", [], ["+ move()", "+ jump() { }  ?!"]);
const per = cls("Person", [], ["+ move()", "+ jump()"]);
const brd = cls("Bird", [], ["+ move()", "+ jump()"]);
const vehOk = cls("Vehicle", [], ["+ move()"]);

const IW = 176, CW = 132;
const FAT = { x: 90, y: 50, h: diagramCardHeight(fat.sections) };
const BROW = 200; // bad row y
const badX = [10, 152, 294];

const MOV = { x: 560, y: 50 };
const JMP = { x: 800, y: 50 };
const GROW = 200;
const goodX = [560, 702, 844];

export default function SolidIsp() {
  const badKids = [
    { spec: veh, x: badX[0], stub: true },
    { spec: per, x: badX[1] },
    { spec: brd, x: badX[2] },
  ];
  const goodKids = [
    { spec: vehOk, x: goodX[0], to: [MOV] },
    { spec: per, x: goodX[1], to: [MOV, JMP] },
    { spec: brd, x: goodX[2], to: [MOV, JMP] },
  ];
  return (
    <DiagramSvg viewBox="0 0 990 362" maxWidth={760}
      ariaLabel="Interface Segregation Principle. Left, crossed out: a fat Movable interface declaring move and jump, realized by Vehicle, Person, and Bird — Vehicle is forced to stub jump with an empty body. Right: the split into Movable (move) and Jump-able (jump); Vehicle realizes only Movable, while Person and Bird realize both. All realization edges are dashed with hollow triangles.">
      <text x={218} y={34} textAnchor="middle" style={{ fill: "var(--mm-hl)", fontSize: 15, fontWeight: 800 }}>
        BEFORE — one fat interface
      </text>
      <text x={768} y={34} textAnchor="middle" style={{ fill: "var(--mm-cell-fg)", fontSize: 15, fontWeight: 800 }}>
        AFTER — two thin interfaces
      </text>
      {/* ---- bad half ---- */}
      {badKids.map((k, i) => (
        <UmlLink key={i} orth elbow="vhv"
          from={{ x: k.x + CW / 2, y: BROW }}
          to={{ x: FAT.x + IW / 2 + (i - 1) * 30, y: FAT.y + FAT.h }} kind="realize" />
      ))}
      <DiagramCard x={FAT.x} y={FAT.y} w={IW} title={fat.title} sections={fat.sections} abstract sub={3} />
      {badKids.map((k, i) => (
        <DiagramCard key={i} x={k.x} y={BROW} w={CW} title={k.spec.title} sections={k.spec.sections} sub={i} />
      ))}
      {/* the fat interface is the mistake — it forces Vehicle's empty jump() stub */}
      <CrossOut x={FAT.x} y={FAT.y} w={IW} h={FAT.h} size={FAT.h + 14} />
      <text x={218} y={348} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        vehicles don't jump — the fat interface forces the empty stub
      </text>

      <text x={492} y={190} textAnchor="middle" style={{ fill: "var(--mm-cell-fg)", fontSize: 24, fontWeight: 800 }}>⇒</text>

      {/* ---- good half ---- */}
      {goodKids.map((k, i) =>
        k.to.map((t, j) => (
          <UmlLink key={i + "-" + j} orth elbow="vhv"
            from={{ x: k.x + CW / 2, y: GROW }}
            to={{ x: t.x + IW / 2 + (i - 1) * 22, y: FAT.y + diagramCardHeight(movable.sections) }} kind="realize" />
        )))}
      <DiagramCard x={MOV.x} y={MOV.y} w={IW} title={movable.title} sections={movable.sections} abstract sub={3} />
      <DiagramCard x={JMP.x} y={JMP.y} w={IW} title={jumpable.title} sections={jumpable.sections} abstract sub={3} />
      {goodKids.map((k, i) => (
        <DiagramCard key={i} x={k.x} y={GROW} w={CW} title={k.spec.title} sections={k.spec.sections} sub={i} />
      ))}
      <text x={770} y={348} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        two thin contracts — each class signs only what it can honour
      </text>
    </DiagramSvg>
  );
}
