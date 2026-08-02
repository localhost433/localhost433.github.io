import { mcq } from "@course";

/* password-keeper practice — the round-trip drill from sections 4 and 5: given a
   code shape, name the diagram element, and vice versa. Every question is decided by
   one of the note's two discriminators: where does the reference live, and what is
   the line style. */

export default mcq({
  questions: [
    {
      stem: "`FileManager f = new FileManager(\"data.bin\");` appears inside `add_to_list`, and nowhere does MainGUI declare a FileManager field. Which edge does this predict?",
      choices: [
        { text: "A dashed dependency from MainGUI to FileManager", correct: true },
        { text: "An aggregation diamond from MainGUI to FileManager" },
        { text: "A solid association line between the two classes" },
        { text: "A generalization triangle from FileManager upward" },
      ],
      why: "The reference is **method-local**: born inside `add_to_list`, dropped when it returns. No field means no association and no diamond — the loosest edge, drawn dashed. The *same* class would earn a plain association line if a `FileManager` were stored as a field instead.",
    },
    {
      stem: "In the use case diagram, which way does the «extends» arrow between Delete password and View passwords point?",
      choices: [
        { text: "From Delete to View — the extension knows its base", correct: true },
        { text: "From View to Delete — the base offers its extension" },
        { text: "Both ways, because each use case can reach the other" },
        { text: "Neither — «extends» is drawn as a line with no arrow" },
      ],
      why: "The extension points at the base it plugs into, never the reverse: `View passwords` is complete on its own and knows nothing about deleting. The arrow is **dashed** with the «extends» label riding it — same edge, same direction, as note 12's optional behaviours.",
    },
    {
      stem: "`class Password implements Serializable` and `class MainGUI extends JFrame` both draw a triangle-headed edge. What tells them apart?",
      choices: [
        { text: "The line style — dashed for implements, solid for extends", correct: true },
        { text: "The head style — hollow for implements, filled for extends" },
        { text: "The direction — implements points down, extends points up" },
        { text: "The label — implements edges carry a «uses» stereotype" },
      ],
      why: "Both are triangles pointing at the parent; only the **line** differs. Solid line = generalization (`extends JFrame`), dashed line = realization (`implements Serializable`). Head shape and direction are identical, which is exactly why the quiz likes this pair.",
    },
    {
      stem: "Which sequence diagram is the one that runs when the app starts?",
      choices: [
        { text: "View passwords — the constructor ends by loading the list", correct: true },
        { text: "Add password — the app begins by creating a Password" },
        { text: "Delete password — the list must be cleared before use" },
        { text: "None — startup is not modeled by any of the three flows" },
      ],
      why: "The *View passwords* diagram starts with `new()` creating `mgr : MainGUI` itself, and the constructor's last act is the `load_passwords()` self-call that reads the file and fills the JList. Viewing **is** startup — the other two flows each begin from a button instead.",
    },
    {
      stem: "After `addNew` runs, where does the new Password object live, and which edge recorded that fact?",
      choices: [
        { text: "In lstPasswords, the field behind the aggregation diamond", correct: true },
        { text: "In a local variable that dies when addNew returns" },
        { text: "Inside the FileManager, which keeps the master copy" },
        { text: "In the JList widget, which owns the objects it draws" },
      ],
      why: "`add_to_list(p)` appends the object to `lstPasswords : DefaultListModel` — a **field**, holding many parts that outlive any one entry: the definition of the hollow-diamond aggregation. The JList only *renders* the model, and FileManager just serializes whatever list it is handed.",
    },
  ],
});
