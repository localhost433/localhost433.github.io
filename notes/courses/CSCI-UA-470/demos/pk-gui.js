/* AUTO-GENERATED from pk-gui.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, diagramCardHeight } from "@course";

/* password-keeper — the finished Swing window from the L17 slide, so every later
   diagram has a referent. Drawn in the converter-gui-walkthrough idiom (a DiagramCard
   whose rows imitate the widgets), with each widget annotated by the MainGUI field it
   will become in the class diagram — the traceability spine of the whole note. */

const winSections = [{
  rows: ["[ yahoo     ]  [ 22        ]", "                  [ Add New ]"]
}, {
  rows: ["yahoo,22", "okok,3331", "qwww,2222", "qqq,ww"]
}, {
  rows: ["      [ Delete ]  [ Exit ]"]
}];
const WIN = {
  x: 24,
  y: 26,
  w: 262,
  h: diagramCardHeight(winSections)
};
const AX = WIN.x + WIN.w + 14; // annotation column

const note = (y, lines) => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
  x1: WIN.x + WIN.w,
  y1: y,
  x2: AX + 4,
  y2: y,
  stroke: "var(--mm-muted)",
  strokeWidth: "1",
  opacity: "0.5"
}), lines.map((t, i) => /*#__PURE__*/React.createElement("text", {
  key: i,
  x: AX + 8,
  y: y + 4 + i * 14,
  style: {
    fill: "var(--mm-muted)",
    fontSize: 10.5
  }
}, t)));
export default function PkGui() {
  const H = WIN.y + WIN.h + 34;
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: `0 0 620 ${H}`,
    maxWidth: 640,
    ariaLabel: "The Password Keeper window: a title field and a passcode field with an Add New button, a list showing saved entries rendered as title comma passcode, and Delete and Exit buttons. Annotations name the MainGUI field behind each widget: txtTitle and txtPasscode are JTextFields, btnAdd, btnDelete and btnExit are JButtons, and the list is a JList backed by a DefaultListModel called lstPasswords."
  }, /*#__PURE__*/React.createElement(DiagramCard, {
    x: WIN.x,
    y: WIN.y,
    w: WIN.w,
    title: "Password Keeper",
    sections: winSections,
    sub: 0
  }), note(WIN.y + 40, ["txtTitle, txtPasscode : JTextField"]), note(WIN.y + 62, ["btnAdd : JButton"]), note(WIN.y + 116, ["gui_list : JList,", "backed by lstPasswords :", "DefaultListModel"]), note(WIN.y + 178, ["btnDelete, btnExit : JButton"]), /*#__PURE__*/React.createElement("text", {
    x: (WIN.x + 620) / 2,
    y: H - 8,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "every widget is a MainGUI field \u2014 the class diagram is already visible in the window"));
}