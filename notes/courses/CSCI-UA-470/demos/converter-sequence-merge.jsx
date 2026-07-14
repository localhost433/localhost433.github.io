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

const Panel = ({ title, sub, spec, label, rule }) => (
  <div style={{ paddingTop: rule ? 14 : 0, marginTop: rule ? 14 : 0,
    borderTop: rule ? "1px dashed var(--mm-gap-bd)" : "none" }}>
    <div style={{ textAlign: "center", marginBottom: 2 }}>
      <div style={{ fontSize: 13.5, fontWeight: 900, color: "var(--mm-cell-fg)" }}>{title}</div>
      <div style={{ fontSize: 10.5, color: "var(--mm-muted)" }}>{sub}</div>
    </div>
    <SequenceDiagram {...spec} caption={null} ariaLabel={label} />
  </div>
);

export default function ConverterSequenceMerge() {
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>
        The two conversions realized as sequence diagrams — the same shape twice
      </span>

      <Panel title="Convert Kg → Lb" sub="use case 1" spec={converterSeqKgLb}
        label="Sequence diagram for Convert Kg to Lb: the User clicks Kg to Lb on MainGUI, which creates and shows KgLbGUI; the dialog reads the input, calls convertKgToLb(amount) on Converter, receives the result, and displays it." />

      <Panel rule title="Convert Cm → Inch" sub="use case 2 — the same diagram, twice over" spec={converterSeqCmInch}
        label="Sequence diagram for Convert Cm to Inch: identical in every respect to the Kg to Lb diagram above, except that the dialog is CmInchGUI and the call is convertCmToInch(amount)." />

      <CompareCaption
        cols={[
          { tag: "identical", kind: "int", children: <>Same participants, same messages, same order, same activation bars, same returns. Read the two figures row by row and every row matches. (The lifelines sit at slightly different widths only because the labels are different lengths.)</> },
          { tag: "difference 1", kind: "cpp", children: <>The dialog class: <code className="mm-ic">k : KgLbGUI</code> against <code className="mm-ic">k : CmInchGUI</code>.</> },
          { tag: "difference 2", kind: "java", children: <>The worker's method: <code className="mm-ic">convertKgToLb(amount)</code> against <code className="mm-ic">convertCmToInch(amount)</code>.</> },
        ]}
        punch={<>Two diagrams, one shape. The unit is doing the work of an <em>identity</em> when it should be doing the work of a <em>parameter</em> — so give <code className="mm-ic">Converter</code> a single <code className="mm-ic">convert(amount, targetUnit)</code> and the two collapse into one.</>}
      />
    </div>
  );
}
