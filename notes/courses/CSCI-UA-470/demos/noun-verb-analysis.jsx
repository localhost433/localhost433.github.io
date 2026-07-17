import React from "react";
import { CompareCaption } from "@course";

/* note 15 — finding the classes by reading the requirements as GRAMMAR. The
   part-of-speech table from L15, plus a live sentence with each word tagged the
   way the analysis would tag it. Rendered as HTML (not SVG) because it IS a
   table; the sentence above it shows the rules firing on real text. */

const ROWS = [
  ["Proper noun", "instance (object)", "Alice, Ace of Hearts"],
  ["Common noun", "class (or attribute)", "Student, DailyReport, color"],
  ["Doing verb", "operation", "submits, deletes, runs"],
  ["Being verb", "inheritance", "is one of, is a kind of"],
  ["Having verb", "aggregation / composition", "has, consists of, includes"],
  ["Modal verb", "constraint", "must be"],
  ["Adjective", "helps identify an attribute", "a yellow ball (i.e. color)"],
];

// the sample sentence, word by word, with the words the analysis picks out tagged
const SENTENCE = [
  { w: "A" }, { w: "student", tag: "class" }, { w: "is a kind of", tag: "inheritance" },
  { w: "person", tag: "class" }, { w: "who" }, { w: "has", tag: "aggregation" },
  { w: "a" }, { w: "schedule", tag: "class" }, { w: "and" }, { w: "submits", tag: "operation" },
  { w: "assignments;" }, { w: "each" }, { w: "must be", tag: "constraint" },
  { w: "graded", tag: "operation" }, { w: "by" }, { w: "Alice.", tag: "instance" },
];

const TAG_STYLE = {
  class: "mm-cap-tag--java",
  instance: "mm-cap-tag--int",
  inheritance: "mm-cap-tag--cpp",
  aggregation: "mm-cap-tag--asm",
  operation: "mm-cap-tag--java",
  constraint: "mm-cap-tag--asm",
};

export default function NounVerbAnalysis() {
  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>Natural-language analysis — nouns become classes, verbs become operations</div>

      <p style={{ margin: "10px 2px 4px", fontSize: 14, lineHeight: 2.1, maxWidth: 700, whiteSpace: "normal" }}>
        {SENTENCE.map((t, i) => (
          <React.Fragment key={i}>
            <span style={{ whiteSpace: "nowrap" }}>
              {t.tag ? (
                <span>
                  <strong>{t.w}</strong>
                  <span className={"mm-cap-tag " + (TAG_STYLE[t.tag] || "mm-cap-tag--java")}
                    style={{ marginLeft: 3, fontSize: 8.5, verticalAlign: "super" }}>{t.tag}</span>
                </span>
              ) : t.w}
            </span>
            {" "}
          </React.Fragment>
        ))}
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.5, margin: "8px 0 4px" }}>
          <thead>
            <tr>
              {["Part of speech", "Model component", "Examples"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "6px 12px", borderBottom: "2px solid var(--mm-cell-bd)",
                  color: "var(--mm-cell-fg)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} style={{ padding: "5px 12px", borderBottom: "1px solid var(--mm-gap-bd)",
                    color: j === 0 ? "var(--mm-cell-fg)" : "var(--mm-muted)",
                    fontWeight: j === 0 ? 650 : 400, fontStyle: j === 2 ? "italic" : "normal" }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CompareCaption
        cols={[
          { tag: "grammar", kind: "java", children: <>The first pass is mechanical: underline the nouns and verbs in the requirements and let the table sort them into classes, attributes, operations, and relationships.</> },
          { tag: "CRC", kind: "int", children: <>The second pass is a walk-through with <strong>CRC cards</strong> — one card per candidate class, listing its <em>Responsibilities</em> and <em>Collaborators</em>. Re-walking the scenarios grows and prunes the cards.</> },
        ]}
        punch="Grammar proposes the classes; walking the scenarios disposes."
      />
    </div>
  );
}
