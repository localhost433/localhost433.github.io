import React from "react";

function cn(...a) { return a.filter(Boolean).join(" "); }

export function Button({ variant = "default", size = "default", className, ...props }) {
  return <button className={cn("ui-btn", "ui-btn--" + variant, "ui-btn--size-" + size, className)} {...props} />;
}

export function Card({ title, className, children, ...props }) {
  if (title != null) {
    return (
      <div className={cn("ui-card", className)} {...props}>
        <div className="ui-card__header"><h3 className="ui-card__title">{title}</h3></div>
        <div className="ui-card__content">{children}</div>
      </div>
    );
  }
  return <div className={cn("ui-card", className)} {...props}>{children}</div>;
}
export function CardHeader({ className, ...props }) { return <div className={cn("ui-card__header", className)} {...props} />; }
export function CardTitle({ className, ...props }) { return <h3 className={cn("ui-card__title", className)} {...props} />; }
export function CardDescription({ className, ...props }) { return <p className={cn("ui-card__description", className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn("ui-card__content", className)} {...props} />; }
export function CardFooter({ className, ...props }) { return <div className={cn("ui-card__footer", className)} {...props} />; }

export function Badge({ variant = "default", className, ...props }) {
  return <span className={cn("ui-badge", "ui-badge--" + variant, className)} {...props} />;
}

export function Input({ className, ...props }) {
  return <input className={cn("ui-input", className)} {...props} />;
}

export function Label({ className, ...props }) {
  return <label className={cn("ui-label", className)} {...props} />;
}

export function Slider({ className, ...props }) {
  return <input type="range" className={cn("ui-slider", className)} {...props} />;
}

export function Switch({ checked, onCheckedChange, className, ...props }) {
  return (
    <button type="button" role="switch" aria-checked={!!checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn("ui-switch", className)}
      onClick={() => onCheckedChange && onCheckedChange(!checked)} {...props}>
      <span className="ui-switch__thumb" />
    </button>
  );
}

export function useTheme() {
  const [theme, setTheme] = React.useState(window.__theme || "light");
  React.useEffect(() => {
    const on = (e) => setTheme(e.detail);
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return theme;
}

const CHART_COLORS_LIGHT = ["#6d28d9", "#2563eb", "#059669", "#d97706", "#dc2626"];
const CHART_COLORS_DARK = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];

export function useChartTheme() {
  const dark = useTheme() === "dark";
  const colors = dark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  return {
    colors,
    line: colors[0],
    grid: dark ? "#2c2f33" : "#e5e7eb",
    axis: dark ? "#9aa0a6" : "#6b7280",
    tooltip: { background: dark ? "#15171a" : "#ffffff", border: "1px solid " + (dark ? "#2c2f33" : "#e5e7eb"), borderRadius: 8, fontSize: 12 },
  };
}

export function Field({ label, htmlFor, className, children, ...props }) {
  return (
    <div className={cn("ui-field", className)} {...props}>
      {label != null ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
    </div>
  );
}

export function Stat({ label, value, className, ...props }) {
  return (
    <div className={cn("ui-stat", className)} {...props}>
      {label != null ? <div className="ui-stat__label">{label}</div> : null}
      <div className="ui-stat__value">{value}</div>
    </div>
  );
}

export function ButtonGroup({ className, ...props }) {
  return <div role="group" className={cn("ui-btn-group", className)} {...props} />;
}

export function Stepper({ value, onChange, step = 1, min, max, className, ...props }) {
  const clamp = (n) => (min != null && n < min ? min : max != null && n > max ? max : n);
  return (
    <div className={cn("ui-row", className)} {...props}>
      <Button variant="outline" size="icon" aria-label="Decrease"
        disabled={min != null && value <= min} onClick={() => onChange(clamp(value - step))}>−</Button>
      <span className="ui-stat__value" style={{ minWidth: "3ch", textAlign: "center" }}>{value}</span>
      <Button variant="outline" size="icon" aria-label="Increase"
        disabled={max != null && value >= max} onClick={() => onChange(clamp(value + step))}>+</Button>
    </div>
  );
}

/* Reusable interaction primitives (shared across scene types). See _shared.css.
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

/* ---- concept-diagram primitives (shared SVG building blocks) ----
   Extracted from diamond-chart so every concept diagram (pipeline, class
   relations, the diamond) shares one box/edge/arrow/palette styling. */
export const diagramPalette = (i) => ([
  { bg: "--seg-stack-bg",  bd: "--seg-stack-bd",  fg: "--seg-stack-fg"  },
  { bg: "--seg-heap-bg",   bd: "--seg-heap-bd",   fg: "--seg-heap-fg"   },
  { bg: "--seg-global-bg", bd: "--seg-global-bd", fg: "--seg-global-fg" },
  { bg: "--seg-code-bg",   bd: "--seg-code-bd",   fg: "--seg-code-fg"   },
])[((i % 4) + 4) % 4];

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
