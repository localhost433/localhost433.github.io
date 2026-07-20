/* AUTO-GENERATED from practice-14-classbox-compose.jsx by `npm run build:artifacts` — do not edit. */
// notes/courses/CSCI-UA-470/demos/practice-14-classbox-compose.jsx
import { classBuild } from "@course";

/* note 14 practice, second class box — this time the relationship is the
   aggregation/composition trap the note flags as the mark-loser: both are diamonds,
   and only the FILL tells them apart. A Window OWNS its TitleBar — destroy the
   window and the bar goes with it — so it is COMPOSITION: a FILLED diamond, and the
   diamond sits at the WHOLE (Window) end, never on the part. The member notation is
   drilled again (visibility left, type after the colon), and the `- bar : TitleBar`
   field is the composition made concrete: the whole holds the part as a field. */

export default classBuild({
  prompt: "Build the Window class box, then pick the line to TitleBar. A Window OWNS its title bar — destroy the window and the bar is destroyed with it. Which of the two diamonds is that, and where does it sit?",
  className: "Window",
  abstract: false,
  attributes: [{
    vis: "-",
    name: "bar",
    type: "TitleBar",
    whyVis: "`bar` is internal state the window manages → `-` private.",
    whyType: "The type goes AFTER the colon: `bar : TitleBar`. Holding the part as a field is what makes this a whole/part relationship in the first place."
  }, {
    vis: "-",
    name: "width",
    type: "int",
    whyVis: "`width` is hidden data → `-` private.",
    whyType: "Type after the colon: `width : int`, not `int width` — the reverse of Java/C++."
  }],
  operations: [{
    vis: "+",
    name: "show()",
    ret: null,
    whyVis: "`show()` is part of the interface callers use → `+` public."
  }, {
    vis: "+",
    name: "close()",
    ret: null,
    whyVis: "`close()` is a public operation → `+`."
  }],
  typeDistractors: ["double", "String", "boolean"],
  relationship: {
    to: "TitleBar",
    kind: "compose",
    parentAbstract: false,
    parentSections: [{
      rows: []
    }, {
      rows: [{
        text: "+ setText(t : String)"
      }]
    }],
    why: "A Window OWNS its TitleBar and the bar dies with the window, so this is COMPOSITION — a FILLED diamond (◆), sitting at the WHOLE end (Window), never on the part. Aggregation (the HOLLOW diamond ◇) is the looser has-a where the part can outlive the whole, e.g. a Team and its Players. Generalization (the hollow triangle) would be wrong — a TitleBar is not a kind of Window."
  }
});