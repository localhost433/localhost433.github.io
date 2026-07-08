/* AUTO-GENERATED from concrete-abstract-interface.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, CompareCaption } from "@course";

/* L13 - concrete vs abstract vs interface, drawn as ONE spectrum.
   The single axis is "how much is left unimplemented", shown as a row of method
   slots: a filled slot has a body, a dashed slot is abstract. A concrete class
   fills every slot (so `new` works); an abstract class leaves >= 1 slot empty
   (so `new` is blocked); an interface leaves every slot empty by default (modern
   Java fills only the default/static/private corners). Defining a reference is
   always legal; only `new` tracks the spectrum. */

const COLS = [{
  key: "concrete",
  title: "Concrete class",
  subtitle: "instantiable",
  sub: "stack",
  slots: [1, 1, 1, 1],
  ratio: "every method has a body",
  canNew: true,
  newNote: "object can be created"
}, {
  key: "abstract",
  title: "Abstract class",
  subtitle: "partial contract",
  sub: "global",
  slots: [1, 1, 0, 1],
  ratio: "one abstract slot blocks it",
  canNew: false,
  newNote: "no direct object"
}, {
  key: "interface",
  title: "Interface",
  subtitle: "pure contract",
  sub: "code",
  slots: [0, 0, 0, 0],
  ratio: "abstract by default",
  canNew: false,
  newNote: "default / static fill corners"
}];
const PANEL = {
  w: 250,
  h: 214,
  top: 104
};
const X0 = 38,
  GAP = 38;
const colX = i => X0 + i * (PANEL.w + GAP);

/* one method slot: filled => has a body (two code lines); dashed => abstract. */
function Slot({
  x,
  y,
  w,
  h,
  filled,
  sub
}) {
  const bd = `var(--seg-${sub}-bd)`;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: h,
    rx: 6,
    style: {
      fill: filled ? `var(--seg-${sub}-bg)` : "none",
      stroke: bd,
      strokeWidth: 1.3,
      strokeDasharray: filled ? "none" : "3.5 3",
      opacity: filled ? 1 : 0.85
    }
  }), filled ? /*#__PURE__*/React.createElement("g", {
    style: {
      stroke: `var(--seg-${sub}-fg)`,
      strokeWidth: 1.7,
      strokeLinecap: "round",
      opacity: 0.8
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: x + 9,
    y1: y + h / 2 - 4,
    x2: x + w - 9,
    y2: y + h / 2 - 4
  }), /*#__PURE__*/React.createElement("line", {
    x1: x + 9,
    y1: y + h / 2 + 4,
    x2: x + w - 14,
    y2: y + h / 2 + 4
  })) : /*#__PURE__*/React.createElement("text", {
    x: x + w / 2,
    y: y + h / 2 + 0.5,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 8.4,
      fontStyle: "italic"
    }
  }, "abs"));
}
function NewBadge({
  x,
  y,
  w,
  ok
}) {
  const seg = ok ? "heap" : "code";
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: 28,
    rx: 9,
    style: {
      fill: `var(--seg-${seg}-bg)`,
      stroke: `var(--seg-${seg}-bd)`,
      strokeWidth: 1.3
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 13,
    y: y + 14,
    textAnchor: "start",
    dominantBaseline: "central",
    style: {
      fill: `var(--seg-${seg}-fg)`,
      fontSize: 12.5,
      fontWeight: 800
    }
  }, "new T()"), ok ? /*#__PURE__*/React.createElement("path", {
    d: `M ${x + w - 26} ${y + 14} l 5 5 l 9 -10`,
    style: {
      fill: "none",
      stroke: `var(--seg-${seg}-fg)`,
      strokeWidth: 2.4,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  }) : /*#__PURE__*/React.createElement("g", {
    style: {
      stroke: `var(--seg-${seg}-fg)`,
      strokeWidth: 2.4,
      strokeLinecap: "round"
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: x + w - 24,
    y1: y + 9,
    x2: x + w - 13,
    y2: y + 20
  }), /*#__PURE__*/React.createElement("line", {
    x1: x + w - 13,
    y1: y + 9,
    x2: x + w - 24,
    y2: y + 20
  })));
}
function Panel({
  col,
  i
}) {
  const x = colX(i);
  const cx = x + PANEL.w / 2;
  const sub = col.sub;
  const fg = `var(--seg-${sub}-fg)`;
  const bd = `var(--seg-${sub}-bd)`;
  const slotW = 44,
    slotH = 34,
    slotGap = 10;
  const rowW = col.slots.length * slotW + (col.slots.length - 1) * slotGap;
  const slotX0 = cx - rowW / 2;
  const slotY = PANEL.top + 80;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: PANEL.top,
    width: PANEL.w,
    height: PANEL.h,
    rx: 16,
    style: {
      fill: "var(--mm-panel-bg)",
      stroke: bd,
      strokeWidth: 1.6
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: PANEL.top,
    width: PANEL.w,
    height: 52,
    rx: 16,
    style: {
      fill: `var(--seg-${sub}-bg)`,
      stroke: bd,
      strokeWidth: 1.2
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: PANEL.top + 21,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: {
      fill: fg,
      fontSize: 15,
      fontWeight: 900
    }
  }, col.title), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: PANEL.top + 39,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: {
      fill: fg,
      fontSize: 10,
      opacity: 0.78
    }
  }, col.subtitle), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: PANEL.top + 67,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 8.6,
      fontWeight: 800,
      letterSpacing: 0.5
    }
  }, "METHODS"), col.slots.map((f, k) => /*#__PURE__*/React.createElement(Slot, {
    key: k,
    x: slotX0 + k * (slotW + slotGap),
    y: slotY,
    w: slotW,
    h: slotH,
    filled: !!f,
    sub: sub
  })), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: slotY + slotH + 16,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 9.8
    }
  }, col.ratio), /*#__PURE__*/React.createElement("line", {
    x1: x + 16,
    y1: PANEL.top + 156,
    x2: x + PANEL.w - 16,
    y2: PANEL.top + 156,
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1
    }
  }), /*#__PURE__*/React.createElement(NewBadge, {
    x: x + 18,
    y: PANEL.top + 170,
    w: 96,
    ok: col.canNew
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 124,
    y: PANEL.top + 184,
    textAnchor: "start",
    dominantBaseline: "central",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 8.8
    }
  }, col.newNote.length > 22 ? col.newNote.split(" / ").map((t, k) => /*#__PURE__*/React.createElement("tspan", {
    key: k,
    x: x + 124,
    dy: k === 0 ? 0 : 11
  }, t, k === 0 ? " /" : "")) : col.newNote));
}
export default function ConcreteAbstractInterface() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "Concrete vs abstract vs interface - a spectrum of how much is left unimplemented"), /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 900 360",
    maxWidth: 790,
    ariaLabel: "A single spectrum from concrete class to abstract class to interface, ordered by how much is left unimplemented, shown as a row of four method slots per class. A filled slot has a body; a dashed slot is abstract. A concrete class fills all four slots and can be instantiated with new. An abstract class leaves at least one slot empty and cannot be instantiated. An interface leaves all four empty by default, apart from default, static and private bodies, and also cannot be instantiated. Defining a reference of any of the three is always legal; only new tracks the spectrum."
  }, /*#__PURE__*/React.createElement("text", {
    x: 450,
    y: 28,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 16,
      fontWeight: 900
    }
  }, "how much is left unimplemented?"), /*#__PURE__*/React.createElement("line", {
    x1: 62,
    y1: 66,
    x2: 838,
    y2: 66,
    markerEnd: "url(#dia-arrow)",
    style: {
      stroke: "var(--mm-muted)",
      strokeWidth: 1.6
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: 62,
    y: 84,
    textAnchor: "start",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.6,
      fontStyle: "italic"
    }
  }, "fully implemented \xB7 instantiable"), /*#__PURE__*/React.createElement("text", {
    x: 838,
    y: 84,
    textAnchor: "end",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.6,
      fontStyle: "italic"
    }
  }, "nothing implemented \xB7 pure contract"), COLS.map((col, i) => /*#__PURE__*/React.createElement(Panel, {
    key: col.key,
    col: col,
    i: i
  })), /*#__PURE__*/React.createElement("text", {
    x: 450,
    y: 344,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.4
    }
  }, "A reference of any of the three is legal; only `new T()` needs every slot filled.")), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "concrete",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Every method has a body, so ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "new T()"), " is allowed. In C++, an ordinary class; add ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "virtual"), " only where you need runtime dispatch. Extends one class.")
    }, {
      tag: "abstract",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "One ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "abstract"), " method is enough to block ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "new"), ". The C++ analogue is a class with a pure virtual method (", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "= 0"), "). Extends one class.")
    }, {
      tag: "interface",
      kind: "asm",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Abstract by default; a class can implement ", /*#__PURE__*/React.createElement("strong", null, "many"), " -- Java's controlled substitute for multiple inheritance. Modern Java adds ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "default"), "/", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "static"), "/", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "private"), " bodies.")
    }],
    punch: "The single axis is how much is left unimplemented; that one difference drives instantiability and every other rule."
  }));
}