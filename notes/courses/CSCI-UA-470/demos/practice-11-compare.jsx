import { compare, stack } from "@course";

/* Static side-by-side: the same method interpreted (cold) vs JIT-compiled (hot). */
const method = (state) => stack("m", "hot()", state, { id: "m" });

export default compare({
  title: "Interpreted vs JIT-compiled",
  lang: "java",
  stages: [
    {
      code: "hot();  // cold / warming",
      cells: [method("interpreted")],
      tag: { kind: "jvm", text: "interpreter" },
      note: "Below the hotness threshold the method runs in the **interpreter**, one bytecode at a time.",
    },
    {
      code: "hot();  // hot (10k+ calls)",
      cells: [method("JIT → native")],
      tag: { kind: "jvm", text: "JIT" },
      note: "Past the threshold the JIT compiles `hot()` to **native code**; later calls run the compiled version.",
    },
  ],
  punch: "Hot methods stop being interpreted and start running as native machine code.",
});
