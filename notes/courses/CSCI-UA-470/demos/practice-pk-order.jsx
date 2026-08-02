// notes/courses/CSCI-UA-470/demos/practice-pk-order.jsx
import { sequenceOrder } from "@course";

/* password-keeper practice — rebuild the Add flow from L17. The ordering is pinned
   by two rules the note teaches: an object must be created (new) before it is used,
   and persistence happens after the model changes. The trap is putting save before
   new(FN) — you cannot ask a FileManager to save before one exists. */

export default sequenceOrder({
  prompt: "The Add password flow, scrambled. The user has typed a title and passcode and clicked Add New. Order the five messages as L17's sequence diagram draws them.",
  participants: [
    { id: "user", label: "User", kind: "actor" },
    { id: "mgr", label: "mgr : MainGUI" },
    { id: "p", label: "p : Password" },
    { id: "f", label: "f : FileManager" },
  ],
  messages: [
    { id: "addnew", from: "user", to: "mgr", label: "addNew(title, passcode)", kind: "sync",
      why: "The button's ActionListener hands off to the control method — the boundary→control message that starts every flow. Nothing exists yet but the GUI itself." },
    { id: "newp", from: "mgr", to: "p", label: "new(title, passcode)", kind: "sync",
      why: "The entity is created **first**: `addNew` wraps the two strings in a `Password` object before anything can be listed or saved." },
    { id: "addlist", from: "mgr", to: "mgr", label: "add_to_list(p)", kind: "sync",
      why: "A **self-call**: `addNew` invokes `add_to_list(p)` on the same object. `p` joins `lstPasswords` here — the moment the aggregation diamond is talking about." },
    { id: "newf", from: "mgr", to: "f", label: "new(FN)", kind: "sync",
      why: "Only now is a `FileManager` built — inside `add_to_list`, method-local, from the filename. Created fresh on every flow: that is the evidence for the **dashed dependency** edge." },
    { id: "save", from: "mgr", to: "f", label: "save(list_of_passwords)", kind: "sync",
      why: "Persistence comes last, after the list has changed, and it needs the `f` created one message earlier. `save` writes the whole model out by serialization." },
  ],
  activations: [
    { p: "mgr", from: 0, to: 4 },
    { p: "mgr", from: 2, to: 2, dx: 4 },
    { p: "f", from: 4, to: 4 },
  ],
});
