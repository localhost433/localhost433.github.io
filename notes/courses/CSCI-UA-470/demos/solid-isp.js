/* AUTO-GENERATED from solid-isp.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, CrossOut, diagramCardHeight, ab, cls } from "@course";

/* note 16 — ISP. Left, crossed out: one fat Movable interface with move() AND
   jump(), realized by Vehicle, Person, and Bird — forcing Vehicle to stub
   jump() with an empty body (the lecture's `{}` margin note). Right: the
   interface split in two; every class now implements exactly the methods it
   can honour. Dashed edges are realization, as in note 15. */

const iface = (title, methods) => ({
  title,
  abstract: true,
  sections: [{
    rows: methods.map(ab)
  }]
});
const fat = iface("«interface» Movable", ["+ move() : void", "+ jump() : void"]);
const movable = iface("«interface» Movable", ["+ move() : void"]);
const jumpable = iface("«interface» Jump-able", ["+ jump() : void"]);
const veh = cls("Vehicle", [], ["+ move() : void", "+ jump() { }  ?!"]);
const per = cls("Person", [], ["+ move() : void", "+ jump() : void"]);
const brd = cls("Bird", [], ["+ move() : void", "+ jump() : void"]);
const vehOk = cls("Vehicle", [], ["+ move() : void"]);
const IW = 176,
  CW = 132;
const FAT = {
  x: 90,
  y: 50,
  h: diagramCardHeight(fat.sections)
};
const BROW = 200; // bad row y
const badX = [10, 152, 294];
const MOV = {
  x: 560,
  y: 50
};
const JMP = {
  x: 800,
  y: 50
};
const GROW = 200;
const goodX = [560, 702, 844];
export default function SolidIsp() {
  const badKids = [{
    spec: veh,
    x: badX[0],
    stub: true
  }, {
    spec: per,
    x: badX[1]
  }, {
    spec: brd,
    x: badX[2]
  }];
  const goodKids = [{
    spec: vehOk,
    x: goodX[0],
    to: [MOV]
  }, {
    spec: per,
    x: goodX[1],
    to: [MOV, JMP]
  }, {
    spec: brd,
    x: goodX[2],
    to: [MOV, JMP]
  }];
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 990 362",
    maxWidth: 760,
    ariaLabel: "Interface Segregation Principle. Left, crossed out: a fat Movable interface declaring move and jump, realized by Vehicle, Person, and Bird \u2014 Vehicle is forced to stub jump with an empty body. Right: the split into Movable (move) and Jump-able (jump); Vehicle realizes only Movable, while Person and Bird realize both. All realization edges are dashed with hollow triangles."
  }, /*#__PURE__*/React.createElement("text", {
    x: 218,
    y: 34,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-hl)",
      fontSize: 15,
      fontWeight: 800
    }
  }, "BEFORE \u2014 one fat interface"), /*#__PURE__*/React.createElement("text", {
    x: 768,
    y: 34,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 15,
      fontWeight: 800
    }
  }, "AFTER \u2014 two thin interfaces"), badKids.map((k, i) => /*#__PURE__*/React.createElement(UmlLink, {
    key: i,
    orth: true,
    elbow: "vhv",
    from: {
      x: k.x + CW / 2,
      y: BROW
    },
    to: {
      x: FAT.x + IW / 2 + (i - 1) * 30,
      y: FAT.y + FAT.h
    },
    kind: "realize"
  })), /*#__PURE__*/React.createElement(DiagramCard, {
    x: FAT.x,
    y: FAT.y,
    w: IW,
    title: fat.title,
    sections: fat.sections,
    abstract: true,
    sub: 3
  }), badKids.map((k, i) => /*#__PURE__*/React.createElement(DiagramCard, {
    key: i,
    x: k.x,
    y: BROW,
    w: CW,
    title: k.spec.title,
    sections: k.spec.sections,
    sub: i
  })), /*#__PURE__*/React.createElement(CrossOut, {
    x: FAT.x,
    y: FAT.y,
    w: IW,
    h: FAT.h,
    size: FAT.h + 14
  }), /*#__PURE__*/React.createElement("text", {
    x: 218,
    y: 348,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "vehicles don't jump \u2014 the fat interface forces the empty stub"), /*#__PURE__*/React.createElement("text", {
    x: 492,
    y: 190,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 24,
      fontWeight: 800
    }
  }, "\u21D2"), goodKids.map((k, i) => k.to.map((t, j) => /*#__PURE__*/React.createElement(UmlLink, {
    key: i + "-" + j,
    orth: true,
    elbow: "vhv",
    from: {
      x: k.x + CW / 2,
      y: GROW
    },
    to: {
      x: t.x + IW / 2 + (i - 1) * 22,
      y: FAT.y + diagramCardHeight(movable.sections)
    },
    kind: "realize"
  }))), /*#__PURE__*/React.createElement(DiagramCard, {
    x: MOV.x,
    y: MOV.y,
    w: IW,
    title: movable.title,
    sections: movable.sections,
    abstract: true,
    sub: 3
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: JMP.x,
    y: JMP.y,
    w: IW,
    title: jumpable.title,
    sections: jumpable.sections,
    abstract: true,
    sub: 3
  }), goodKids.map((k, i) => /*#__PURE__*/React.createElement(DiagramCard, {
    key: i,
    x: k.x,
    y: GROW,
    w: CW,
    title: k.spec.title,
    sections: k.spec.sections,
    sub: i
  })), /*#__PURE__*/React.createElement("text", {
    x: 770,
    y: 348,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "two thin contracts \u2014 each class signs only what it can honour"));
}