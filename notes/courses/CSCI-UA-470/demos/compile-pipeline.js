/* AUTO-GENERATED from compile-pipeline.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { Pipeline, cppBuildPipeline } from "@course";

/* The C++ build pipeline (note 01), drawn as a VERTICAL flow so it stays legible:
     main.cpp (+ mylib.h) --preprocess--> --compile--> main.o (object · unlinked)
       --link (with precompiled libraries)--> a.out (executable) --load/run--> CPU.
   The steps live in `cppBuildPipeline` in the @course kit so this note and the L08
   C++-vs-Java comparison render the exact same pipeline from one definition. */

export default function CompilePipeline() {
  return /*#__PURE__*/React.createElement(Pipeline, {
    maxWidth: 420,
    steps: cppBuildPipeline,
    ariaLabel: "The C++ build pipeline as a vertical flow: you write main.cpp (with mylib.h); the preprocessor and compiler turn it into the unlinked object main.o; the linker combines main.o with precompiled libraries into the executable a.out; at runtime the OS loads it and the CPU executes it."
  });
}