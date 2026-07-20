import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, CrossOut, diagramCardHeight, ab, cls } from "@course";

/* note 16 — DIP. The L16 slide stops at the one-liner, so this figure supplies
   the standard example the note flags as "beyond the slide". Bad: the
   high-level NotificationService names the concrete EmailSender — swap email
   for SMS and the high-level policy class gets edited. Good: both depend on a
   MessageSender abstraction — the service points DOWN only to an interface,
   and the concrete senders point UP into it (realization). The "inversion" is
   that arrow flip: concretions depend on the abstraction, never the reverse.

   The two designs sit side-by-side under BEFORE/AFTER headers so their headings
   and relationship shapes compare at a glance. The classes are fine on the left;
   what's wrong is the DEPENDENCY, so the red X strikes the arrow itself — the
   two boxes stay clean and the crossed-out relationship reads in the middle. */

const svc = cls("NotificationService", [], ["+ notify(msg : String)"]);
const email = cls("EmailSender", [], ["+ send(msg : String)"]);
const sms = cls("SmsSender", [], ["+ send(msg : String)"]);
const ifc = { title: "«interface» MessageSender", abstract: true,
  sections: [{ rows: [ab("+ send(msg : String)")] }] };

const W = 214, WI = 300, WS = 220;
const svcH = diagramCardHeight(svc.sections);   // 86
const ifcH = diagramCardHeight(ifc.sections);   // 56

// ---- bad block (left) — a real gap between the boxes so the dependency arrow
//      it crosses out is legible ----
const ROW = 120;
const B_SVC = { x: 18, y: ROW, right: 18 + W };
const B_EML = { x: 316, y: ROW };
const B_ARROW_Y = ROW + svcH / 2;               // 163

// ---- good block (right) ----
const G_SVC = { x: 560, y: ROW, right: 560 + W };
const G_IFC = { x: 890, y: ROW, cx: 890 + WI / 2, bottom: ROW + ifcH };
const G_ROW = 240;                              // bottom row (tightened up)
const G_EML = { x: 740, cx: 740 + WS / 2 };
const G_SMS = { x: 970, cx: 970 + WS / 2 };

export default function SolidDip() {
  return (
    <DiagramSvg viewBox="0 0 1200 360" maxWidth={980}
      ariaLabel="Dependency Inversion Principle. Left, the dependency crossed out: NotificationService depends directly on the concrete EmailSender. Right: NotificationService depends on a MessageSender interface, while EmailSender and SmsSender realize that interface from below.">
      {/* ---- BEFORE: high-level depends on low-level ---- */}
      <text x={275} y={54} textAnchor="middle" style={{ fill: "var(--mm-hl)", fontSize: 15, fontWeight: 800 }}>
        BEFORE — policy depends on a detail
      </text>
      <UmlLink from={{ x: B_SVC.right, y: B_ARROW_Y }} to={{ x: B_EML.x, y: B_ARROW_Y }} kind="depend" />
      <DiagramCard x={B_SVC.x} y={B_SVC.y} w={W} title={svc.title} sections={svc.sections} sub={2} />
      <DiagramCard x={B_EML.x} y={B_EML.y} w={W} title={email.title} sections={email.sections} sub={1} />
      {/* the red X rides the arrow, not the boxes: it's the dependency that's wrong */}
      <CrossOut x={(B_SVC.right + B_EML.x) / 2 - 27} y={B_ARROW_Y - 27} w={54} h={54} />

      <line x1={535} y1={42} x2={535} y2={330}
        style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1 }} />

      {/* ---- AFTER: both depend on the abstraction ---- */}
      <text x={875} y={54} textAnchor="middle" style={{ fill: "var(--mm-cell-fg)", fontSize: 15, fontWeight: 800 }}>
        AFTER — both sides depend on the abstraction
      </text>
      <UmlLink from={{ x: G_SVC.right, y: G_SVC.y + 30 }} to={{ x: G_IFC.x, y: G_SVC.y + 30 }} kind="depend" />
      <UmlLink orth elbow="vhv"
        from={{ x: G_EML.cx, y: G_ROW }}
        to={{ x: G_IFC.cx - 65, y: G_IFC.bottom }} kind="realize" />
      <UmlLink orth elbow="vhv"
        from={{ x: G_SMS.cx, y: G_ROW }}
        to={{ x: G_IFC.cx + 65, y: G_IFC.bottom }} kind="realize" />
      <DiagramCard x={G_SVC.x} y={G_SVC.y} w={W} title={svc.title} sections={svc.sections} sub={2} />
      <DiagramCard x={G_IFC.x} y={G_IFC.y} w={WI} title={ifc.title} sections={ifc.sections} abstract sub={3} />
      <DiagramCard x={G_EML.x} y={G_ROW} w={WS} title={email.title} sections={email.sections} sub={1} />
      <DiagramCard x={G_SMS.x} y={G_ROW} w={WS} title={sms.title} sections={sms.sections} sub={0} />

      <text x={875} y={344} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        the arrows flipped: concretions point UP into the abstraction — that flip is the "inversion"
      </text>
    </DiagramSvg>
  );
}
