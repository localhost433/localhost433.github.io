import React from "react";
import { Pipeline, KnobBar } from "@course";

/* note 23 — the L22 whiteboard's spine, as one figure with three readings of the same
   seven bands. Reuses the vertical `Pipeline` the C++ build flow is drawn with, because
   the shape is identical: ordered phases, one artifact per phase, an optional side feed.

   The three knobs are the three things the whiteboard actually says:
     phases  — what each stage produces (the artifact, not the activity)
     roles   — who owns each stage, which is the board's analyst -> designer ->
               programmer -> tester chain, and which retroactively explains the order
               this course taught its material in
     ai      — the board's "AI SDLC" band: AI can draft at every stage, and the question
               that decides whether that is enough is how large the system is

   Design is `accent` in all three views. That band is where this whole course lives. */

const P = (zone, label, note, sub, via, accent) =>
  ({ zone, label, note, sub, via, accent });

const PHASES = [
  P("Requirements", "the ask", "in the customer's words", 0),
  P("Analysis", "use cases", "who wants what, and why", 0, "turn wishes into behaviour"),
  P("Design", "the UML model", "classes · sequences · patterns", 1, "decide how it is built", true),
  P("Implementation", "the code", "C++ / Java", 1, "translate the model"),
  P("Testing", "defects", "measured against the use cases", 2, "does it do the ask?"),
  P("Deployment", "a running system", "in the user's hands", 2, "ship it"),
  P("Maintenance", "changes", "the ask has moved again", 3, "and round to the top"),
];

const feed = (steps, feeds) => steps.map((s, i) => ({ ...s, feed: feeds[i] }));

const ROLES = feed(PHASES, [
  { label: "Analyst", note: "architect", sub: 0, via: "gathers" },
  { label: "Analyst", note: "architect", sub: 0, via: "models" },
  { label: "Designer", note: "architect", sub: 1, via: "draws" },
  { label: "Programmer", note: "", sub: 1, via: "writes" },
  { label: "Tester", note: "", sub: 2, via: "checks" },
  { label: "the team", note: "", sub: 2, via: "releases" },
  { label: "everyone", note: "", sub: 3, via: "loops" },
]);

/* `via` rides a ~58px edge and the feed box is 120 wide, so labels are capped at about
   9 characters and notes at about 16 — anything longer is clipped by the boxes at
   either end. "AI drafts" is true of every band, which is the point of the view, so
   the ownership split lives in the box rather than on the arrow. */
const AI = feed(PHASES, [
  { label: "you own it", note: "what to build", sub: 3, via: "AI drafts" },
  { label: "you own it", note: "what exists", sub: 3, via: "AI drafts" },
  { label: "you own it", note: "the boundaries", sub: 3, via: "AI drafts" },
  { label: "AI owns it", note: "your contract", sub: 0, via: "AI drafts" },
  { label: "shared", note: "you judge it", sub: 1, via: "AI drafts" },
  { label: "shared", note: "you approve", sub: 1, via: "AI drafts" },
  { label: "you own it", note: "coherence", sub: 3, via: "AI drafts" },
]);

const VIEWS = {
  phases: {
    steps: PHASES,
    aria: "Seven development phases as a vertical flow: Requirements produces the ask; Analysis produces use cases; Design produces the UML model of classes, sequences and patterns; Implementation produces the code; Testing produces defects measured against the use cases; Deployment produces a running system; Maintenance produces changes that send the flow back to the top.",
  },
  roles: {
    steps: ROLES,
    aria: "The same seven phases with an owner beside each: the Analyst gathers requirements and models the analysis, the Designer draws the design, the Programmer writes the code, the Tester checks it, and the team releases and maintains it. Analyst and Designer are labelled architects.",
  },
  ai: {
    steps: AI,
    aria: "The same seven phases with the division of labour under AI codegen: AI drafts at every phase, but you own requirements, analysis, design and maintenance, AI owns implementation inside a contract you set, and testing and deployment are shared.",
  },
};

const KNOBS = [{
  id: "view", label: "read it as",
  options: [
    { value: "phases", label: "the phases" },
    { value: "roles", label: "who owns it" },
    { value: "ai", label: "with AI" },
  ],
}];

const CAPTION = {
  phases: "Everything this course taught sits in one band. Use cases are the output of Analysis; UML, SOLID and the pattern catalog are the output of Design. Code arrives one phase later — which is why the course spent six lectures on drawings before it wrote a line of the capstone.",
  roles: "The chain explains the syllabus. An analyst hands the designer use cases, the designer hands the programmer a model, the programmer hands the tester a build — and each handoff is a document in a notation both sides can read. That is what UML is for, and why a diagram nobody else can read has failed at its only job.",
  ai: "The deck's claim in one column: AI can draft in every band, but the bands you own are the ones where somebody has to decide what should exist and whether what came back is right. Note where Design sits — it is the phase AI helps with most and can settle least.",
};

export default function SdlcRolesAi() {
  const [view, setView] = React.useState("phases");
  const v = VIEWS[view];
  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>
        The development process, three ways
      </div>
      <KnobBar knobs={KNOBS} value={{ view }} onChange={(_, x) => setView(x)} />
      <Pipeline maxWidth={view === "phases" ? 430 : 560} steps={v.steps} ariaLabel={v.aria} />
      <p className="mm-scene__caption">{CAPTION[view]}</p>
    </div>
  );
}
