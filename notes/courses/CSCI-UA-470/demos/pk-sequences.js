/* AUTO-GENERATED from pk-sequences.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { SequenceDiagram, KnobBar } from "@course";

/* password-keeper — L17's three sequence diagrams behind one knob, in the slide's
   own vocabulary: addNew / add_to_list / new(FN) / save(list_of_passwords),
   load_passwords / read() with its dashed List_of_passwords return, and
   delete / remove_from_list. One artifact instead of three because the three flows
   share their cast — mgr : MainGUI up front, f : FileManager built fresh at the end
   of every flow, which is the dependency-edge evidence the class diagram needs. */

const FLOWS = {
  add: {
    label: "Add password",
    participants: [{
      id: "user",
      label: "User",
      kind: "actor"
    }, {
      id: "mgr",
      label: "mgr : MainGUI"
    }, {
      id: "p",
      label: "p : Password",
      bornAt: 1
    }, {
      id: "f",
      label: "f : FileManager",
      bornAt: 3
    }],
    messages: [{
      from: "user",
      to: "mgr",
      label: "addNew(title, passcode)",
      kind: "sync"
    },
    // 0
    {
      from: "mgr",
      to: "p",
      label: "new(title, passcode)",
      kind: "sync"
    },
    // 1 — creation
    {
      from: "mgr",
      to: "mgr",
      label: "add_to_list(p)",
      kind: "sync",
      self: true
    },
    // 2
    {
      from: "mgr",
      to: "f",
      label: "new(FN)",
      kind: "sync"
    },
    // 3 — creation
    {
      from: "mgr",
      to: "f",
      label: "save(list_of_passwords)",
      kind: "sync"
    } // 4
    ],
    activations: [{
      p: "mgr",
      from: 0,
      to: 4
    }, {
      p: "mgr",
      from: 2,
      to: 2,
      dx: 4
    }, {
      p: "f",
      from: 4,
      to: 4
    }],
    caption: {
      text: "p joins the list and stays; f is built, used once, and dropped — remember that difference",
      color: "--mm-muted"
    }
  },
  view: {
    label: "View passwords",
    participants: [{
      id: "user",
      label: "User",
      kind: "actor"
    }, {
      id: "mgr",
      label: "mgr : MainGUI",
      bornAt: 0
    }, {
      id: "f",
      label: "f : FileManager",
      bornAt: 2
    }],
    messages: [{
      from: "user",
      to: "mgr",
      label: "new()",
      kind: "sync"
    },
    // 0 — creation
    {
      from: "mgr",
      to: "mgr",
      label: "load_passwords()",
      kind: "sync",
      self: true
    },
    // 1
    {
      from: "mgr",
      to: "f",
      label: "new(FN)",
      kind: "sync"
    },
    // 2 — creation
    {
      from: "mgr",
      to: "f",
      label: "read()",
      kind: "sync"
    },
    // 3
    {
      from: "f",
      to: "mgr",
      label: "List_of_passwords",
      kind: "return"
    } // 4
    ],
    activations: [{
      p: "mgr",
      from: 1,
      to: 4
    }, {
      p: "mgr",
      from: 1,
      to: 1,
      dx: 4
    }, {
      p: "f",
      from: 3,
      to: 4
    }],
    caption: {
      text: "viewing IS startup: the constructor ends by calling load_passwords()",
      color: "--mm-muted"
    }
  },
  delete: {
    label: "Delete password",
    participants: [{
      id: "user",
      label: "User",
      kind: "actor"
    }, {
      id: "mgr",
      label: "mgr : MainGUI"
    }, {
      id: "f",
      label: "f : FileManager",
      bornAt: 2
    }],
    messages: [{
      from: "user",
      to: "mgr",
      label: "delete(pid)",
      kind: "sync"
    },
    // 0
    {
      from: "mgr",
      to: "mgr",
      label: "remove_from_list(pid)",
      kind: "sync",
      self: true
    },
    // 1
    {
      from: "mgr",
      to: "f",
      label: "new(FN)",
      kind: "sync"
    },
    // 2 — creation
    {
      from: "mgr",
      to: "f",
      label: "save(list_of_passwords)",
      kind: "sync"
    } // 3
    ],
    activations: [{
      p: "mgr",
      from: 0,
      to: 3
    }, {
      p: "mgr",
      from: 1,
      to: 1,
      dx: 4
    }, {
      p: "f",
      from: 3,
      to: 3
    }],
    caption: {
      text: "the mirror of Add: remove instead of append, then the same fresh FileManager and save",
      color: "--mm-muted"
    }
  }
};
const KNOBS = [{
  id: "flow",
  label: "use case",
  options: [{
    value: "add",
    label: "Add password"
  }, {
    value: "view",
    label: "View passwords"
  }, {
    value: "delete",
    label: "Delete password"
  }]
}];
export default function PkSequences() {
  const [flow, setFlow] = React.useState("add");
  const f = FLOWS[flow];
  return /*#__PURE__*/React.createElement("div", {
    className: "mm-scene"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__title",
    "data-artifact-title": true
  }, "The three use cases as interactions \u2014 ", f.label), /*#__PURE__*/React.createElement(KnobBar, {
    knobs: KNOBS,
    value: {
      flow
    },
    onChange: (_, v) => setFlow(v)
  }), /*#__PURE__*/React.createElement(SequenceDiagram, {
    participants: f.participants,
    messages: f.messages,
    activations: f.activations,
    caption: f.caption,
    maxWidth: 720
  }));
}