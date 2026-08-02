import { scene, stack, glob, obj } from "@course";

/* note 20 — Flyweight's payoff, in the heap. Four requests, two objects: the two
   "hit" steps allocate nothing at all, and the repo's arrows show why — the second
   red car request lands on the cell the first one created.

   Companion to pattern-flyweight, which shows the same story as a method body. The
   pair is deliberate: the cache logic is easy to read and easy to nod along to, and
   the memory picture is where "shared" stops being a word and becomes an address. */

const code =
`v = VehicleFactory.getVehicle(car,  red);    // miss
v = VehicleFactory.getVehicle(car,  red);    // hit
v = VehicleFactory.getVehicle(bike, blue);   // miss
v = VehicleFactory.getVehicle(car,  red);    // hit`;

const REPO = (entries, hl) => glob("repo", "List<vehicle>", "", { id: "repo", hl, fields: entries });
const CAR_ENTRY = { name: "car·red", size: 8, to: "car1", value: "→" };
const BIKE_ENTRY = { name: "bike·blue", size: 8, to: "bike1", value: "→" };

const carObj = obj("Car", [{ name: "color", type: "String", size: 8 }], { region: "heap", header: 12 });
const bikeObj = obj("Bike", [{ name: "color", type: "String", size: 8 }], { region: "heap", header: 12 });
const CAR = (hl) => carObj("Car #1", { color: '"red"' }, { id: "car1", hl });
const BIKE = (hl) => bikeObj("Bike #1", { color: '"blue"' }, { id: "bike1", hl });

const V = (target, hl) => stack("v", "vehicle", "ref", { id: "v", to: target, hl });

const steps = [
  {
    line: 1,
    cells: [V("car1", true), CAR(true), REPO([CAR_ENTRY], true)],
    caption: {
      java: "`repo` is empty, so this is a **miss**: `new Car(\"red\")` runs, the object is filed under `car·red`, and the reference is returned.",
      intuition: "The first request for any (type, colour) pair costs exactly what it cost before the pattern.",
    },
  },
  {
    line: 2,
    cells: [V("car1", true), CAR(true), REPO([CAR_ENTRY])],
    caption: {
      java: "Same type, same colour — a **hit**. `repo.get(car, red)` returns the existing reference and `new` never runs.",
      intuition: "Nothing appeared on the heap. `v` is now a second name for the object step 1 made.",
    },
  },
  {
    line: 3,
    cells: [V("bike1", true), CAR(), BIKE(true), REPO([CAR_ENTRY, BIKE_ENTRY], true)],
    caption: {
      java: "A pair the repo has not seen: **miss**. One more object, one more entry.",
      intuition: "The heap grows once per **distinct** pair, not once per request — which is the whole trade.",
    },
  },
  {
    line: 4,
    cells: [V("car1", true), CAR(true), BIKE(), REPO([CAR_ENTRY, BIKE_ENTRY])],
    caption: {
      java: "Back to `car·red` — **hit** again. Four requests have now been served by two objects.",
      intuition: "Scale that loop to a thousand frames and the count on the left keeps climbing while the count on the right does not. That gap is the pattern.",
    },
  },
];

export default scene({
  title: "Four requests, two objects: Flyweight in the heap",
  code, steps, lang: "java",
});
