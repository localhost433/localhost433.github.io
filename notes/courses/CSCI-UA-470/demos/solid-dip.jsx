import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, diagramCardHeight, ab, cls } from "@course";

/* note 16 — DIP. The L16 slide stops at the one-liner, so this figure supplies
   the standard example the note flags as "beyond the slide". Bad: the
   high-level NotificationService names the concrete EmailSender — swap email
   for SMS and the high-level policy class gets edited. Good: both depend on a
   MessageSender abstraction — the service points DOWN only to an interface,
   and the concrete senders point UP into it (realization). The "inversion" is
   that arrow flip: concretions depend on the abstraction, never the reverse. */

const svc = cls("NotificationService", [], ["+ notify(msg : String) : void"]);
const email = cls("EmailSender", [], ["+ send(msg : String) : void"]);
const sms = cls("SmsSender", [], ["+ send(msg : String) : void"]);
const ifc = { title: "«interface» MessageSender", abstract: true,
  sections: [{ rows: [ab("+ send(msg : String) : void")] }] };

const W1 = 200, WS = 216, W2 = 176;
const BSVC = { x: 20, y: 30, h: diagramCardHeight(svc.sections) };
const BEML = { x: 20, y: 176 };

const GSVC = { x: 424, y: 30 };
const GIFC = { x: 690, y: 30, h: diagramCardHeight(ifc.sections) };
const GROW = 196;

export default function SolidDip() {
  return (
    <DiagramSvg viewBox="0 0 1100 340" maxWidth={760}
      ariaLabel="Dependency Inversion Principle. Left, crossed out: the high-level NotificationService depends directly on the concrete low-level EmailSender. Right: NotificationService depends on a MessageSender interface, and both EmailSender and SmsSender realize that interface — the concrete classes now point up into the abstraction.">
      {/* ---- bad: high-level depends on low-level ---- */}
      <UmlLink orth elbow="vhv"
        from={{ x: BSVC.x + W2 / 2, y: BSVC.y + BSVC.h }}
        to={{ x: BEML.x + W2 / 2, y: BEML.y }} kind="depend" />
      <DiagramCard x={BSVC.x} y={BSVC.y} w={W2} title={svc.title} sections={svc.sections} sub={2} />
      <DiagramCard x={BEML.x} y={BEML.y} w={W2} title={email.title} sections={email.sections} sub={1} />
      <line x1={8} y1={18} x2={208} y2={288} style={{ stroke: "var(--mm-hl)", strokeWidth: 3, opacity: 0.7 }} />
      <line x1={208} y1={18} x2={8} y2={288} style={{ stroke: "var(--mm-hl)", strokeWidth: 3, opacity: 0.7 }} />

      <text x={312} y={128} textAnchor="middle" style={{ fill: "var(--mm-cell-fg)", fontSize: 24, fontWeight: 800 }}>⇒</text>
      <text x={312} y={168} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic" }}>
        policy names a concrete class —
      </text>
      <text x={312} y={184} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic" }}>
        switching to SMS edits the service
      </text>

      {/* ---- good: both depend on the abstraction ---- */}
      <UmlLink from={{ x: GSVC.x + W2, y: 70 }} to={{ x: GIFC.x, y: 70 }} kind="depend" />
      <UmlLink orth elbow="vhv"
        from={{ x: 608 + WS / 2, y: GROW }}
        to={{ x: GIFC.x + 70, y: GIFC.y + GIFC.h }} kind="realize" />
      <UmlLink orth elbow="vhv"
        from={{ x: 862 + WS / 2, y: GROW }}
        to={{ x: GIFC.x + 146, y: GIFC.y + GIFC.h }} kind="realize" />
      <DiagramCard x={GSVC.x} y={GSVC.y} w={W2} title={svc.title} sections={svc.sections} sub={2} />
      <DiagramCard x={GIFC.x} y={GIFC.y} w={W1} title={ifc.title} sections={ifc.sections} abstract sub={3} />
      <DiagramCard x={608} y={GROW} w={WS} title={email.title} sections={email.sections} sub={1} />
      <DiagramCard x={862} y={GROW} w={WS} title={sms.title} sections={sms.sections} sub={0} />

      <text x={550} y={330} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        the arrows flipped: concretions point UP into the abstraction — that flip is the "inversion"
      </text>
    </DiagramSvg>
  );
}
