import React from "react";
import { patternFigure, DiagramCard, UmlLink, SvgCode, svgCodeSize } from "@course";

/* note 22 — Memento. Three cards in a ROW, not a fork, so this skips patternTree and
   places its own cards the way Facade and Bridge do.

   The deck's own drawing is the source: Document (title/name/content) on the left, a
   CareTaker holding `mementos : List<Memento>` in the middle with a dashed dependency
   back to Document, and Memento on the right joined by a hollow aggregation diamond
   at the CareTaker end. The two handwritten fragments beside it are what make the LIFO
   stack visible — save() copies three fields IN, undo() copies three fields OUT and
   then drops the entry — so they are carried verbatim as SvgCode callouts.

   The rejected half deliberately shows BOTH failures at once: the document keeping its
   own history (two jobs) and an if-chain over which field changed (the same smell L20
   rejects three times). */

const PAD = 14;
const DOC_W = 200, CT_W = 240, MEM_W = 182, GAP = 62;

const docSections = [
  { rows: ["title : String", "name : String", "content : String"] },
  { rows: [] },
];
const ctSections = [
  { rows: ["mementos : List<Memento>"] },
  { rows: ["save(d : Document) : void", "undo() : void"] },
];

const DOC_H = 26 + (12 + 3 * 18) + (12 + 18);   // 122
const CT_H = 26 + (12 + 18) + (12 + 2 * 18);    // 104

const docX = PAD;
const ctX = docX + DOC_W + GAP;
const memX = ctX + CT_W + GAP;

const AXIS = PAD + DOC_H / 2;                    // every link rides this line
const docY = AXIS - DOC_H / 2;
const ctY = AXIS - CT_H / 2;

const SAVE = [
  "Memento m = new Memento();",
  "m.title   = d.title;",
  "m.name    = d.name;",
  "m.content = d.content;",
  "mementos.add(m);",
];
const UNDO = [
  "d.title   = mementos[-1].title;",
  "d.name    = mementos[-1].name;",
  "d.content = mementos[-1].content;",
  "mementos.remove(-1);",
];
const saveSize = svgCodeSize(SAVE, "CareTaker.save(d)");
const undoSize = svgCodeSize(UNDO, "CareTaker.undo()");

const CODE_Y = Math.max(docY + DOC_H, ctY + CT_H) + 24;
const CODE_GAP = 34;
const pairW = saveSize.w + CODE_GAP + undoSize.w;
const saveX = ctX + CT_W / 2 - pairW / 2;
const undoX = saveX + saveSize.w + CODE_GAP;

const W = Math.round(Math.max(memX + MEM_W, undoX + undoSize.w) + PAD);
const H = Math.round(CODE_Y + Math.max(saveSize.h, undoSize.h) + 20 + PAD);

export default patternFigure({
  title: "Memento — the past leaves the object that has it",
  intent: "[Restore Object to its previous state]",
  bad: {
    lang: "java",
    code: `class Document {
    String title, name, content;
    Deque<Edit> history;                 // the document keeps its own past

    void setTitle(String t)   { history.push(new Edit("title", title));   title = t; }
    void setContent(String c) { history.push(new Edit("content", content)); content = c; }

    void undo() {
        Edit e = history.pop();
        if      (e.field.equals("title"))   { title   = e.old; }
        else if (e.field.equals("content")) { content = e.old; }
        // a fourth field means a fourth branch — and a setter you must remember to edit
    }
}`,
    note: "Two failures in one class. `Document` is now the text **and** the bookkeeping of every past version of the text, which change for different reasons. And `undo()` has become an if-chain over *which field moved* — so undo has to be taught every edit the document will ever support.",
  },
  good: {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, maxWidth: 860,
    ariaLabel: "Three classes in a row. Document holds title, name and content. CareTaker holds mementos, a List of Memento, and offers save of a Document and undo; a dashed dependency arrow runs from CareTaker to Document, and a hollow aggregation diamond at the CareTaker end joins it to Memento, which holds the same three fields. Two code callouts below show save copying the document's three fields into a new Memento and adding it to the list, and undo copying the last Memento's three fields back into the document and then removing it.",
    node: (
      <g>
        <DiagramCard x={docX} y={docY} w={DOC_W} title="Document" sections={docSections} sub={0} />
        <DiagramCard x={ctX} y={ctY} w={CT_W} title="CareTaker" sections={ctSections} sub={1} />
        <DiagramCard x={memX} y={docY} w={MEM_W} title="Memento" sections={docSections} sub={2} />

        <UmlLink kind="depend"
          from={{ x: ctX, y: AXIS }} to={{ x: docX + DOC_W, y: AXIS }} />
        <UmlLink kind="aggregate"
          from={{ x: ctX + CT_W, y: AXIS }} to={{ x: memX, y: AXIS }} />

        <SvgCode x={saveX} y={CODE_Y} lines={SAVE} title="CareTaker.save(d)" />
        <SvgCode x={undoX} y={CODE_Y} lines={UNDO} title="CareTaker.undo()" />

        <text x={W / 2} y={H - 8} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
          save pushes a copy; undo pops the last one back. Document gains nothing either way.
        </text>
      </g>
    ),
    note: "A `Memento` has the document's fields and no methods — it is a photograph, not a machine. Note the deck's own loose end: `undo()` is drawn with no parameter yet its body writes into a `d`, so the CareTaker must already be holding the document. That is what the dashed dependency edge is recording.",
  },
  client: {
    lang: "java",
    label: "client code",
    code: `Document d  = new Document();
CareTaker c = new CareTaker();

d.title = "draft";
c.save(d);              // snapshot taken BEFORE the next edit

d.title = "final";
c.undo();               // d.title is "draft" again

// ctrl+Z once more -> whatever was saved before that`,
    note: "`Document` has no `undo`, no `history`, and no idea any of this is happening. Ten levels of undo is ten entries in the caretaker's list and **zero** new lines in `Document`.",
  },
  caption: {
    cols: [
      { tag: "originator", kind: "cpp", children: <>The <code className="mm-ic">Document</code> holds the state and only that. It never learns that it is being snapshotted, so undo depth is not its problem.</> },
      { tag: "caretaker", kind: "int", children: <>The canonical <code className="mm-ic">CareTaker</code> stores the stack and does not interpret it. This deck's simplified version exposes the snapshot fields and copies them directly in <code className="mm-ic">undo()</code>.</> },
    ],
    punch: "The stack is LIFO, and that is the whole of ctrl+Z: save pushes, undo pops. Because depth is a property of the caretaker's list rather than of the document, a hundred levels of undo costs a hundred mementos and not one line of Document.",
  },
});
