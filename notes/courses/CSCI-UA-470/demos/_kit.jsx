import React from "react";
import { Button, useTheme } from "@kit";
import { seededShuffle, gradeOrder, hashSeed } from "@course/seq-order";

/* ============================================================
   Shared textbook memory model for CSCI-UA-470.
   - MemoryModel: the canonical 4-segment diagram (Stack / Heap /
     Global-Static / Code) with cells and pointer/reference arrows.
   - MemoryScene: a stepper that pairs a code panel with the model.
   Reused across lecture notes; each note feeds it its own steps.
   ============================================================ */

const LANGS = {
  cpp: {
    kw: new Set(["return", "using", "namespace", "new", "delete", "class", "struct",
      "public", "private", "protected", "friend", "static", "const", "virtual",
      "operator", "template", "typename", "this", "if", "else", "for", "while",
      "include", "define", "ifdef", "ifndef", "endif", "undef", "override", "final",
      "nullptr", "NULL", "true", "false"]),
    ty: new Set(["int", "char", "double", "float", "bool", "void", "unsigned",
      "long", "short", "auto", "string", "ostream", "istream"]),
    bi: new Set(["cout", "cin", "endl", "std", "main"]),
  },
  java: {
    kw: new Set(["package", "import", "public", "private", "protected", "class",
      "interface", "enum", "extends", "implements", "abstract", "final", "static",
      "native", "synchronized", "return", "new", "this", "super", "void",
      "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
      "try", "catch", "finally", "throw", "throws", "instanceof",
      "null", "true", "false"]),
    ty: new Set(["int", "long", "short", "byte", "char", "boolean", "float", "double", "var"]),
    bi: new Set(["out", "err", "println", "print", "args", "length", "main"]),
  },
};

function classifyWord(w, L) {
  if (L.kw.has(w)) return "mm-tok-kw";
  if (L.ty.has(w)) return "mm-tok-ty";
  if (L.bi.has(w)) return "mm-tok-fn";
  if (/^[A-Z]/.test(w)) return "mm-tok-ty";   // user-defined types: Circle, Person, String, …
  return undefined;
}

// Drive a tokenizer: scan `line` with a global regex and wrap each match in a
// <span> whose class comes from classify(match). Shared by code + asm below.
function tokenize(line, re, classify) {
  const out = [];
  let m, k = 0;
  while ((m = re.exec(line)) !== null) out.push(<span key={k++} className={classify(m)}>{m[0]}</span>);
  return out;
}

const CODE_RE = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(#[A-Za-z]+)|(\b\d+\.?\d*[fFlLdD]?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_"'])/g;

// Tokenize one line of C++/Java into highlighted <span>s.
function highlightCode(line, lang = "cpp") {
  const L = LANGS[lang] || LANGS.cpp;
  return tokenize(line, CODE_RE, (m) =>
    m[1] ? "mm-tok-com" : (m[2] || m[3]) ? "mm-tok-str" : m[4] ? "mm-tok-pre"
      : m[5] ? "mm-tok-num" : m[6] ? classifyWord(m[6], L) : undefined);
}

// x86-64 (Intel-syntax) mnemonics and registers we tokenize in curated asm.
const ASM_MNEMONICS = new Set(["mov", "movabs", "lea", "push", "pop", "call",
  "ret", "leave", "jmp", "je", "jne", "jl", "jg", "jle", "jge", "cmp", "test",
  "add", "sub", "imul", "mul", "xor", "and", "or", "shl", "shr", "sar", "inc",
  "dec", "nop", "cdqe", "cqo", "syscall"]);
const ASM_REGS = new Set(["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp",
  "rip", "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15",
  "eax", "ebx", "ecx", "edx", "esi", "edi", "ebp", "esp",
  "r8d", "r9d", "al", "bl", "cl", "dl"]);

const ASM_RE = /([#;].*$)|(\b0x[0-9a-fA-F]+\b)|(\$?-?\b\d+\b)|([A-Za-z_.][\w.$:]*)|(\s+)|([^\sA-Za-z0-9_"'])/g;

// Tokenize one line of curated x86-64 assembly, reusing the C++ token colours:
// mnemonic->kw, register->ty, number/offset->num, label (ends ':')->fn, comment->com.
function highlightAsm(line) {
  return tokenize(line, ASM_RE, (m) => {
    if (m[1]) return "mm-tok-com";
    if (m[2] || m[3]) return "mm-tok-num";
    if (m[4]) {
      const w = m[4].replace(/^%/, "").toLowerCase();
      return ASM_MNEMONICS.has(w) ? "mm-tok-kw" : ASM_REGS.has(w) ? "mm-tok-ty"
        : m[4].endsWith(":") ? "mm-tok-fn" : undefined;
    }
    return undefined;
  });
}

// JVM bytecode mnemonics we tokenize in `javap -c` output. Prefixed forms
// (iload_1, aload_0, …) are matched by stripping the trailing _N, so this set
// stays small.
const BYTECODE_OPS = new Set(["aload", "astore", "iload", "istore", "lload", "dload",
  "fload", "aconst", "iconst", "bipush", "sipush", "ldc", "dup", "pop", "pop2", "swap",
  "iadd", "isub", "imul", "idiv", "irem", "ineg", "ladd", "dadd", "dsub", "dmul",
  "iinc", "i2d", "i2l", "d2i", "new", "newarray", "anewarray", "getfield", "putfield",
  "getstatic", "putstatic", "invokevirtual", "invokespecial", "invokestatic",
  "invokeinterface", "invokedynamic", "checkcast", "instanceof", "athrow",
  "ireturn", "lreturn", "dreturn", "areturn", "return",
  "goto", "if_icmpge", "if_icmpgt", "if_icmple", "if_icmplt", "if_icmpeq", "if_icmpne",
  "ifeq", "ifne", "iflt", "ifge", "ifgt", "ifle", "ifnull", "ifnonnull"]);

// An instruction line: "  9: invokevirtual #10   // Method Shape.draw:()V"
// Every alternative below must cover SOME token, including bare operands
// (`bipush 7`, `goto 12`): tokenize() silently DROPS text no alternative matches.
const BC_INSTR = /^\s*\d+:\s/;
const BC_RE = /(\/\/[^\n]*)|(^\s*\d+:)|(#\d+)|(\b\d+\b)|([A-Za-z_][\w$]*)|(\s+)|([^\sA-Za-z0-9_])/g;

// Tokenize one line of `javap -c` output. Instruction lines (offset-prefixed) get
// opcode/constant-pool colouring; every other line (class/method declarations,
// "Code:") is a Java-ish declaration, so it reuses the Java tokenizer.
function highlightBytecode(line) {
  if (!BC_INSTR.test(line)) return highlightCode(line, "java");
  return tokenize(line, BC_RE, (m) => {
    if (m[1]) return "mm-tok-com";                       // // Method Shape.draw:()V
    if (m[2]) return "mm-tok-num";                       // the byte offset "9:"
    if (m[3]) return "mm-tok-num";                       // constant-pool ref "#10"
    if (m[4]) return "mm-tok-num";                       // bare operand: bipush 7, goto 12
    if (m[5]) {
      const w = m[5].replace(/_\d+$/, "").toLowerCase(); // iload_1 -> iload
      return BYTECODE_OPS.has(w) ? "mm-tok-kw" : undefined;
    }
    return undefined;
  });
}

// Pick the tokenizer for a language; "asm" gets the x86 highlighter, else C-family.
const highlight = (line, lang) =>
  lang === "asm" ? highlightAsm(line)
    : lang === "bytecode" ? highlightBytecode(line)
    : highlightCode(line, lang);

// A curated-asm line beginning with "…" is an elision row (muted, non-mappable).
const isElision = (ln) => /^\s*…/.test(ln);

// Expand code sentinels (\0 N \0) in an already-emphasis-parsed string back
// into <code> elements, leaving the surrounding text as-is.
function expandCodes(str, codes, kp) {
  return String(str).split(/\u0000(\d+)\u0000/).map((p, i) =>
    i % 2 === 1
      ? <code key={kp + "c" + i} className="mm-ic">{codes[+p]}</code>
      : <React.Fragment key={kp + "t" + i}>{p}</React.Fragment>
  );
}
// Render a caption with composable inline markdown: `code`, **bold**, *italic*.
// Code spans are masked out before emphasis parsing, so the two COMPOSE — e.g.
// **`x`** renders as bold code, and **a `b` c** bolds the whole run incl. code.
function renderCaption(text) {
  const codes = [];
  const masked = String(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c); return "\u0000" + (codes.length - 1) + "\u0000";
  });
  const out = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(masked)) !== null) {
    if (m.index > last) out.push(<React.Fragment key={"t" + k}>{expandCodes(masked.slice(last, m.index), codes, "t" + k)}</React.Fragment>);
    if (m[1] != null) out.push(<strong key={"b" + k}>{expandCodes(m[1], codes, "b" + k)}</strong>);
    else out.push(<em key={"i" + k}>{expandCodes(m[2], codes, "i" + k)}</em>);
    last = re.lastIndex; k++;
  }
  if (last < masked.length) out.push(<React.Fragment key={"t" + k}>{expandCodes(masked.slice(last), codes, "t" + k)}</React.Fragment>);
  return out;
}

/* ---- cell factories (terser demo authoring) ----
   stack("x", "int", 5, { hl: true })           a stack variable
   heap("", "int", 42, { id: "h" })             an (unnamed) heap cell
   glob("g", "int", 10)  ·  text("f1", "int()", "…")   global / code-segment
   opts: { id, addr, to, link, hl, reclaimed, destroyed, toNull }.  `to` makes it a pointer to that
   cell's id (link defaults to "ptr"; pass link:"ref" for a reference).      */
const NULL_ID = "⌀null";   // sentinel target id for the shared nullptr sink
const mkCell = (region) => (name, type, value, opts = {}) => ({
  id: opts.id || name,
  region, name, type,
  value: value == null ? "" : String(value),
  addr: opts.addr,
  size: opts.size,          // explicit byte size (overrides derivation)
  fields: opts.fields,      // member list -> derived padded sizeof
  vptr: opts.vptr,          // class has a virtual -> hidden vptr (+8)
  vptrOrigin: opts.vptrOrigin,  // class the vptr belongs to (subobject colouring)
  header: opts.header,      // object header bytes (e.g. Java)
  pointsTo: opts.to != null ? opts.to : (opts.toNull ? NULL_ID : undefined),
  link: (opts.to != null || opts.toNull) ? (opts.link || "ptr") : opts.link,
  highlight: opts.hl,
  reclaimed: opts.reclaimed,
  destroyed: opts.destroyed,
});
export const stack = mkCell("stack");
export const heap = mkCell("heap");
export const glob = mkCell("global");
export const text = mkCell("code");

// JVM runtime-area cell factories (note 11 mini-VM). Reuse the segment machinery
// with JVM region keys; the `heap` factory above doubles as the JVM Heap area.
export const methodArea = mkCell("method");
export const opstack = mkCell("opstack");
export const pcreg = mkCell("pc");

/* ---- higher-level builders (compose the cell factories above) ----
   These turn the repeated demo boilerplate into named blocks so a scene
   reads as "define the shape once, stamp instances per step". */

// An object/struct cell from a reusable field spec. Define the shape once,
// then stamp instances per step. Values may be positional (spec order) or
// keyed by field name; `base` carries fixed opts (region, vptr, header).
//   const circle = obj("circle", [{ name: "color", type: "string", size: 32 },
//                                  { name: "radius", type: "double" }]);
//   circle("c1", ["red", 10], { hl: true })          // positional values
//   circle("c1", { color: "red", radius: 10 })       // …or by field name
export function obj(type, fields, base = {}) {
  const make = mkCell(base.region || "stack");
  return (id, vals = [], opts = {}) => make(id, type, "", {
    ...base, ...opts,
    fields: fields.map((f, i) => ({ ...f, value: Array.isArray(vals) ? vals[i] : (vals ? vals[f.name] : undefined) })),
  });
}

// A single object laid out as its inheritance chain. Each layer's fields are
// tagged with the declaring class, so the byte strip is colour-grouped by
// subobject (base first, derived appended) — the actual in-memory layout.
//   const studentObj = derived([
//     { cls: "person",  vptr: true, fields: [{ name: "name", type: "string", size: 32 }] },
//     { cls: "student", fields: [{ name: "age", type: "int" }] },
//   ]);
//   studentObj("s", { name: '"James"', age: "20" }, { hl: true })
export function derived(layers, base = {}) {
  const type = layers[layers.length - 1].cls;        // most-derived class names the object
  const vlayer = layers.find((L) => L.vptr);          // which layer introduces the vptr
  const fields = layers.flatMap((L) => (L.fields || []).map((f) => ({ ...f, origin: L.cls })));
  const make = mkCell(base.region || "stack");
  return (id, vals = {}, opts = {}) => make(id, type, "", {
    ...base, ...opts,
    vptr: vlayer ? vlayer.vptr : undefined,           // true = slot only; string = points at that vtable id
    vptrOrigin: vlayer ? vlayer.cls : undefined,
    fields: fields.map((f, i) => ({ ...f, value: Array.isArray(vals) ? vals[i] : (vals ? vals[f.name] : undefined) })),
  });
}

// A fixed sub-object "part" card for construction/destruction order. Carries
// its member(s) as `fields`, so it shows the same value+byte strip as any
// object card (not a plain text line). Only toggles highlight / destroyed per step:
//   const PP = part("(person)", "base part", [{ name: "name", type: "string", size: 32, value: '"james"' }], "pp");
//   PP(true)          -> highlighted          PP(true, true) -> highlighted + destroyed
export function part(label, type, fields, id, region = "stack") {
  const make = mkCell(region);
  // a destroyed sub-object: its dtor has run (members gone), so show its now-stale
  // member value struck through rather than a live byte strip.
  return (hl, destroyed) => make(label, type, destroyed ? fields.map((f) => f.value).filter((v) => v != null).join(", ") : "", { id, hl, destroyed, fields });
}

// Highlight exactly one cell (by id) out of a fixed set, dimming the rest:
//   const hl = spotlight(baseCells);   hl("sage") -> that cell highlighted
export function spotlight(cells) {
  return (id) => cells.map((c) => ({ ...c, highlight: c.id === id }));
}

// Accumulating console output: ladder(lines)(n) = the first n lines as rows.
//   const out = ladder(["A", "B", "C"]);   out(2) -> rows for A and B
export function ladder(lines) {
  return (n) => lines.slice(0, n).map((result) => ({ expr: "", result }));
}

/* ---- object byte-layout ("how big is this object?") ----
   Typical sizes; scalars align to their own size (capped at 8). A struct's
   size rounds up to its largest member's alignment. Java objects add a header
   (~12 B) and round to 8. */
const TYPE_SIZE = {
  bool: 1, char: 1, byte: 1, boolean: 1, short: 2, int: 4, float: 4, unsigned: 4,
  long: 8, double: 8, "long long": 8, pointer: 8, ptr: 8, ref: 8, reference: 8,
};

// A memory cell's width reflects its DERIVED sizeof. Order of preference:
//   1. explicit `size`
//   2. `fields` -> sizeLayout(...).total  (proper alignment + padding, +vptr/header)
//   3. a pointer/reference type -> 8, or a primitive from the table above
//   4. otherwise unknown -> default uniform width
function cellBytes(cell) {
  if (cell.size != null) return cell.size;
  if (cell.fields || cell.vptr || cell.header) return sizeLayout(cell.fields || [], { vptr: cell.vptr, header: cell.header }).total;
  const t = cell.type;
  if (!t) return null;
  if (/[*&]/.test(t)) return 8;                 // pointer / reference / function pointer
  return TYPE_SIZE[t] != null ? TYPE_SIZE[t] : null;
}
// Cell width tracks byte size so cells read proportionally (a double is visibly
// wider than an int, a string wider still). A small base + steeper slope keeps
// the proportion legible across the common 1..48 B range; the floor keeps the
// smallest cells readable (type badge + value), the ceiling bounds big objects.
//   1 B -> 3.40   4 B (int) -> 3.60   8 B (double/ptr) -> 5.20
//   16 B (vtable) -> 8.40   32 B (string) -> 14.80   40+ B (object) -> 15.00
function cellWidthRem(bytes) {
  return bytes == null ? null : Math.max(3.4, Math.min(15, 2.0 + bytes * 0.4));
}

export function sizeLayout(fields, opts = {}) {
  const header = opts.header || 0;
  let offset = 0;
  let maxAlign = Math.max(1, opts.minAlign || ((header || opts.vptr) ? 8 : 1));
  const blocks = [];
  // map each distinct declaring class (origin) to a colour index, in layout order
  const origins = [];
  const subOf = (o) => {
    if (o == null) return undefined;
    let i = origins.indexOf(o);
    if (i < 0) { i = origins.length; origins.push(o); }
    return i;
  };
  if (header) { blocks.push({ kind: "header", size: header, offset }); offset += header; }
  if (opts.vptr) {   // hidden vtable pointer; a string value means it points at that cell id
    blocks.push({ kind: "vptr", size: 8, offset, to: typeof opts.vptr === "string" ? opts.vptr : undefined, link: "ptr", sub: subOf(opts.vptrOrigin) });
    offset += 8;
  }
  fields.forEach((f) => {
    const size = f.size != null ? f.size : (TYPE_SIZE[f.type] != null ? TYPE_SIZE[f.type] : 4);
    const align = Math.min(size, 8);
    maxAlign = Math.max(maxAlign, align);
    const rem = offset % align;
    if (rem !== 0) { blocks.push({ kind: "pad", size: align - rem, offset }); offset += align - rem; }
    blocks.push({ kind: f.kind || "field", name: f.name, type: f.type, size, offset, to: f.to, link: f.link, value: f.value, sub: subOf(f.origin), anchor: f.anchor, hl: f.hl });
    offset += size;
  });
  const total = Math.ceil(offset / maxAlign) * maxAlign;
  if (total > offset) blocks.push({ kind: "pad", size: total - offset, offset });
  return { blocks, total, align: maxAlign, origins };
}

// The proportional field strip (fields + vptr/header + padding) — shared by the
// standalone SizeLayout and the in-cell "physical mapping" row.
function LayoutBar({ fields = [], vptr, header, vptrOrigin, cellId, regRef, variant = "mem" }) {
  const value = variant === "value";
  const { blocks } = sizeLayout(fields, { vptr, header, vptrOrigin });
  return (
    <div className={"mm-layout__bar" + (value ? " mm-layout__bar--value" : "")}>
      {blocks.map((b, i) => {
        const cls = ["mm-layout__block", "mm-layout__block--" + b.kind];
        if (!value && b.to) cls.push("mm-layout__block--ptr");
        if (!value && b.sub != null) cls.push("mm-layout__block--sub" + b.sub);
        return (
        <div key={i}
          ref={!value && regRef ? (el => { regRef("b:" + cellId + ":" + i, el); if (b.anchor) regRef(b.anchor, el); }) : undefined}
          className={cls.join(" ")}
          style={{ flexGrow: b.size }}
          title={(b.name || b.kind) + " · " + b.size + " B @ +" + b.offset + (b.value != null ? " = " + b.value : "")}>
          {value
            ? <span className="mm-layout__val" title={b.value != null ? String(b.value) : undefined}>{b.value != null ? String(b.value) : ""}</span>
            : <span className="mm-layout__lbl">{b.name ? b.name : b.kind}</span>}
          {value ? null : <span className="mm-layout__sz">{b.size}</span>}
        </div>
      );
      })}
    </div>
  );
}

export function SizeLayout({ title, fields, lang = "cpp", header, vptr }) {
  const hdr = header != null ? header : (lang === "java" ? 12 : 0);
  const { total, align } = sizeLayout(fields, { header: hdr, vptr });
  return (
    <div className="mm-layout">
      {title ? <div className="mm-layout__title">{title}</div> : null}
      <LayoutBar fields={fields} vptr={vptr} header={hdr} />
      <div className="mm-layout__foot">
        <span>{lang === "java" ? "object size" : "sizeof"} = <b>{total} bytes</b></span>
        <span className="mm-layout__align">aligned to {align}</span>
      </div>
    </div>
  );
}

// Stack several SizeLayout cards — the common "compare these structs" block.
//   <SizeCompare items={[{ title, fields }, { title, fields, vptr }]} />
export function SizeCompare({ items = [], lang = "cpp" }) {
  return (
    <div className="mm-sizes">
      {items.map((it, i) => <SizeLayout key={i} lang={lang} {...it} />)}
    </div>
  );
}

const SEGMENTS = [
  { key: "stack",  label: "Stack",           hint: "locals & args · auto, LIFO" },
  { key: "heap",   label: "Heap",            hint: "new / delete · manual lifetime" },
  { key: "global", label: "Global / Static", hint: "globals, statics, literals" },
  { key: "code",   label: "Code",            hint: "machine instructions · read-only" },
];

function Cell({ cell, attachRef, regRef, onEnter, onLeave }) {
  const isPtr = cell.pointsTo != null || cell.kind === "ptr" || cell.kind === "ref";
  const cls = [
    "mm-cell",
    isPtr ? "mm-cell--ptr" : "",
    cell.kind === "ref" ? "mm-cell--ref" : "",
    cell.highlight ? "mm-cell--hl" : "",
    cell.reclaimed ? "mm-cell--reclaimed" : "",
    cell.destroyed ? "mm-cell--destroyed" : "",
  ].filter(Boolean).join(" ");
  const bytes = cellBytes(cell);
  const w = cellWidthRem(bytes);
  const style = w != null ? { width: w.toFixed(2) + "rem" } : undefined;
  // every sized cell gets a mapping row; a basic type is just a single block.
  // a scalar's stored value rides on its synthetic block so the value row lines up.
  const stripFields = cell.fields || (bytes != null ? [{ name: cell.type || "", size: bytes, value: cell.value }] : null);
  const showStrip = !cell.reclaimed && !cell.destroyed && (stripFields || cell.vptr || cell.header);
  // hover anywhere on the cell to reveal its full identity (the floating
  // tooltip is owned by MemoryModel so it can escape the cell's overflow:hidden).
  return (
    <div ref={attachRef} className={cls} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="mm-cell__top">
        {cell.name
          ? <span className="mm-cell__name">{cell.name}</span>
          : <span className="mm-cell__name mm-cell__name--anon">(unnamed)</span>}
      </div>
      {cell.type ? (
        <div className="mm-cell__typerow">
          <span className="mm-cell__type">{cell.type}</span>
        </div>
      ) : null}
      {cell.reclaimed || cell.destroyed
        ? <div className="mm-cell__value mm-cell__value--reclaimed">{cell.value}</div>
        : (cell.value && !showStrip)
          ? <div className="mm-cell__value">{cell.value}</div>
          : null}
      {cell.addr ? <div className="mm-cell__meta"><span className="mm-cell__addr">{cell.addr}</span></div> : null}
      {showStrip ? (
        <div className="mm-cell__table">
          <LayoutBar fields={stripFields} vptr={cell.vptr} header={cell.header} vptrOrigin={cell.vptrOrigin} variant="value" />
          <LayoutBar fields={stripFields} vptr={cell.vptr} header={cell.header} vptrOrigin={cell.vptrOrigin} variant="mem" cellId={cell.id} regRef={regRef} />
        </div>
      ) : null}
    </div>
  );
}

export function MemoryModel({ cells = [], axis = true, regions = null, legend = null, segments = null, active = null }) {
  const wrapRef = React.useRef(null);
  const refs = React.useRef({});
  const [lines, setLines] = React.useState([]);
  const [tip, setTip] = React.useState(null);   // hover tooltip: { left, top, above, lines }
  const theme = useTheme();

  // re-measure whenever the meaningful shape of the scene changes
  const sig = JSON.stringify(
    cells.map((c) => [c.id, c.region, c.pointsTo, c.link, c.reclaimed, c.destroyed, c.value, c.vptr, c.header,
      c.fields && c.fields.map((f) => [f.name, f.size, f.type, f.to, f.link])])
  );

  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const compute = () => {
      const W = wrap.getBoundingClientRect();
      const rel = (r) => ({
        l: r.left - W.left, r: r.right - W.left, t: r.top - W.top, b: r.bottom - W.top,
        cx: r.left + r.width / 2 - W.left, cy: r.top + r.height / 2 - W.top, h: r.height, w: r.width,
      });
      // route from source to target along cell/block edges (out of the interiors).
      // When N>=2 links share one target, `idx`/`count` fan the TARGET-SIDE anchor
      // apart so the arrows stay visually distinct (single-link calls pass neither
      // -> idx 0, count 1 -> zero offset -> identical to before).
      const geom = (A, B, idx = 0, count = 1) => {
        const dy = B.cy - A.cy;
        let sx, sy, ex, ey, c1x, c1y, c2x, c2y;
        // fan spread along the target's facing edge; centred so the group straddles
        // the true anchor (idx - (count-1)/2 runs symmetric about 0).
        const fan = idx - (count - 1) / 2;
        const overlapY = Math.min(A.b, B.b) - Math.max(A.t, B.t);
        if (overlapY > Math.min(A.h, B.h) * 0.5) {
          // same row (their vertical spans overlap): a short, flat link between the
          // facing edges, centred on the shared band. Works when the source is a
          // small field block low in a tall cell (its String sits to the right),
          // and the arc never dips down into the row below.
          const toLeft = B.cx < A.cx;
          const my = (Math.max(A.t, B.t) + Math.min(A.b, B.b)) / 2;
          const espread = Math.min(B.h / (count + 1), 16);
          sx = toLeft ? A.l : A.r; sy = my;
          ex = toLeft ? B.r : B.l; ey = my + fan * espread;
          c1x = sx + (ex - sx) / 3; c1y = sy; c2x = sx + 2 * (ex - sx) / 3; c2y = ey;
        } else {
          const down = dy > 0;
          const espread = Math.min(B.w / (count + 1), 16);
          sx = A.cx; sy = down ? A.b : A.t;
          ex = B.cx + fan * espread; ey = down ? B.t : B.b;
          const my = (sy + ey) / 2;
          c1x = sx; c1y = my; c2x = ex; c2y = my;
        }
        return { dot: { x: sx, y: sy }, d: `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}` };
      };
      const next = [];
      const reclaimedIds = new Set(cells.filter((c) => c.reclaimed).map((c) => c.id));
      // collect link requests first; geometry is computed AFTER grouping by target
      // so we know how many arrows share a target and can fan them apart.
      const reqs = [];
      const add = (id, srcEl, tgtId, link) => {
        const t = refs.current[tgtId];
        if (!srcEl || !t) return;
        reqs.push({ id, srcEl, tgtId, link, srcRect: rel(srcEl.getBoundingClientRect()), tgtRect: rel(t.getBoundingClientRect()) });
      };
      cells.forEach((c) => {
        if (c.reclaimed || c.destroyed) return;
        // a raw pointer: the whole cell is the source
        if (c.pointsTo != null) add("c:" + c.id, refs.current[c.id], c.pointsTo, c.link);
        // an object: each pointing field / vptr block is its own source (linked-list style)
        if (c.fields || typeof c.vptr === "string") {
          const { blocks } = sizeLayout(c.fields || [], { vptr: c.vptr, header: c.header });
          blocks.forEach((blk, i) => {
            if (blk.to) add("b:" + c.id + ":" + i, refs.current["b:" + c.id + ":" + i], blk.to, blk.link);
          });
        }
      });
      // group requests by target id, then emit. A lone target keeps today's geometry
      // exactly; a shared target fans its endpoints, sorted left->right by source x
      // so the assignment never crosses.
      const byTgt = {};
      reqs.forEach((r) => { (byTgt[r.tgtId] = byTgt[r.tgtId] || []).push(r); });
      Object.keys(byTgt).forEach((tgtId) => {
        const group = byTgt[tgtId];
        if (group.length > 1) group.sort((a, b) => a.srcRect.cx - b.srcRect.cx);
        group.forEach((r, idx) => {
          const g = geom(r.srcRect, r.tgtRect, idx, group.length);
          next.push({ id: r.id, link: reclaimedIds.has(r.tgtId) ? "dangling" : (r.link || "ptr"), dot: g.dot, d: g.d });
        });
      });
      setLines(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    window.addEventListener("resize", compute);
    return () => { ro.disconnect(); window.removeEventListener("resize", compute); };
  }, [sig, theme]);

  // when the scene advances, any open tooltip refers to a now-unmounted cell
  React.useEffect(() => { setTip(null); }, [sig]);

  // The full identity to reveal on hover: label, type, then each member as
  // "name = value" (or the scalar value for a basic cell). The tooltip mirrors
  // the diagram's deletion semantics: a reclaimed/destroyed cell gets a status
  // note and its now-stale values struck through, and a pointer into freed
  // memory is flagged dangling — so hovering never implies dead memory is live.
  const tipLines = (cell) => {
    const out = [];
    if (cell.name) out.push(["id", cell.name]);
    if (cell.type) out.push(["type", cell.type]);
    const stale = cell.reclaimed || cell.destroyed;
    if (stale) {
      out.push(["note", cell.reclaimed ? "reclaimed memory" : "destroyed (lifetime ended)"]);
    } else if (cell.pointsTo != null && cells.some((c) => c.reclaimed && c.id === cell.pointsTo)) {
      out.push(["note", "dangling pointer"]);
    }
    const valKind = stale ? "stale" : "field";
    if (cell.fields && cell.fields.length) {
      cell.fields.forEach((f) => {
        const v = f.value != null && String(f.value) !== "" ? " = " + f.value : "";
        out.push([valKind, f.name + v]);
      });
    } else if (cell.value) {
      out.push([valKind, cell.value]);
    }
    return out;
  };
  // Reveal the cell's full identity on hover — always, even when the text isn't
  // clipped, so the inspect-on-hover affordance is consistent across every cell.
  const showTip = (cell, e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const lines = tipLines(cell);
    if (!lines.length) return;          // nothing to show (e.g. a bare unnamed cell)
    const el = e.currentTarget;
    const W = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const above = r.top - W.top > 64;   // flip below near the canvas top so it isn't clipped
    setTip({
      left: r.left - W.left + r.width / 2,
      top: above ? r.top - W.top - 6 : r.bottom - W.top + 6,
      above,
      lines,
    });
  };
  const hideTip = () => setTip(null);

  const byRegion = {};
  cells.forEach((c) => { (byRegion[c.region] = byRegion[c.region] || []).push(c); });

  const links = cells.flatMap((c) => {
    const ls = [];
    if (c.pointsTo != null) ls.push(c.link || "ptr");
    if (typeof c.vptr === "string") ls.push("ptr");
    if (c.fields) c.fields.forEach((f) => { if (f.to) ls.push(f.link || "ptr"); });
    return ls;
  });
  const hasPtr = links.includes("ptr");
  const hasRef = links.includes("ref");
  const reclaimedIdSet = new Set(cells.filter((c) => c.reclaimed).map((c) => c.id));
  const hasReclaimed = reclaimedIdSet.size > 0;
  const hasDangling = cells.some((c) => !c.reclaimed && c.pointsTo != null && reclaimedIdSet.has(c.pointsTo));
  const hasNull = cells.some((c) => c.pointsTo === NULL_ID);
  const hasDestroyed = cells.some((c) => c.destroyed);
  // distinct declaring classes (subobjects), in layout order -> colour-coded legend
  const subOrigins = [];
  cells.forEach((c) => {
    if (c.vptrOrigin && !subOrigins.includes(c.vptrOrigin)) subOrigins.push(c.vptrOrigin);
    (c.fields || []).forEach((f) => { if (f.origin && !subOrigins.includes(f.origin)) subOrigins.push(f.origin); });
  });
  const showLegend = legend === false ? false
    : (hasPtr || hasRef || hasReclaimed || hasDangling || hasDestroyed || subOrigins.length > 0);
  // `regions` narrows the view to a subset of segments (e.g. stack-only side-by-side
  // figures); the stack/heap gap band only makes sense when the heap is also shown.
  const baseSegs = segments || SEGMENTS;
  const segs = regions ? baseSegs.filter((s) => regions.includes(s.key)) : baseSegs;
  // the C++ stack/heap gap band ("grow toward each other") is meaningless for a
  // custom JVM segment set, so only show it for the default memory model.
  const heapVisible = !segments && segs.some((s) => s.key === "heap");
  const activeSet = new Set(active || []);
  const regRef = (key, el) => { refs.current[key] = el; };   // for field/vptr block anchors

  return (
    <div className="mm">
      <div className="mm-canvas" ref={wrapRef}>
        <svg className="mm-arrows" aria-hidden="true">
          <defs>
            <marker id="mm-head" markerWidth="12" markerHeight="12" refX="7.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M3,2.5 L7.5,5 L3,7.5" className="mm-head" />
            </marker>
            <marker id="mm-head-ref" markerWidth="12" markerHeight="12" refX="7.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M3,2.5 L7.5,5 L3,7.5" className="mm-head mm-head--ref" />
            </marker>
            <marker id="mm-head-dangling" markerWidth="12" markerHeight="12" refX="7.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M3,2.5 L7.5,5 L3,7.5" className="mm-head mm-head--dangling" />
            </marker>
          </defs>
          {lines.map((l) => {
            const cls = "mm-arrow" + (l.link === "ref" ? " mm-arrow--ref" : l.link === "dangling" ? " mm-arrow--dangling" : "");
            const head = l.link === "ref" ? "url(#mm-head-ref)" : l.link === "dangling" ? "url(#mm-head-dangling)" : "url(#mm-head)";
            const srcCls = "mm-arrow-src" + (l.link === "ref" ? " mm-arrow-src--ref" : l.link === "dangling" ? " mm-arrow-src--dangling" : "");
            return (
              <g key={l.id}>
                <circle cx={l.dot.x} cy={l.dot.y} r="2.5" className={srcCls} />
                <path className={cls} markerEnd={head} d={l.d} />
              </g>
            );
          })}
        </svg>

        {axis ? (
          <div className="mm-axis">
            <span className="mm-axis__cap">high</span>
            <span className="mm-axis__line" />
            <span className="mm-axis__cap">low</span>
          </div>
        ) : null}

        <div className="mm-segs">
          {segs.map((seg) => {
            const list = byRegion[seg.key] || [];
            return (
              <React.Fragment key={seg.key}>
                <div className={"mm-seg mm-seg--" + seg.key + (list.length ? "" : " mm-seg--empty") + (activeSet.has(seg.key) ? " mm-seg--active" : "")}>
                  <div className="mm-seg__head">
                    <span className="mm-seg__label">{seg.label}</span>
                    <span className="mm-seg__hint">{seg.hint}</span>
                  </div>
                  {list.length ? (
                    <div className="mm-seg__cells">
                      {list.map((c) => (
                        <Cell key={c.id} cell={c} attachRef={(el) => { refs.current[c.id] = el; }} regRef={regRef}
                          onEnter={(e) => showTip(c, e)} onLeave={hideTip} />
                      ))}
                    </div>
                  ) : null}
                </div>
                {seg.key === "stack" && heapVisible ? (
                  <div className="mm-gap">
                    {hasNull ? <span className="mm-null" ref={(el) => regRef(NULL_ID, el)}>⌀ nullptr</span> : null}
                    <span className="mm-gap__txt">free / unmapped · stack &amp; heap grow toward each other</span>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>

        {tip ? (
          <div className={"mm-tip mm-tip--" + (tip.above ? "above" : "below")}
            style={{ left: tip.left + "px", top: tip.top + "px" }} role="tooltip">
            {tip.lines.map(([k, t], i) => (
              <div key={i} className={"mm-tip__line mm-tip__" + k}>{t}</div>
            ))}
          </div>
        ) : null}
      </div>

      {showLegend ? (
        <div className="mm-legend">
          {subOrigins.map((o, i) => (
            <span className="mm-legend__item" key={"sub" + i}>
              <i className={"mm-swatch mm-swatch--sub" + i} /> {o}
            </span>
          ))}
          {hasPtr ? <span className="mm-legend__item"><i className="mm-swatch mm-swatch--ptr" /> pointer</span> : null}
          {hasRef ? <span className="mm-legend__item"><i className="mm-swatch mm-swatch--ref" /> reference (alias)</span> : null}
          {hasReclaimed ? <span className="mm-legend__item"><i className="mm-swatch mm-swatch--reclaimed" /> reclaimed memory</span> : null}
          {hasDangling ? <span className="mm-legend__item"><i className="mm-swatch mm-swatch--dangling" /> dangling pointer</span> : null}
          {hasDestroyed ? <span className="mm-legend__item"><i className="mm-swatch mm-swatch--destroyed" /> destroyed (lifetime ended)</span> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ObjectLayout — a full-width object map for inheritance/offset stories.
   A horizontal byte strip with an *aligned* offset ruler and class brackets
   beneath it (every row is byte-proportional via flex-grow + flex-basis:0, so
   columns line up with no measurement). Pointer markers sit above the strip,
   each aligned to the byte offset it targets — making "this-pointer
   adjustment" and "shared base at +N" literally visible.
     slots:    [{ name, size|type, value, origin, kind, anchor, hl }]
     pointers: [{ name, at: <byte offset>, link }]  (rendered above the strip) */
export function ObjectLayout({ title, slots = [], pointers = [], note }) {
  const { blocks, total, origins } = sizeLayout(slots, {});
  // merge consecutive same-subobject blocks into class brackets (pads are gaps)
  const groups = [];
  blocks.forEach((b) => {
    const key = b.sub == null ? null : b.sub;
    const last = groups[groups.length - 1];
    if (last && last.sub === key && key != null) last.size += b.size;
    else groups.push({ sub: key, size: b.size, label: key == null ? "" : origins[key] });
  });
  // exactly-proportional, drift-proof columns: fr tracks sized by byte count,
  // minmax(0,…) so content can never floor a track. Strip, ruler and brackets
  // all derive their tracks from the SAME byte sizes, so they cannot misalign.
  const track = (n) => "minmax(0," + (n || 0.0001) + "fr)";
  const stripCols = blocks.map((b) => track(b.size)).join(" ");
  const brkCols = groups.map((g) => track(g.size)).join(" ");
  // pointer markers: anchor each at its byte offset with a stem down to the strip;
  // box alignment avoids edge overflow, and pointers sharing an offset stagger up.
  const ptrAt = (p) => (total ? (p.at / total) * 100 : 0);
  const ptrMarks = pointers.map((p, i) => ({
    ...p,
    pct: ptrAt(p),
    lvl: pointers.slice(0, i).filter((q) => q.at === p.at).length,
    side: ptrAt(p) <= 10 ? "l" : ptrAt(p) >= 90 ? "r" : "c",
  }));
  const maxPtrLvl = ptrMarks.reduce((m, x) => Math.max(m, x.lvl), 0);
  return (
    <div className="ol">
      {title ? <div className="ol__title">{title}</div> : null}
      {ptrMarks.length ? (
        <div className="ol__ptrs" style={{ height: (2 + 1.8 * maxPtrLvl) + "rem" }}>
          {ptrMarks.map((p, i) => (
            <div className={"ol__ptr ol__ptr--" + (p.link || "ptr") + " ol__ptr--" + p.side}
              key={"p" + i} style={{ left: p.pct + "%", "--lvl": p.lvl }}>
              <span className="ol__ptr-box">
                <span className="ol__ptr-name">{p.name}</span>
                <span className="ol__ptr-off">@ +{p.at}</span>
              </span>
              <span className="ol__ptr-stem" />
            </div>
          ))}
        </div>
      ) : null}
      <div className="ol__strip" style={{ gridTemplateColumns: stripCols }}>
        {blocks.map((b, i) => {
          const cls = ["ol__cell", "ol__cell--" + b.kind];
          if (b.to) cls.push("ol__cell--ptr");
          if (b.hl) cls.push("ol__cell--hl");
          if (b.sub != null) cls.push("mm-layout__block--sub" + b.sub);
          return (
            <div key={i} className={cls.join(" ")} title={(b.name || b.kind) + " @ +" + b.offset + " · " + b.size + "B"}>
              <span className="ol__cell-lab">{b.name ? b.name : b.kind}</span>
              {b.value != null ? <span className="ol__cell-val">{String(b.value)}</span> : null}
            </div>
          );
        })}
      </div>
      <div className="ol__ruler" style={{ gridTemplateColumns: stripCols }}>
        {blocks.map((b, i) => <div key={i} className="ol__tick"><span>+{b.offset}</span></div>)}
        <span className="ol__tick-end">+{total}</span>
      </div>
      <div className="ol__brk" style={{ gridTemplateColumns: brkCols }}>
        {groups.map((g, i) => (
          <div key={i} className={"ol__grp" + (g.sub == null ? " ol__grp--gap" : " mm-layout__block--sub" + g.sub)}>
            {g.label ? <span>{g.label}</span> : null}
          </div>
        ))}
      </div>
      {note ? <div className="ol__note">{renderCaption(note)}</div> : null}
      {origins.length ? (
        <div className="mm-legend">
          {origins.map((o, i) => <span className="mm-legend__item" key={i}><i className={"mm-swatch mm-swatch--sub" + i} /> {o}</span>)}
        </div>
      ) : null}
    </div>
  );
}

// One line-numbered, syntax-highlighted block for C++ OR assembly. `activeLine`
// is the highlighted 1-based line, or an array/Set of lines (an asm group). A line
// starting with "…" renders as a muted "⋯" elision row (used by curated asm).
// Optional onHoverLine(n) reports the hovered line (null on leave) to a parent.
// Optional onPickLine(n) makes lines in `pickable` (a Set) clickable -> jump to step.
export function CodeBlock({ code, activeLine, lang = "cpp", onHoverLine, onPickLine, pickable }) {
  const lines = (code || "").split("\n");
  const isActive = activeLine instanceof Set ? (n) => activeLine.has(n)
    : Array.isArray(activeLine) ? (n) => activeLine.includes(n)
    : (n) => n === activeLine;
  return (
    <pre className="mm-code">
      {lines.map((ln, n) => {
        if (isElision(ln)) return (
          <div key={n} className="mm-code__line mm-code__line--elide">
            <span className="mm-code__ln" aria-hidden="true">⋯</span>
            <span className="mm-code__txt">{ln.replace(/^\s*…\s?/, "")}</span>
          </div>
        );
        const no = n + 1;
        const canPick = onPickLine && (!pickable || pickable.has(no));
        const h = {};
        if (onHoverLine) { h.onMouseEnter = () => onHoverLine(no); h.onMouseLeave = () => onHoverLine(null); }
        if (canPick) {
          h.onClick = () => onPickLine(no);
          h.role = "button"; h.tabIndex = 0;
          h.onKeyDown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPickLine(no); } };
        }
        const cls = "mm-code__line" + (isActive(no) ? " mm-code__line--active" : "") + (canPick ? " mm-code__line--pick" : "");
        return (
          <div key={n} className={cls} {...h}>
            <span className="mm-code__ln">{no}</span>
            <span className="mm-code__txt">{ln ? highlight(ln, lang) : " "}</span>
          </div>
        );
      })}
    </pre>
  );
}

// Dev-time guard: warn (never throw) if an asmMap entry points at a missing or
// elided asm line, so maps stay honest as the asm is edited.
function validateAsmMap(asm, asmMap) {
  if (!asm || !asmMap) return;
  const lines = String(asm).split("\n");
  const N = lines.length;
  for (const src of Object.keys(asmMap)) {
    for (const a of asmMap[src]) {
      if (a < 1 || a > N) console.warn(`[asmMap] src ${src} -> asm line ${a} out of range (1..${N})`);
      else if (isElision(lines[a - 1] || "")) console.warn(`[asmMap] src ${src} -> asm line ${a} is an elided row`);
    }
  }
}

// The left column is always the source; its header names the source language.
const SRC_LABEL = { cpp: "C++", java: "Java" };

// Side-by-side C++ | assembly with synchronized highlighting. Default highlight
// follows the stepper (activeSrcLine -> asmMap group); hovering either column
// overrides it: hover a C++ line -> its asm group; hover an asm line -> its
// source line and the whole instruction group. Mouse-leave restores the step.
export function CodeAsmPane({ code, lang = "cpp", asm, asmMap = {}, asmLabel, asmLang = "asm",
  activeSrcLine, activeAsmLine, onPickSrc, pickableSrc, onPickAsm, pickableAsm }) {
  const [hover, setHover] = React.useState(null); // {side:'src'|'asm', line} | null
  React.useEffect(() => validateAsmMap(asm, asmMap), [asm, asmMap]);
  const reverse = React.useMemo(() => {
    const r = {};
    for (const s of Object.keys(asmMap)) for (const a of asmMap[s]) r[a] = Number(s);
    return r;
  }, [asmMap]);

  let hlSrc, hlAsm;
  if (hover && hover.side === "src") {
    hlSrc = hover.line;
    hlAsm = asmMap[hover.line] || [];
  } else if (hover && hover.side === "asm") {
    const s = reverse[hover.line];
    hlSrc = s;
    hlAsm = s != null ? (asmMap[s] || []) : [hover.line];
  } else {
    hlSrc = activeSrcLine;   // a number or an array of source lines
    hlAsm = activeAsmLine != null
      ? (Array.isArray(activeAsmLine) ? activeAsmLine : [activeAsmLine])
      : (Array.isArray(activeSrcLine) ? activeSrcLine : [activeSrcLine])
          .flatMap((l) => asmMap[l] || []);
  }

  const column = (head, props) => (
    <div className="mm-codeasm__col">
      <div className="mm-codeasm__head">{head}</div>
      <CodeBlock {...props} />
    </div>
  );
  return (
    <div className="mm-codeasm">
      {column(SRC_LABEL[lang] || "source", { code, activeLine: hlSrc, lang,
        onHoverLine: (n) => setHover(n == null ? null : { side: "src", line: n }),
        onPickLine: onPickSrc, pickable: pickableSrc })}
      {column(asmLabel || (asmLang === "bytecode" ? "bytecode" : "assembly"),
        { code: asm, activeLine: hlAsm, lang: asmLang,
        onHoverLine: (n) => setHover(n == null ? null : { side: "asm", line: n }),
        onPickLine: onPickAsm, pickable: pickableAsm })}
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="mm-sec">
      <button type="button" className="mm-sec__head" aria-expanded={open} onClick={onToggle}>
        <span className={"mm-sec__chev" + (open ? " mm-sec__chev--open" : "")} aria-hidden="true">▸</span>
        <span>{title}</span>
      </button>
      {open ? <div className="mm-sec__body">{children}</div> : null}
    </div>
  );
}

// structured-caption rows: [key, label, palette modifier], in display order. A
// step's `caption` may be a string (one paragraph) or an object with any of these
// keys, which renders as labelled rows (C++ / Java / ASM / JVM / Intuition).
const CAPTION_ROWS = [
  ["cpp", "C++", "cpp"],
  ["java", "Java", "java"],
  ["asm", "ASM", "asm"],
  ["jvm", "JVM", "jvm"],
  ["intuition", "Intuition", "int"],
];

/* Reusable interaction primitives (shared across scene types) — see _shared.css.
   KnobBar: manipulate-and-observe segmented controls. PredictGate + Verdict:
   predict-then-reveal (neutral, no scoring). */
export function KnobBar({ knobs, value, onChange }) {
  return (
    <div className="mm-knobs">
      {knobs.map((k) => (
        <div className="mm-knob" key={k.id}>
          <span className="mm-knob__label">{k.label}</span>
          <div className="mm-knob__opts" role="group" aria-label={k.label}>
            {k.options.map((o) => {
              const on = value[k.id] === o.value;
              return (
                <button key={String(o.value)} type="button" aria-pressed={on}
                  className={"mm-knob__opt" + (on ? " mm-knob__opt--on" : "")}
                  onClick={() => onChange(k.id, o.value)}>{o.label}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PredictGate({ predict, onAnswer }) {
  return (
    <div className="mm-predict">
      <p className="mm-predict__ask">{renderCaption(predict.ask)}</p>
      <div className="mm-predict__choices">
        {predict.choices.map((c, k) => (
          <button key={k} type="button" className="mm-predict__choice" onClick={() => onAnswer(k)}>{renderCaption(c.label)}</button>
        ))}
      </div>
      <button type="button" className="mm-predict__skip" onClick={() => onAnswer(-1)}>Just show me</button>
    </div>
  );
}

export function Verdict({ predict, pick }) {
  const chosen = pick >= 0 ? predict.choices[pick] : null;
  return (
    <p className="mm-verdict">
      {chosen ? (
        <span className={"mm-verdict__mark mm-verdict__mark--" + (chosen.correct ? "ok" : "no")}>
          {chosen.correct ? "✓ correct" : "✗ not quite"}
        </span>
      ) : null}
      {predict.why ? <span className="mm-cap-txt">{renderCaption(predict.why)}</span> : null}
    </p>
  );
}

/* Why: annotated-callout hotspots for a static SVG figure. WhyDot is a numbered
   marker drawn INSIDE the figure's <DiagramSvg>; WhyNotes is the caption panel
   placed BELOW it. The host demo owns the open-state (a single useState) so the
   two stay in sync. Purely additive — the figure reads fine with nothing tapped. */
export function WhyDot({ n, x, y, active, onToggle, label }) {
  const fire = () => onToggle(n);
  return (
    <g className={"mm-why__dot" + (active ? " mm-why__dot--on" : "")}
      role="button" tabIndex={0} aria-pressed={!!active}
      aria-label={label ? ("Explain: " + label) : ("Explain point " + n)}
      onClick={fire}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); }
      }}>
      <circle cx={x} cy={y} r={11} />
      <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central">{n}</text>
    </g>
  );
}

export function WhyNotes({ notes, open }) {
  const active = open != null ? notes[open - 1] : null;
  return (
    <div className="mm-why" aria-live="polite">
      {active ? (
        <p className="mm-why__note">
          <span className="mm-why__badge">{open}</span>
          <span className="mm-cap-txt"><strong>{active.title}. </strong>{renderCaption(active.body)}</span>
        </p>
      ) : (
        <p className="mm-why__hint">Tap a numbered marker to see how each piece works.</p>
      )}
    </div>
  );
}

/* ---- build-exercise helpers (shared by the UML "build from scratch" demos) ----
   Chip: a focusable token pill. BuilderControls: the Check/Reset/Reveal row.
   useTapOrDrag: one tap-or-drag+keyboard model so a token can be moved by click,
   by HTML5 drag, or by keyboard (Enter picks, Enter on a slot drops). ---- */
export function Chip({ state = "idle", children, ariaLabel, className, ...rest }) {
  return (
    <button type="button"
      className={"bex-chip bex-chip--" + state + (className ? " " + className : "")}
      aria-label={ariaLabel} aria-pressed={state === "picked"} {...rest}>
      {children}
    </button>
  );
}

export function BuilderControls({ status, onCheck, onReset, onReveal, checkDisabled, revealed }) {
  return (
    <div className="bex-controls">
      <span className="bex-status" role="status" aria-live="polite">{status}</span>
      <div className="bex-controls__btns">
        <Button onClick={onCheck} disabled={checkDisabled || revealed}>Check</Button>
        <Button onClick={onReset} variant="outline">Reset</Button>
        <Button onClick={onReveal} variant="outline" disabled={revealed}>Reveal</Button>
      </div>
    </div>
  );
}

// Shared grading→colour mapping for every build exercise's slots/chips: a token is
// green once revealed; before Check a filled slot is neutral "placed" and an empty
// one "idle"; after Check a filled slot is "correct"/"wrong" and an empty one stays
// "idle" (never marked wrong for being blank). Each builder computes `filled`/`ok`.
export function gradedChipState({ revealed, checked, filled, ok }) {
  if (revealed) return "correct";
  if (!checked) return filled ? "placed" : "idle";
  if (!filled) return "idle";
  return ok ? "correct" : "wrong";
}

export function useTapOrDrag({ onMove }) {
  const [picked, setPicked] = React.useState(null);
  const pick = (id) => setPicked((cur) => (cur === id ? null : id));
  const drop = (index) => { if (picked != null) { onMove(picked, index); setPicked(null); } };
  const chipProps = (id) => ({
    onClick: () => pick(id),
    draggable: true,
    onDragStart: (e) => { setPicked(id); e.dataTransfer.setData("text/plain", id); },
    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(id); } },
  });
  const slotProps = (index) => ({
    onClick: () => drop(index),
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain") || picked;
      if (id != null) { onMove(id, index); setPicked(null); } },
    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); drop(index); } },
  });
  return { picked, pick, drop, chipProps, slotProps };
}

export function MemoryScene({ title, code, steps, lang = "cpp", asm, asmMap, asmLabel, asmLang,
  knobs, segments = null, axis, outLabel }) {
  const [i, setI] = React.useState(0);
  const [open, setOpen] = React.useState({ mem: true, code: true, out: true });
  // manipulate-and-observe: knob state drives a `steps` function (backward-compatible
  // — `steps` may still be a plain array). Changing a knob re-derives the scene.
  const [knob, setKnob] = React.useState(() =>
    Object.fromEntries((knobs || []).map((k) => [k.id, k.default != null ? k.default : k.options[0].value])));
  // predict-then-reveal: per-step pick. value >=0 is a chosen choice, -1 = "just show me".
  const [picks, setPicks] = React.useState({});
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const resolved = typeof steps === "function" ? steps(knob) : steps;
  const i2 = Math.min(i, resolved.length - 1);
  const step = resolved[i2];
  // the state to keep visible as context while a predict is unanswered: the
  // previously-confirmed step. The learner reasons about the NEXT state from the
  // CURRENT one, so we never blank the memory view behind the question.
  const prevStep = i2 > 0 ? resolved[i2 - 1] : null;

  // clicking a code (or asm) line jumps to the first step that highlights it
  const nav = React.useMemo(() => {
    const src = {}, asmL = {};
    resolved.forEach((st, idx) => {
      const ls = Array.isArray(st.line) ? st.line : (st.line != null ? [st.line] : []);
      const m = st.asmMap || asmMap || {};
      ls.forEach((L) => {
        if (src[L] == null) src[L] = idx;
        for (const a of (m[L] || [])) if (asmL[a] == null) asmL[a] = idx;
      });
      // a step that names its own bytecode line owns that line (beats the asmMap group)
      const as = Array.isArray(st.asmLine) ? st.asmLine : (st.asmLine != null ? [st.asmLine] : []);
      as.forEach((a) => { asmL[a] = idx; });
    });
    return { src, asmL, srcSet: new Set(Object.keys(src).map(Number)), asmSet: new Set(Object.keys(asmL).map(Number)) };
  }, [resolved, asmMap]);
  const pickSrc = (L) => { const s = nav.src[L]; if (s != null) setI(s); };
  const pickAsm = (a) => { const s = nav.asmL[a]; if (s != null) setI(s); };
  const setKnobVal = (id, v) => { setKnob((s) => ({ ...s, [id]: v })); setI(0); setPicks({}); };

  // predict gate: while an unanswered `step.predict` exists, hide the reveal
  // (memory + output + caption) behind a guess. Non-blocking — Next still works.
  const pred = step.predict;
  const answered = !pred || picks[i2] != null;
  const answer = (k) => setPicks((p) => ({ ...p, [i2]: k }));

  return (
    <div className="mm-scene">
      {/* The collapsible bar (in the note, outside this iframe) shows this title,
          so it's hidden here via CSS — kept in the DOM for the host to read. */}
      {title ? <div className="mm-scene__title" data-artifact-title>{title}</div> : null}

      {knobs && knobs.length ? <KnobBar knobs={knobs} value={knob} onChange={setKnobVal} /> : null}

      <Section title="Memory" open={open.mem} onToggle={() => toggle("mem")}>
        {!answered ? (
          <div className="mm-predict-wrap">
            {prevStep ? (
              <div className="mm-predict-ctx">
                <span className="mm-predict-ctx__tag">state now — predict what changes</span>
                {prevStep.layout ? <ObjectLayout {...prevStep.layout} /> : <MemoryModel cells={prevStep.cells} segments={segments} active={prevStep.active} axis={axis} />}
              </div>
            ) : null}
            <PredictGate predict={pred} onAnswer={answer} />
          </div>
        ) : step.layout ? <ObjectLayout {...step.layout} /> : <MemoryModel cells={step.cells} segments={segments} active={step.active} axis={axis} />}
      </Section>

      <Section title="Code" open={open.code} onToggle={() => toggle("code")}>
        {(step.asm || asm) ? (
          <CodeAsmPane
            code={step.code || code}
            lang={lang}
            asm={step.asm || asm}
            asmMap={step.asmMap || asmMap || {}}
            asmLabel={step.asmLabel || asmLabel}
            asmLang={step.asmLang || asmLang}
            activeSrcLine={step.line}
            activeAsmLine={step.asmLine}
            onPickSrc={pickSrc} pickableSrc={nav.srcSet}
            onPickAsm={pickAsm} pickableAsm={nav.asmSet}
          />
        ) : (
          <CodeBlock code={step.code || code} activeLine={step.line} lang={lang}
            onPickLine={pickSrc} pickable={nav.srcSet} />
        )}
      </Section>

      {answered && step.outputs ? (
        <Section title={outLabel || "Output (cout)"} open={open.out} onToggle={() => toggle("out")}>
          <div className="mm-console">
            {step.outputs.map((o, k) => (
              <div className="mm-console__row" key={k}>
                <span className="mm-console__expr">{o.expr}</span>
                <span className="mm-console__arrow">prints</span>
                <span className="mm-console__out">{o.result}</span>
                {o.note ? <span className="mm-console__note">{o.note}</span> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {answered && pred ? <Verdict predict={pred} pick={picks[i2]} /> : null}

      {answered ? (
        step.caption && typeof step.caption === "object" ? (
          <div className="mm-scene__caption mm-scene__caption--struct">
            {CAPTION_ROWS.map(([key, label, mod]) =>
              step.caption[key] != null ? (
                <p className="mm-cap-row" key={key}>
                  <span className={"mm-cap-tag mm-cap-tag--" + mod}>{label}</span>
                  <span className="mm-cap-txt">{renderCaption(step.caption[key])}</span>
                </p>
              ) : null
            )}
          </div>
        ) : step.caption != null ? (
          <p className="mm-scene__caption">{renderCaption(step.caption)}</p>
        ) : null
      ) : null}

      <div className="mm-scene__nav">
        <Button variant="ghost" size="sm" disabled={i2 === 0} onClick={() => setI(0)}>Reset</Button>
        <Button variant="outline" size="sm" disabled={i2 === 0} onClick={() => setI(i2 - 1)}>Back</Button>
        <div className="mm-scene__dots" role="tablist">
          {resolved.map((_, n) => (
            <button key={n} type="button" aria-label={"Step " + (n + 1)} aria-selected={n === i2}
              className={"mm-dot" + (n === i2 ? " mm-dot--on" : "")} onClick={() => setI(n)} />
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={i2 === resolved.length - 1} onClick={() => setI(i2 + 1)}>Next</Button>
        <span className="mm-scene__step">{i2 + 1} / {resolved.length}</span>
      </div>
    </div>
  );
}

// One side of a MemoryDualScene: a column heading, that side's memory pane, its
// code/asm pane, and its per-step caption — rendered exactly as MemoryScene does
// (structured caption -> CAPTION_ROWS rows; string -> one paragraph). `step` is
// the clamped step for this side; `idx` is the shared (max-count) step index.
function DualColumn({ side, step }) {
  return (
    <div className="mm-dual__col">
      <div className="mm-dual__head">{side.label}</div>
      {step.layout ? <ObjectLayout {...step.layout} /> : <MemoryModel cells={step.cells} />}
      {(step.asm || side.asm) ? (
        <CodeAsmPane
          code={step.code || side.code}
          lang={side.lang || "cpp"}
          asm={step.asm || side.asm}
          asmMap={step.asmMap || side.asmMap || {}}
          asmLabel={step.asmLabel || side.asmLabel}
          asmLang={step.asmLang || side.asmLang}
          activeSrcLine={step.line}
          activeAsmLine={step.asmLine}
        />
      ) : (
        <CodeBlock code={step.code || side.code} activeLine={step.line} lang={side.lang || "cpp"} />
      )}
      {step.caption && typeof step.caption === "object" ? (
        <div className="mm-scene__caption mm-scene__caption--struct">
          {CAPTION_ROWS.map(([key, label, mod]) =>
            step.caption[key] != null ? (
              <p className="mm-cap-row" key={key}>
                <span className={"mm-cap-tag mm-cap-tag--" + mod}>{label}</span>
                <span className="mm-cap-txt">{renderCaption(step.caption[key])}</span>
              </p>
            ) : null
          )}
        </div>
      ) : (
        <p className="mm-scene__caption">{renderCaption(step.caption)}</p>
      )}
    </div>
  );
}

/* MemoryDualScene — two MemoryScene-style columns sharing ONE stepper, so step n
   on the left lines up with step n on the right. Each side stacks memory + C++ +
   asm VERTICALLY (the narrow column forces the code/asm pane to one column via
   CSS). The shorter side holds on its last step. One Reset/Back/Next/dots row
   beneath both columns drives the MAX step count. */
export function MemoryDualScene({ title, left, right }) {
  const [i, setI] = React.useState(0);
  const total = Math.max(left.steps.length, right.steps.length);
  const at = (side) => side.steps[Math.min(i, side.steps.length - 1)];
  return (
    <div className="mm-scene mm-dual-wrap">
      {/* kept in the DOM for the host bar, hidden via existing CSS (as MemoryScene) */}
      {title ? <div className="mm-scene__title" data-artifact-title>{title}</div> : null}
      <div className="mm-dual">
        <DualColumn side={left} step={at(left)} />
        <DualColumn side={right} step={at(right)} />
      </div>

      <div className="mm-scene__nav">
        <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(0)}>Reset</Button>
        <Button variant="outline" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>Back</Button>
        <div className="mm-scene__dots" role="tablist">
          {Array.from({ length: total }, (_, n) => (
            <button key={n} type="button" aria-label={"Step " + (n + 1)} aria-selected={n === i}
              className={"mm-dot" + (n === i ? " mm-dot--on" : "")} onClick={() => setI(n)} />
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={i === total - 1} onClick={() => setI(i + 1)}>Next</Button>
        <span className="mm-scene__step">{i + 1} / {total}</span>
      </div>
    </div>
  );
}

/* ---- concept-diagram primitives (shared SVG building blocks) ----
   Extracted from diamond-chart so every concept diagram (pipeline, class
   relations, the diamond) shares one box/edge/arrow/palette styling. */
export const diagramPalette = (i) => ([
  { bg: "--seg-stack-bg",  bd: "--seg-stack-bd",  fg: "--seg-stack-fg"  },
  { bg: "--seg-heap-bg",   bd: "--seg-heap-bd",   fg: "--seg-heap-fg"   },
  { bg: "--seg-global-bg", bd: "--seg-global-bd", fg: "--seg-global-fg" },
  { bg: "--seg-code-bg",   bd: "--seg-code-bd",   fg: "--seg-code-fg"   },
])[((i % 4) + 4) % 4];

// a rounded, theme-coloured box centred at (cx,cy); `sub` picks the palette role,
// optional `note` is a small second line.
export function DiagramBox({ cx, cy, w = 96, h = 36, label, note, sub = 0, neutral }) {
  const c = neutral
    ? { bg: "--mm-cell-bg", bd: "--mm-cell-bd", fg: "--mm-cell-fg" }
    : diagramPalette(sub);
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={7}
        style={{ fill: `var(${c.bg})`, stroke: `var(${c.bd})`, strokeWidth: 1.5 }} />
      <text x={cx} y={note ? cy - 4 : cy + 0.5} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(${c.fg})`, fontSize: 14, fontWeight: 700 }}>{label}</text>
      {note ? (
        <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="central"
          style={{ fill: `var(${c.fg})`, fontSize: 10, opacity: 0.8 }}>{note}</text>
      ) : null}
    </g>
  );
}

// an arrow from point `from` to point `to` (each {x,y}); optional italic mid-label.
export function DiagramEdge({ from, to, label, dashed }) {
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        style={{ stroke: "var(--mm-muted)", strokeWidth: 1.5, strokeDasharray: dashed ? "4 4" : "none" }}
        markerEnd="url(#dia-arrow)" />
      {label ? (
        <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 4} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 10, fontStyle: "italic" }}>{label}</text>
      ) : null}
    </g>
  );
}

// the <svg> wrapper that defines the shared arrowhead marker once.
export function DiagramSvg({ viewBox, ariaLabel, maxWidth = 640, children }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={ariaLabel}
      style={{ width: "100%", height: "auto", maxWidth, display: "block", margin: "0 auto",
        fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace' }}>
      <defs>
        <marker id="dia-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L8,4.5 L1,8 Z" style={{ fill: "var(--mm-muted)" }} />
        </marker>
        {/* UML relations: a hollow triangle (filled with the card bg so the line
            stops at its base) pointing at the supertype. COLOUR encodes the
            relation — extends (inheritance, indigo) vs implements (interface, teal);
            the boxes themselves stay neutral. */}
        <marker id="dia-extends" markerWidth="15" markerHeight="13" refX="12.5" refY="6.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L12.5,6.5 L1,12 Z"
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-ptr)", strokeWidth: 1.4 }} />
        </marker>
        <marker id="dia-implements" markerWidth="15" markerHeight="13" refX="12.5" refY="6.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L12.5,6.5 L1,12 Z"
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-ref)", strokeWidth: 1.4 }} />
        </marker>
        {/* Use-case dependency arrowheads: an OPEN V (not filled) at the target,
            coloured to name the relation — «include» (teal) vs «extend» (amber).
            The dashed dependency line meeting it is drawn in the same colour. */}
        <marker id="dia-open-inc" markerWidth="13" markerHeight="12" refX="9.5" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1.5,1 L9.5,5.5 L1.5,10" style={{ fill: "none", stroke: "var(--mm-ref)", strokeWidth: 1.5 }} />
        </marker>
        <marker id="dia-open-ext" markerWidth="13" markerHeight="12" refX="9.5" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1.5,1 L9.5,5.5 L1.5,10" style={{ fill: "none", stroke: "var(--mm-hl)", strokeWidth: 1.5 }} />
        </marker>
        {/* Class-diagram whole/part diamonds. These sit at the SOURCE end (the
            "whole"), not the target — hollow for aggregation (the part can outlive
            the whole), filled for composition (the part dies with it). refX=0 so
            the diamond's tip lands on the line's start point. */}
        <marker id="dia-diamond-hollow" markerWidth="16" markerHeight="11" refX="0" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,5.5 L7.5,1 L15,5.5 L7.5,10 Z"
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-muted)", strokeWidth: 1.4 }} />
        </marker>
        <marker id="dia-diamond-filled" markerWidth="16" markerHeight="11" refX="0" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,5.5 L7.5,1 L15,5.5 L7.5,10 Z"
            style={{ fill: "var(--mm-muted)", stroke: "var(--mm-muted)", strokeWidth: 1.4 }} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

/* ---- Pipeline (shared) — a VERTICAL flow through labelled ZONE BANDS. Each step
   is one zone band (stacked top -> bottom): { zone, label, note, sub, via, feed,
   accent }. A band with `label` holds an artifact box; a box-less band (e.g.
   "Preprocessor") is a pass-through the flow arrow crosses. `via` labels the action
   entering that band; `feed` is a side input box { label, note, sub, via }; `accent`
   tints the band distinctly (e.g. Runtime). Vertical keeps the figure legible. */
export function Pipeline({ steps = [], maxWidth = 400, ariaLabel }) {
  const W = 440, BAND = 96, BW = 184, BH = 48, colX = 150;
  const bandTop = (i) => i * BAND;
  const bandMid = (i) => i * BAND + BAND / 2;
  const boxTop = (i) => bandMid(i) - BH / 2;
  const boxBot = (i) => bandMid(i) + BH / 2;
  const H = steps.length * BAND;
  const fx = 360, FW = 120, FH = 38;
  const boxed = steps.map((s, i) => (s.label ? i : -1)).filter((i) => i >= 0);
  return (
    <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={maxWidth} ariaLabel={ariaLabel}>
      {/* zone bands */}
      {steps.map((s, i) => (
        <g key={"z" + i}>
          <rect x={6} y={bandTop(i) + 4} width={W - 12} height={BAND - 8} rx={9}
            style={{ fill: `var(${s.accent ? "--seg-global-bg" : "--mm-reclaimed-bg"})`, opacity: 0.5 }} />
          <rect x={6.75} y={bandTop(i) + 4.75} width={W - 13.5} height={BAND - 9.5} rx={8.5}
            style={{ fill: "none", stroke: "var(--mm-gap-bd)", strokeWidth: 1, strokeDasharray: "3 4", opacity: 0.7 }} />
          <text x={16} y={bandTop(i) + 17} textAnchor="start"
            style={{ fill: "var(--mm-muted)", fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>{s.zone}</text>
        </g>
      ))}
      {/* flow arrows between consecutive artifact boxes (cross any box-less band) */}
      {boxed.slice(1).map((bi, k) => (
        <DiagramEdge key={"e" + bi} from={{ x: colX, y: boxBot(boxed[k]) }} to={{ x: colX, y: boxTop(bi) }} />
      ))}
      {/* action labels: at the top of a box band, centred in a box-less band */}
      {steps.map((s, i) => s.via ? (
        <text key={"v" + i} x={colX + 14} y={s.label ? bandTop(i) + 17 : bandMid(i) + 4} textAnchor="start"
          style={{ fill: "var(--mm-muted)", fontSize: 11, fontStyle: "italic" }}>{s.via}</text>
      ) : null)}
      {/* side feeds */}
      {steps.map((s, i) => s.feed ? (
        <g key={"f" + i}>
          <DiagramEdge from={{ x: fx - FW / 2, y: bandMid(i) }} to={{ x: colX + BW / 2, y: bandMid(i) }} label={s.feed.via} />
          <DiagramBox cx={fx} cy={bandMid(i)} w={FW} h={FH} label={s.feed.label} note={s.feed.note} sub={s.feed.sub} />
        </g>
      ) : null)}
      {/* artifact boxes */}
      {steps.map((s, i) => s.label ? (
        <DiagramBox key={"b" + i} cx={colX} cy={bandMid(i)} w={BW} h={BH} label={s.label} note={s.note} sub={s.sub} />
      ) : null)}
    </DiagramSvg>
  );
}

/* The canonical C++ build pipeline (note 01) as Pipeline steps. The compiler
   emits assembly (main.s); the assembler turns that into the object main.o. */
export const cppBuildPipeline = [
  { zone: "Source", label: "main.cpp", note: "+ mylib.h", sub: 0 },
  { zone: "Preprocessor", via: "preprocess" },
  { zone: "Compiler", label: "main.s", note: "assembly", sub: 1, via: "compile" },
  { zone: "Assembler", label: "main.o", note: "object · unlinked", sub: 1, via: "assemble" },
  { zone: "Linker", label: "a.out", note: "executable", sub: 2, via: "link",
    feed: { label: "libraries", note: "precompiled", sub: 1, via: "provides" } },
  { zone: "Runtime · OS + CPU", label: "CPU", note: "executes", sub: 3, via: "load / run", accent: true },
];

/* ---- DiagramCard (shared) — a titled, UML-style class/instance card ----
   A rounded card anchored at its TOP-LEFT (x,y) with width w, built in the
   exact style of DiagramBox (rx 7, theme vars, palette via diagramPalette(sub)).
   Body = one or more horizontal SECTIONS, each a list of left-aligned monospace
   rows; a divider line is drawn between adjacent sections. The title is centred
   and bold; the card computes its own total height from the rows so callers can
   lay out around it deterministically via diagramCardHeight(...).

     sections: [{ rows: ["color : string", "radius : double"] },
                { rows: ["get_color()", "set_radius(double)"] }]

   Layout constants (also used by diagramCardHeight):
     TITLE_H 26  ·  ROW_H 18  ·  SECT_PAD 6 (top+bottom inside a section)  ·  PAD_X 11
   Height = TITLE_H + Σ sections (2*SECT_PAD + rows.length*ROW_H).
   An empty section (no rows) still reserves one ROW_H so its divider reads.
   Width: rows are NOT measured/clipped — size `w` to fit the widest row
   (≈ 2*PAD_X + chars*6.6px at fontSize 11), as DiagramBox also expects. */
const DCARD = { TITLE_H: 26, ROW_H: 18, SECT_PAD: 6, PAD_X: 11 };

const sectionHeight = (s) =>
  DCARD.SECT_PAD * 2 + Math.max(1, (s.rows || []).length) * DCARD.ROW_H;

export function diagramCardHeight(sections = [], opts = {}) {
  const titleH = opts.title === false ? 0 : DCARD.TITLE_H;
  return titleH + sections.reduce((h, s) => h + sectionHeight(s), 0);
}

// UML class-spec shorthands shared by the uml-v* diagrams: ab("+ draw()") is an
// italic abstract-method row; st("- instance : Singleton") is an underlined STATIC
// row; cls(title, attrs, methods) is the standard two-compartment card spec
// (attrs + methods) for DiagramCard / treeLayout.
export const ab = (text) => ({ text, italic: true });
export const st = (text) => ({ text, underline: true });
export const cls = (title, attrs, methods) => ({
  title, sections: [{ rows: attrs }, { rows: methods }] });

// `neutral` = a colourless card (--mm-cell-*). `abstract` = UML italic title.
// `dashed` = a dashed border (e.g. a placeholder "shape to be added"). A row may
// be a string OR { text, italic, underline } — italic marks a UML abstract method,
// underline marks a STATIC member (note 14's notation; first drawn by Singleton's
// `instance` field and `getInstance()` in note 19).
// `underline` = the UML OBJECT convention: an instance box titles itself with an
// underlined `name : Class`, which is what separates an object diagram from a class one.
export function DiagramCard({ x, y, w = 150, title, sections = [], sub = 0, neutral, abstract, dashed, underline }) {
  const c = neutral
    ? { bg: "--mm-cell-bg", bd: "--mm-cell-bd", fg: "--mm-cell-fg" }
    : diagramPalette(sub);
  const h = diagramCardHeight(sections, { title: title != null });
  const titleH = title != null ? DCARD.TITLE_H : 0;
  let cy = y + titleH;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7}
        style={{ fill: `var(${c.bg})`, stroke: `var(${c.bd})`, strokeWidth: 1.5,
          strokeDasharray: dashed ? "5 4" : "none" }} />
      {title != null ? (
        <>
          <text x={x + w / 2} y={y + titleH / 2 + 0.5} textAnchor="middle" dominantBaseline="central"
            style={{ fill: `var(${c.fg})`, fontSize: 13.5, fontWeight: 700,
              fontStyle: abstract ? "italic" : "normal",
              textDecoration: underline ? "underline" : "none" }}>{title}</text>
          <line x1={x} y1={y + titleH} x2={x + w} y2={y + titleH}
            style={{ stroke: `var(${c.bd})`, strokeWidth: 1 }} />
        </>
      ) : null}
      {sections.map((s, si) => {
        const top = cy;
        cy += sectionHeight(s);
        return (
          <g key={si}>
            {si > 0 ? (
              <line x1={x} y1={top} x2={x + w} y2={top}
                style={{ stroke: `var(${c.bd})`, strokeWidth: 1, opacity: 0.7 }} />
            ) : null}
            {(s.rows || []).map((r, ri) => {
              const txt = typeof r === "object" ? r.text : r;
              const ital = typeof r === "object" && r.italic;
              const und = typeof r === "object" && r.underline;
              return (
                <text key={ri} x={x + DCARD.PAD_X}
                  y={top + DCARD.SECT_PAD + DCARD.ROW_H * (ri + 0.5)}
                  textAnchor="start" dominantBaseline="central"
                  style={{ fill: `var(${c.fg})`, fontSize: 11, fontStyle: ital ? "italic" : "normal",
                    textDecoration: und ? "underline" : "none",
                    fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace' }}>{txt}</text>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

/* A "this design is wrong" mark — the refined red X on the BEFORE half of the
   SOLID before/after figures (note 16). Draw it OVER the region it rejects:
   the whole bad block (SRP god-class, ISP fat interface) or a single bad
   relationship (DIP's concrete dependency, centred on the arrow). The two
   strokes are EQUAL-ARMED (perpendicular, ±45°) and round-capped so it reads as
   a deliberate rejection stamp, never two stray diagonals — `size` fixes the arm
   span (defaults to the region's shorter side) so a wide block still gets a
   square X rather than a stretched one. */
export function CrossOut({ x, y, w, h, size, strokeWidth = 4, opacity = 0.9 }) {
  const cx = x + w / 2, cy = y + h / 2;
  const r = (size != null ? size : Math.min(w, h)) / 2;
  const s = { stroke: "var(--mm-dangling)", strokeWidth, strokeLinecap: "round", opacity };
  return (
    <g aria-hidden="true">
      <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} style={s} />
      <line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} style={s} />
    </g>
  );
}

/* ---- UML class-hierarchy primitives (note 09) — note 03's DiagramCards wired
   with note 08's trunk -> bus -> drops fork and a hollow "extends" triangle.
   treeLayout computes card positions from their heights; ClassTree renders the
   cards + fork from a layout; InheritFork is the bare connector. ---- */

// One inheritance fork: a hollow-triangle "extends" arrow into the parent, a
// horizontal bus across the children, and a drop to each child's top.
export function InheritFork({ parentCx, parentBottomY, childCxs = [], childTopY, busY, relation = "extends" }) {
  const xs = [parentCx, ...childCxs];
  const impl = relation === "implements";
  const s = { stroke: impl ? "var(--mm-ref)" : "var(--mm-ptr)", strokeWidth: 1.5,
    strokeDasharray: impl ? "5 4" : "none" };
  const marker = impl ? "url(#dia-implements)" : "url(#dia-extends)";
  return (
    <g>
      <line x1={parentCx} y1={busY} x2={parentCx} y2={parentBottomY} style={s} markerEnd={marker} />
      <line x1={Math.min(...xs)} y1={busY} x2={Math.max(...xs)} y2={busY} style={s} />
      {childCxs.map((cx, i) => (
        <line key={i} x1={cx} y1={busY} x2={cx} y2={childTopY} style={s} />
      ))}
    </g>
  );
}

// Lay out a one-parent tree: parent centred at cx/topY, children in a row below
// with aligned tops. Heights come from diagramCardHeight. Returns rects (each with
// cx/top/bottom), the bus geometry, and the bounding box (left/right/bottom).
export function treeLayout({ cx, topY = 8, parent, children = [], cardW = 150, gap = 22, forkGap = 32 }) {
  const ph = diagramCardHeight(parent.sections, { title: true });
  const parentBottom = topY + ph;
  const childTop = parentBottom + forkGap;
  const busY = parentBottom + forkGap / 2;
  const n = children.length;
  const rowW = n * cardW + Math.max(0, n - 1) * gap;
  const startX = cx - rowW / 2;
  const kids = children.map((spec, i) => {
    const x = startX + i * (cardW + gap);
    return { spec, x, y: childTop, w: cardW, cx: x + cardW / 2, top: childTop,
      h: diagramCardHeight(spec.sections, { title: true }) };
  });
  const maxChildH = kids.length ? Math.max(...kids.map((k) => k.h)) : 0;
  return {
    parent: { spec: parent, x: cx - cardW / 2, y: topY, w: cardW, cx, h: ph, bottom: parentBottom },
    children: kids, busY, childTop,
    left: Math.min(startX, cx - cardW / 2),
    right: Math.max(startX + rowW, cx + cardW / 2),
    bottom: childTop + maxChildH,
  };
}

// Render a treeLayout result: each card (sub from its spec) + the fork connector.
export function ClassTree({ layout, relation = "extends" }) {
  const card = (c, key) => (
    <DiagramCard key={key} x={c.x} y={c.y} w={c.w}
      title={c.spec.title} sections={c.spec.sections} neutral
      abstract={c.spec.abstract} dashed={c.spec.dashed} />
  );
  return (
    <g>
      {card(layout.parent, "p")}
      {layout.children.map((k, i) => card(k, i))}
      <InheritFork parentCx={layout.parent.cx} parentBottomY={layout.parent.bottom}
        childCxs={layout.children.map((k) => k.cx)} childTopY={layout.childTop} busY={layout.busY} relation={relation} />
    </g>
  );
}

/* ---- design-pattern figures (notes 19–21) ----------------------------------
   The three pattern decks draw every pattern the same way: a bracketed one-line
   INTENT, a rejected naive design, the pattern's UML, and client code that is
   deliberately IDENTICAL before and after. These two exports are that shape.

   `patternTree` lays out the picture almost every pattern in the decks reduces to:
   a CONTEXT card (ShapeFactory, Team, Subject, Phone — the class that holds, makes,
   or wraps the others) joined by ONE UML edge to an abstract PARENT that forks into
   its concrete CHILDREN. The joining edge is always horizontal, so nothing reads
   diagonal (note 12's rule). It returns `{ node, viewBox, width, height, layout }`,
   so a caller can drop `node` into a DiagramSvg — or hand the whole object to
   `patternFigure` as one of its halves.

   `patternFigure` is the chrome around it: title, intent, the rejected half (a code
   block, or a diagram stamped with CrossOut), the pattern half, the client code, and
   the caption. A figure the decks draw only once — Facade's subsystem, Bridge's two
   hierarchies, Decorator's wrapper chain — skips `patternTree` and passes its own
   `{ node, viewBox }` instead; the chrome is the same either way. ---- */

const PAT_PAD = 14;

function wrapSvgNote(text, maxChars) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach(word => {
    const candidate = line ? line + " " + word : word;
    if (line && candidate.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

export function patternTree({
  context, edge = "assoc", edgeLabel, contextW = 200, gapX = 54, gapY = 40,
  place = "left",   // where the context card sits relative to the abstract parent
  parent, children = [], relation = "extends", cardW = 150, gap = 20, forkGap = 32, note,
}) {
  const ctxH = context ? diagramCardHeight(context.sections, { title: true }) : 0;
  const parentH = diagramCardHeight(parent.sections, { title: true });
  const above = !!context && place === "above";

  // "left": centre the context on the PARENT card so their joining edge is horizontal.
  // "above": stack it over the parent — the inheritance fork enters the parent's
  // BOTTOM edge, so its top is free for the incoming edge. Cheaper in width, which
  // is what a five-subclass hierarchy needs.
  const axis = context && !above ? PAT_PAD + Math.max(ctxH, parentH) / 2 : 0;
  const ctxY = above ? PAT_PAD : axis - ctxH / 2;
  const treeTop = above ? PAT_PAD + ctxH + gapY : (context ? axis - parentH / 2 : PAT_PAD);

  const probe = treeLayout({ cx: 0, topY: treeTop, parent, children, cardW, gap, forkGap });
  const treeLeft = context && !above ? PAT_PAD + contextW + gapX : PAT_PAD;
  const L = treeLayout({ cx: treeLeft - probe.left, topY: treeTop, parent, children, cardW, gap, forkGap });
  const ctxX = above ? L.parent.cx - contextW / 2 : PAT_PAD;

  const width = Math.round(Math.max(L.right, ctxX + contextW) + PAT_PAD);
  // SVG text does not wrap by itself. Keep the note inside the viewBox instead
  // of letting a long centered sentence clip at either edge on narrow frames.
  const noteLines = note ? wrapSvgNote(note, Math.max(38, Math.floor((width - 2 * PAT_PAD) / 6.8))) : [];
  const noteH = noteLines.length ? noteLines.length * 15 : 0;
  const height = Math.round(Math.max(L.bottom, ctxY + ctxH) + PAT_PAD + noteH);

  const node = (
    <g>
      {context ? (
        <>
          <DiagramCard x={ctxX} y={ctxY} w={contextW} title={context.title}
            sections={context.sections} neutral abstract={context.abstract} dashed={context.dashed} />
          <UmlLink kind={edge} label={edgeLabel}
            from={above ? { x: L.parent.cx, y: ctxY + ctxH } : { x: PAT_PAD + contextW, y: axis }}
            to={above ? { x: L.parent.cx, y: L.parent.y } : { x: L.parent.x, y: axis }} />
        </>
      ) : null}
      <ClassTree layout={L} relation={relation} />
      {noteLines.length ? (
        <text x={width / 2} y={height - 8 - (noteLines.length - 1) * 15} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
          {noteLines.map((line, i) => <tspan key={i} x={width / 2} dy={i ? 15 : 0}>{line}</tspan>)}
        </text>
      ) : null}
    </g>
  );
  return { node, width, height, viewBox: `0 0 ${width} ${height}`, layout: L, axis };
}

/* One half of a pattern figure: either a code block or a diagram. `cross` stamps
   the shared CrossOut over a diagram half — the decks' red X on the naive design.
   A CODE half is never crossed out (note 16's OCP figure set that precedent: the
   rejected if-chain is marked by its tag and its comment, not by an overlay). */
function PatternHalf({ half, tag, tagKind, cross, maxWidth }) {
  if (!half) return null;
  const isCode = half.code != null;
  return (
    <div className="mm-pat__half">
      {tag ? <span className={"mm-pat__tag mm-cap-tag mm-cap-tag--" + (tagKind || "cpp")}>{tag}</span> : null}
      {isCode ? (
        <CodeBlock code={half.code} lang={half.lang || "java"} />
      ) : (
        <DiagramSvg viewBox={half.viewBox} ariaLabel={half.ariaLabel} maxWidth={half.maxWidth || maxWidth}>
          {half.node}
          {cross ? <CrossOut x={0} y={0} w={half.width} h={half.height} /> : null}
        </DiagramSvg>
      )}
      {half.note ? <p className="mm-pat__note">{renderCaption(half.note)}</p> : null}
    </div>
  );
}

export function PatternFigure({
  title, intent, bad, badTag = "rejected", good, goodTag = "the pattern",
  client, caption, maxWidth = 760,
}) {
  return (
    <div className="mm-scene mm-pat">
      {title ? <div className="mm-scene__title" data-artifact-title>{title}</div> : null}
      {intent ? <p className="mm-pat__intent">{intent}</p> : null}
      <PatternHalf half={bad} tag={badTag} tagKind="asm" cross={bad && bad.code == null} maxWidth={maxWidth} />
      <PatternHalf half={good} tag={goodTag} tagKind="int" maxWidth={maxWidth} />
      {client ? (
        <div className="mm-pat__half">
          <span className="mm-pat__tag mm-cap-tag mm-cap-tag--java">{client.label || "client code"}</span>
          <CodeBlock code={client.code} lang={client.lang || "java"} />
          {client.note ? <p className="mm-pat__note">{renderCaption(client.note)}</p> : null}
        </div>
      ) : null}
      {caption ? <CompareCaption cols={caption.cols} punch={caption.punch} /> : null}
    </div>
  );
}
export function patternFigure(cfg) { return function App() { return React.createElement(PatternFigure, cfg); }; }

/* The decks' other recurring mark: a handwritten pseudocode callout parked beside
   the card that owns it — the few lines that live INSIDE a method (Singleton's lazy
   init, Flyweight's cache-or-create, Proxy's guard, Mediator's notify loop). Size it
   with `svgCodeSize` first when you need to place it; both use the same metrics. */
const SVGC = { PAD: 9, LINE_H: 15, TITLE_H: 17, CH: 6.7, FS: 11 };

export function svgCodeSize(lines = [], title) {
  const widest = Math.max(title ? title.length : 0, ...lines.map((l) => String(l).length), 1);
  return { w: Math.round(2 * SVGC.PAD + widest * SVGC.CH),
    h: Math.round(2 * SVGC.PAD + (title ? SVGC.TITLE_H : 0) + lines.length * SVGC.LINE_H) };
}

export function SvgCode({ x, y, lines = [], title, w }) {
  const size = svgCodeSize(lines, title);
  const width = w || size.w;
  return (
    <g>
      <rect x={x} y={y} width={width} height={size.h} rx={6}
        style={{ fill: "var(--mm-code-bg)", stroke: "var(--mm-panel-bd)", strokeWidth: 1 }} />
      {title ? (
        <text x={x + SVGC.PAD} y={y + SVGC.PAD + 8} dominantBaseline="central"
          style={{ fill: "var(--mm-muted)", fontSize: 10, fontWeight: 700, letterSpacing: ".04em",
            fontFamily: "system-ui, sans-serif" }}>{title}</text>
      ) : null}
      {lines.map((l, i) => (
        <text key={i} x={x + SVGC.PAD}
          y={y + SVGC.PAD + (title ? SVGC.TITLE_H : 0) + SVGC.LINE_H * (i + 0.5)}
          dominantBaseline="central"
          style={{ fill: "var(--mm-code-fg)", fontSize: SVGC.FS, whiteSpace: "pre",
            fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace' }}>{l}</text>
      ))}
    </g>
  );
}

/* ---- UML use-case primitives (note 12) — the vocabulary of a use-case diagram:
   an Actor (stick figure), a UseCaseOval (an ellipse behaviour), a SystemBoundary
   (the box around what the system offers), and UmlLink (the four relation kinds).
   COLOUR names the relation, exactly as the class-diagram primitives do:
     association  neutral solid line, no head   (actor ⟷ use case)
     generalize   indigo solid, hollow triangle (child → parent — reuses «extends»)
     «include»    teal dashed, open arrow       (base → always-run step)
     «extend»     amber dashed, open arrow       (optional step → complete base)
   Shapes stay neutral so the relation reads at a glance. ---- */

// Point on an ellipse's edge in the direction of (tx,ty) — so links touch the
// oval's rim cleanly instead of its centre.
export function ovalEdge(cx, cy, rx, ry, tx, ty) {
  const dx = tx - cx, dy = ty - cy;
  const t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) || 1);
  return { x: cx + dx * t, y: cy + dy * t };
}

// A UML actor: a stick figure whose head starts at (x, y), label(s) centred below.
// `active` tints it indigo to spotlight the actor under discussion. Returns its
// geometry via well-known offsets so callers can anchor links at arm height (y+22).
export function Actor({ x, y = 0, label, active }) {
  const col = active ? "var(--mm-ptr)" : "var(--mm-cell-fg)";
  const s = { stroke: col, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" };
  const lines = Array.isArray(label) ? label : (label != null ? [label] : []);
  return (
    <g>
      <circle cx={x} cy={y + 8} r={7} style={{ ...s, fill: "var(--mm-cell-bg)" }} />
      <line x1={x} y1={y + 15} x2={x} y2={y + 33} style={s} />
      <line x1={x - 13} y1={y + 21} x2={x + 13} y2={y + 21} style={s} />
      <line x1={x} y1={y + 33} x2={x - 11} y2={y + 47} style={s} />
      <line x1={x} y1={y + 33} x2={x + 11} y2={y + 47} style={s} />
      {lines.map((ln, i) => (
        <text key={i} x={x} y={y + 61 + i * 13} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 12, fontWeight: 600 }}>{ln}</text>
      ))}
    </g>
  );
}
Actor.ARM = 21;   // link anchor: y-offset of the arms from the actor's top y

// A use-case behaviour: a soft pill ellipse centred at (cx,cy). `label` is a
// string or an array of lines (author wraps long phrases). `sub` tints the fill
// with a segment hue for emphasis (e.g. the base case in an include/extend story);
// `dashed` marks a placeholder/hypothetical case.
export function UseCaseOval({ cx, cy, rx = 82, ry = 27, label, sub, dashed }) {
  const lines = Array.isArray(label) ? label : [label];
  const c = sub != null ? diagramPalette(sub) : { bg: "--mm-panel-bg", bd: "--mm-cell-bd", fg: "--mm-cell-fg" };
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
        style={{ fill: `var(${c.bg})`, stroke: `var(${c.bd})`, strokeWidth: 1.6,
          strokeDasharray: dashed ? "5 4" : "none" }} />
      {lines.map((ln, i) => (
        <text key={i} x={cx} y={cy + (i - (lines.length - 1) / 2) * 14} textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: `var(${c.fg})`, fontSize: 12, fontWeight: 600 }}>{ln}</text>
      ))}
    </g>
  );
}

// The system boundary: a rounded frame with a top-centred title. Everything the
// system offers (the use cases) sits inside; actors sit outside.
export function SystemBoundary({ x, y, w, h, label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={11}
        style={{ fill: "var(--mm-panel-bg)", fillOpacity: 0.35, stroke: "var(--mm-muted)", strokeWidth: 1.4 }} />
      {label ? (
        <text x={x + w / 2} y={y + 17} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>{label}</text>
      ) : null}
    </g>
  );
}

// The four use-case relation kinds. `from`/`to` are {x,y} endpoints (use ovalEdge
// to land on a rim). `kind` selects colour + line style + arrowhead + default label;
// pass `label` to override (e.g. a named association) or "" to suppress.
// `startMarker` (aggregate/compose only) rides the SOURCE end: the whole/part
// diamond belongs on the whole, while every other kind marks only its target.
const UML_LINK = {
  assoc:      { color: "--mm-muted", dashed: false, marker: null,           label: null },
  generalize: { color: "--mm-ptr",   dashed: false, marker: "dia-extends",  label: null },
  realize:    { color: "--mm-ref",   dashed: true,  marker: "dia-implements", label: null },
  include:    { color: "--mm-ref",   dashed: true,  marker: "dia-open-inc",  label: "«include»" },
  extend:     { color: "--mm-hl",    dashed: true,  marker: "dia-open-ext",  label: "«extend»" },
  depend:     { color: "--mm-muted", dashed: true,  marker: "dia-arrow",    label: null },
  aggregate:  { color: "--mm-muted", dashed: false, marker: null, startMarker: "dia-diamond-hollow", label: null },
  compose:    { color: "--mm-muted", dashed: false, marker: null, startMarker: "dia-diamond-filled", label: null },
};
// `orth` routes an ELBOW (only horizontal + vertical segments) when the endpoints
// aren't already axis-aligned — so every arrow reads as H or V, never diagonal.
// `elbow`: "hvh" exits horizontally (default), "vhv" exits vertically.
export function UmlLink({ from, to, kind = "assoc", label, labelDy = -5, labelDx = 0, orth, elbow = "hvh" }) {
  const k = UML_LINK[kind] || UML_LINK.assoc;
  const lab = label !== undefined ? label : k.label;
  const axis = Math.abs(from.y - to.y) < 1 || Math.abs(from.x - to.x) < 1;
  const style = { stroke: `var(${k.color})`, strokeWidth: 1.5, fill: "none",
    strokeDasharray: k.dashed ? "5 4" : "none" };
  const head = k.marker ? `url(#${k.marker})` : undefined;
  const tail = k.startMarker ? `url(#${k.startMarker})` : undefined;
  let shape, lx, ly;
  if (orth && !axis) {
    let d;
    if (elbow === "vhv") {
      const my = (from.y + to.y) / 2;
      d = `M ${from.x} ${from.y} V ${my} H ${to.x} V ${to.y}`;
      lx = (from.x + to.x) / 2; ly = my;
    } else {
      const mx = (from.x + to.x) / 2;
      d = `M ${from.x} ${from.y} H ${mx} V ${to.y} H ${to.x}`;
      lx = (from.x + mx) / 2; ly = from.y;
    }
    shape = <path d={d} style={style} markerEnd={head} markerStart={tail} />;
  } else {
    shape = <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={style}
      markerEnd={head} markerStart={tail} />;
    lx = (from.x + to.x) / 2; ly = (from.y + to.y) / 2;
  }
  // the label rides on a panel-bg chip (like fragment guards) so a vertical
  // link's own line/arrowhead never strikes through «include» / «extend».
  const labW = lab ? String(lab).length * 5.6 + 8 : 0;
  return (
    <g>
      {shape}
      {lab ? (
        <g>
          <rect x={lx + labelDx - labW / 2} y={ly + labelDy - 10.5} width={labW} height={14} rx={2}
            style={{ fill: "var(--mm-panel-bg)" }} />
          <text x={lx + labelDx} y={ly + labelDy} textAnchor="middle"
            style={{ fill: `var(${k.color})`, fontSize: 10.5, fontWeight: 600, fontStyle: "italic",
              fontFamily: "system-ui, sans-serif" }}>{lab}</text>
        </g>
      ) : null}
    </g>
  );
}

/* ---- auto-sizing + declarative composers ----
   The primitives above are the reusable shapes; these compose them from DATA so a
   demo is a spec, not hand-placed coordinates. A running bounding box measures
   every shape (and its label + the caption) and derives the viewBox with uniform
   padding — so a figure can never clip or overflow, whatever it contains. ---- */

const MONO_CH = 7.2, UI_CH = 6.2;   // approx px per character at the sizes we render
const estHalf = (text, ch) => (String(text == null ? "" : text).length * ch) / 2;

// Auto oval radius: wide enough for the longest label line (+ padding), floored.
export function ovalRx(label, min = 54, padX = 15) {
  const lines = Array.isArray(label) ? label : [label];
  const widest = Math.max(...lines.map((s) => String(s).length));
  return Math.max(min, (widest * MONO_CH) / 2 + padX);
}

// A running bounding box in user units; `viewBox()` pads it uniformly.
function makeBounds(pad = 16) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (a, b, c, d) => { x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); };
  return {
    add,
    oval: (cx, cy, rx, ry) => add(cx - rx, cy - ry, cx + rx, cy + ry),
    box: (x, y, w, h) => add(x, y, x + w, y + h),
    actor: (x, topY, label) => {
      const lines = Array.isArray(label) ? label : [label];
      const hw = Math.max(14, estHalf(lines[0], MONO_CH));
      add(x - hw, topY, x + hw, topY + 55 + lines.length * 13);
    },
    text: (cx, baseY, halfW) => add(cx - halfW, baseY - 11, cx + halfW, baseY + 3),
    get y1() { return y1; }, get x1() { return x1; }, get x0() { return x0; },
    width: () => x1 - x0 + 2 * pad,
    viewBox: () => `${(x0 - pad).toFixed(1)} ${(y0 - pad).toFixed(1)} ${(x1 - x0 + 2 * pad).toFixed(1)} ${(y1 - y0 + 2 * pad).toFixed(1)}`,
  };
}

// A footer caption line, coloured to match its figure (relation hue or muted).
function FigureCaption({ x, y, text, color = "--mm-muted" }) {
  if (!text) return null;
  return (
    <text x={x} y={y} textAnchor="middle"
      style={{ fill: `var(${color})`, fontSize: 11, fontWeight: 700, fontStyle: "italic",
        fontFamily: "system-ui, sans-serif" }}>{text}</text>
  );
}

// Small shared helpers for the interactive builders below.
const joinLabel = (l) => (Array.isArray(l) ? l.join(" ") : l);   // a label may be a string or an array of lines
const onEnterOrSpace = (fn) => (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };

/* UseCaseDiagram — the everyday shape: one or more actors outside a system
   boundary, a column of use-case ovals inside it, associations between them.
   Driven by data:
     useCaseDiagram({
       system: "Online Banking",
       actors: [{ id: "cust", label: "Customer", side: "left" }],
       cases:  ["Open Account", { label: "Deposit Funds" }, …],
       associations: [{ actor: "cust", cases: ["*"] }],   // omit → each actor ↔ all
       caption, showRoles })
   `showRoles` (single actor + single case) tags the three parts — actor /
   association / use case — for the teaching figure. */
export function UseCaseDiagram({ system, actors = [], cases = [], associations,
  relations = [], caption, showRoles, maxWidth, visible, ry = 26, rowGap = 66,
  onPick, pickedId }) {
  // `onPick(id)` makes the actor glyphs and use-case ovals themselves clickable and
  // keyboard-focusable (the builder wires this to the same handler as its chips);
  // when it is absent the diagram is a pure, non-interactive figure as before.
  const [focusId, setFocusId] = React.useState(null);
  // A case may be a bare string, an auto-column spec, or carry explicit {x,y}.
  const cs = cases.map((c, i) => {
    const o = typeof c === "string" ? { label: c } : c;
    return { id: o.id || ("uc" + i), label: o.label, sub: o.sub, dashed: o.dashed,
      rx: o.rx != null ? o.rx : ovalRx(o.label), ry: o.ry || ry, cx: o.x, cy: o.y };
  });
  const hasCases = cs.length > 0;
  const rx = hasCases ? Math.max(...cs.map((c) => c.rx)) : ovalRx("");   // one width for every oval in the figure
  cs.forEach((c) => { c.rx = rx; });
  const explicit = cs.length > 0 && cs[0].cx != null;
  if (!explicit) {                          // single auto-laid column
    cs.forEach((c, i) => { c.cx = 300; c.cy = 40 + ry + i * rowGap; });
  }
  const byId = Object.fromEntries(cs.map((c) => [c.id, c]));

  // boundary fits around every case (+ title room), so any arrangement is enclosed.
  // With no cases yet (a live preview mid-build) fall back to a modest empty box
  // tall enough to seat the placed actors, so bounds stay finite.
  const padX = 26, padTop = system ? 34 : 20, padBot = 20;
  const minX = hasCases ? Math.min(...cs.map((c) => c.cx - c.rx)) : 300 - rx;
  const maxX = hasCases ? Math.max(...cs.map((c) => c.cx + c.rx)) : 300 + rx;
  const minY = hasCases ? Math.min(...cs.map((c) => c.cy - c.ry)) : 40;
  const maxY = hasCases ? Math.max(...cs.map((c) => c.cy + c.ry)) : 40 + Math.max(0, actors.length - 1) * rowGap;
  const bx = minX - padX, bw = (maxX - minX) + 2 * padX;
  const bTop = minY - padTop, bh = (maxY - minY) + padTop + padBot;
  const boundCX = bx + bw / 2;

  const stackTop = bTop + padTop + ry;   // first row for actors that link to nothing yet
  const acts = actors.map((a, i) => {
    // No `associations` prop at all → legacy shorthand: each actor ↔ every case.
    // When the prop IS provided, an actor absent from it links to NOTHING (only an
    // explicit ["*"] links to all) — so a live preview with no connections yet, or a
    // partial set, draws exactly the associations that were actually authored.
    const linkAll = associations == null;
    const spec = linkAll ? null : (associations.find((l) => l.actor === a.id) || {}).cases;
    const ids = linkAll || (spec && spec.includes("*")) ? cs.map((c) => c.id) : (spec || []);
    const linked = ids.map((id) => byId[id]).filter(Boolean);
    const ax = a.x != null ? a.x : ((a.side || "left") === "left" ? bx - 60 : bx + bw + 60);
    const midY = a.y != null ? a.y
      : linked.length ? linked.reduce((s, c) => s + c.cy, 0) / linked.length
      : stackTop + i * rowGap;   // no linked cases yet — stack down the gutter (live preview)
    return { ...a, ax, midY, linked };
  });
  // De-overlap actors that resolved to the SAME vertical point. This only bites in
  // a live preview before associations are drawn — every actor links to every case,
  // so all midYs collapse to the same mean. Authored diagrams give actors distinct
  // rows, so their (rounded-distinct) midYs form singleton groups and never move.
  const tieGroups = {};
  acts.forEach((a) => { if (a.y == null) (tieGroups[Math.round(a.midY)] = tieGroups[Math.round(a.midY)] || []).push(a); });
  Object.values(tieGroups).forEach((g) => {
    if (g.length < 2) return;
    const c = g.reduce((s, a) => s + a.midY, 0) / g.length;
    g.forEach((a, k) => { a.midY = c + (k - (g.length - 1) / 2) * rowGap; });
  });

  // A case reached by more than one actor is SHARED: its incoming lines must not
  // land on the same rim point or they overlap into one doubled line. Count the
  // actors per case so shared ones can fan their rim contacts apart.
  const shareCount = {};
  acts.forEach((a) => a.linked.forEach((c) => { shareCount[c.id] = (shareCount[c.id] || 0) + 1; }));
  const SHARE_DY = 10;   // vertical spread of a shared case's two line endings

  // Associations BRANCH from each actor: a horizontal main arm runs from the actor
  // to a PERPENDICULAR distribution line (a vertical spine); each use case then
  // branches off it at a right angle, a plain line to the case's rim. The spine
  // sits a FIXED gap in from the nearest oval rim — the same gap for every actor in
  // every diagram, so the split point is consistent (a visible line just inside the
  // frame, never straddling the boundary nor staggered per-actor). A shared case is
  // entered above centre by actors sitting above it, below centre by actors below
  // it — so the two lines reach distinct points on the rim.
  const SPINE_GAP = 20;
  const branchSets = acts.map((a) => {
    const left = a.ax < boundCX;
    // start the association line clear of the figure's outstretched arm (±13) so
    // the line's source reads as separate from the actor, not merged with its arm.
    const armX = a.ax + (left ? 22 : -22);
    const rimXs = a.linked.map((c) => (left ? c.cx - c.rx : c.cx + c.rx));
    const nearX = left ? Math.min(...rimXs) : Math.max(...rimXs);   // nearest use-case rim
    const spineX = a.linked.length > 1 ? nearX + (left ? -SPINE_GAP : SPINE_GAP) : armX;
    const branches = a.linked.map((c) => {
      const dy = shareCount[c.id] > 1 ? (a.midY < c.cy ? -SHARE_DY : SHARE_DY) : 0;
      const enterY = c.cy + dy;
      const xoff = dy ? c.rx * Math.sqrt(Math.max(0, 1 - (dy / c.ry) ** 2)) : c.rx;
      return { cid: c.id, cy: c.cy, enterY, rimX: left ? c.cx - xoff : c.cx + xoff };
    });
    return { actor: a.id, armX, midY: a.midY, spineX, branches, single: a.linked.length <= 1 };
  });
  // inter-case relations are STRAIGHT lines: perfectly vertical when the two cases
  // are stacked, perfectly horizontal when they share a row, a straight diagonal
  // otherwise. Never an elbow.
  const rels = relations.map((r, i) => {
    const A = byId[r.from], B = byId[r.to], dx = B.cx - A.cx, dy = B.cy - A.cy;
    let from, to;
    if (Math.abs(dx) < A.rx * 0.5) {            // stacked → vertical
      const up = dy < 0;
      from = { x: A.cx, y: A.cy + (up ? -A.ry : A.ry) };
      to = { x: A.cx, y: B.cy + (up ? B.ry : -B.ry) };
    } else if (Math.abs(dy) < A.ry * 0.5) {     // same row → horizontal
      const right = dx > 0;
      from = { x: A.cx + (right ? A.rx : -A.rx), y: A.cy };
      to = { x: B.cx + (right ? -B.rx : B.rx), y: A.cy };
    } else {                                    // offset → straight diagonal to the rims
      from = ovalEdge(A.cx, A.cy, A.rx, A.ry, B.cx, B.cy);
      to = ovalEdge(B.cx, B.cy, B.rx, B.ry, A.cx, A.cy);
    }
    return { id: r.id != null ? r.id : "r" + i, kind: r.kind, label: r.label,
      labelDx: r.labelDx, labelDy: r.labelDy, from, to };
  });

  // visibility (for the stepper): render-only filter; bounds still span the FULL
  // diagram so the frame never moves between steps.
  const has = (arr, id) => !arr || arr.indexOf(id) >= 0;
  const vAct = (id) => !visible || has(visible.actors, id);
  const vCase = (id) => !visible || has(visible.cases, id);
  const vRel = (id) => !visible || has(visible.relations, id);

  const b = makeBounds();
  b.box(bx, bTop, bw, bh);
  cs.forEach((c) => b.oval(c.cx, c.cy, c.rx, c.ry));
  acts.forEach((a) => b.actor(a.ax, a.midY - Actor.ARM, a.label));

  // teaching role labels (only for the 1-actor, 1-case figure)
  let roles = null;
  if (showRoles && acts.length === 1 && cs.length === 1) {
    const rY = b.y1 + 20;
    roles = [
      { x: acts[0].ax, t: "actor" },
      { x: (acts[0].ax + cs[0].cx) / 2, t: "association" },
      { x: cs[0].cx, t: "use case" },
    ];
    roles.forEach((r) => { r.y = rY; b.text(r.x, rY, estHalf(r.t, UI_CH)); });
  }
  let capY = null;
  if (caption) { capY = b.y1 + 24; b.text(boundCX, capY, estHalf(caption.text || caption, UI_CH)); }

  const aria = `Use-case diagram${system ? " for " + system : ""}: `
    + acts.map((a) => joinLabel(a.label)).join(", ") + (acts.length ? " — " : "")
    + cs.map((c) => joinLabel(c.label)).join(", ") + ".";

  // Wrap an actor/oval in a focusable, clickable group so the diagram itself is a
  // control surface (Enter/Space activate it, matching the builder chips). A ring
  // shows on focus or when the element is the current pick; a transparent hit-rect
  // over the whole box makes the stroke-only actor glyph clickable across its area.
  const pickable = (id, kind, name, box, isOval, glyph) => {
    const ring = id === pickedId || id === focusId;
    return (
      <g key={id} role="button" tabIndex={0} aria-label={`${name} (${kind})`} className="uc-pickable"
        style={{ cursor: "pointer" }}
        onClick={(e) => { e.stopPropagation(); onPick(id); }}
        onFocus={() => setFocusId(id)} onBlur={() => setFocusId((f) => (f === id ? null : f))}
        onKeyDown={onEnterOrSpace(() => onPick(id))}>
        {ring ? (isOval
          ? <ellipse cx={box.x + box.w / 2} cy={box.y + box.h / 2} rx={box.w / 2 + 5} ry={box.h / 2 + 5}
              style={{ fill: "none", stroke: "var(--mm-ptr)", strokeWidth: 2 }} />
          : <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={9}
              style={{ fill: "none", stroke: "var(--mm-ptr)", strokeWidth: 2 }} />) : null}
        <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="transparent" />
        {glyph}
      </g>
    );
  };

  return (
    <DiagramSvg viewBox={b.viewBox()} maxWidth={maxWidth || Math.min(720, Math.round(b.width()))} ariaLabel={aria}>
      {system ? <SystemBoundary x={bx} y={bTop} w={bw} h={bh} label={system} /> : null}
      {branchSets.map((bs) => {
        const vis = bs.branches.filter((br) => !visible || (vAct(bs.actor) && vCase(br.cid)));
        if (!vis.length) return null;
        const s = { stroke: "var(--mm-muted)", strokeWidth: 1.5 };
        const ys = [bs.midY, ...vis.map((br) => br.enterY)];
        // A case on the actor's OWN row is reached by the arm itself — one clean
        // association straight into the oval, so no branch-origin lands on top of
        // the arm. The rest branch off the distribution line as usual.
        const onRow = vis.find((br) => Math.abs(br.enterY - bs.midY) < 0.5);
        const others = vis.filter((br) => br !== onRow);
        return (
          <g key={bs.actor}>
            {onRow
              ? <UmlLink kind="assoc" from={{ x: bs.armX, y: bs.midY }} to={{ x: onRow.rimX, y: bs.midY }} />
              : <line x1={bs.armX} y1={bs.midY} x2={bs.spineX} y2={bs.midY} style={s} />}
            {!bs.single ? <line x1={bs.spineX} y1={Math.min(...ys)} x2={bs.spineX} y2={Math.max(...ys)} style={s} /> : null}
            {others.map((br) => <UmlLink key={br.cid} kind="assoc" from={{ x: bs.spineX, y: br.enterY }} to={{ x: br.rimX, y: br.enterY }} />)}
          </g>
        );
      })}
      {rels.filter((r) => vRel(r.id)).map((r) => (
        <UmlLink key={r.id} kind={r.kind} from={r.from} to={r.to} label={r.label} labelDx={r.labelDx} labelDy={r.labelDy} />
      ))}
      {acts.filter((a) => vAct(a.id)).map((a) => {
        const glyph = <Actor key={a.id} x={a.ax} y={a.midY - Actor.ARM} label={a.label} active />;
        if (!onPick) return glyph;
        const y0 = a.midY - Actor.ARM;
        return pickable(a.id, "actor", joinLabel(a.label), { x: a.ax - 20, y: y0 - 3, w: 40, h: 80 }, false, glyph);
      })}
      {cs.filter((c) => vCase(c.id)).map((c) => {
        const glyph = <UseCaseOval key={c.id} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} label={c.label} sub={c.sub} dashed={c.dashed} />;
        if (!onPick) return glyph;
        return pickable(c.id, "case", joinLabel(c.label), { x: c.cx - c.rx, y: c.cy - c.ry, w: 2 * c.rx, h: 2 * c.ry }, true, glyph);
      })}
      {roles ? roles.map((r, i) => (
        <text key={"rl" + i} x={r.x} y={r.y} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic", fontFamily: "system-ui, sans-serif" }}>{r.t}</text>
      )) : null}
      {caption ? <FigureCaption x={boundCX} y={capY} text={caption.text || caption} color={caption.color} /> : null}
    </DiagramSvg>
  );
}

/* UseCaseRelation — the three use-case-to-use-case relationships as one data
   shape: a `focal` case and its `satellites`, wired by `kind`. The focal sits on
   the LEFT; the satellites stack on the RIGHT, each joined to the focal by a
   STRAIGHT line running right → left (child→parent, base→included, extension→base).
   A single satellite sits on the focal's row (a horizontal arrow); two or more
   fan in as straight diagonals that meet the focal without crossing anything.
   Every oval shares one width. */
export function UseCaseRelation({ focal, satellites = [], kind = "generalize",
  caption, maxWidth, ry = 26 }) {
  const f = typeof focal === "string" ? { label: focal } : { ...focal };
  const sats = satellites.map((s) => (typeof s === "string" ? { label: s } : { ...s }));
  if (f.sub == null && kind !== "generalize") f.sub = 1;   // tint the include/extend target
  const rx = Math.max(ovalRx(f.label), ...sats.map((s) => ovalRx(s.label)));   // equal width
  f.rx = rx; f.ry = ry; f.cx = 0; f.cy = 0;

  const gapX = 132, sGap = 34;                 // stack the satellites to the right
  const totalH = sats.length * 2 * ry + (sats.length - 1) * sGap;
  let y = -totalH / 2 + ry;
  sats.forEach((s) => { s.cx = 2 * rx + gapX; s.cy = sats.length === 1 ? 0 : y; s.rx = rx; s.ry = ry; y += 2 * ry + sGap; });

  const b = makeBounds();
  [f, ...sats].forEach((o) => b.oval(o.cx, o.cy, o.rx, o.ry));
  const capColor = { generalize: "--mm-ptr", include: "--mm-ref", extend: "--mm-hl" }[kind];
  let capY = null;
  if (caption) { capY = b.y1 + 26; b.text((b.x0 + b.x1) / 2, capY, estHalf(caption.text || caption, UI_CH)); }

  const aria = `${kind} relationship: ${sats.map((s) => (Array.isArray(s.label) ? s.label.join(" ") : s.label)).join(", ")} `
    + `${kind === "generalize" ? "generalize to" : kind === "include" ? "each include" : "each extend"} `
    + `${Array.isArray(f.label) ? f.label.join(" ") : f.label}.`;

  return (
    <DiagramSvg viewBox={b.viewBox()} maxWidth={maxWidth || Math.min(560, Math.round(b.width()))} ariaLabel={aria}>
      {sats.map((s, i) => (
        <UmlLink key={i} kind={kind}
          from={ovalEdge(s.cx, s.cy, s.rx, s.ry, f.cx, f.cy)}
          to={ovalEdge(f.cx, f.cy, f.rx, f.ry, s.cx, s.cy)}
          labelDy={-7} />
      ))}
      <UseCaseOval cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry} label={f.label} sub={f.sub} />
      {sats.map((s, i) => <UseCaseOval key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} label={s.label} sub={s.sub} dashed={s.dashed} />)}
      {caption ? <FigureCaption x={(b.x0 + b.x1) / 2} y={capY} text={caption.text || caption} color={capColor} /> : null}
    </DiagramSvg>
  );
}

/* UseCaseWalkthrough — a stepped reveal of a UseCaseDiagram spec. Each step names
   which actors / cases / relations are visible; the frame is fixed (bounds come
   from the FULL spec) so nothing jumps as pieces appear. Caption + Reset/Back/Next
   chrome mirror MemoryScene. */
export function UseCaseWalkthrough({ title, spec, steps, maxWidth }) {
  const [i, setI] = React.useState(0);
  const i2 = Math.min(i, steps.length - 1);
  const step = steps[i2];
  return (
    <div className="mm-scene">
      {title ? <div className="mm-scene__title" data-artifact-title>{title}</div> : null}
      <UseCaseDiagram {...spec} caption={null} visible={step.show} maxWidth={maxWidth} />
      {step.caption ? <p className="mm-scene__caption">{renderCaption(step.caption)}</p> : null}
      <div className="mm-scene__nav">
        <Button variant="ghost" size="sm" disabled={i2 === 0} onClick={() => setI(0)}>Reset</Button>
        <Button variant="outline" size="sm" disabled={i2 === 0} onClick={() => setI(i2 - 1)}>Back</Button>
        <div className="mm-scene__dots" role="tablist">
          {steps.map((_, n) => (
            <button key={n} type="button" aria-label={"Step " + (n + 1)} aria-selected={n === i2}
              className={"mm-dot" + (n === i2 ? " mm-dot--on" : "")} onClick={() => setI(n)} />
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={i2 === steps.length - 1} onClick={() => setI(i2 + 1)}>Next</Button>
        <span className="mm-scene__step">{i2 + 1} / {steps.length}</span>
      </div>
    </div>
  );
}

/* The Library System worked example (note 12) — the richest use-case diagram in
   the course: two actors flanking the boundary, columns of use cases, a shared
   case reached by both, and «extend» relations between cases. ONE spec drives
   both the stepped walkthrough and the static reference figure. */
export const librarySystem = {
  system: "Library System",
  actors: [
    // actors aligned from the top: the first actor sits level with the first use
    // case (so the very first association reads as a clean horizontal).
    { id: "borrower", label: ["Borrower", "(Member)"], x: 200, y: 60 },
    { id: "librarian", label: "Librarian", x: 200, y: 340 },
  ],
  cases: [
    // base cases — the middle column, reached by the actors
    { id: "search",   label: "Search for book",     x: 430, y: 60 },
    { id: "list",     label: "List all Borrowings",  x: 430, y: 140, sub: 1 },
    { id: "add",      label: "Add book",             x: 430, y: 220 },
    { id: "remove",   label: "Remove Book",          x: 430, y: 300 },
    { id: "update",   label: "Update Book",          x: 430, y: 380 },
    { id: "organize", label: "Organize Books",       x: 430, y: 460 },
    // optional refinements — their own column on the right, row-aligned with the
    // base they «extend», so every extend arrow is a clean horizontal.
    { id: "borrow",   label: "Borrow Book",          x: 720, y: 60 },
    { id: "return",   label: "Return Book",          x: 720, y: 140 },
  ],
  associations: [
    { actor: "borrower", cases: ["search", "list"] },
    { actor: "librarian", cases: ["add", "remove", "update", "organize", "list"] },
  ],
  relations: [
    { id: "e-borrow", from: "borrow", to: "search", kind: "extend", labelDy: -8 },
    { id: "e-return", from: "return", to: "list", kind: "extend", labelDy: -8 },
  ],
};

const ALL_CASES = librarySystem.cases.map((c) => c.id);
const BASE_CASES = ["search", "list", "add", "remove", "update", "organize"];
const BOTH = ["borrower", "librarian"];
export const librarySteps = [
  { caption: "**Actors.** Two actors sit *outside* the system: the **Borrower (Member)** and the **Librarian**. Neither is part of the software — they are who it serves.",
    show: { actors: BOTH, cases: [], relations: [] } },
  { caption: "**The Borrower's goal.** A member's core interaction goes *inside* the boundary as a use-case oval — `Search for book`, joined to the Borrower by a plain association. Borrowing and returning arrive later, as refinements.",
    show: { actors: BOTH, cases: ["search"], relations: [] } },
  { caption: "**The Librarian's goals.** The librarian manages the catalogue from the same boundary: `Add book`, `Remove Book`, `Update Book`, `Organize Books`.",
    show: { actors: BOTH, cases: ["search", "add", "remove", "update", "organize"], relations: [] } },
  { caption: "**A shared use case.** `List all Borrowings` is reached by **both** actors — one behaviour, two associations. A shared case is why both actors and all the use cases live in one diagram rather than two.",
    show: { actors: BOTH, cases: BASE_CASES, relations: [] } },
  { caption: "**«extend» relations.** Finally the optional refinements, pulled into their own column on the right: `Borrow Book` **«extend»** `Search for book`, and `Return Book` **«extend»** `List all Borrowings` — optional behaviour layered onto an already-complete base.",
    show: { actors: BOTH, cases: ALL_CASES, relations: ["e-borrow", "e-return"] } },
];

/* ---- The unit converter (note 14) — the spec that drives the whole iterative
   design story. The actor has two goals that differ ONLY in a unit, so the first
   cut states the same shape twice; generalizing them under one parameterized
   `Convert` deletes that duplication, and the sequence + class diagrams downstream
   get simpler for free. Shared by converter-use-case-generalize (the walkthrough)
   and converter-use-case-final (the settled figure). ---- */
export const converterUseCase = {
  system: "Unit Converter",
  actors: [{ id: "user", label: "User", x: 150, y: 150 }],
  cases: [
    { id: "kglb",    label: "Convert Kg → Lb",   x: 430, y: 80 },
    { id: "cminch",  label: "Convert Cm → Inch", x: 430, y: 220 },
    { id: "convert", label: "Convert(amount, targetUnit)", x: 760, y: 150, sub: 1 },
  ],
  associations: [{ actor: "user", cases: ["kglb", "cminch"] }],
  relations: [
    { id: "g-kglb",   from: "kglb",   to: "convert", kind: "generalize", labelDy: -8 },
    { id: "g-cminch", from: "cminch", to: "convert", kind: "generalize", labelDy: 14 },
  ],
};

// Two steps, not three: a step whose figure is identical to the one before it is a
// step that shows the reader nothing. Each step here changes the diagram.
export const converterUseCaseSteps = [
  { caption: "**The honest first draft.** One actor, one goal per thing the user can do: `Convert Kg → Lb` and `Convert Cm → Inch`, each joined to the `User` by a plain association. The two ovals differ only in a **unit** — the duplication that was visual in the GUI is now structural in the model.",
    show: { actors: ["user"], cases: ["kglb", "cminch"], relations: [] } },
  { caption: "**Generalize.** Make the unit *data* rather than *identity*: one parameterized `Convert(amount, targetUnit)` parent, with the two conversions as children under the hollow-triangle **generalization** arrow. The actor keeps the same power; the model stops saying the same thing twice.",
    show: { actors: ["user"], cases: ["kglb", "cminch", "convert"], relations: ["g-kglb", "g-cminch"] } },
];

/* The three sequence specs for the same story (note 14). The Kg→Lb and Cm→Inch
   interactions are the SAME shape — they differ only in the dialog class and the
   worker's method name. Once `Converter` exposes one `convert(amount, targetUnit)`,
   the two collapse into a single interaction. Shared by converter-sequence-merge
   (the walkthrough) and converter-sequence-one (the merged figure). */
const convSeq = (dialog, click, call) => ({
  participants: [
    { id: "user", label: "User", kind: "actor" },
    { id: "b", label: "b : MainGUI" },
    { id: "k", label: dialog },
    { id: "c", label: "c : Converter" },
  ],
  messages: [
    { from: "user", to: "b", label: click, kind: "sync" },                 // 0
    { from: "b", to: "k", label: "new / show()", kind: "sync" },           // 1
    // A SELF message's label is excluded from the kit's column-gap sizing, so a long
    // one overruns the next lifeline. Kept short deliberately; the note carries the
    // `getInput() → amount` detail in prose.
    { from: "k", to: "k", label: "getInput()", kind: "sync", self: true },  // 2
    { from: "k", to: "c", label: call, kind: "sync" },                     // 3
    { from: "c", to: "k", label: "result", kind: "return" },               // 4
    { from: "k", to: "user", label: "display(result)", kind: "return" },   // 5
  ],
  activations: [
    { p: "b", from: 0, to: 1 },
    { p: "k", from: 1, to: 5 },
    { p: "c", from: 3, to: 4 },
  ],
});

export const converterSeqKgLb = convSeq("k : KgLbGUI", "click Kg → Lb", "convertKgToLb(amount)");
export const converterSeqCmInch = convSeq("k : CmInchGUI", "click Cm → Inch", "convertCmToInch(amount)");
export const converterSeqMerged = convSeq("k : ConverterGUI", "click Convert", "convert(amount, targetUnit)");

/* The Digital Sound Recorder worked example (note 12), refined form. Same
   two-column shape as the Library figure: the User's cases — Record a file,
   View Recordings, Edit settings — sit in a LEFT column; the three refinements
   — Play, Delete, Edit recording — stack in a RIGHT column and «extend» the
   `View Recordings` hub, fanning in (horizontal for the middle one, diagonal for
   the top and bottom). */
export const soundRecorder = {
  system: "Digital Sound Recorder",
  actors: [{ id: "user", label: "User", x: -40, y: 210 }],
  cases: [
    // left column — the User's cases, View Recordings the shared hub
    { id: "record",   label: "Record a file",      x: 180, y: 70 },
    { id: "view",     label: "View Recordings",     x: 180, y: 210, sub: 1 },
    { id: "settings", label: "Edit settings",       x: 180, y: 350 },
    // right column — the three optional refinements
    { id: "play",     label: "Play a Recording",    x: 560, y: 70 },
    { id: "delete",   label: "Delete a Recording",  x: 560, y: 210 },
    { id: "editrec",  label: "Edit recording",      x: 560, y: 350 },
  ],
  associations: [{ actor: "user", cases: ["record", "view", "settings"] }],
  relations: [
    { id: "x-play",    from: "play",    to: "view", kind: "extend", labelDy: -7 },
    { id: "x-delete",  from: "delete",  to: "view", kind: "extend", labelDy: -8 },
    { id: "x-editrec", from: "editrec", to: "view", kind: "extend", labelDy: 14 },
  ],
  caption: { text: "the three refinements «extend» the View Recordings hub — each an optional add-on", color: "--mm-muted" },
};

// entry points — a demo exports one of these with a pure data spec.
export function useCaseDiagram(cfg) { return function App() { return React.createElement(UseCaseDiagram, cfg); }; }
export function useCaseRelation(cfg) { return function App() { return React.createElement(UseCaseRelation, cfg); }; }
export function useCaseWalkthrough(cfg) { return function App() { return React.createElement(UseCaseWalkthrough, cfg); }; }

/* ---- UML SEQUENCE DIAGRAM (note 13) — the Interaction-family diagram note 12
   deferred. Participants (an Actor stick figure or an object :Class box) sit
   across the TOP, each dropping a dashed LIFELINE; time flows DOWN, so every
   message is a row. Message kinds:
     sync    solid line, filled head   — a call that blocks until it returns
     async   solid line, open head     — fire-and-forget, no wait
     return  dashed line, open head     — control flowing back to the caller
   An ACTIVATION bar (thin box on a lifeline) marks a method on the stack. A
   COMBINED FRAGMENT (opt / alt / loop) frames a span of rows. Everything is
   data-driven and the viewBox is measured from the shapes, exactly like the
   use-case primitives above.
     sequenceDiagram({
       participants: [{ id, label, kind:"object"|"actor", bornAt, diesAt }],
       messages:    [{ from, to, label, kind:"sync"|"async"|"return", self }],
       activations: [{ p, from, to, dx }],          // row-index span of a stack frame
       fragments:   [{ kind:"opt"|"alt"|"loop", guard, from, to,
                       dividers:[{ at, guard }] }], // `at` = row of the [else] split
       annotations: [{ t, x, y, to:{ x, y } }],     // teaching leader-labels
     })
   Rows are message indices (0-based); activations/fragments reference them.  ---- */
const SEQ = { ROW: 46, HEADER: 80, MSGTOP: 18, AW: 9, GAPMIN: 52, BOX_H: 30, BAND: 26, LABELPAD: 22 };

// object header: a box with the participant's underlined name (`name : Class`).
function SeqObjectBox({ label, cx, top }) {
  const w = Math.max(64, String(label).length * MONO_CH + 22);
  return (
    <g>
      <rect x={cx - w / 2} y={top} width={w} height={SEQ.BOX_H} rx={3}
        style={{ fill: "var(--mm-panel-bg)", stroke: "var(--mm-cell-bd)", strokeWidth: 1.5 }} />
      <text x={cx} y={top + SEQ.BOX_H / 2 + 1} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 12, fontWeight: 600, textDecoration: "underline" }}>{label}</text>
    </g>
  );
}

export function SequenceDiagram({ participants = [], messages = [], activations = [],
  fragments = [], annotations = [], caption, maxWidth }) {
  const ps = participants.map((p) => ({ ...p, kind: p.kind || "object" }));
  const halfW = (p) => p.kind === "actor"
    ? Math.max(22, (String(p.label).length * MONO_CH) / 2)
    : Math.max(34, (String(p.label).length * MONO_CH + 22) / 2);
  // lay participants left→right. Each gap is the LARGER of (a) a base gap that keeps
  // neighbouring headers apart and (b) the widest message label riding between that
  // adjacent pair — so a long call like place_order(order_details) is not clipped by
  // the two lifelines it sits between, while columns whose labels are short stay
  // narrow. (Labels spanning more than one column already have ample room.)
  const idxOf = Object.fromEntries(ps.map((p, i) => [p.id, i]));
  const gapNeed = new Array(Math.max(0, ps.length - 1)).fill(0);
  messages.forEach((m, mi) => {
    if (m.from === m.to || m.self || !m.label) return;
    const a = idxOf[m.from], bi = idxOf[m.to];
    if (a == null || bi == null || Math.abs(a - bi) !== 1) return;   // adjacent pairs only
    const g = Math.min(a, bi);
    // a creation message shares its row with the target's floating header, which
    // reaches halfW(target) back toward the sender — reserve that too, or a long
    // label like new(title, passcode) is clipped by the header it created.
    const extra = ps[bi].bornAt === mi ? halfW(ps[bi]) : 0;
    gapNeed[g] = Math.max(gapNeed[g], String(m.label).length * MONO_CH + SEQ.LABELPAD + extra);
  });
  let x = 0;
  ps.forEach((p, i) => {
    if (i > 0) x += Math.max(halfW(ps[i - 1]) + halfW(p) + SEQ.GAPMIN, gapNeed[i - 1]);
    p.cx = x;
  });
  const byId = Object.fromEntries(ps.map((p) => [p.id, p]));

  const headerBottom = SEQ.HEADER;
  const msgTop = headerBottom + SEQ.MSGTOP;
  // a combined fragment (and each [else] divider) needs a header band above its
  // first message so the guard label sits in clear space, not on the arrow. Rows
  // are laid out cumulatively so activations/fragments still index by message.
  const rowPad = messages.map((m) => m.padTop || 0);
  fragments.forEach((f) => {
    if (rowPad[f.from] != null) rowPad[f.from] += SEQ.BAND;
    (f.dividers || []).forEach((d) => { if (rowPad[d.at] != null) rowPad[d.at] += SEQ.BAND; });
  });
  const yOf = [];
  { let acc = msgTop; messages.forEach((m, i) => { acc += (i ? SEQ.ROW : 0) + rowPad[i]; yOf.push(acc); }); }
  const msgY = (i) => yOf[Math.max(0, Math.min(yOf.length - 1, i))] ?? (msgTop + i * SEQ.ROW);
  const bottomY = (yOf[yOf.length - 1] ?? msgTop) + 32;

  // a born object's header floats at its creation row; others sit at the top.
  const headTop = (p) => (p.bornAt != null ? msgY(p.bornAt) - SEQ.BOX_H / 2 : 0);
  const lifeTop = (p) => (p.bornAt != null ? msgY(p.bornAt) + SEQ.BOX_H / 2 : headerBottom);
  const lifeBot = (p) => (p.diesAt != null ? msgY(p.diesAt) : bottomY);

  // is participant P inside an activation bar at row i? (so arrows touch the bar)
  const activeAt = (pid, i) => activations.some((a) => a.p === pid && i >= a.from && i <= a.to);
  const edge = (p, i, sign) => p.cx + (activeAt(p.id, i) ? sign * SEQ.AW / 2 : 0);

  const minX = Math.min(...ps.map((p) => p.cx));
  const maxX = Math.max(...ps.map((p) => p.cx));

  // ---- measure ----
  const b = makeBounds();
  ps.forEach((p) => {
    if (p.kind === "actor") b.actor(p.cx, headTop(p), p.label);
    else b.box(p.cx - halfW(p), headTop(p), 2 * halfW(p), SEQ.BOX_H);
    b.add(p.cx, lifeBot(p), p.cx, lifeBot(p) + 10);
  });
  messages.forEach((m, i) => {
    const y = msgY(i);
    if (m.from === m.to || m.self) {
      const lw = m.label ? String(m.label).length * MONO_CH : 0;
      b.add(byId[m.from].cx, y - 10, byId[m.from].cx + 34 + 10 + lw, y + 22);
    }
    const A = byId[m.from], B = byId[m.to];
    const midX = (A.cx + B.cx) / 2, halfLab = estHalf(m.label || "", MONO_CH);
    b.text(midX, y - 6, Math.max(halfLab, 20));
  });
  fragments.forEach((f) => b.box(minX - 34, msgY(f.from) - SEQ.BAND - 8,
    (maxX - minX) + 68, (msgY(f.to) - msgY(f.from)) + SEQ.BAND + 30));
  annotations.forEach((a) => {
    const w = String(a.t).length * UI_CH;
    const x0 = a.anchor === "end" ? a.x - w : a.anchor === "start" ? a.x : a.x - w / 2;
    b.add(x0, a.y - 11, x0 + w, a.y + 3);
    if (a.to) b.add(a.to.x, a.to.y, a.to.x, a.to.y);
  });
  let capY = null;
  if (caption) { capY = b.y1 + 24; b.text((minX + maxX) / 2, capY, estHalf(caption.text || caption, UI_CH)); }

  const aria = "Sequence diagram: " + ps.map((p) => p.label).join(", ") + ". "
    + messages.filter((m) => m.label).map((m) => `${byId[m.from].label} ${m.label} ${byId[m.to].label}`).join("; ") + ".";

  const lineFor = (kind) => ({
    stroke: kind === "return" ? "var(--mm-muted)" : "var(--mm-cell-fg)",
    strokeWidth: 1.6, fill: "none", strokeDasharray: kind === "return" ? "5 4" : "none",
  });
  const headFor = (kind) => (kind === "sync" ? "url(#seq-sync)" : "url(#seq-open)");

  return (
    <DiagramSvg viewBox={b.viewBox()} maxWidth={maxWidth || Math.min(760, Math.round(b.width()))} ariaLabel={aria}>
      <defs>
        <marker id="seq-sync" markerWidth="10" markerHeight="10" refX="7.5" refY="4.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L8,4.5 L1,8 Z" style={{ fill: "var(--mm-cell-fg)" }} />
        </marker>
        <marker id="seq-open" markerWidth="12" markerHeight="11" refX="8.5" refY="5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1.5,1 L8.5,5 L1.5,9" style={{ fill: "none", stroke: "var(--mm-muted)", strokeWidth: 1.5 }} />
        </marker>
      </defs>

      {/* lifelines */}
      {ps.map((p) => (
        <line key={"ll" + p.id} x1={p.cx} y1={lifeTop(p)} x2={p.cx} y2={lifeBot(p)}
          style={{ stroke: "var(--mm-muted)", strokeWidth: 1.3, strokeDasharray: "4 5" }} />
      ))}

      {/* combined fragments (drawn under the messages) */}
      {fragments.map((f, i) => {
        const y0 = msgY(f.from) - SEQ.BAND - 6, y1 = msgY(f.to) + 16;
        const fx = minX - 30, fw = (maxX - minX) + 60;
        const tabW = 34 + (f.kind === "loop" ? 4 : 0);
        return (
          <g key={"fr" + i}>
            <rect x={fx} y={y0} width={fw} height={y1 - y0} rx={3}
              style={{ fill: "none", stroke: "var(--mm-muted)", strokeWidth: 1.3 }} />
            <path d={`M ${fx} ${y0} h ${tabW} l 0 12 l -8 8 h ${-(tabW - 8)} Z`}
              style={{ fill: "var(--mm-panel-bg)", stroke: "var(--mm-muted)", strokeWidth: 1.3 }} />
            <text x={fx + 6} y={y0 + 14} style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontWeight: 700 }}>{f.kind}</text>
            {(f.dividers || []).map((d, k) => (
              <line key={"dv" + k} x1={fx} y1={msgY(d.at) - SEQ.BAND - 2} x2={fx + fw} y2={msgY(d.at) - SEQ.BAND - 2}
                style={{ stroke: "var(--mm-muted)", strokeWidth: 1, strokeDasharray: "5 4" }} />
            ))}
          </g>
        );
      })}

      {/* activation bars — from === to is a NESTED self-call bar: it spans the
          self-loop's height (±8, matching the loop path's ±7) instead of the
          usual ±2 trim, and rides `dx` so it sits half-atop its parent bar. */}
      {activations.map((a, i) => {
        const p = byId[a.p]; if (!p) return null;
        const pad = a.from === a.to ? 8 : 2;
        const y0 = msgY(a.from) - pad, y1 = msgY(a.to) + pad;
        return (
          <rect key={"ac" + i} x={p.cx - SEQ.AW / 2 + (a.dx || 0)} y={y0} width={SEQ.AW} height={y1 - y0}
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-muted)", strokeWidth: 1.2 }} />
        );
      })}

      {/* messages */}
      {messages.map((m, i) => {
        const y = msgY(i), A = byId[m.from], B = byId[m.to];
        if (m.from === m.to || m.self) {           // self-call: a small loop back to the lifeline
          const sx = edge(A, i, 1), w = 34;
          return (
            <g key={"m" + i}>
              <path d={`M ${sx} ${y - 7} h ${w} v 14 h ${-w}`} markerEnd={headFor(m.kind || "sync")}
                style={lineFor(m.kind || "sync")} />
              {m.label ? (
                <text x={sx + w + 7} y={y} dominantBaseline="central"
                  style={{ fill: "var(--mm-cell-fg)", fontSize: 11, fontFamily: 'ui-monospace, Menlo, monospace' }}>{m.label}</text>
              ) : null}
            </g>
          );
        }
        const kind = m.kind || "sync", right = B.cx > A.cx;
        // a CREATE message (its row is the target's bornAt) points at the edge of
        // the floating header box, per UML — not at the lifeline underneath it.
        const sx = edge(A, i, right ? 1 : -1);
        const tx = B.bornAt === i
          ? B.cx + (right ? -1 : 1) * (halfW(B) + 2)
          : edge(B, i, right ? -1 : 1);
        return (
          <g key={"m" + i}>
            <line x1={sx} y1={y} x2={tx} y2={y} markerEnd={headFor(kind)} style={lineFor(kind)} />
            {m.label ? (
              <text x={(sx + tx) / 2} y={y - 6} textAnchor="middle"
                style={{ fill: "var(--mm-cell-fg)", fontSize: 11, fontFamily: 'ui-monospace, Menlo, monospace' }}>{m.label}</text>
            ) : null}
          </g>
        );
      })}

      {/* headers (drawn last so nothing overlaps them) + object-death X */}
      {ps.map((p) => (
        <g key={"h" + p.id}>
          {p.kind === "actor"
            ? <Actor x={p.cx} y={headTop(p)} label={p.label} />
            : <SeqObjectBox label={p.label} cx={p.cx} top={headTop(p)} />}
          {p.diesAt != null ? (
            <g style={{ stroke: "var(--mm-muted)", strokeWidth: 1.8 }}>
              <line x1={p.cx - 7} y1={msgY(p.diesAt) - 7} x2={p.cx + 7} y2={msgY(p.diesAt) + 7} />
              <line x1={p.cx - 7} y1={msgY(p.diesAt) + 7} x2={p.cx + 7} y2={msgY(p.diesAt) - 7} />
            </g>
          ) : null}
        </g>
      ))}

      {/* teaching annotations: an italic label + an optional leader line */}
      {annotations.map((a, i) => (
        <g key={"an" + i}>
          {a.to ? <line x1={a.x} y1={a.y + (a.to.y > a.y ? 3 : -9)} x2={a.to.x} y2={a.to.y}
            style={{ stroke: "var(--mm-muted)", strokeWidth: 1, strokeDasharray: "2 3" }} /> : null}
          <text x={a.x} y={a.y} textAnchor={a.anchor || "middle"}
            style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic", fontFamily: "system-ui, sans-serif" }}>{a.t}</text>
        </g>
      ))}
      {/* guard labels last, on a chip, so they read over lifelines + activation bars */}
      {fragments.flatMap((f, i) => {
        const fx = minX - 30, tabW = 34 + (f.kind === "loop" ? 4 : 0);
        const items = [];
        // start the tab-side guard clear of the leftmost lifeline/activation bar
        // (which runs down inside the frame) so `[balance >= amount]` isn't jammed
        // against it; the `[else]` guard sits in the left tab margin as usual.
        if (f.guard) items.push({ x: fx + tabW + 16, y: msgY(f.from) - SEQ.BAND - 6 + 14, t: `[${f.guard}]` });
        (f.dividers || []).forEach((d) => {
          if (d.guard) items.push({ x: fx + 8, y: msgY(d.at) - SEQ.BAND - 2 + 14, t: `[${d.guard}]` });
        });
        return items.map((g, k) => (
          <g key={"g" + i + "-" + k}>
            <rect x={g.x - 4} y={g.y - 12} width={g.t.length * MONO_CH + 8} height={16} rx={2}
              style={{ fill: "var(--mm-panel-bg)" }} />
            <text x={g.x} y={g.y} style={{ fill: "var(--mm-cell-fg)", fontSize: 11, fontWeight: 600 }}>{g.t}</text>
          </g>
        ));
      })}
      {caption ? <FigureCaption x={(minX + maxX) / 2} y={capY} text={caption.text || caption} color={caption.color} /> : null}
    </DiagramSvg>
  );
}

export function sequenceDiagram(cfg) { return function App() { return React.createElement(SequenceDiagram, cfg); }; }

/* Interactive: order the messages of an interaction top-to-bottom. The bank is a
   seeded shuffle of the (correctly-ordered) messages; the student fills N ordered
   slots and the real SequenceDiagram redraws from the current order. Ungraded:
   per-slot right/wrong + why on Check, plus Reset/Reveal. */
export function SequenceOrderBuilder({ prompt, participants = [], messages = [], activations = [] }) {
  const correctIds = messages.map((m) => m.id);
  const byId = React.useMemo(() => Object.fromEntries(messages.map((m) => [m.id, m])), [messages]);
  // chips name endpoints by the participant's LABEL (its class part for an
  // `name : Class` object), never the internal id — "Model", not "m" or "model".
  const pName = React.useMemo(() => Object.fromEntries(participants.map((p) => {
    const l = Array.isArray(p.label) ? p.label.join(" ") : String(p.label);
    return [p.id, l.includes(":") ? l.split(":").pop().trim() : l];
  })), [participants]);
  const ends = (m) => `${pName[m.from] || m.from} → ${pName[m.to] || m.to}`;
  const seed = React.useMemo(() => hashSeed(correctIds.join("")), [correctIds.join("")]);
  const shuffled = React.useMemo(() => seededShuffle(correctIds, seed), [seed]);

  const [placed, setPlaced] = React.useState([]);   // ids in slot order
  const [checked, setChecked] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  const bank = shuffled.filter((id) => !placed.includes(id));
  const N = messages.length;
  const complete = placed.length === messages.length;

  // Check locks the board: once checked (or revealed) the order is fixed and the
  // only way forward is Reset — a post-check edit would invalidate the grade.
  const move = (id, index) => {
    if (revealed || checked) return;
    setPlaced((cur) => {
      const without = cur.filter((x) => x !== id);       // remove from any current slot
      const next = without.slice();
      if (index >= next.length) next.push(id);           // append into the next empty slot
      else next.splice(index, 0, id);
      return next.slice(0, N);
    });
  };
  const removeAt = (index) => { if (!revealed && !checked) setPlaced((c) => c.filter((_, i) => i !== index)); };

  const { picked, chipProps, slotProps } = useTapOrDrag({ onMove: move });

  const grades = checked ? gradeOrder(placed, correctIds) : null;
  // slots render a Chip only when filled, so `filled` is always true here.
  const stateFor = (index) => gradedChipState({ revealed, checked, filled: true, ok: grades ? grades[index].ok : false });

  const shownMessages = (revealed ? correctIds : placed).map((id) => byId[id]);
  const shownActivations = (revealed || complete) ? activations : [];

  const wrongCount = grades ? grades.filter((g) => !g.ok).length : 0;
  const status = revealed ? "Revealed — reset to try again."
    : !checked ? `${placed.length} of ${N} placed`
    : wrongCount === 0 ? "Correct — that's the interaction."
    : `${wrongCount} out of place — reset to try again.`;

  const reset = () => { setPlaced([]); setChecked(false); setRevealed(false); };
  const reveal = () => { setPlaced(correctIds.slice()); setChecked(false); setRevealed(true); };

  return (
    <div className="bex bex-seq">
      {prompt ? <p className="bex-prompt">{prompt}</p> : null}
      <div className="bex-seq__cols">
        <div className="bex-bank" aria-label="message bank">
          {bank.length ? bank.map((id) => (
            <Chip key={id} state={picked === id ? "picked" : "idle"}
              ariaLabel={`message ${ends(byId[id])} ${byId[id].label}, in bank`}
              {...chipProps(id)}>
              {ends(byId[id])} : {byId[id].label}
            </Chip>
          )) : <span className="bex-status">bank empty</span>}
        </div>
        <ol className="bex-slots" aria-label="ordered messages">
          {Array.from({ length: N }, (_, i) => {
            const id = placed[i];
            return (
              <li key={i}>
                <div className="bex-slot" tabIndex={0} role="button"
                  aria-label={`slot ${i + 1}${id ? `: ${byId[id].label}` : ", empty"}`} {...slotProps(i)}>
                  <span className="bex-slot__n">{i + 1}</span>
                  {id ? (
                    <Chip state={stateFor(i)}
                      ariaLabel={`message ${byId[id].label} in slot ${i + 1}`}
                      onClick={() => removeAt(i)}>
                      {ends(byId[id])} : {byId[id].label} ✕
                    </Chip>
                  ) : <span className="bex-status">drop message {i + 1}</span>}
                </div>
                {checked && id && !grades[i].ok && byId[id].why
                  ? <div className="bex-why">{byId[id].why}</div> : null}
              </li>
            );
          })}
        </ol>
      </div>
      {shownMessages.length ? (
        <SequenceDiagram participants={participants} messages={shownMessages} activations={shownActivations} />
      ) : null}
      <BuilderControls status={status} revealed={revealed}
        checkDisabled={placed.length === 0 || checked}
        onCheck={() => setChecked(true)} onReset={reset} onReveal={reveal} />
    </div>
  );
}

export function sequenceOrder(cfg) { return function App() { return React.createElement(SequenceOrderBuilder, cfg); }; }

/* Interactive (note 14): build a UML class box from scratch. The student stamps a
   visibility mark (+ - # ~) on each member and drops a type AFTER the colon, then
   picks the relationship line joining this class to another. Three things the note
   insists on and exams lose: the vis mark, that the TYPE comes after the colon (the
   reverse of Java/C++ declaration order), and which of the five relationship lines
   fits. The editable box is HTML (a real three-compartment UML box, edited in
   place); the relationship + its two boxes render as a real SVG DiagramCard preview
   with the correct UML arrowhead so the student sees the notation they chose.
   Ungraded: per-part right/wrong + why on Check, plus Reset/Reveal. */
const CBX_VIS = ["+", "-", "#", "~"];
const CBX_RELS = [
  { kind: "assoc", glyph: "—", name: "association" },
  { kind: "generalize", glyph: "▷", name: "generalization" },
  { kind: "aggregate", glyph: "◇", name: "aggregation" },
  { kind: "compose", glyph: "◆", name: "composition" },
  { kind: "depend", glyph: "⤏", name: "dependency" },
];
export function ClassBoxBuilder({ prompt, className = "", abstract = false,
  attributes = [], operations = [], typeDistractors = [], relationship = {} }) {
  // one vis slot + one type slot per member; the correct value + why ride along.
  const slots = React.useMemo(() => {
    const out = [];
    attributes.forEach((m, i) => {
      out.push({ id: `a${i}v`, kind: "vis", correct: m.vis, why: m.whyVis, name: m.name });
      out.push({ id: `a${i}t`, kind: "type", correct: m.type, why: m.whyType, name: m.name });
    });
    operations.forEach((m, i) => {
      out.push({ id: `o${i}v`, kind: "vis", correct: m.vis, why: m.whyVis, name: m.name });
      // ret == null means a void operation: UML omits the return type, so there
      // is no type slot to fill (and no colon in the rendered row).
      if (m.ret != null) out.push({ id: `o${i}t`, kind: "type", correct: m.ret, why: m.whyType, name: m.name });
    });
    return out;
  }, [attributes, operations]);

  // the type bank is a multiset: one token per required type occurrence + the
  // authored distractors, shuffled once (seeded, so it is stable per mount but
  // varies per exercise). Grading is by value, so two "double" tokens are equal.
  const typeValues = React.useMemo(
    () => [...attributes.map((a) => a.type), ...operations.filter((o) => o.ret != null).map((o) => o.ret), ...typeDistractors],
    [attributes, operations, typeDistractors]);
  const typeTokens = React.useMemo(
    () => seededShuffle(typeValues.map((v, i) => ({ id: `ty${i}:${v}`, value: v })),
      hashSeed(className + "|" + typeValues.join(","))),
    [typeValues, className]);

  const [fills, setFills] = React.useState({});   // slotId -> { value, tokenId? }
  const [rel, setRel] = React.useState(null);
  const [picked, setPicked] = React.useState(null); // { pool:"vis"|"type", value, tokenId? }
  const [checked, setChecked] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  const usedTokens = new Set(Object.values(fills).map((f) => f.tokenId).filter(Boolean));
  const bank = typeTokens.filter((t) => !usedTokens.has(t.id));

  const pickToken = (pool, value, tokenId) => {
    if (revealed) return;
    setPicked((p) => (p && p.pool === pool && p.value === value && p.tokenId === tokenId)
      ? null : { pool, value, tokenId });
  };
  const fillSlot = (slot) => {
    if (revealed) return;
    setChecked(false);
    if (picked && picked.pool === slot.kind) {
      setFills((f) => ({ ...f, [slot.id]: { value: picked.value, tokenId: picked.tokenId } }));
      setPicked(null);
    } else if (!picked) {
      setFills((f) => { const n = { ...f }; delete n[slot.id]; return n; });   // tap a filled slot to clear it
    }
  };
  const dropOnSlot = (slot, e) => {
    e.preventDefault(); if (revealed) return;
    let d = null; try { d = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (_) { d = picked; }
    if (d && d.pool === slot.kind) { setChecked(false); setFills((f) => ({ ...f, [slot.id]: { value: d.value, tokenId: d.tokenId } })); setPicked(null); }
  };
  const pickRel = (kind) => { if (revealed) return; setChecked(false); setRel(kind); };

  const slotOk = (s) => fills[s.id] && fills[s.id].value === s.correct;
  // `relationship` is optional: a class that joins nothing (note 19's Singleton) has
  // no edge to pick, so the whole stage — palette, grading slot, preview target —
  // drops out rather than showing an empty target card.
  const hasRel = !!relationship.to;
  const relOk = hasRel && rel != null && rel === relationship.kind;
  const total = slots.length + (hasRel ? 1 : 0);
  const correctCount = slots.filter(slotOk).length + (relOk ? 1 : 0);
  const filledCount = slots.filter((s) => fills[s.id]).length;

  const slotState = (s) => gradedChipState({ revealed, checked, filled: !!fills[s.id], ok: slotOk(s) });
  const relState = (kind) => {
    if (rel !== kind) return "idle";
    if (revealed) return "correct";
    if (!checked) return "picked";
    return relOk ? "correct" : "wrong";
  };

  const status = revealed ? "Revealed — reset to try again."
    : !checked ? (hasRel
      ? "Stamp a visibility, drop a type after each colon, pick the relationship — then Check."
      : "Stamp a visibility and drop a type after each colon — then Check.")
    : correctCount === total ? "Correct — that's the class box."
    : `${correctCount} of ${total} right — the red marks show what to fix.`;

  const reset = () => { setFills({}); setRel(null); setPicked(null); setChecked(false); setRevealed(false); };
  const reveal = () => {
    const nf = {}; slots.forEach((s) => { nf[s.id] = { value: s.correct }; });
    setFills(nf); setRel(relationship.kind || null); setPicked(null); setChecked(false); setRevealed(true);
  };

  // ---- live SVG preview: both real DiagramCards + the chosen relationship line ----
  const show = (id) => (fills[id] ? fills[id].value : "·");
  const childAttrRows = attributes.map((m, i) => `${show(`a${i}v`)} ${m.name} : ${show(`a${i}t`)}`);
  const childOpRows = operations.map((m, i) =>
    m.ret != null ? `${show(`o${i}v`)} ${m.name} : ${show(`o${i}t`)}` : `${show(`o${i}v`)} ${m.name}`);
  const childSections = [{ rows: childAttrRows }, { rows: childOpRows }];
  const parentSections = relationship.parentSections || [{ rows: [] }, { rows: [] }];
  const allRows = [className, relationship.to || "", ...childAttrRows, ...childOpRows,
    ...parentSections.flatMap((s) => (s.rows || []).map((r) => (typeof r === "object" ? r.text : r)))];
  const W = Math.max(150, Math.round(Math.max(...allRows.map((r) => String(r).length)) * 6.9) + 26);
  const cx = 14 + W / 2, px = 14;
  const parentTop = 8, parentH = diagramCardHeight(parentSections, { title: true });
  const parentBottom = parentTop + parentH, childTop = parentBottom + 46;
  const childH = diagramCardHeight(childSections, { title: true }), childBottom = childTop + childH;
  const vb = hasRel ? `0 0 ${W + 28} ${childBottom + 12}`
    : `0 0 ${W + 28} ${parentTop + childH + 12}`;

  const renderSlot = (slot) => (
    <Chip state={slotState(slot)}
      ariaLabel={`${slot.kind === "vis" ? "visibility" : "type"} of ${slot.name}${fills[slot.id] ? `: ${fills[slot.id].value}` : ", empty"}`}
      onClick={() => fillSlot(slot)}
      onDragOver={(e) => e.preventDefault()} onDrop={(e) => dropOnSlot(slot, e)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fillSlot(slot); } }}>
      {fills[slot.id] ? fills[slot.id].value : <span className="bex-cbx__ph">{slot.kind}</span>}
    </Chip>
  );
  const whyFor = (slotId) => {
    const s = slots.find((x) => x.id === slotId);
    return checked && s && fills[slotId] && !slotOk(s) && s.why
      ? <div className="bex-why">{s.why}</div> : null;
  };

  return (
    <div className="bex bex-cbx-ex">
      {prompt ? <p className="bex-prompt">{prompt}</p> : null}
      <div className="bex-palette" aria-label="visibility palette">
        <span className="bex-palette__label">Visibility</span>
        {CBX_VIS.map((v) => (
          <Chip key={v} state={picked && picked.pool === "vis" && picked.value === v ? "picked" : "idle"}
            ariaLabel={`visibility ${v}`} draggable={!revealed}
            onDragStart={(e) => { setPicked({ pool: "vis", value: v }); e.dataTransfer.setData("text/plain", JSON.stringify({ pool: "vis", value: v })); }}
            onClick={() => pickToken("vis", v)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickToken("vis", v); } }}>{v}</Chip>
        ))}
      </div>
      {!revealed ? (
        <div className="bex-typebank" aria-label="type bank">
          <span className="bex-typebank__label">Types</span>
          {bank.length ? bank.map((t) => (
            <Chip key={t.id} state={picked && picked.tokenId === t.id ? "picked" : "idle"}
              ariaLabel={`type ${t.value}`} draggable
              onDragStart={(e) => { setPicked({ pool: "type", value: t.value, tokenId: t.id }); e.dataTransfer.setData("text/plain", JSON.stringify({ pool: "type", value: t.value, tokenId: t.id })); }}
              onClick={() => pickToken("type", t.value, t.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickToken("type", t.value, t.id); } }}>{t.value}</Chip>
          )) : <span className="bex-status">every type placed</span>}
        </div>
      ) : null}

      <div className="bex-cbx-wrap">
        {/* left column — everything the student sets: the class card, then the line to the parent */}
        <div className="bex-cbx-build">
          <div className="bex-zone-label">Build the class box</div>
          <div className={"bex-cbx" + (abstract ? " bex-cbx--abstract" : "")} aria-label={`class box for ${className}`}>
            <div className={"bex-cbx__name" + (abstract ? " bex-cbx__name--abstract" : "")}>{className}</div>
            <div className="bex-cbx__sect">
              {attributes.length ? attributes.map((m, i) => (
                <div key={i} className="bex-cbx__row">
                  {renderSlot(slots.find((s) => s.id === `a${i}v`))}
                  <span>{m.name}</span><span className="bex-cbx__colon">:</span>
                  {renderSlot(slots.find((s) => s.id === `a${i}t`))}
                  {whyFor(`a${i}v`)}{whyFor(`a${i}t`)}
                </div>
              )) : <div className="bex-cbx__row"><span className="bex-cbx__ph">no attributes</span></div>}
            </div>
            <div className="bex-cbx__sect">
              {operations.length ? operations.map((m, i) => (
                <div key={i} className="bex-cbx__row">
                  {renderSlot(slots.find((s) => s.id === `o${i}v`))}
                  <span>{m.name}</span>
                  {m.ret != null ? <span className="bex-cbx__colon">:</span> : null}
                  {m.ret != null ? renderSlot(slots.find((s) => s.id === `o${i}t`)) : null}
                  {whyFor(`o${i}v`)}{whyFor(`o${i}t`)}
                </div>
              )) : <div className="bex-cbx__row"><span className="bex-cbx__ph">no operations</span></div>}
            </div>
          </div>

          {hasRel ? (
            <div className="bex-cbx-rel">
              <div className="bex-rel-title">Relationship: <code>{className}</code> to <code>{relationship.to}</code></div>
              <div className="bex-rel" role="group" aria-label="relationship kind">
                {CBX_RELS.map((r) => (
                  <Chip key={r.kind} state={relState(r.kind)} ariaLabel={r.name}
                    onClick={() => pickRel(r.kind)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickRel(r.kind); } }}>
                    <span className="bex-rel__glyph">{r.glyph}</span> {r.name}
                  </Chip>
                ))}
              </div>
              {checked && !relOk && relationship.why ? <div className="bex-why">{relationship.why}</div> : null}
            </div>
          ) : null}
        </div>

        {/* right column — the live result: your Circle joined to the target Shape */}
        <div className="bex-cbx-preview">
          <div className="bex-zone-label">Preview</div>
          <DiagramSvg viewBox={vb} maxWidth={Math.min(340, W + 28)}
            ariaLabel={hasRel ? `class diagram preview: ${className} and ${relationship.to}` : `class diagram preview: ${className}`}>
            {hasRel ? (rel
              ? <UmlLink from={{ x: cx, y: childTop }} to={{ x: cx, y: parentBottom }} kind={rel} />
              : <line x1={cx} y1={parentBottom} x2={cx} y2={childTop}
                  style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1.5, strokeDasharray: "4 5" }} />) : null}
            {hasRel ? (
              <DiagramCard x={px} y={parentTop} w={W} title={relationship.to}
                sections={parentSections} neutral abstract={relationship.parentAbstract} />
            ) : null}
            <DiagramCard x={px} y={hasRel ? childTop : parentTop} w={W} title={className}
              sections={childSections} neutral abstract={abstract} />
          </DiagramSvg>
          {hasRel ? (
            <div className="bex-cbx-preview__hint">pick a line to join <code>{className}</code> to <code>{relationship.to}</code></div>
          ) : null}
        </div>
      </div>

      <BuilderControls status={status} revealed={revealed}
        checkDisabled={filledCount === 0 && rel == null}
        onCheck={() => setChecked(true)} onReset={reset} onReveal={reveal} />
    </div>
  );
}

export function classBuild(cfg) { return function App() { return React.createElement(ClassBoxBuilder, cfg); }; }

/* Interactive (note 16): match each scenario to the label it calls for — built for
   "which SOLID principle does this design violate?", but generic: options are stamp
   chips (reusable, not consumed), items carry a code snippet and/or a caption.
   The three wording slots default to note 16's ("Principles" / "violates" /
   "principle"); notes 19–21's pattern matchers pass "Patterns" / "is a" / "pattern".
   One-shot grading: Check locks the board; Reset to retry (Reveal stays available). */
export function MatchBuilder({ prompt, options = [], items = [],
  paletteLabel = "Principles", slotLabel = "violates", slotPlaceholder = "principle" }) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const [fills, setFills] = React.useState({});   // item index -> option value
  const [picked, setPicked] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const locked = revealed || checked;

  const pick = (v) => { if (locked) return; setPicked((p) => (p === v ? null : v)); };
  const fill = (i) => {
    if (locked) return;
    if (picked != null) { setFills((f) => ({ ...f, [i]: picked })); setPicked(null); }
    else setFills((f) => { const n = { ...f }; delete n[i]; return n; });   // tap a filled slot to clear it
  };
  const dropOn = (i, e) => {
    e.preventDefault(); if (locked) return;
    let d = null; try { d = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (_) { d = picked != null ? { value: picked } : null; }
    if (d && d.value != null) { setFills((f) => ({ ...f, [i]: d.value })); setPicked(null); }
  };

  const okAt = (i) => fills[i] === items[i].answer;
  const filledCount = items.filter((_, i) => fills[i] != null).length;
  const correctCount = items.filter((_, i) => okAt(i)).length;
  const chipStateAt = (i) => gradedChipState({ revealed, checked, filled: fills[i] != null, ok: okAt(i) });
  const labelOf = (v) => { const o = opts.find((x) => x.value === v); return o ? o.label : v; };

  const status = revealed ? "Revealed — reset to try again."
    : !checked ? `${filledCount} of ${items.length} matched`
    : correctCount === items.length ? "Correct — every scenario matched."
    : `${correctCount} of ${items.length} right — reset to try again.`;

  const reset = () => { setFills({}); setPicked(null); setChecked(false); setRevealed(false); };
  const reveal = () => {
    const nf = {}; items.forEach((it, i) => { nf[i] = it.answer; });
    setFills(nf); setPicked(null); setChecked(false); setRevealed(true);
  };

  return (
    <div className="bex bex-match-ex">
      {prompt ? <p className="bex-prompt">{prompt}</p> : null}
      <div className="bex-palette" aria-label="label palette">
        <span className="bex-palette__label">{paletteLabel}</span>
        {opts.map((o) => (
          <Chip key={o.value} state={picked === o.value ? "picked" : "idle"} ariaLabel={o.label}
            draggable={!locked}
            onDragStart={(e) => { setPicked(o.value); e.dataTransfer.setData("text/plain", JSON.stringify({ value: o.value })); }}
            onClick={() => pick(o.value)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(o.value); } }}>
            {o.label}
          </Chip>
        ))}
      </div>
      <div className="bex-match">
        {items.map((it, i) => (
          <div key={i} className="bex-match__item">
            {it.code ? <CodeBlock code={it.code} lang={it.lang || "java"} /> : null}
            {it.text ? <div className="bex-match__scene">{renderCaption(it.text)}</div> : null}
            <div className="bex-match__row">
              <span className="bex-match__label">{slotLabel}</span>
              <Chip state={chipStateAt(i)}
                ariaLabel={`${slotPlaceholder} for scenario ${i + 1}${fills[i] != null ? `: ${labelOf(fills[i])}` : ", empty"}`}
                onClick={() => fill(i)}
                onDragOver={(e) => e.preventDefault()} onDrop={(e) => dropOn(i, e)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fill(i); } }}>
                {fills[i] != null ? labelOf(fills[i]) : <span className="bex-cbx__ph">{slotPlaceholder}</span>}
              </Chip>
            </div>
            {checked && fills[i] != null && !okAt(i) && it.why ? <div className="bex-why">{renderCaption(it.why)}</div> : null}
          </div>
        ))}
      </div>
      <BuilderControls status={status} revealed={revealed}
        checkDisabled={filledCount === 0 || checked}
        onCheck={() => setChecked(true)} onReset={reset} onReveal={reveal} />
    </div>
  );
}
export function matchBuild(cfg) { return function App() { return React.createElement(MatchBuilder, cfg); }; }

/* Interactive (note 12): assemble a use-case diagram from scratch. Two moves the
   note insists on: put ACTORS outside the boundary and USE CASES inside it, then
   join them — an actor to a case is a plain association, a case to a case is one of
   «include» / «extend» / generalization. The student first drops each element into
   the actor gutter or the system box (graded: inside vs outside), then taps pairs
   to connect them (graded as sets). The real UseCaseDiagram redraws live from the
   current placement + connections. Ungraded: right/wrong + why on Check, Reset,
   Reveal. Zones (not free 2D coordinates) + the auto-layout renderer keep it
   tractable; the only task is what goes where and what connects to what. */
const UC_RELS = [
  { kind: "assoc", label: "association" },
  { kind: "include", label: "«include»" },
  { kind: "extend", label: "«extend»" },
  { kind: "generalize", label: "generalization" },
];
const ucKey = (a, b) => a + "|" + b;
const setEqual = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

/* Reorder a list of case ids so cases joined by a relation end up ADJACENT, while
   preserving input order for unrelated cases. Each connected component is walked
   from a MINIMUM-degree node (a leaf when one exists), so a hub — e.g. a
   generalization parent with two children — lands in the MIDDLE of its neighbours
   and every inter-case relation draws across one gap, never through another oval. */
function clusterByRelations(ids, relations) {
  const present = new Set(ids);
  const adj = new Map(ids.map((id) => [id, []]));
  relations.forEach((r) => {
    if (present.has(r.from) && present.has(r.to)) {
      adj.get(r.from).push(r.to);
      adj.get(r.to).push(r.from);
    }
  });
  const pos = Object.fromEntries(ids.map((id, i) => [id, i]));
  const deg = (id) => adj.get(id).length;
  const seen = new Set(), out = [];
  // gather a component's nodes so we can pick its lowest-degree start
  const component = (root) => {
    const nodes = [], stack = [root], mark = new Set([root]);
    while (stack.length) {
      const x = stack.pop(); nodes.push(x);
      adj.get(x).forEach((n) => { if (!mark.has(n)) { mark.add(n); stack.push(n); } });
    }
    return nodes;
  };
  ids.forEach((id) => {
    if (seen.has(id)) return;
    const comp = component(id);
    // seed the walk at the lowest-degree node (leaf first), ties → earliest input
    const start = comp.slice().sort((a, b) => deg(a) - deg(b) || pos[a] - pos[b])[0];
    const stack = [start];
    while (stack.length) {
      const x = stack.shift();
      if (seen.has(x)) continue;
      seen.add(x); out.push(x);
      adj.get(x).filter((n) => !seen.has(n))
        .sort((a, b) => deg(a) - deg(b) || pos[a] - pos[b])   // walk toward the hub, then out
        .forEach((n) => stack.unshift(n));
    }
  });
  return out;
}

export function UseCaseBuilder({ prompt, system = "System", elements = [],
  associations = [], relations = [], whyZone = {}, source }) {
  const byId = React.useMemo(() => Object.fromEntries(elements.map((e) => [e.id, e])), [elements]);
  const shuffled = React.useMemo(
    () => seededShuffle(elements.map((e) => e.id), hashSeed(system + elements.map((e) => e.id).join(","))),
    [elements, system]);

  // Optional Identify stage: the requirements sentence as clickable spans. Each
  // token is a span the reader can tag; a bare string is a one-word span (answer
  // "none"), an object { w, role, id?, why? } carries the hidden answer role. NO
  // span is styled to reveal whether it is an answer.
  const spans = React.useMemo(() => ((source && source.tokens) ? source.tokens.map((t, i) => {
    const o = typeof t === "string" ? { w: t } : t;
    return { i, w: o.w, role: o.role || "none", id: o.id, why: o.why };
  }) : []), [source]);
  const hasIdentify = spans.length > 0;

  const [zone, setZone] = React.useState({});     // elId -> "actors" | "system"
  const [assoc, setAssoc] = React.useState([]);   // ["actorId|caseId", ...]
  const [rels, setRels] = React.useState([]);     // [{ from, to, kind }]
  const [tags, setTags] = React.useState({});     // spanIndex -> "actor" | "case" (absent = none)
  const [picked, setPicked] = React.useState(null);
  const [pendingRel, setPendingRel] = React.useState(null); // { from, to }
  const [stage, setStage] = React.useState(hasIdentify ? "identify" : "place");
  const [checked, setChecked] = React.useState(false);
  const [revealedSet, setRevealedSet] = React.useState(() => new Set());  // stages whose answer is shown
  // Connect's reveal fills the placement too; this remembers when Place was
  // revealed only as a side-effect of that, so resetting Connect can roll it back.
  const [placeViaConnect, setPlaceViaConnect] = React.useState(false);
  const isRevealed = (st) => revealedSet.has(st);
  const unreveal = (...names) => setRevealedSet((s) => { const n = new Set(s); names.forEach((x) => n.delete(x)); return n; });
  const revealed = isRevealed(stage);   // the CURRENT stage is locked / showing its answer

  const zoneOf = (id) => zone[id];
  const bank = shuffled.filter((id) => !(id in zone));
  const inActors = shuffled.filter((id) => zone[id] === "actors");
  const inSystem = shuffled.filter((id) => zone[id] === "system");

  const dirty = () => { setChecked(false); };

  // ---- placement (stage 1) ----
  const placeInZone = (z) => {
    if (revealed || !picked) return;
    dirty(); setZone((m) => ({ ...m, [picked]: z })); setPicked(null);
  };
  const toBank = (id) => { if (revealed) return; dirty(); setZone((m) => { const n = { ...m }; delete n[id]; return n; }); };

  // ---- identify (stage 0): cycle a span none -> actor -> use case -> none ----
  const cycleTag = (i) => {
    if (revealed) return; dirty();
    setTags((m) => {
      const next = m[i] === "actor" ? "case" : m[i] === "case" ? undefined : "actor";
      const n = { ...m }; if (next) n[i] = next; else delete n[i]; return n;
    });
  };
  const roleWord = (r) => (r === "case" ? "use case" : "actor");   // only called with a set tag
  const idWhy = (s) => s.why || (s.role === "actor"
    ? `“${s.w}” is an actor — someone outside the system who uses it.`
    : s.role === "case"
    ? `“${s.w}” is a use case — a goal the system carries out for an actor.`
    : `“${s.w}” is neither an actor nor a use case here — leave it untagged.`);

  // ---- connection (stage 2): tap two placed chips ----
  const connect = (id) => {
    if (revealed) return;
    if (picked == null) { setPicked(id); return; }
    if (picked === id) { setPicked(null); return; }
    const za = zoneOf(picked), zb = zoneOf(id);
    if (za === "actors" && zb === "system") { toggleAssoc(picked, id); setPicked(null); }
    else if (za === "system" && zb === "actors") { toggleAssoc(id, picked); setPicked(null); }
    else if (za === "system" && zb === "system") { setPendingRel({ from: picked, to: id }); setPicked(null); }
    else { setPicked(id); }   // two actors, etc. — just move the selection
  };
  const toggleAssoc = (actor, c) => { dirty(); setAssoc((a) => a.includes(ucKey(actor, c)) ? a.filter((x) => x !== ucKey(actor, c)) : [...a, ucKey(actor, c)]); };
  const addRel = (kind) => {
    if (!pendingRel) return; dirty();
    const { from, to } = pendingRel;
    setRels((r) => {
      const same = r.find((x) => x.from === from && x.to === to && x.kind === kind);
      if (same) return r.filter((x) => x !== same);
      return [...r.filter((x) => !(x.from === from && x.to === to)), { from, to, kind }];
    });
    setPendingRel(null);
  };

  // ---- live preview (only placed elements; connections filtered to valid ends) ----
  const previewActors = inActors.map((id) => ({ id, label: byId[id].label, side: "left" }));
  // Order the case column so RELATED cases sit adjacent — a vertical relation then
  // spans one gap (short arrow, label in the clear) instead of crossing unrelated
  // ovals. Cluster by the authored relations (stable) and keep placement order
  // within each cluster; unrelated cases keep their placement order.
  const orderedSystem = React.useMemo(
    () => clusterByRelations(inSystem, relations),
    [inSystem.join(","), relations]);
  const previewCases = orderedSystem.map((id) => ({ id, label: byId[id].label }));
  const sysSet = new Set(inSystem), actSet = new Set(inActors);
  const previewAssoc = React.useMemo(() => {
    const g = {};
    assoc.forEach((k) => { const [a, c] = k.split("|"); if (actSet.has(a) && sysSet.has(c)) (g[a] = g[a] || []).push(c); });
    return Object.entries(g).map(([actor, cases]) => ({ actor, cases }));
  }, [assoc, zone]);
  const previewRels = rels.filter((r) => sysSet.has(r.from) && sysSet.has(r.to));

  // ---- grading ----
  const wantZone = (e) => (e.role === "actor" ? "actors" : "system");
  const zoneRight = (e) => zone[e.id] === wantZone(e);
  const authoredAssoc = React.useMemo(() => new Set(associations.flatMap((l) => l.cases.map((c) => ucKey(l.actor, c)))), [associations]);
  const userAssoc = new Set(assoc);
  const authoredRels = React.useMemo(() => new Set(relations.map((r) => ucKey(ucKey(r.from, r.to), r.kind))), [relations]);
  const userRels = new Set(rels.map((r) => ucKey(ucKey(r.from, r.to), r.kind)));
  const assocOk = setEqual(userAssoc, authoredAssoc);
  const relsOk = setEqual(userRels, authoredRels);
  const zonesRight = elements.filter(zoneRight).length;
  const spanRight = (s) => (tags[s.i] || "none") === s.role;   // an identify span matches its authored role
  // Check and Reveal act on the CURRENT stage only, so a finished stage grades
  // green without waiting on the later ones.
  const stageInfo = stage === "identify"
    ? (() => { const right = spans.filter(spanRight).length;
        return { ok: right === spans.length,
          okMsg: "Every actor and use case is tagged — move on to Place.",
          partMsg: `${right} of ${spans.length} words right — see the notes below.` }; })()
    : stage === "place"
    ? { ok: zonesRight === elements.length,
        okMsg: "Everything is on the right side of the boundary — move on to Connect.",
        partMsg: `${zonesRight} of ${elements.length} placed right — see the notes below.` }
    : (() => { const right = (assocOk ? 1 : 0) + (relsOk ? 1 : 0);
        return { ok: assocOk && relsOk,
          okMsg: "Correct — that's the use-case diagram.",
          partMsg: `${right} of 2 connection checks right — see the notes below.` }; })();

  const chipState = (id) => {
    if (isRevealed("place")) return "correct";
    if (picked === id) return "picked";
    return gradedChipState({ revealed: false, checked: checked && stage === "place", filled: id in zone, ok: zoneRight(byId[id]) });
  };

  const status = revealed ? "Revealed — reset to try again."
    : !checked ? (stage === "identify"
      ? "Identify stage: click each word that names an actor or a use case; click again to change or clear it."
      : stage === "place"
      ? "Place stage: pick an element, then click the gutter (actors) or the system box (use cases)."
      : "Connect stage: click an actor then a case (association), or two cases (then pick the relation).")
    : stageInfo.ok ? stageInfo.okMsg
    : stageInfo.partMsg;

  // Reset the CURRENT stage only, staying put — the sibling stages keep their work,
  // mirroring how Check and Reveal already act per-stage. Connect's reveal fills the
  // placement as a side-effect (placeViaConnect); resetting Connect rolls that back
  // too so an auto-completed Place doesn't linger.
  const reset = () => {
    setPicked(null); setPendingRel(null); setChecked(false);
    if (stage === "identify") {
      setTags({}); unreveal("identify");
    } else if (stage === "place") {
      setZone({}); setPlaceViaConnect(false); unreveal("place");
    } else {
      setAssoc([]); setRels([]);
      if (placeViaConnect) { setZone({}); setPlaceViaConnect(false); unreveal("connect", "place"); }
      else { unreveal("connect"); }
    }
  };
  // Reveal the CURRENT stage's answer only. Connect also completes placement, since
  // the connections can't be drawn without the elements sitting in their zones.
  const reveal = () => {
    if (stage === "identify") {
      const t = {}; spans.forEach((s) => { if (s.role !== "none") t[s.i] = s.role; });
      setTags(t); setRevealedSet((s) => new Set(s).add("identify"));
    } else if (stage === "place") {
      const z = {}; elements.forEach((e) => { z[e.id] = wantZone(e); });
      setZone(z); setPlaceViaConnect(false); setRevealedSet((s) => new Set(s).add("place"));
    } else {
      const z = {}; elements.forEach((e) => { z[e.id] = wantZone(e); });
      setZone(z); setAssoc([...authoredAssoc]); setRels(relations.map((r) => ({ from: r.from, to: r.to, kind: r.kind })));
      // Place is being auto-completed here unless the reader already revealed it themselves.
      setPlaceViaConnect(!isRevealed("place"));
      setRevealedSet((s) => { const n = new Set(s); n.add("place"); n.add("connect"); return n; });
    }
    setPicked(null); setPendingRel(null); setChecked(false);
  };

  const renderChip = (id, onClick) => (
    <Chip key={id} state={chipState(id)} ariaLabel={`${byId[id].label} (${byId[id].role})`}
      onClick={onClick} onKeyDown={onEnterOrSpace(onClick)}>
      {joinLabel(byId[id].label)}
    </Chip>
  );
  const chipClick = (id) => (stage === "place"
    ? () => { if (revealed) return; if (id in zone) toBank(id); else setPicked((p) => (p === id ? null : id)); }
    : () => connect(id));

  // feedback lines on Check
  const wrongZoned = checked && !revealed ? elements.filter((e) => (e.id in zone) && !zoneRight(e)) : [];
  const missingAssoc = checked ? [...authoredAssoc].filter((k) => !userAssoc.has(k)) : [];
  const extraAssoc = checked ? [...userAssoc].filter((k) => !authoredAssoc.has(k)) : [];
  const missingRels = checked ? relations.filter((r) => !userRels.has(ucKey(ucKey(r.from, r.to), r.kind))) : [];
  // extra relations the diagram doesn't call for. Pairs already covered by a
  // missing line (same endpoints, wrong kind) are skipped — that line explains
  // what the pair SHOULD be; these catch reversed arrows and stray links.
  const missingPairs = new Set(missingRels.map((r) => ucKey(r.from, r.to)));
  const extraRels = checked
    ? rels.filter((r) => !authoredRels.has(ucKey(ucKey(r.from, r.to), r.kind)) && !missingPairs.has(ucKey(r.from, r.to)))
    : [];

  return (
    <div className="bex bex-uc-ex">
      {prompt ? <p className="bex-prompt">{prompt}</p> : null}
      <div className="bex-uc-stages" role="group" aria-label="build stage">
        {hasIdentify ? (
          <Chip state={stage === "identify" ? "picked" : "idle"} ariaLabel="identify stage" onClick={() => { setPicked(null); setChecked(false); setStage("identify"); }}>1 · Identify</Chip>
        ) : null}
        <Chip state={stage === "place" ? "picked" : "idle"} ariaLabel="place stage" onClick={() => { setPicked(null); setChecked(false); setStage("place"); }}>{hasIdentify ? "2" : "1"} · Place</Chip>
        <Chip state={stage === "connect" ? "picked" : "idle"} ariaLabel="connect stage" onClick={() => { setPicked(null); setChecked(false); setStage("connect"); }}>{hasIdentify ? "3" : "2"} · Connect</Chip>
      </div>

      {hasIdentify && stage === "identify" ? (
        <div className="uc-id">
          <p className="uc-id__sentence" aria-label="requirements to tag">
            {spans.map((s) => {
              const tag = tags[s.i];   // "actor" | "case" | undefined
              const wrong = checked && !revealed && !spanRight(s);
              const cls = "uc-id__w" + (tag ? " uc-id__w--" + tag : "") + (wrong ? " uc-id__w--wrong" : "");
              return (
                <React.Fragment key={s.i}>
                  <span className={cls} role="button" tabIndex={revealed ? -1 : 0}
                    aria-label={`${s.w}${tag ? `, tagged ${roleWord(tag)}` : ""}`}
                    onClick={() => cycleTag(s.i)}
                    onKeyDown={onEnterOrSpace(() => cycleTag(s.i))}>
                    <span className="uc-id__tag" aria-hidden="true">{tag ? roleWord(tag) : ""}</span>
                    <span className="uc-id__word">{s.w}</span>
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </p>
        </div>
      ) : null}

      {stage === "place" && !revealed && bank.length ? (
        <div className="bex-uc-bank" aria-label="element bank">
          <span className="bex-palette__label">Unplaced</span>
          {bank.map((id) => renderChip(id, chipClick(id)))}
        </div>
      ) : null}

      {stage !== "identify" ? (
      <div className="bex-uc-zones">
        <div className="bex-uc-gutter" role="button" tabIndex={0}
          aria-label="actor gutter, outside the system"
          onClick={() => stage === "place" && placeInZone("actors")}
          onKeyDown={(e) => { if (stage === "place" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); placeInZone("actors"); } }}>
          <div className="bex-uc-zone__label">Actors (outside)</div>
          {inActors.map((id) => renderChip(id, chipClick(id)))}
          {!inActors.length ? <span className="bex-cbx__ph">drop actors here</span> : null}
        </div>
        <div className="bex-uc-system" role="button" tabIndex={0}
          aria-label={`${system}, inside the boundary`}
          onClick={() => stage === "place" && placeInZone("system")}
          onKeyDown={(e) => { if (stage === "place" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); placeInZone("system"); } }}>
          <div className="bex-uc-zone__label">{system} (inside)</div>
          {inSystem.map((id) => renderChip(id, chipClick(id)))}
          {!inSystem.length ? <span className="bex-cbx__ph">drop use cases here</span> : null}
        </div>
      </div>
      ) : null}

      {stage === "connect" && pendingRel && !revealed ? (
        <div className="bex-rel" role="group" aria-label="relation kind">
          <span className="bex-palette__label">{byId[pendingRel.from].label} → {byId[pendingRel.to].label}:</span>
          {UC_RELS.map((r) => (
            <Chip key={r.kind} state="idle" ariaLabel={r.label} onClick={() => addRel(r.kind)}>{r.label}</Chip>
          ))}
          <Chip state="idle" ariaLabel="cancel relation" onClick={() => setPendingRel(null)}>cancel</Chip>
        </div>
      ) : null}

      {previewActors.length || previewCases.length ? (
        <UseCaseDiagram system={system} actors={previewActors} cases={previewCases}
          associations={previewAssoc} relations={previewRels} maxWidth={520} rowGap={96}
          onPick={revealed ? undefined : (id) => chipClick(id)()} pickedId={picked} />
      ) : null}

      {checked && !revealed && !stageInfo.ok ? (
        <div className="bex-uc-fb">
          {stage === "identify" ? spans.filter((s) => !spanRight(s)).map((s) => (
            <div key={"id" + s.i} className="bex-why">{idWhy(s)}</div>
          )) : null}
          {stage === "place" ? wrongZoned.map((e) => (
            <div key={e.id} className="bex-why">{joinLabel(e.label)}: {e.whyZone || whyZone[e.role] || (e.role === "actor" ? "An actor sits OUTSIDE the boundary." : "A use case sits INSIDE the boundary.")}</div>
          )) : null}
          {stage === "connect" ? (
            <>
              {(missingAssoc.length || extraAssoc.length) ? (
                <div className="bex-why">Associations: {missingAssoc.length} missing, {extraAssoc.length} extra. An actor joins each use case it takes part in.</div>
              ) : null}
              {missingRels.map((r, i) => (
                <div key={i} className="bex-why">{byId[r.from].label} → {byId[r.to].label}: {r.why || `should be «${r.kind}».`}</div>
              ))}
              {extraRels.map((r, i) => {
                const relName = (UC_RELS.find((x) => x.kind === r.kind) || {}).label || r.kind;
                const reversed = relations.some((a) => a.from === r.to && a.to === r.from && a.kind === r.kind);
                return (
                  <div key={"x" + i} className="bex-why">{byId[r.from].label} → {byId[r.to].label}: {reversed
                    ? `right relation, wrong way round — the ${relName} arrow runs ${byId[r.to].label} → ${byId[r.from].label}.`
                    : `this ${relName} is not part of the diagram — remove it.`}</div>
                );
              })}
            </>
          ) : null}
        </div>
      ) : null}

      <BuilderControls status={status} revealed={revealed}
        checkDisabled={revealed || (stage === "identify" ? Object.keys(tags).length === 0
          : stage === "place" ? Object.keys(zone).length === 0
          : assoc.length === 0 && rels.length === 0)}
        onCheck={() => setChecked(true)} onReset={reset} onReveal={reveal} />
    </div>
  );
}

export function useCaseBuild(cfg) { return function App() { return React.createElement(UseCaseBuilder, cfg); }; }

/* (There is deliberately NO SequenceWalkthrough here. Two sequence diagrams that are
   meant to look identical must be shown SIDE BY SIDE — stepping between them hides
   the very sameness the reader is supposed to notice. See converter-sequence-merge,
   which lays them out as columns with a compare caption.) */

/* ---- comparison captions (shared) — tagged "A vs B" labels for any compare figure.
   Tags reuse the mm-cap-tag palette; pass any `kind` ("cpp" | "java" | "asm" | "int").
   Content is JSX so it can carry `<strong>`/`<em>`/`<code className="mm-ic">`. Nothing
   is hardcoded — reused across compare demos (L08, L09, …).

   CompareTitles — a compact header row of tagged one-liners, sits ABOVE a figure:
     <CompareTitles cols={[{ tag: "C++",  kind: "cpp",  text: "recompile per platform" },
                           { tag: "Java", kind: "java", text: "compile once, run anywhere" }]} />

   CompareCaption — a tagged multi-column summary (+ optional shared punchline) BELOW it:
     <CompareCaption
       cols={[{ tag: "C++",  kind: "cpp",  children: <>…</> },
              { tag: "Java", kind: "java", children: <>…</> }]}
       punch={<>…</>} />                                                                 */
export function CompareTitles({ cols = [] }) {
  return (
    <div className="mm-compare-titles">
      {cols.map((c, i) => (
        <span key={i}>
          <span className={"mm-cap-tag mm-cap-tag--" + (c.kind || "cpp")}>{c.tag}</span> {c.text}
        </span>
      ))}
    </div>
  );
}

export function CompareCaption({ cols = [], punch }) {
  return (
    <div className="mm-compare" style={{ "--cols": cols.length }}>
      {cols.map((c, i) => (
        <div className="mm-compare__col" key={i}>
          <span className={"mm-compare__tag mm-cap-tag mm-cap-tag--" + (c.kind || "cpp")}>{c.tag}</span>
          {c.children}
        </div>
      ))}
      {punch ? <p className="mm-compare__punch">{punch}</p> : null}
    </div>
  );
}

/* ---- MemoryCompare — a static, side-by-side reading of a few related stages.
   Where MemoryScene gives ONE model you step through, this lays the stages out as
   columns so the DELTA between them is visible at a glance: each column shows a
   declaration, the stack after it runs, a byte-cost chip, and a one-line reading.
   The cell HIGHLIGHT marks the storage *introduced* at that stage — so a stage
   that allocates nothing (a local reference) lights up nothing.

     compare({ title,
               stages: [{ code, lang, cells, tag: { text, kind }, note }, …],
               punch, hint }) */
export function MemoryCompare({ title, stages = [], punch, hint, lang = "cpp" }) {
  return (
    <div className="mm-scene mm-cmp-wrap">
      {title ? <div className="mm-scene__title" data-artifact-title>{title}</div> : null}
      <div className="mm-cmp" style={{ "--cols": stages.length }}>
        {stages.map((st, i) => (
          <div className="mm-cmp__col" key={i}>
            <code className="mm-cmp__code">{highlight(st.code, st.lang || lang)}</code>
            <MemoryModel cells={st.cells} axis={false} regions={["stack"]} legend={false} />
            {st.tag ? (
              <span className={"mm-cmp__tag mm-cap-tag mm-cap-tag--" + (st.tag.kind || "cpp")}>{st.tag.text}</span>
            ) : null}
            {st.note ? <p className="mm-cmp__note">{renderCaption(st.note)}</p> : null}
          </div>
        ))}
      </div>
      {(punch || hint) ? (
        <div className="mm-cmp__foot">
          {punch ? <p className="mm-cmp__punch">{renderCaption(punch)}</p> : null}
          {hint ? <p className="mm-cmp__hint">{hint}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ---- artifact entry points ----
   A demo is just DATA plus one default export — no JSX, no App wrapper, no
   `import React`. To create a new artifact:

     import { scene, obj, stack } from "@course";
     const code  = `int main() { … }`;
     const steps = [{ line: 1, cells: [stack("x", "int", 5)], caption: "…" }];
     export default scene({ title: "My demo", code, steps });

   Steps drive the memory view: give a step `cells` (MemoryModel) or `layout`
   (ObjectLayout); optional `code`/`line`, `outputs`, `caption`. For a sizeof
   comparison instead, use `sizes({ items: [{ title, fields }, …] })`. */
/* MCQ: a paged multiple-choice quiz (4 choices, or 2 for true/false). No score —
   picking marks the choice ✓/✗, reveals the correct one, and shows a "why".
   Reuses the .mm-quiz nav shell. `figure` is an optional { code, lang } snippet
   or { image, alt } picture above the choices. */
export function McqFigure({ figure }) {
  if (!figure) return null;
  if (figure.code) return <div className="mm-mcq__fig"><CodeBlock code={figure.code} lang={figure.lang || "cpp"} /></div>;
  if (figure.image) return <img className="mm-mcq__img" src={figure.image} alt={figure.alt || ""} />;
  return null; // { artifact: src } embed is deferred
}

export function Mcq({ questions: rawQuestions }) {
  // Shuffle each question's choices (seeded by index + stem, so the order is
  // stable per question but varies across questions) — authored configs list the
  // correct choice first for readability, which must never survive into the UI.
  const questions = React.useMemo(
    () => rawQuestions.map((q, i) => ({ ...q, choices: seededShuffle(q.choices, hashSeed(i + "#" + q.stem)) })),
    [rawQuestions]);
  const [cur, setCur] = React.useState(0);
  const [picks, setPicks] = React.useState({}); // qIndex -> choiceIndex, or -1 for "show answer"
  const n = questions.length;
  const go = (d) => setCur((c) => Math.max(0, Math.min(n - 1, c + d)));
  const q = questions[cur];
  const pick = picks[cur];
  const answered = pick != null;
  const choose = (k) => setPicks((p) => (p[cur] != null ? p : { ...p, [cur]: k }));
  return (
    <div className="mm-mcq">
      <div className="mm-quiz__nav">
        <button type="button" className="mm-quiz__btn" onClick={() => go(-1)} disabled={cur === 0}
          aria-label="Previous question">‹ Prev</button>
        <span className="mm-quiz__pos" aria-live="polite">Question {cur + 1} of {n}</span>
        <button type="button" className="mm-quiz__btn" onClick={() => go(1)} disabled={cur === n - 1}
          aria-label="Next question">Next ›</button>
      </div>
      <p className="mm-mcq__stem">{renderCaption(q.stem)}</p>
      <McqFigure figure={q.figure} />
      <div className="mm-mcq__choices" role="group">
        {q.choices.map((c, k) => {
          const cls = !answered ? "" : c.correct ? " mm-mcq__choice--correct" : (k === pick ? " mm-mcq__choice--wrong" : "");
          return (
            <button type="button" key={k} className={"mm-mcq__choice" + cls} disabled={answered}
              onClick={() => choose(k)}>
              {answered && c.correct ? <span className="mm-mcq__mark">✓ </span> : null}
              {answered && k === pick && !c.correct ? <span className="mm-mcq__mark mm-mcq__mark--no">✗ </span> : null}
              {renderCaption(c.text)}
            </button>
          );
        })}
      </div>
      {!answered ? (
        <button type="button" className="mm-mcq__show" onClick={() => choose(-1)}>Show answer</button>
      ) : (
        <p className="mm-mcq__why"><span className="mm-cap-txt">{renderCaption(q.why)}</span></p>
      )}
    </div>
  );
}

export function scene(config) {
  return function App() { return React.createElement(MemoryScene, config); };
}
export function mcq(config) {
  return function App() { return React.createElement(Mcq, config); };
}
export function sizes(config) {
  return function App() { return React.createElement(SizeCompare, config); };
}
export function compare(config) {
  return function App() { return React.createElement(MemoryCompare, config); };
}
export function dualScene(config) {
  return function App() { return React.createElement(MemoryDualScene, config); };
}

/* Shared L06 virtual-dispatch scene (vptr -> vtable -> function). Defined once and
   used by BOTH the explanatory demo (mem-vtable) and the note-06 predict practice,
   so the cell layout and code snippet live in a single place. Pass a `predict`
   block to attach the "which intro runs?" question to the final dispatch step;
   omit it for the plain walkthrough. Returns a scene config for scene(...). */
export function l06VtableScene({ predict } = {}) {
  const code =
`class person {
public:
    string name = "James";
    virtual void intro();
};
class student : public person {
public:
    int age = 20;
    void intro() override;
};

int main() {
    person  p;
    student s;
    person* ptr = &s;
    ptr->intro();
}`;
  const person  = obj("person",  [{ name: "name", type: "string", size: 32 }], { vptr: "pvt" });
  const student = obj("student", [{ name: "name", type: "string", size: 32 }, { name: "age", type: "int" }], { vptr: "svt" });
  const P   = (hl) => person("p", ['"James"'], { hl });
  const PVT = (hl) => glob("person::vtable", "vtable", "&intro", { id: "pvt", to: "pintro", hl });
  const PIN = (hl) => text("person::intro", "fn", "cout << name", { id: "pintro", hl });
  const S   = (hl) => student("s", ['"James"', "20"], { hl });
  const SVT = (hl) => glob("student::vtable", "vtable", "&intro", { id: "svt", to: "sintro", hl });
  const SIN = (hl) => text("student::intro", "fn", "cout << name, age", { id: "sintro", hl });
  const PTR = (hl) => stack("ptr", "person*", "-> s", { to: "s", hl });

  const steps = [
    {
      line: [3, 4, 13],
      cells: [P(true), PVT(), PIN()],
      caption: {
        cpp: "`person p;` constructs a `person`, and because the class has a `virtual` function its first member is a hidden **vptr** pointing to the one `person` vtable whose `intro` slot points to `person::intro`.",
        intuition: "A `virtual` function makes every object carry a vptr, so the object itself remembers which function table to use.",
      },
    },
    {
      line: [8, 9, 14],
      cells: [P(), PVT(), PIN(), S(true), SVT(), SIN()],
      caption: {
        cpp: "`student s;` constructs a `student`, which overrides `intro()` and so gets its own vtable; `s`'s vptr points there and that `intro` slot points to `student::intro`.",
        intuition: "Each class that overrides a virtual function gets a distinct vtable, so an object's vptr selects the right override.",
      },
    },
    {
      line: 15,
      cells: [P(), PVT(), PIN(), S(), SVT(), SIN(), PTR(true)],
      caption: {
        cpp: "`person* ptr = &s;` gives `ptr` the static type `person*` while it holds the address of the **student** object `s`.",
        intuition: "The pointer's type doesn't change what `s` actually is — the object keeps its own vptr regardless of how you point at it.",
      },
    },
    {
      line: 16,
      ...(predict ? { predict } : {}),
      cells: [P(), PVT(), PIN(), S(true), SVT(true), SIN(true), PTR(true)],
      caption: {
        cpp: "`ptr->intro();` dispatches dynamically along `ptr -> s -> s's vptr -> student::vtable -> student::intro`, running the **derived** override even through a `person*`.",
        intuition: "Virtual dispatch follows the object's vptr, not the pointer type — a non-virtual call would instead use the static type and run `person::intro`.",
      },
    },
  ];
  return { title: "L06 — virtual dispatch: vptr -> vtable -> function", code, steps };
}

/* Shared L02 dynamic-memory scene (new -> delete -> dangling). Defined once and
   used by BOTH the explanatory demo (mem-heap) and the note-02 predict practice.
   Pass a `predict` block to attach the "what does delete do?" question to the
   `delete p;` step; omit it for the plain walkthrough. Returns a scene config. */
export function l02HeapScene({ predict } = {}) {
  const code =
`int* p = new int(0);
*p = 42;
delete p;
p = nullptr;`;
  const P = (value, hl) => stack("p", "int*", value, { addr: "0x…a8", to: value === "nullptr" ? undefined : "h", toNull: value === "nullptr", hl });
  const H = (value, reclaimed) => heap("", "int", value, { id: "h", addr: "0x…c0", reclaimed });
  const steps = [
    { line: 1, cells: [P("0x…c0", true), H("0")],
      caption: {
        cpp: "`new int(0)` asks for memory on the **heap** and returns its address into `p`.",
        asm: "`new` -> `call operator new` — heap allocation is a library call; the returned address is stored in `p`.",
        intuition: "The pointer `p` lives on the **stack**, but the `int` it owns lives on the **heap**.",
      },
    },
    { line: 2, cells: [P("0x…c0"), H("42")],
      caption: {
        cpp: "`*p = 42;` writes through the pointer into the heap object.",
        intuition: "Stack variables are freed automatically, but this **heap** object is not — you must free it yourself.",
      },
    },
    { line: 3, ...(predict ? { predict } : {}), cells: [P("0x…c0", true), H("42", true)],
      caption: {
        cpp: "`delete p;` releases the heap memory, but `p` still holds the old address — it is now a **dangling** pointer, and reading `*p` here is undefined behaviour.",
        asm: "`delete p` -> `call operator delete` frees the block; `p` still holds the freed address (dangling).",
        intuition: "Freeing the **heap** bytes (greyed and struck through) does not change `p`, so its arrow now dangles (red and broken).",
      },
    },
    { line: 4, cells: [P("nullptr", true), H("42", true)],
      caption: {
        cpp: "`p = nullptr;` breaks the dangling link so `p` now points at the dedicated **null sink** (`⌀ nullptr`) in the free/unmapped band.",
        intuition: "Pointing at **null** clearly means *nothing*, and a second `delete` would now be harmless.",
      },
    },
  ];
  return { title: "Dynamic memory: new, delete, and dangling pointers", code, steps };
}
