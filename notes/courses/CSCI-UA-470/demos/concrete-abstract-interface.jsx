import React from "react";
import { DiagramSvg, CompareCaption } from "@course";

/* L13 - concrete vs abstract vs interface, drawn as ONE spectrum.
   The single axis is "how much is left unimplemented", shown as a row of method
   slots: a filled slot has a body, a dashed slot is abstract. A concrete class
   fills every slot (so `new` works); an abstract class leaves >= 1 slot empty
   (so `new` is blocked); an interface leaves every slot empty by default (modern
   Java fills only the default/static/private corners). Defining a reference is
   always legal; only `new` tracks the spectrum. */

const COLS = [
  {
    key: "concrete", title: "Concrete class", subtitle: "instantiable", sub: "stack",
    slots: [1, 1, 1, 1], ratio: "every method has a body",
    canNew: true, newNote: "object can be created",
  },
  {
    key: "abstract", title: "Abstract class", subtitle: "partial contract", sub: "global",
    slots: [1, 1, 0, 1], ratio: "one abstract slot blocks it",
    canNew: false, newNote: "no direct object",
  },
  {
    key: "interface", title: "Interface", subtitle: "pure contract", sub: "code",
    slots: [0, 0, 0, 0], ratio: "abstract by default",
    canNew: false, newNote: "default / static fill corners",
  },
];

const PANEL = { w: 250, h: 214, top: 104 };
const X0 = 38, GAP = 38;
const colX = (i) => X0 + i * (PANEL.w + GAP);

/* one method slot: filled => has a body (two code lines); dashed => abstract. */
function Slot({ x, y, w, h, filled, sub }) {
  const bd = `var(--seg-${sub}-bd)`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6}
        style={{
          fill: filled ? `var(--seg-${sub}-bg)` : "none",
          stroke: bd, strokeWidth: 1.3,
          strokeDasharray: filled ? "none" : "3.5 3",
          opacity: filled ? 1 : 0.85,
        }} />
      {filled ? (
        <g style={{ stroke: `var(--seg-${sub}-fg)`, strokeWidth: 1.7, strokeLinecap: "round", opacity: 0.8 }}>
          <line x1={x + 9} y1={y + h / 2 - 4} x2={x + w - 9} y2={y + h / 2 - 4} />
          <line x1={x + 9} y1={y + h / 2 + 4} x2={x + w - 14} y2={y + h / 2 + 4} />
        </g>
      ) : (
        <text x={x + w / 2} y={y + h / 2 + 0.5} textAnchor="middle" dominantBaseline="central"
          style={{ fill: "var(--mm-muted)", fontSize: 8.4, fontStyle: "italic" }}>abs</text>
      )}
    </g>
  );
}

function NewBadge({ x, y, w, ok }) {
  const seg = ok ? "heap" : "code";
  return (
    <g>
      <rect x={x} y={y} width={w} height={28} rx={9}
        style={{ fill: `var(--seg-${seg}-bg)`, stroke: `var(--seg-${seg}-bd)`, strokeWidth: 1.3 }} />
      <text x={x + 13} y={y + 14} textAnchor="start" dominantBaseline="central"
        style={{ fill: `var(--seg-${seg}-fg)`, fontSize: 12.5, fontWeight: 800 }}>new T()</text>
      {/* check or cross */}
      {ok ? (
        <path d={`M ${x + w - 26} ${y + 14} l 5 5 l 9 -10`}
          style={{ fill: "none", stroke: `var(--seg-${seg}-fg)`, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" }} />
      ) : (
        <g style={{ stroke: `var(--seg-${seg}-fg)`, strokeWidth: 2.4, strokeLinecap: "round" }}>
          <line x1={x + w - 24} y1={y + 9} x2={x + w - 13} y2={y + 20} />
          <line x1={x + w - 13} y1={y + 9} x2={x + w - 24} y2={y + 20} />
        </g>
      )}
    </g>
  );
}

function Panel({ col, i }) {
  const x = colX(i);
  const cx = x + PANEL.w / 2;
  const sub = col.sub;
  const fg = `var(--seg-${sub}-fg)`;
  const bd = `var(--seg-${sub}-bd)`;

  const slotW = 44, slotH = 34, slotGap = 10;
  const rowW = col.slots.length * slotW + (col.slots.length - 1) * slotGap;
  const slotX0 = cx - rowW / 2;
  const slotY = PANEL.top + 80;

  return (
    <g>
      <rect x={x} y={PANEL.top} width={PANEL.w} height={PANEL.h} rx={16}
        style={{ fill: "var(--mm-panel-bg)", stroke: bd, strokeWidth: 1.6 }} />
      <rect x={x} y={PANEL.top} width={PANEL.w} height={52} rx={16}
        style={{ fill: `var(--seg-${sub}-bg)`, stroke: bd, strokeWidth: 1.2 }} />
      <text x={cx} y={PANEL.top + 21} textAnchor="middle" dominantBaseline="central"
        style={{ fill: fg, fontSize: 15, fontWeight: 900 }}>{col.title}</text>
      <text x={cx} y={PANEL.top + 39} textAnchor="middle" dominantBaseline="central"
        style={{ fill: fg, fontSize: 10, opacity: 0.78 }}>{col.subtitle}</text>

      {/* method slots — the spectrum made visible */}
      <text x={cx} y={PANEL.top + 67} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 8.6, fontWeight: 800, letterSpacing: 0.5 }}>METHODS</text>
      {col.slots.map((f, k) => (
        <Slot key={k} x={slotX0 + k * (slotW + slotGap)} y={slotY} w={slotW} h={slotH} filled={!!f} sub={sub} />
      ))}
      <text x={cx} y={slotY + slotH + 16} textAnchor="middle"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 9.8 }}>{col.ratio}</text>

      {/* the consequence: can you new it? */}
      <line x1={x + 16} y1={PANEL.top + 156} x2={x + PANEL.w - 16} y2={PANEL.top + 156}
        style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1 }} />
      <NewBadge x={x + 18} y={PANEL.top + 170} w={96} ok={col.canNew} />
      <text x={x + 124} y={PANEL.top + 184} textAnchor="start" dominantBaseline="central"
        style={{ fill: "var(--mm-muted)", fontSize: 8.8 }}>
        {col.newNote.length > 22
          ? col.newNote.split(" / ").map((t, k) => <tspan key={k} x={x + 124} dy={k === 0 ? 0 : 11}>{t}{k === 0 ? " /" : ""}</tspan>)
          : col.newNote}
      </text>
    </g>
  );
}

export default function ConcreteAbstractInterface() {
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>Concrete vs abstract vs interface - a spectrum of how much is left unimplemented</span>

      <DiagramSvg viewBox="0 0 900 360" maxWidth={790}
        ariaLabel="A single spectrum from concrete class to abstract class to interface, ordered by how much is left unimplemented, shown as a row of four method slots per class. A filled slot has a body; a dashed slot is abstract. A concrete class fills all four slots and can be instantiated with new. An abstract class leaves at least one slot empty and cannot be instantiated. An interface leaves all four empty by default, apart from default, static and private bodies, and also cannot be instantiated. Defining a reference of any of the three is always legal; only new tracks the spectrum.">
        <text x={450} y={28} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 16, fontWeight: 900 }}>how much is left unimplemented?</text>

        {/* spectrum axis */}
        <line x1={62} y1={66} x2={838} y2={66} markerEnd="url(#dia-arrow)"
          style={{ stroke: "var(--mm-muted)", strokeWidth: 1.6 }} />
        <text x={62} y={84} textAnchor="start"
          style={{ fill: "var(--mm-muted)", fontSize: 9.6, fontStyle: "italic" }}>fully implemented · instantiable</text>
        <text x={838} y={84} textAnchor="end"
          style={{ fill: "var(--mm-muted)", fontSize: 9.6, fontStyle: "italic" }}>nothing implemented · pure contract</text>

        {COLS.map((col, i) => <Panel key={col.key} col={col} i={i} />)}

        <text x={450} y={344} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 10.4 }}>
          A reference of any of the three is legal; only `new T()` needs every slot filled.
        </text>
      </DiagramSvg>

      <CompareCaption
        cols={[
          { tag: "concrete", kind: "cpp", children: <>Every method has a body, so <code className="mm-ic">new T()</code> is allowed. In C++, an ordinary class; add <code className="mm-ic">virtual</code> only where you need runtime dispatch. Extends one class.</> },
          { tag: "abstract", kind: "java", children: <>One <code className="mm-ic">abstract</code> method is enough to block <code className="mm-ic">new</code>. The C++ analogue is a class with a pure virtual method (<code className="mm-ic">= 0</code>). Extends one class.</> },
          { tag: "interface", kind: "asm", children: <>Abstract by default; a class can implement <strong>many</strong> -- Java's controlled substitute for multiple inheritance. Modern Java adds <code className="mm-ic">default</code>/<code className="mm-ic">static</code>/<code className="mm-ic">private</code> bodies.</> },
        ]}
        punch="The single axis is how much is left unimplemented; that one difference drives instantiability and every other rule."
      />
    </div>
  );
}
