import React from "react";
import { DiagramSvg, CompareCaption } from "@course";

/* L10 - C++ const vs Java final vs true immutability.
   The axis is WHAT gets frozen, shown as a padlock on a shared
   name -> reference -> object chain. C++ const is fine-grained: a lock can
   sit on the pointer, the handle, or the value -- you choose. Java final is
   coarse: the lock sits on the BINDING (the link), so the object reached
   through it stays mutable. Immutability locks the OBJECT itself. The classic
   trap - `final Circle c` - is a lock on the link, not on the Circle.

   Drawn at viewBox width 780 with maxWidth 780 so 1 unit ≈ 1 rendered px; the
   small chain labels (name / ref / field) stay legible. */

const COLS = [
  {
    key: "const", title: "C++ const", subtitle: "fine-grained: pick what", sub: "stack",
    name: "p", obj: "T", field: "value",
    locks: ["name", "link", "obj"], tag: "any link you choose",
  },
  {
    key: "final", title: "Java final", subtitle: "coarse: the binding", sub: "global",
    name: "c", obj: "Circle", field: "radius", openObj: true,
    locks: ["link"], tag: "the binding only",
  },
  {
    key: "immutable", title: "Immutable object", subtitle: "a design, not a keyword", sub: "code",
    name: "s", obj: "String", field: "chars", lockObj: true,
    locks: ["obj"], tag: "the whole object",
  },
];

const PANEL = { w: 234, h: 214, top: 88 };
const X0 = 14, GAP = 18;
const colX = (i) => X0 + i * (PANEL.w + GAP);

/* a small padlock centred at (cx, cy); a filled body with a shackle. */
function Lock({ cx, cy, color, r = 1, faint = false }) {
  const w = 14 * r, h = 11 * r, sw = 5 * r;
  return (
    <g opacity={faint ? 0.92 : 1}>
      <path d={`M ${cx - sw} ${cy - h / 2} v ${-3.6 * r} a ${sw} ${sw} 0 0 1 ${2 * sw} 0 v ${3.6 * r}`}
        style={{ fill: "none", stroke: color, strokeWidth: 1.9 * r, strokeLinecap: "round" }} />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={2.6 * r}
        style={{ fill: color, stroke: color, strokeWidth: 1 }} />
      <circle cx={cx} cy={cy + 0.4 * r} r={1.6 * r} style={{ fill: "var(--mm-panel-bg)" }} />
    </g>
  );
}

function Panel({ col, i }) {
  const x = colX(i);
  const cx = x + PANEL.w / 2;
  const sub = col.sub;
  const fg = `var(--seg-${sub}-fg)`;
  const bd = `var(--seg-${sub}-bd)`;
  const cyc = PANEL.top + 116;            // chain centre-line

  const nameBox = { x: x + 22, y: cyc - 21, w: 46, h: 42 };
  const objBox = { x: x + 120, y: cyc - 32, w: 100, h: 64 };
  const linkX1 = nameBox.x + nameBox.w, linkX2 = objBox.x;
  const linkMid = (linkX1 + linkX2) / 2;

  return (
    <g>
      <rect x={x} y={PANEL.top} width={PANEL.w} height={PANEL.h} rx={16}
        style={{ fill: "var(--mm-panel-bg)", stroke: bd, strokeWidth: 1.6 }} />
      <rect x={x} y={PANEL.top} width={PANEL.w} height={50} rx={16}
        style={{ fill: `var(--seg-${sub}-bg)`, stroke: bd, strokeWidth: 1.2 }} />
      <text x={cx} y={PANEL.top + 20} textAnchor="middle" dominantBaseline="central"
        style={{ fill: fg, fontSize: 15, fontWeight: 900 }}>{col.title}</text>
      <text x={cx} y={PANEL.top + 38} textAnchor="middle" dominantBaseline="central"
        style={{ fill: fg, fontSize: 10, opacity: 0.78 }}>{col.subtitle}</text>

      {/* the shared chain: name --reference--> object */}
      <rect x={nameBox.x} y={nameBox.y} width={nameBox.w} height={nameBox.h} rx={7}
        style={{ fill: "var(--mm-cell-bg)", stroke: bd, strokeWidth: 1.4 }} />
      <text x={nameBox.x + nameBox.w / 2} y={nameBox.y + 15} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 15, fontWeight: 800 }}>{col.name}</text>
      <text x={nameBox.x + nameBox.w / 2} y={nameBox.y + 31} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--mm-muted)", fontSize: 8.6 }}>name</text>

      {/* reference link */}
      <line x1={linkX1 + 2} y1={cyc} x2={linkX2 - 3} y2={cyc}
        style={{ stroke: "var(--mm-muted)", strokeWidth: 1.8 }} markerEnd="url(#dia-arrow)" />
      <text x={linkMid} y={cyc - 12} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 9, fontStyle: "italic" }}>ref</text>

      {/* object (the heap value) */}
      <rect x={objBox.x} y={objBox.y} width={objBox.w} height={objBox.h} rx={8}
        style={{
          fill: col.lockObj ? `var(--seg-${sub}-bg)` : "var(--mm-cell-bg)",
          stroke: bd, strokeWidth: 1.4,
          strokeDasharray: col.openObj ? "4 3" : "none",
        }} />
      <text x={objBox.x + objBox.w / 2} y={objBox.y + 19} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 14, fontWeight: 800 }}>{col.obj}</text>
      <line x1={objBox.x + 10} y1={objBox.y + 33} x2={objBox.x + objBox.w - 10} y2={objBox.y + 33}
        style={{ stroke: bd, strokeWidth: 1, opacity: 0.6 }} />
      <text x={objBox.x + objBox.w / 2} y={objBox.y + 49} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--mm-muted)", fontSize: 11, fontWeight: 700 }}>{col.field}</text>

      {/* padlocks: where this mechanism actually freezes */}
      {col.locks.includes("name") && <Lock cx={nameBox.x + nameBox.w / 2} cy={nameBox.y - 8} color={fg} r={0.95} faint />}
      {col.locks.includes("link") && <Lock cx={linkMid} cy={cyc + 15} color={fg} r={col.locks.length > 1 ? 0.95 : 1.18} faint={col.locks.length > 1} />}
      {col.locks.includes("obj") && <Lock cx={objBox.x + objBox.w - 7} cy={objBox.y - 6} color={fg} r={col.locks.length > 1 ? 0.95 : 1.18} faint={col.locks.length > 1} />}

      {/* one-line "what gets locked" tag */}
      <text x={cx} y={PANEL.top + PANEL.h - 28} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 9.4, fontWeight: 800, letterSpacing: 0.4 }}>LOCKS</text>
      <text x={cx} y={PANEL.top + PANEL.h - 13} textAnchor="middle"
        style={{ fill: fg, fontSize: 12, fontWeight: 800 }}>{col.tag}</text>
    </g>
  );
}

export default function ConstFinalImmutable() {
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>const vs final vs immutability - what exactly is frozen</span>

      <DiagramSvg viewBox="0 0 780 320" maxWidth={780}
        ariaLabel="Three columns comparing what is frozen on a shared name-to-reference-to-object chain. C++ const is fine-grained: a lock can sit on the pointer, the handle, or the value, so you choose what is constant. Java final is coarse: the lock sits on the binding link only, so the object reached through it stays mutable. Immutability locks the object itself, freezing the whole observable state, as in String. The trap is that a final reference to a mutable object is not an immutable object.">
        <text x={390} y={28} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 16.5, fontWeight: 900 }}>what exactly gets frozen?</text>
        <text x={390} y={50} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11, fontStyle: "italic" }}>put the padlock on the binding, the handle, or the whole object</text>

        {COLS.map((col, i) => <Panel key={col.key} col={col} i={i} />)}
      </DiagramSvg>

      <CompareCaption
        cols={[
          { tag: "C++ const", kind: "cpp", children: <>Fine-grained: you choose <em>what</em> is constant -- the value, the pointee viewed through a handle (<code className="mm-ic">const T*</code>), the pointer itself (<code className="mm-ic">T* const</code>), or <code className="mm-ic">*this</code> in a <code className="mm-ic">const</code> member.</> },
          { tag: "Java final", kind: "java", children: <>Coarse: the lock sits on a <strong>name or edge</strong> -- a binding (<code className="mm-ic">final T x</code>), an override (<code className="mm-ic">final m()</code>), a subclass (<code className="mm-ic">final class</code>). It <strong>never</strong> freezes the object reached through a reference.</> },
          { tag: "immutable", kind: "asm", children: <>A <strong>design property</strong>, not a keyword: all-final fields + no setters + defensive copies freeze the <strong>whole observable state</strong> (e.g. <code className="mm-ic">String</code>).</> },
        ]}
        punch="const/final lock a binding or a handle; immutability locks the object itself. A final reference to a mutable object is not immutable -- final Circle c still allows c.radius = 10."
      />
    </div>
  );
}
