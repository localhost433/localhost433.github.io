/* AUTO-GENERATED from practice-14-classbox-aggregate.jsx by `npm run build:artifacts` — do not edit. */
// notes/courses/CSCI-UA-470/demos/practice-14-classbox-aggregate.jsx
import { classBuild } from "@course";

/* note 14 practice — the OTHER half of the diamond trap. The composition box
   (Window/TitleBar) drew a FILLED diamond because the part died with the whole.
   Here a Team HAS Players, but a player can be traded and outlive the team — the
   looser has-a — so it is AGGREGATION: a HOLLOW diamond, again at the WHOLE (Team)
   end. Same diamond position, opposite fill; that fill is the whole distinction. */

export default classBuild({
  prompt: "Build the Team class box, then pick the line to Player. A Team HAS players, but a player can be traded and outlive the team — the part does NOT die with the whole. Which diamond is that, filled or hollow?",
  className: "Team",
  abstract: false,
  attributes: [{
    vis: "-",
    name: "name",
    type: "String",
    whyVis: "`name` is hidden data → `-` private.",
    whyType: "Type after the colon: `name : String`, not `String name` — the reverse of Java/C++."
  }, {
    vis: "-",
    name: "roster",
    type: "List",
    whyVis: "`roster` is internal state → `-` private.",
    whyType: "The type goes after the colon: `roster : List`. Holding the players in a list is the has-a made concrete."
  }],
  operations: [{
    vis: "+",
    name: "addPlayer()",
    ret: "void",
    whyVis: "`addPlayer()` is part of the interface callers use → `+` public.",
    whyType: "A method that returns nothing writes `: void` — not omitted, not moved to the front."
  }, {
    vis: "+",
    name: "size()",
    ret: "int",
    whyVis: "`size()` is a public query → `+`.",
    whyType: "The return type follows the colon: `size() : int`."
  }],
  typeDistractors: ["double", "boolean", "Player"],
  relationship: {
    to: "Player",
    kind: "aggregate",
    parentAbstract: false,
    parentSections: [{
      rows: []
    }, {
      rows: [{
        text: "+ getName() : String"
      }]
    }],
    why: "A Team HAS players but does not own their lifetime — a traded player outlives the team — so this is AGGREGATION: a HOLLOW diamond (◇), at the WHOLE (Team) end. Contrast COMPOSITION (the FILLED diamond ◆), where the part dies with the whole, as a Window's TitleBar does. Same diamond, same end — only the fill changes, and the lifetime rule decides it."
  }
});