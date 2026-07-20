/* AUTO-GENERATED from bce-three-layer.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge, Actor } from "@course";

/* note 15 — the Boundary/Control/Entity picture from L15, drawn as the lecture
   drew it: the system box between the user and the DBMS, sliced into three
   layers. Boundary objects sit wherever the system touches the outside — the
   input/output forms on the user edge AND the DB connection on the database
   edge. One control object (the Handler) orchestrates in the middle, fanning
   out to the entity objects that hold the domain data. Colour names the
   stereotype, so the legend is part of the figure. */

const SYS = {
  x: 150,
  y: 40,
  w: 560,
  h: 280
};
const CTRL = {
  cx: 455,
  cy: 195
};
const DBB = {
  cx: 650,
  cy: 180
};
const ENTY = 96; // entity row y
const entities = [350, 405, 460, 515, 570];
const legend = [{
  label: "boundary",
  sub: 0,
  x: 220
}, {
  label: "control",
  sub: 2,
  x: 350
}, {
  label: "entity",
  sub: 1,
  x: 470
}];
export default function BceThreeLayer() {
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 880 400",
    maxWidth: 760,
    ariaLabel: "Boundary, control, and entity objects inside one system box. A user actor on the left sends input to boundary objects (two UI forms) on the system's user edge. A single control object, the Handler, sits in the middle and fans out to five entity objects holding the data. On the right edge, a DB connection boundary object talks to the external DBMS. Dashed vertical lines slice the system into the three layers."
  }, /*#__PURE__*/React.createElement("rect", {
    x: SYS.x,
    y: SYS.y,
    width: SYS.w,
    height: SYS.h,
    rx: 10,
    style: {
      fill: "none",
      stroke: "var(--mm-cell-bd)",
      strokeWidth: 1.5
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: SYS.x + 10,
    y: SYS.y + 20,
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11,
      fontWeight: 700
    }
  }, "System"), /*#__PURE__*/React.createElement("line", {
    x1: 318,
    y1: SYS.y + 8,
    x2: 318,
    y2: SYS.y + SYS.h - 8,
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement("line", {
    x1: 600,
    y1: SYS.y + 8,
    x2: 600,
    y2: SYS.y + SYS.h - 8,
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement(Actor, {
    x: 52,
    y: 130,
    label: "user"
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: 84,
      y: 160
    },
    to: {
      x: 186,
      y: 130
    },
    label: "input"
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: 186,
      y: 230
    },
    to: {
      x: 84,
      y: 200
    },
    label: "output"
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: 240,
    cy: 120,
    w: 92,
    h: 34,
    label: "LoginForm",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: 240,
    cy: 240,
    w: 92,
    h: 34,
    label: "ReportView",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: CTRL.cx,
    cy: CTRL.cy,
    w: 92,
    h: 38,
    label: "Handler",
    note: "control",
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: 286,
      y: 130
    },
    to: {
      x: 409,
      y: 185
    }
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: 409,
      y: 207
    },
    to: {
      x: 286,
      y: 232
    }
  }), entities.map((ex, i) => /*#__PURE__*/React.createElement(DiagramEdge, {
    key: i,
    from: {
      x: CTRL.cx + 6 * (i - 2),
      y: CTRL.cy - 19
    },
    to: {
      x: ex,
      y: ENTY + 14
    }
  })), entities.map((ex, i) => /*#__PURE__*/React.createElement(DiagramBox, {
    key: i,
    cx: ex,
    cy: ENTY,
    w: 48,
    h: 28,
    label: "e" + (i + 1),
    sub: 1
  })), /*#__PURE__*/React.createElement("text", {
    x: 460,
    y: 62,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, "entity objects \u2014 the data"), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: DBB.cx,
    cy: DBB.cy,
    w: 84,
    h: 34,
    label: "DBConn",
    note: "boundary",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: CTRL.cx + 46,
      y: CTRL.cy
    },
    to: {
      x: DBB.cx - 42,
      y: DBB.cy
    }
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M 774 160 L 774 210 A 30 8 0 0 0 834 210 L 834 160",
    style: {
      fill: "var(--mm-cell-bg)",
      stroke: "var(--mm-cell-bd)",
      strokeWidth: 1.5
    }
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: 804,
    cy: 160,
    rx: 30,
    ry: 8,
    style: {
      fill: "var(--mm-cell-bg)",
      stroke: "var(--mm-cell-bd)",
      strokeWidth: 1.5
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: 804,
    y: 191,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 12,
      fontWeight: 700
    }
  }, "DBMS")), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: 694,
      y: 174
    },
    to: {
      x: 770,
      y: 174
    }
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: 770,
      y: 192
    },
    to: {
      x: 694,
      y: 192
    }
  }), legend.map(l => /*#__PURE__*/React.createElement("g", {
    key: l.label
  }, /*#__PURE__*/React.createElement(DiagramBox, {
    cx: l.x,
    cy: 352,
    w: 16,
    h: 16,
    label: "",
    sub: l.sub
  }), /*#__PURE__*/React.createElement("text", {
    x: l.x + 14,
    y: 352,
    dominantBaseline: "central",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, l.label))), /*#__PURE__*/React.createElement("text", {
    x: 430,
    y: 386,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, "boundary = every edge the system touches, including the database"));
}