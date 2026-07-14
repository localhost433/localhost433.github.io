import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, diagramCardHeight } from "@course";

/* note 14 — the Structural payoff: the participants left standing on the merged
   sequence diagram's top row, read off as classes. Each box is the three-compartment
   UML form (name / attributes / operations) with real member notation — visibility
   marker, then `name : Type`, the type AFTER the colon. The plain lines are
   associations ("knows-about"): MainGUI knows each dialog it opens, and each dialog
   knows the one Converter it delegates to. */

const mainSections = [
  { rows: ["- b1 : JButton", "- b2 : JButton", "- b3 : JButton"] },
  { rows: ["+ whenKgLbClicked() : void", "+ whenCmInchClicked() : void"] },
];
const dialogSections = [
  { rows: ["- in : JTextField", "- out : JTextField", "- c : Converter"] },
  { rows: ["+ show() : void", "+ whenConvertClicked() : void"] },
];
const convSections = [
  { rows: ["(no attributes)"] },
  { rows: ["+ convert(amount : float, unit : String) : float"] },
];

/* Card widths are measured, not guessed: the kit renders rows in an 11px mono face at
   ~7.2px/char (MONO_CH) inside DCARD.PAD_X=11 of padding on each side. The Converter's
   one operation is 47 characters, so anything under 22 + 47*7.2 = 360 clips it. */
const MAIN = { x: 20, y: 110, w: 224, h: diagramCardHeight(mainSections) };    // 140
const KG = { x: 300, y: 20, w: 232, h: diagramCardHeight(dialogSections) };    // 140
const CM = { x: 300, y: 200, w: 232, h: diagramCardHeight(dialogSections) };   // 140
const CONV = { x: 592, y: 125, w: 364, h: diagramCardHeight(convSections) };   // 86

const mainR = MAIN.x + MAIN.w;   // 244
const dlgR = KG.x + KG.w;        // 532

export default function ConverterClassDiagram() {
  return (
    <DiagramSvg viewBox="0 0 980 400" maxWidth={740}
      ariaLabel="Class diagram of the unit converter. MainGUI holds three JButtons and two click handlers, and is associated with KgLbGUI and CmInchGUI. Each dialog holds input and result fields plus a private Converter reference, and is associated with the single Converter class, whose one operation is convert(amount : float, unit : String) : float.">
      <UmlLink from={{ x: mainR, y: 152 }} to={{ x: KG.x, y: 90 }} kind="assoc" />
      <UmlLink from={{ x: mainR, y: 208 }} to={{ x: CM.x, y: 270 }} kind="assoc" />
      <UmlLink from={{ x: dlgR, y: 90 }} to={{ x: CONV.x, y: 150 }} kind="assoc" />
      <UmlLink from={{ x: dlgR, y: 270 }} to={{ x: CONV.x, y: 190 }} kind="assoc" />

      <DiagramCard x={MAIN.x} y={MAIN.y} w={MAIN.w} title="MainGUI" sections={mainSections} sub={0} />
      <DiagramCard x={KG.x} y={KG.y} w={KG.w} title="KgLbGUI" sections={dialogSections} sub={2} />
      <DiagramCard x={CM.x} y={CM.y} w={CM.w} title="CmInchGUI" sections={dialogSections} sub={2} />
      <DiagramCard x={CONV.x} y={CONV.y} w={CONV.w} title="Converter" sections={convSections} sub={1} />

      <text x={490} y={378} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        KgLbGUI and CmInchGUI are identical — the next refactor generalizes them under one ConverterGUI
      </text>
    </DiagramSvg>
  );
}
