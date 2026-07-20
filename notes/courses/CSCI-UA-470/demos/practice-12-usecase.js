/* AUTO-GENERATED from practice-12-usecase.jsx by `npm run build:artifacts` — do not edit. */
// notes/courses/CSCI-UA-470/demos/practice-12-usecase.jsx
import { useCaseBuild } from "@course";

/* note 12 practice — assemble a small Library System use-case diagram. A trimmed
   cut of the worked example (two actors, three use cases) so the moves stand out:
   actors go OUTSIDE the boundary, use cases INSIDE it; the Member takes part in
   borrowing and searching, the Librarian adds books; and Borrow Book is an optional
   path off Search for book, so the line between them is «extend». Placement is by
   zone and the diagram auto-lays-out — the only decisions are what goes where and
   what connects to what. */

export default useCaseBuild({
  prompt: "Build the Library System diagram. First read the requirements and tag the actors and use cases; then drop each element inside or outside the boundary, and connect the actors to their use cases and Borrow Book to Search for book.",
  system: "Library System",
  // Identify stage: the requirements as clickable words. Nouns naming a user are
  // actors; the things the system does for them are use cases; everything else
  // (books, the shelf, glue words) is left untagged.
  source: {
    tokens: ["A", {
      w: "Member",
      role: "actor"
    }, "can", {
      w: "borrow",
      role: "case",
      id: "borrow"
    }, "and", {
      w: "search for",
      role: "case",
      id: "search"
    }, "books,", "while", "a", {
      w: "Librarian",
      role: "actor"
    }, "can", {
      w: "add",
      role: "case",
      id: "add"
    }, "new", "books", "to", "the", "shelf."]
  },
  elements: [{
    id: "member",
    label: "Member",
    role: "actor",
    whyZone: "The Member is a person the system serves — an actor OUTSIDE the boundary."
  }, {
    id: "librarian",
    label: "Librarian",
    role: "actor",
    whyZone: "The Librarian is also an actor — outside the boundary, not a use case inside it."
  }, {
    id: "borrow",
    label: "Borrow Book",
    role: "case",
    whyZone: "Borrowing is a goal the system provides — a use-case oval INSIDE the boundary."
  }, {
    id: "search",
    label: "Search for book",
    role: "case",
    whyZone: "Searching is a use case the system offers — inside the boundary."
  }, {
    id: "add",
    label: "Add book",
    role: "case",
    whyZone: "Adding a book is a use case — inside the boundary."
  }],
  associations: [{
    actor: "member",
    cases: ["borrow", "search"]
  }, {
    actor: "librarian",
    cases: ["add"]
  }],
  relations: [{
    from: "borrow",
    to: "search",
    kind: "extend",
    why: "Borrow Book is an optional path off Search for book, so the line is «extend» — a dashed arrow from the extension to the base case."
  }]
});