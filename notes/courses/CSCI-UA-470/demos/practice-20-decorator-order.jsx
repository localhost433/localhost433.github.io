// notes/courses/CSCI-UA-470/demos/practice-20-decorator-order.jsx
import { sequenceOrder } from "@course";

/* note 20 practice — the decorator chain as a sequence diagram, which is where the
   two directions become impossible to confuse: the CALLS run outside-in (Music
   first, because b1 points at the outermost wrapper) and the RETURNS come back
   inside-out (Booking's 400 first, each layer adding on the way up).

   The trap this drill is built around is starting the chain at `Booking` because it
   is "the real one". b1 does not point at Booking — it points at Music, and the base
   booking is the LAST thing reached. Note 13's ordering rules apply unchanged:
   solid heads for calls, dashed for returns. */

export default sequenceOrder({
  prompt: "A booking wrapped in Flower, then Catering, then Music. The client calls b1.cost(). Order the messages top-to-bottom as time. Ask yourself first: which object does b1 actually point at?",
  participants: [
    { id: "client", label: "Client", kind: "actor" },
    { id: "music", label: "b1 : Music" },
    { id: "cat", label: ": Catering" },
    { id: "flower", label: ": Flower" },
    { id: "booking", label: ": Booking" },
  ],
  messages: [
    { id: "call", from: "client", to: "music", label: "cost()", kind: "sync",
      why: "`b1` holds the address of the **outermost** wrapper — the last one constructed, `Music`. The client's single call lands there, not on the base booking." },
    { id: "toCat", from: "music", to: "cat", label: "b.cost()", kind: "sync",
      why: "`Music` cannot answer alone: it knows only its own £/hour. It forwards to whatever it wraps, which is the `Catering` created on the line before it." },
    { id: "toFlower", from: "cat", to: "flower", label: "b.cost()", kind: "sync",
      why: "Same move, one layer in. `Catering` wraps `Flower`, because `Flower` was the value of `b1` when `new Catering(b1, …)` ran." },
    { id: "toBooking", from: "flower", to: "booking", label: "b.cost()", kind: "sync",
      why: "`Flower` wraps the original `Booking` — the first object made and the **last** one reached. The call has now run all the way in without anyone computing a total." },
    { id: "base", from: "booking", to: "flower", label: "400", kind: "return",
      why: "The base is the only object that can answer without asking anyone: it returns its own cost. Every return above this one is built on it, so it must come first." },
    { id: "rFlower", from: "flower", to: "cat", label: "400 + flowers", kind: "return",
      why: "`Flower` adds its own charge to what came back and passes the sum on. Adding *after* the inner call returns is what makes decorators compose." },
    { id: "rCat", from: "cat", to: "music", label: "+ catering", kind: "return",
      why: "The same addition, one layer out. Each return is strictly after the return it is built from — so the dashed arrows run in the exact reverse order of the solid ones." },
    { id: "rMusic", from: "music", to: "client", label: "grand total", kind: "return",
      why: "The outermost decorator adds last and hands the client one number. The client made one call and never learned how many objects answered it." },
  ],
  activations: [
    { p: "music", from: 0, to: 7 },
    { p: "cat", from: 1, to: 6 },
    { p: "flower", from: 2, to: 5 },
    { p: "booking", from: 3, to: 4 },
  ],
});
