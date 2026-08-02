/* AUTO-GENERATED from pattern-decorator-wrap.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, obj } from "@course";

/* note 20 — the Decorator onion, watched in memory. The line students misread is
   `b1 = new Flower(b1, …)`: it looks like reassignment losing the old object, and it
   is the opposite — the old object survives, held by the new one, and only the
   NAME moves outward.

   Each step adds one heap cell whose `b` field points at the previous outermost
   object, so the arrows accumulate into the chain that `cost()` walks. */

const code = `Booking b1 = new Booking("01/17/26", 400);
b1 = new Flower(b1, "white", 12);
b1 = new Catering(b1, "vegan", 40);
b1 = new Music(b1, "jazz", 3);

double total = b1.cost();`;
const H = {
  region: "heap",
  header: 12
};
const booking = obj("Booking", [{
  name: "date",
  type: "String",
  size: 8
}, {
  name: "cost",
  type: "double",
  size: 8
}], H);
const flower = obj("Flower", [{
  name: "b",
  type: "Booking",
  size: 8,
  to: "bk"
}, {
  name: "number",
  type: "int",
  size: 4
}], H);
const catering = obj("Catering", [{
  name: "b",
  type: "Booking",
  size: 8,
  to: "fl"
}, {
  name: "amount",
  type: "int",
  size: 4
}], H);
const music = obj("Music", [{
  name: "b",
  type: "Booking",
  size: 8,
  to: "ca"
}, {
  name: "length",
  type: "int",
  size: 4
}], H);
const BK = hl => booking("base", {
  date: '"01/17"',
  cost: "400"
}, {
  id: "bk",
  hl
});
const FL = hl => flower("+flowers", {
  number: "12"
}, {
  id: "fl",
  hl
});
const CA = hl => catering("+catering", {
  amount: "40"
}, {
  id: "ca",
  hl
});
const MU = hl => music("+music", {
  length: "3"
}, {
  id: "mu",
  hl
});
const B1 = (target, hl) => stack("b1", "Booking", "ref", {
  id: "b1",
  to: target,
  hl
});
const steps = [{
  line: 1,
  cells: [B1("bk", true), BK(true)],
  caption: {
    java: "An undecorated booking: a date and a base cost. `b1.cost()` returns `400`.",
    intuition: "One object, one name. Everything after this is wrapping, never editing."
  }
}, {
  line: 2,
  cells: [B1("fl", true), BK(), FL(true)],
  caption: {
    java: "`b1 = new Flower(b1, …)` — the **old value of `b1` is passed in first**, and only then does `b1` take the new object's address.",
    intuition: "The base booking is not lost or replaced. It is now held by `Flower`, and reachable only through it."
  }
}, {
  line: 3,
  cells: [B1("ca", true), BK(), FL(), CA(true)],
  caption: {
    java: "Same move again. `Catering` holds the `Flower`, which holds the `Booking`.",
    intuition: "The chain is two deep, and no class in it knows how deep it is."
  }
}, {
  line: 4,
  cells: [B1("mu", true), BK(), FL(), CA(), MU(true)],
  caption: {
    java: "Three decorators over one booking — assembled from three classes, not from a `FlowerCateringMusicBooking` class that somebody had to write.",
    intuition: "Four objects on the heap, one name on the stack, pointing at the **outermost** one."
  }
}, {
  line: 6,
  cells: [B1("mu", true), BK(true), FL(true), CA(true), MU(true)],
  caption: {
    java: "`b1.cost()` runs `Music.cost()`, which adds its own and calls `b.cost()` — `Catering`, then `Flower`, then the base `Booking`, and the sums come back up the same chain.",
    intuition: "Follow the arrows: the call goes **outside-in**, the answer comes **inside-out**. Reordering lines 2–4 reorders the walk without changing a class."
  }
}];
export default scene({
  title: "The onion: what `b1 = new Flower(b1, …)` actually does",
  code,
  steps,
  lang: "java"
});