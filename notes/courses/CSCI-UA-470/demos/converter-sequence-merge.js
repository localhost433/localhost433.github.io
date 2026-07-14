/* AUTO-GENERATED from converter-sequence-merge.jsx by `npm run build:artifacts` — do not edit. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { SequenceDiagram, CompareCaption, converterSeqKgLb, converterSeqCmInch } from "@course";

/* note 14 — the duplication, one level in. Realizing each use case as a sequence
   diagram gives two diagrams of the SAME shape, and the only honest way to show that
   is to have BOTH on screen at once: stepping between them hides the very sameness
   the reader is meant to notice. They are stacked (not columned) so each renders at
   full width and the message labels stay legible — side-by-side halves the scale and
   the mono text turns to mush. Read them one under the other: every participant,
   message, activation bar and return matches, and exactly two things differ — the
   dialog class and the worker's method. That is the cue to generalize;
   converter-sequence-one shows what is left afterwards. */

const Panel = ({
  title,
  sub,
  spec,
  label,
  rule
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    paddingTop: rule ? 14 : 0,
    marginTop: rule ? 14 : 0,
    borderTop: rule ? "1px dashed var(--mm-gap-bd)" : "none"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: "center",
    marginBottom: 2
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13.5,
    fontWeight: 900,
    color: "var(--mm-cell-fg)"
  }
}, title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10.5,
    color: "var(--mm-muted)"
  }
}, sub)), /*#__PURE__*/React.createElement(SequenceDiagram, _extends({}, spec, {
  caption: null,
  ariaLabel: label
})));
export default function ConverterSequenceMerge() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "The two conversions realized as sequence diagrams \u2014 the same shape twice"), /*#__PURE__*/React.createElement(Panel, {
    title: "Convert Kg \u2192 Lb",
    sub: "use case 1",
    spec: converterSeqKgLb,
    label: "Sequence diagram for Convert Kg to Lb: the User clicks Kg to Lb on MainGUI, which creates and shows KgLbGUI; the dialog reads the input, calls convertKgToLb(amount) on Converter, receives the result, and displays it."
  }), /*#__PURE__*/React.createElement(Panel, {
    rule: true,
    title: "Convert Cm \u2192 Inch",
    sub: "use case 2 \u2014 the same diagram, twice over",
    spec: converterSeqCmInch,
    label: "Sequence diagram for Convert Cm to Inch: identical in every respect to the Kg to Lb diagram above, except that the dialog is CmInchGUI and the call is convertCmToInch(amount)."
  }), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "identical",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Same participants, same messages, same order, same activation bars, same returns. Read the two figures row by row and every row matches. (The lifelines sit at slightly different widths only because the labels are different lengths.)")
    }, {
      tag: "difference 1",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The dialog class: ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "k : KgLbGUI"), " against ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "k : CmInchGUI"), ".")
    }, {
      tag: "difference 2",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The worker's method: ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "convertKgToLb(amount)"), " against ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "convertCmToInch(amount)"), ".")
    }],
    punch: /*#__PURE__*/React.createElement(React.Fragment, null, "Two diagrams, one shape. The unit is doing the work of an ", /*#__PURE__*/React.createElement("em", null, "identity"), " when it should be doing the work of a ", /*#__PURE__*/React.createElement("em", null, "parameter"), " \u2014 so give ", /*#__PURE__*/React.createElement("code", {
      className: "mm-ic"
    }, "Converter"), " a single ", /*#__PURE__*/React.createElement("code", {
      className: "mm-ic"
    }, "convert(amount, targetUnit)"), " and the two collapse into one.")
  }));
}