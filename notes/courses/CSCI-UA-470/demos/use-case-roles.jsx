import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge } from "@course";

/* note 12 — the chain of roles a project passes through before code exists.
   UML is the shared notation the two middle roles (Analyst, Designer) author and
   hand downstream, so those two are tinted (amber) and bracketed; the rest stay
   neutral. A left-to-right flow of boxes, an arrow between each. */

const ROLES = [
  { label: "Client", note: "wants a system" },
  { label: "Analyst", note: "captures needs", uml: true },
  { label: "Designer", note: "shapes solution", uml: true },
  { label: "Programmer", note: "writes code" },
  { label: "Tester", note: "checks it" },
];

const BW = 108, BH = 44, GAP = 30, MX = 16, CY = 52;
const step = BW + GAP;
const cx = (i) => MX + BW / 2 + i * step;
const W = MX * 2 + ROLES.length * BW + (ROLES.length - 1) * GAP;
const H = 128;

// bracket under the two UML roles
const umlIdx = ROLES.map((r, i) => (r.uml ? i : -1)).filter((i) => i >= 0);
const bx1 = cx(umlIdx[0]) - BW / 2, bx2 = cx(umlIdx[umlIdx.length - 1]) + BW / 2;
const brY = CY + BH / 2 + 12;

export default function UseCaseRoles() {
  return (
    <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={640}
      ariaLabel="A left-to-right chain of five roles a project passes through: Client, Analyst, Designer, Programmer, Tester, each an arrow to the next. The Analyst and Designer are highlighted and bracketed as the two roles who author and read the UML model.">
      {ROLES.slice(1).map((_, i) => (
        <DiagramEdge key={i} from={{ x: cx(i) + BW / 2, y: CY }} to={{ x: cx(i + 1) - BW / 2, y: CY }} />
      ))}
      {ROLES.map((r, i) => (
        <DiagramBox key={i} cx={cx(i)} cy={CY} w={BW} h={BH} label={r.label} note={r.note}
          sub={2} neutral={!r.uml} />
      ))}
      {/* bracket calling out the UML authors */}
      <path d={`M ${bx1} ${brY} L ${bx1} ${brY + 6} L ${bx2} ${brY + 6} L ${bx2} ${brY}`}
        style={{ fill: "none", stroke: "var(--seg-global-tx)", strokeWidth: 1.4 }} />
      <text x={(bx1 + bx2) / 2} y={brY + 22} textAnchor="middle"
        style={{ fill: "var(--seg-global-tx)", fontSize: 11, fontWeight: 700,
          fontFamily: "system-ui, sans-serif" }}>author &amp; read the UML model</text>
    </DiagramSvg>
  );
}
