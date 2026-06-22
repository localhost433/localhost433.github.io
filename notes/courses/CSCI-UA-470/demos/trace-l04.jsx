import { scene, obj } from "@course";

/* Traces code/lectures/L04/main.cpp: friend operator>> and operator<<.
   Objects appear one declaration at a time. Real run with typed input
   "green 4.5" prints:
     Enter color and radius: I am a circle, my details are: green,4.5  */

const code =
`Circle c1("red", 2.5);
Circle c2("blue", 3.0);
Circle c3;

cin  >> c3;
cout << c3 << endl;`;

// Circle = string color (≈32 B) + double radius (8 B) -> sizeof 40
const circle = obj("Circle", [
  { name: "color", type: "string", size: 32 },
  { name: "radius", type: "double" },
]);
const c = (id, color, radius, hl) => circle(id, [color, radius], { hl });

const steps = [
  { line: 1, cells: [c("c1", "red", 2.5, true)],
    caption: {
      cpp: "`Circle c1(\"red\", 2.5)` is built by the **(string, double)** constructor.",
      intuition: "Passing a color and radius selects the matching constructor overload.",
    },
  },
  { line: 2, cells: [c("c1", "red", 2.5), c("c2", "blue", 3.0, true)],
    caption: {
      cpp: "`Circle c2(\"blue\", 3.0)` is a second object placed on the stack.",
      intuition: "Each declaration creates an independent object with its own members.",
    },
  },
  { line: 3, cells: [c("c1", "red", 2.5), c("c2", "blue", 3.0), c("c3", "\"\"", 0, true)],
    caption: {
      cpp: "`Circle c3;` invokes the **default** constructor, leaving the color empty and the radius `0`.",
      intuition: "With no arguments the default constructor runs, giving the object its initial values.",
    },
  },
  { line: 5, cells: [c("c1", "red", 2.5), c("c2", "blue", 3.0), c("c3", "green", 4.5, true)],
    outputs: [{ expr: "operator>>", result: "Enter color and radius:", note: "(you type: green 4.5)" }],
    caption: {
      cpp: "`cin >> c3` calls the friend `operator>>`, reading input into c3's private color and radius.",
      intuition: "It can't be a member because the left operand is the stream (`istream&`), not the Circle — being a **friend** lets it write c3's private members.",
    },
  },
  { line: 6, cells: [c("c1", "red", 2.5), c("c2", "blue", 3.0), c("c3", "green", 4.5)],
    outputs: [
      { expr: "operator>>", result: "Enter color and radius:", note: "(you type: green 4.5)" },
      { expr: "cout << c3", result: "I am a circle, my details are: green,4.5" },
    ],
    caption: {
      cpp: "`cout << c3` calls the friend `operator<<`, reading c3's private members and returning the stream.",
      intuition: "The left operand is `ostream&` so it's a **free function** too, and returning the stream lets calls chain (`<< endl`).",
    },
  },
];

export default scene({ title: "L04 — friend operator>> and operator<<", code, steps });
