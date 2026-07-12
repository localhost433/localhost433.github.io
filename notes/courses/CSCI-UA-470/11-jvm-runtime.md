---
title: "JVM, Bytecode & Runtime Architecture"
date: "2026-06-22/24"
---

## Purpose of this note

This note isolates the runtime model behind Java. [Note 08](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) gives the high-level C++ versus Java compilation contrast; this note explains what sits behind the Java side of that contrast: bytecode, the JVM, class loading, runtime areas, interpretation, JIT compilation, garbage collection, and native-library access.

Use [note 10](note.html?course=CSCI-UA-470&note=10-java-files-final) for files, serialization, and `final`; use this note for the execution platform.

## The life of one Java program

These are the stages a single program passes through, source to reclaimed
memory -- the same seven steps this page walks through, several of them shown
step-by-step in the demos below:

| # | Stage | Who acts | What happens |
|---|---|---|---|
| 1 | Compile | `javac` | `.java` source becomes portable `.class` bytecode |
| 2 | Load | class loader | the delegation chain brings the class into the Method Area |
| 3 | Verify | verifier | bytecode is checked for safety before it can run |
| 4 | Execute | interpreter | fetch-decode-execute over the operand stack; objects land on the Heap |
| 5 | Native call | JNI | `native` methods cross into a platform library |
| 6 | Optimize | JIT | hot methods are compiled to native code |
| 7 | Reclaim | GC | unreachable objects are marked and swept |

> A hands-on companion that builds this VM yourself in C++: Prof. Hussain's
> [mini-VM workshop](https://ha2285.github.io/oop-activities/mini-vm-workshop.html).

## C++ native execution versus Java bytecode execution

This comparison is one of the main bridges from earlier C++ notes to Java.

```artifact src=demos/platform-fanout.jsx static
```

### C++: platform-dependent native code

C++ starts from source files such as `.cpp`, `.cc`, and `.h`.

The usual pipeline is **C++ source + headers → preprocessor → compiler → assembly code (e.g. `.s`) → assembler → object code (e.g. `.o`) → linker → native executable (e.g. `a.out` or `app.exe`)**.

The final executable contains **machine code** for a particular platform. Therefore:

- A macOS executable is for macOS.
- A Linux executable is for Linux.
- A Windows executable is for Windows.

This is why the lecture labels C++ as **platform dependent / not portable**.

### Java: platform-independent bytecode

Java starts from `.java` source files, and the Java compiler produces `.class` files.

A `.class` file contains **bytecode**, not native machine code. The user runs the program through a JVM installed for their platform: **`.java` source → `javac` compiler → `.class` bytecode → a JVM for macOS / Linux / Windows → native execution on that machine**.

This is why the lecture labels Java as **platform independent / portable**.

The portability is not magic. It comes from moving the platform-specific part into the JVM. Each platform needs its own JVM implementation, but the same `.class` file can be fed to those JVMs.

## The JVM at a glance

Before we trace bytecode through it, here is the whole machine at once. The lecture diagram separates the JVM into three major parts -- **class loaders**, **runtime areas**, and an **execution engine** -- plus the **Java Native Interface (JNI)** that bridges out to platform-native libraries (`.dll`, `.so`, `.dylib`):

```artifact src=demos/jvm-architecture-map.jsx static
```

Keep this map in view: every section that follows zooms into **one box** of it, and each box maps onto a stage of the seven-step table above. The two *machine models* next fill in the **runtime areas** (stacks, heap, method area). *Class loading* and *verification* are the **class loaders** (the *load* and *verify* stages). The interpreter, JIT, and garbage collector are the **execution engine** (*execute*, *optimize*, *reclaim*). And a `native` call crosses **JNI**.

## Physical machine versus virtual machine

The lecture contrasts a **physical machine** with a **virtual machine**.

### Physical machine model

In the C++ physical-machine picture: **source code → compiler → assembly code → assembler → machine code → CPU**.

The assembly code is close to the physical CPU's instruction set. The lecture diagram uses register-style operations such as:

```asm
mov $5, %rbx
mov $7, %rcx
mov $0, %rax
add %rbx, %rax
add %rcx, %rax
```

The machine has:

- a **CPU**, including components such as a control unit and arithmetic logic unit,
- **registers**, used directly by native instructions,
- **RAM**, containing areas such as stack, heap, global/static storage, and code,
- persistent storage, such as an HDD/SSD.

This is a **register-based** execution model: instructions often name registers explicitly.

### Virtual machine model

In the Java virtual-machine picture: **`.java` source → compiler → `.class` bytecode → JVM**.

The `.class` file contains bytecode plus other class metadata. The lecture diagram uses stack-style bytecode such as `iload_1`, `iload_2`, `iadd`, `ireturn`.

The JVM is a **software machine**. It defines a virtual instruction set, virtual runtime memory areas, and rules for loading and executing bytecode. The physical CPU still does the final work, but Java bytecode is not itself the physical CPU's native instruction set.

The JVM model is largely **stack-based**: many bytecode operations push values onto, or pop values from, an operand stack.

The contrast with the register machine above is easiest to see side by side -- the **same** sum `a + b` computed both ways. The register machine names every operand (`add %rbx, %rax`); the stack machine names none, leaving them implicit on the operand stack:

```artifact src=demos/register-vs-stack.jsx static
```

That is exactly why bytecode names no registers: it needn't know how many a given CPU has -- the JVM maps the operand stack onto real registers when it runs. The trace below steps through the stack machine on its own, `iload`/`iadd`/`ireturn` over one operand stack:

```artifact src=demos/jvm-operand-stack.jsx
```

### The life of an object: `NEW` / `STORE` / `DESCRIBE`

The operand-stack trace above is pure arithmetic. Object creation adds two more
regions: the **Method Area** (the class blueprint) and the **Heap** (the object
itself). Step through the workshop's Program A -- `new Point()`, set `x` and `y`,
print -- and watch each JVM region light up as its opcode runs:

```artifact src=demos/jvm-object-lifecycle.jsx
```

The key move is `NEW`: it reads the blueprint from the Method Area, allocates the
object on the Heap, and pushes a **reference** onto the operand stack. Every later
field access follows that reference. When the reference goes away, the object
becomes unreachable -- the hand-off to garbage collection.

## Inside the JVM: the three subsystems

Now we zoom into each box of the map above ("The JVM at a glance"), in the order a class meets them: the **class loaders** bring it in, the **runtime areas** hold its state, and the **execution engine** runs its bytecode -- with **JNI** as the exit to native code.

### Class loaders

The lecture names three loaders:

| Loader | What it loads |
|---|---|
| Bootstrap loader | standard packages such as `java.lang`, `java.util`, etc., from the core runtime archive, historically shown as `rt.jar` |
| Application loader | files in the class path, including your own `.class` files |
| Extension loader | optional libraries installed into the runtime extension area, historically `jre/lib/ext` (note: the core `java.sql` JDBC API is *not* an extension -- it is a platform package loaded by the bootstrap loader) |

The job of a class loader is to bring class definitions into the JVM so they can be verified, linked, initialized, and executed.

The three loaders form a **parent-first delegation** chain. A loader does not
load a requested class immediately -- it first asks its parent, which asks *its*
parent, up to the bootstrap loader. Only if every ancestor fails does the
original loader load the class itself:

**application → extension / platform → bootstrap** (ask upward), then load on the
way back down.

This guarantees the core classes are loaded once by the trusted bootstrap loader:
a `java.lang.String` you drop on the class path can never shadow or spoof the
real one, because the bootstrap loader answers first.

### Verification

Before any bytecode runs, the JVM **verifies** each loaded `.class` during the
link step (the `verify` in load → link → initialize). Verification rejects
malformed or hostile bytecode up front, so the interpreter and JIT can then run
it without re-checking safety on every instruction. It confirms, among other
things:

- the bytecode is **well-formed** and its constant-pool references are valid;
- the **operand stack** never underflows or overflows, and the types on it match
  each instruction (no using an `int` where a reference is required);
- every **branch** targets a real instruction inside the method;
- **access rules** hold (for example, a `final` class is never subclassed).

This is why a `.class` produced by a different -- or malicious -- tool still
cannot corrupt the JVM: it must pass the same verification as any other.

### Runtime areas

The lecture JVM memory diagram includes the following areas:

| JVM area | Role |
|---|---|
| Stack Area | one stack per thread; stores stack frames for method calls |
| PC Register | one per thread; tracks the current bytecode instruction |
| Native Method Area / Native Method Stack | supports native-method execution |
| Heap Area | stores object data |
| Method Area | stores class-level information loaded from `.class` files, including method/class metadata |

The slide marks:

- **stack for every thread** near the Stack Area,
- **address of current instruction** near the PC Register,
- **stack for native method code** near the native-method area,
- **object data** near the Heap Area,
- **input class** near the Method Area.

### Execution engine

The execution engine is responsible for making bytecode run. The lecture lists:

| Component | Role |
|---|---|
| Interpreter | interprets bytecode, finds the corresponding native operation, and executes it |
| JIT compiler | provides native code for repeated/hot methods |
| Garbage collector | reclaims the memory of objects that are no longer *reachable* from the live program (not merely "unreferenced" -- an isolated cycle of objects that reference each other is still collected) |

The interpreter runs a **fetch-decode-execute** loop: read the opcode the PC
register points at, decode it to the matching operation, execute it against the
operand stack and heap, then advance the PC to the next instruction.

The interpreter and JIT compiler are not an either/or choice. Every method starts interpreted (fast startup), and once it becomes *hot* the JIT compiles it to native code for the remaining calls:

```artifact src=demos/interp-jit-tiers.jsx static
```

The garbage collector keeps whatever is **reachable** from a GC root and reclaims the rest. "Reachable" is the operative word, not "referenced": a self-referential island of garbage is still garbage.

Reclamation is two phases: a **mark** phase walks outward from the GC roots and
flags every reachable object, then a **sweep** phase frees everything left
unmarked. Because marking starts from the roots and follows references, a
self-referential island with no path from a root is never marked -- and is
therefore swept.

```artifact src=demos/gc-reachability.jsx static
```

The important idea is that Java execution is not simply "source code runs on the CPU." Instead: **source code → bytecode → JVM loading/runtime/execution machinery → native work on the physical machine**.

### Native calls (JNI)

Some methods are declared `native`: their body is not bytecode but compiled
native code in a platform library (`.so` on Linux, `.dll` on Windows, `.dylib`
on macOS). Calling one crosses the **Java Native Interface (JNI)** -- the thread
leaves the ordinary bytecode path, uses its **native method stack** instead of
the usual JVM stack, runs the native function, and returns the result back into
bytecode execution.

JNI is the managed runtime's escape hatch: it is how Java reaches operating-system
and hardware facilities (file I/O, graphics, vendor libraries) that pure bytecode
cannot express. It is also where portability stops -- the native library is
platform-specific, so a program that calls into one is only as portable as that
library.

## What to retain from L11

For exam-style questions, the most important distinctions are:

| Topic | Key test point |
|---|---|
| C++ execution | C++ compiles to platform-specific native machine code |
| Java execution | Java compiles to platform-independent bytecode, then a platform-specific JVM runs that bytecode |
| Bytecode | `.class` files contain JVM instructions and class metadata, not native machine instructions |
| Physical machine | real CPU, registers, RAM, stack, heap, code, and storage executing native instructions |
| Virtual machine | software-defined instruction set, runtime memory areas, and execution rules |
| JVM internals | class loaders, runtime areas, execution engine, and JNI |
| Class loading | parent-first delegation loads core classes once via the trusted bootstrap loader |
| Verification | the link-time safety check that lets bytecode run without per-instruction checks |
| Object creation | `NEW` reads the Method-Area blueprint, allocates on the Heap, pushes a reference |
| JNI | `native` methods cross to a platform library via the native method stack; portability stops there |
| Garbage collection | mark reachable objects from the roots, then sweep the unmarked |
| Runtime areas | stack area, PC register, native method area/stack, heap area, and method area |
| Execution engine | interpreter, JIT compiler, and garbage collector cooperate to execute bytecode |

## Practice

```artifact src=demos/practice-11-compare.jsx
```

```artifact src=demos/practice-11-predict.jsx
```

```artifact src=demos/practice-11-mcq.jsx
```
