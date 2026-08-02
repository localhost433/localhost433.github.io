/* AUTO-GENERATED from pk-class-diagram.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, diagramCardHeight } from "@course";

/* password-keeper — L17's class diagram, read off the sequence diagrams. Notation
   follows the slide itself, which writes `: void` out in full (note 14's convention
   omits it; the note's prose flags the discrepancy). The two edges are the lesson:
   a hollow diamond from MainGUI to Password (the list field), a dashed dependency
   from MainGUI to FileManager (the method-local new). Sibling of
   calculator-class-diagram, which drew the same payoff for L15. */

const guiSections = [{
  rows: ["- btnAdd : JButton", "- btnDelete : JButton", "- btnExit : JButton", "- lblTitle : JLabel", "- txtTitle : JTextField", "- txtPassCode : JTextField", "- gui_list : JList", "- lstPasswords : DefaultListModel", "- contentPane : JPanel"]
}, {
  rows: ["+ addNew(title, passcode) : void", "+ add_to_list(p) : void", "+ load_passwords() : void", "+ remove_from_list(pid) : void", "+ delete(pid) : void"]
}];
const pwdSections = [{
  rows: ["- title : String", "- passcode : String"]
}];
const fmSections = [{
  rows: ["- file_name : String"]
}, {
  rows: ["+ save(list_of_passwords) : void", "+ read() : List"]
}];
const GUI = {
  x: 24,
  y: 26,
  w: 268,
  h: diagramCardHeight(guiSections)
};
const PWD = {
  x: 470,
  y: 40,
  w: 214,
  h: diagramCardHeight(pwdSections)
};
const FM = {
  x: 470,
  y: 176,
  w: 246,
  h: diagramCardHeight(fmSections)
};
export default function PkClassDiagram() {
  const H = Math.max(GUI.y + GUI.h, FM.y + FM.h) + 40;
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: `0 0 740 ${H}`,
    maxWidth: 720,
    ariaLabel: "Class diagram of the Password Keeper. MainGUI holds the three buttons, the labels and text fields, the JList, the DefaultListModel and the content pane, and offers addNew, add_to_list, load_passwords, remove_from_list and delete. A solid line with a hollow diamond at the MainGUI end runs to Password, which has title and passcode. A dashed dependency arrow runs from MainGUI to FileManager, which has file_name, save and read."
  }, /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: GUI.x + GUI.w,
      y: 78
    },
    to: {
      x: PWD.x,
      y: 78
    },
    kind: "aggregate"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: GUI.x + GUI.w,
      y: 214
    },
    to: {
      x: FM.x,
      y: 214
    },
    kind: "depend"
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: GUI.x,
    y: GUI.y,
    w: GUI.w,
    title: "MainGUI",
    sections: guiSections,
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: PWD.x,
    y: PWD.y,
    w: PWD.w,
    title: "Password",
    sections: pwdSections,
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: FM.x,
    y: FM.y,
    w: FM.w,
    title: "FileManager",
    sections: fmSections,
    sub: 3
  }), /*#__PURE__*/React.createElement("text", {
    x: 380,
    y: 66,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, "holds the list of passwords"), /*#__PURE__*/React.createElement("text", {
    x: 380,
    y: 202,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, "uses to read / save"), /*#__PURE__*/React.createElement("text", {
    x: 370,
    y: H - 10,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "diamond because lstPasswords is a field; dashed because every FileManager is a method-local new"));
}