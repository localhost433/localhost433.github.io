---
title: "Capstone: The Password Keeper (Design → Code)"
date: "2026-07-20"
---

## The whole modeling unit on one app

Notes 12–16 introduced each modeling artifact in isolation: the [use case diagram](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams), the [sequence diagram](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams), the [class diagram](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams), the [translation to Java](note.html?course=CSCI-UA-470&note=15-uml-to-code), and the [SOLID judgment layer](note.html?course=CSCI-UA-470&note=16-solid) — all opening from the [modeling overview](note.html?course=CSCI-UA-470&note=systems-modeling-intro). L17 runs the entire chain **on one small app**, a Java Swing "Password Keeper," and never leaves it. The point is not to draw four diagrams; it is to see that they are four views of the *same* thing.

The spine of this note is **bidirectional traceability**. Forward: a use-case oval becomes a sequence diagram, whose top-row participants become class boxes, whose relationship edges become Java fields and `new`s. Backward: given a Swing snippet you have never seen, recover the edge it stands for. Every element maps to a specific piece of code, and every piece of code maps back. That round-trip is exactly what the quiz tests.

Here is the finished app, so every later diagram has a referent — annotated with the `MainGUI` field behind each widget, because that mapping *is* the note:

```artifact src=demos/pk-gui.jsx static
```

A title field, a passcode field, an **Add New** button, a `JList` of saved entries rendered `title,passcode`, plus **Delete** and **Exit**. Small enough to hold in your head; complete enough to exercise every artifact.

## 1 · Use case diagram — what the User can do

Start from the outside, the [note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) view. One actor, three goals — and note what the slide does *not* draw: no association from the User to `Delete password`. Deleting is reachable only through viewing:

```artifact src=demos/pk-use-case.jsx static
```

`Delete password` **«extends»** `View passwords`: deleting is *optional* behavior reachable only once you are looking at the list. The extend arrow is **dashed and points from the extension toward the base** — the extension knows the base it plugs into, never the reverse. This is the same extend edge from [note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams), here earning its place because delete is a conditional add-on to viewing, not a standalone goal.

Forward link: each of these three ovals is a *conversation* waiting to be written out. That is the next artifact's job.

## 2 · Sequence diagrams — how objects collaborate

Each use case becomes one [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) interaction. Read top-to-bottom as time; `new` creates a participant, a dashed arrow returns a value. Three participants recur: `mgr : MainGUI`, `p : Password`, `f : FileManager`.

All three, one knob per use case — the slide's own message names, creations (`new`), self-calls, and the single dashed return:

```artifact src=demos/pk-sequences.jsx
```

Two observations drive the next artifact. First, the **top-row participants** — `MainGUI`, `Password`, `FileManager` — are precisely the classes about to be declared; the interaction *discovers* the structure ([note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams)). Second, watch *where each reference lives*: `Password` is created and then handed to `add_to_list` and kept in a list, while `FileManager` is `new`ed **inside a method**, used once, and dropped. That lifetime difference is what makes one edge an aggregation and the other a dependency ([note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)).

## 3 · Class diagram — the structural blueprint

Read the surviving participants off as three-compartment boxes. Visibility per [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams): `-` private, `+` public. (One notation wrinkle worth noticing: the L17 slide writes `: void` out in full, while note 14's convention omits it — read either form on an exam without blinking.)

```artifact src=demos/pk-class-diagram.jsx static
```

Two different edges, and the difference is the whole lesson:

| Edge | Notation | Why | Java it predicts |
|---|---|---|---|
| `MainGUI` → `Password` | **hollow diamond** (aggregation) at `MainGUI` | `MainGUI` *holds a list* of `Password`s; the objects live in a field that outlives any one entry | a collection field: `DefaultListModel lstPasswords;` |
| `MainGUI` ⟶ `FileManager` | **dashed arrow** (dependency) | `FileManager` is `new`ed inside a method, used, dropped — no field | `FileManager f = new FileManager(...)` local to a method |

The aggregation carries a list, so its diamond sits on the whole (`MainGUI`) and the `*` multiplicity lives on the `Password` end. The dependency is dashed because — per the sequence diagrams — the reference never survives the method it appears in. Nothing here is invented: each box and each edge is *evidence* carried down from the interaction.

Forward link: every compartment line and every edge now has a mechanical Java form. Writing it out is the next section.

## 4 · Design → Code — the real Swing

Now the actual implementation from `MainGUI.java`, `Password.java`, and `FileManager.java`. Stereotype the three classes with [note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)'s boundary/control/entity vocabulary:

- **`MainGUI` = boundary + control.** It *is* the UI wall (fields, buttons, list) and it also orchestrates each use case (`addNew`, `delete`, `load_passwords`). One class doing both jobs is fine for an app this small — but note 16's SRP would eye it.
- **`Password` = entity.** Pure data the system remembers; it `implements Serializable` so it can be written to disk.
- **`FileManager` = boundary.** The *other* wall — the file/DB side. Boundary is not a synonym for UI; anything the system talks to that isn't itself gets a boundary object, and the disk is such a wall.

**The list: aggregation → `JList` + `DefaultListModel`.** The class-diagram diamond becomes two collaborating fields — a view (`JList`) backed by a model (`DefaultListModel`):

```java
private JList gui_list;
private DefaultListModel lstPasswords;
...
gui_list = new JList();
gui_list.setBounds(20, 70, 281, 155);
contentPane.add(gui_list);
lstPasswords = new DefaultListModel();
gui_list.setModel(lstPasswords);   // the model IS the aggregated list of Passwords
```

**The three buttons → three action listeners.** Each `JButton` from the class box gets an anonymous `ActionListener` whose `actionPerformed` calls exactly one control method — the boundary handing off to the control:

```java
btnAdd = new JButton("Add");
btnAdd.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        addNew(txtTitle.getText(), txtPasscode.getText());   // reads the fields
    }
});
btnDelete = new JButton("Delete");
btnDelete.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        delete(gui_list.getSelectedIndex());   // pid = the selected row
    }
});
btnExit = new JButton("Exit");
btnExit.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) { System.exit(ABORT); }
});
```

**The Add flow** is the *Add password* sequence diagram, line for line — `addNew` creates a `Password`, `add_to_list` appends it to the model and persists via a freshly-built `FileManager`:

```java
public void addNew(String title, String passcode) {
    Password p = new Password(title, passcode);   // new(title,passcode)
    add_to_list(p);                               // self-call add_to_list(p)
}
public void add_to_list(Password p) {
    lstPasswords.addElement(p);                   // aggregation: p joins the list
    FileManager f = new FileManager("data.bin");  // new(FN)  ← dependency
    f.save(lstPasswords);                         // save(list_of_passwords)
}
```

**The Delete flow** mirrors it — the *Delete password* sequence exactly — removing at the selected index and re-saving:

```java
public void delete(int pid) { remove_from_list(pid); }   // self-call
public void remove_from_list(int pid) {
    lstPasswords.removeElementAt(pid);
    FileManager f = new FileManager("data.bin");   // dependency again
    f.save(lstPasswords);
}
```

**The load flow** is the *View passwords* sequence — called at the end of the constructor (that is why viewing == startup), reading the list back and rebinding it to the view:

```java
public void load_passwords() {
    FileManager f = new FileManager("data.bin");   // new(FN)
    lstPasswords = f.read();                        // read() returns List_of_passwords
    gui_list.setModel(lstPasswords);
}
```

**`FileManager` save/read** — the boundary at the disk wall, using Java object serialization (which is why `Password implements Serializable`):

```java
public void save(DefaultListModel lst) {
    ObjectOutputStream os = new ObjectOutputStream(new FileOutputStream(file_name));
    os.writeObject(lst);
    os.close();
}
public DefaultListModel read() {
    ObjectInputStream is = new ObjectInputStream(new FileInputStream(file_name));
    return (DefaultListModel) is.readObject();   // one exception handler per method, elided
}
```

Every class-diagram element has now landed somewhere concrete: attributes → field declarations, operations → methods, the aggregation diamond → the `DefaultListModel` field, the dependency arrow → the three method-local `new FileManager(...)`s.

## 5 · Code → Design — reading the edges back

The reverse skill, and the one the quiz leans on: given a snippet, name the diagram element. The discriminating question is always [note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)'s — **where does the reference live?**

| You see in the code | You recover | Because |
|---|---|---|
| `private DefaultListModel lstPasswords;` (a collection **field**) | **aggregation** `MainGUI ◇→ Password` | a field holding many parts that outlive individual entries |
| `FileManager f = new FileManager("data.bin");` **inside a method** | **dependency** `MainGUI ⟶ FileManager` | reference is method-local — no field, so the loosest edge |
| `class Password implements Serializable` | **realization** `Password ┈▷ «interface» Serializable` | dashed triangle to an interface |
| `class MainGUI extends JFrame` | **generalization** `MainGUI —▷ JFrame` | solid triangle to a class parent |
| `btnAdd.addActionListener(...) { addNew(...) }` | a **message** on the *Add* sequence, boundary → control | the button (boundary) invokes a handler (control) |
| `addNew(...)` calling `add_to_list(p)` | a **self-call** (self-message loop) | an object invoking its own method |

Two traps worth rehearsing. First, the *same* type `FileManager` would be an **association** (plain line) if it were a field and a **dependency** (dashed) as a method-local — here it is dashed, decided purely by the `new` sitting inside `add_to_list`/`load_passwords` rather than at the top of the class. Second, `extends JFrame` and `implements Serializable` are both triangles; only the **line style** (solid vs dashed) tells `extends` from `implements`.

## What to retain

- L17 is the **integration** of notes 12–16: one small app modeled end to end, use case → sequence → class → code, and read back the other way.
- The organizing idea is **bidirectional traceability** — every diagram element has a code home and every code shape names a diagram edge.
- The use case's `Delete «extends» View` is a *conditional* add-on; the dashed extend arrow points from extension to base.
- The sequence diagrams **discover the classes** (top-row participants) *and* decide their edges (a reference kept in a list → aggregation; a `new` inside a method → dependency).
- In the class diagram the **hollow diamond** to `Password` becomes `JList` + `DefaultListModel`; the **dashed dependency** to `FileManager` becomes three method-local `new FileManager(...)`.
- Stereotypes: **`MainGUI` = boundary + control**, **`Password` = entity**, **`FileManager` = boundary** (the file/DB wall). `Serializable` is what lets the entity cross that wall.
- Code → design hinges on **where the reference lives**: field vs method-local separates association/aggregation from dependency; line style separates `extends` from `implements`.

## Practice

First rebuild the Add flow — the ordering is pinned by "create before use" and "persist after change", and assembling it makes the self-call and the fresh `FileManager` impossible to miss:

```artifact src=demos/practice-pk-order.jsx
```

Then the round-trip pass, one question per edge the quiz likes: field vs method-local `new`, the extend arrow's direction, solid vs dashed triangles, and which flow runs at startup:

```artifact src=demos/practice-pk-mcq.jsx
```

---

> Where this sits in the course: the **design capstone**. Notes [12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams) built the three UML views, [note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code) translated each edge into Java, and [note 16](note.html?course=CSCI-UA-470&note=16-solid) judged which designs to keep; the Password Keeper is where all four come together on a single running program. This is the last modeling note before the quiz — which examines exactly the round-trip drilled in sections 4 and 5: read a diagram into code, and read code back into a diagram.
