import React from "react";
import { DiagramSvg, DiagramBox, DiagramCard, DiagramEdge, diagramCardHeight } from "@course";

/* notes 19–21, the opener — L18's roadmap slide turned into the map the three
   pattern notes share. The deck draws OOP → SOLID → Design patterns and then splits
   the last one three ways; the useful addition is the QUESTION each category
   answers, because that is what actually tells them apart on an exam. The card for
   each category also lists its members, so the map doubles as a checklist of what
   the three lectures cover. */

const CATS = [
  { title: "Creational", q: "how objects get MADE",
    rows: ["Singleton", "Factory", "Abstract Factory"] },
  { title: "Structural", q: "how objects are COMPOSED",
    rows: ["Adapter", "Composition", "Flyweight", "Proxy", "Facade", "Bridge", "Decorator"] },
  { title: "Behavioral", q: "how objects TALK",
    rows: ["Template Method", "Strategy", "State", "Command",
      "Mediator", "Observer", "Chain of Resp.", "Iterator"] },
];

const PAD = 14, CARD_W = 196, GAP = 22, TOP_H = 44, DROP = 56;
const specs = CATS.map((c) => ({ ...c, sections: [{ rows: [c.q] }, { rows: c.rows }] }));
const cardY = PAD + TOP_H + DROP;
const rowW = specs.length * CARD_W + (specs.length - 1) * GAP;
const W = Math.round(PAD * 2 + rowW);
const H = Math.round(cardY + Math.max(...specs.map((s) => diagramCardHeight(s.sections, { title: true }))) + PAD);
const hubCx = PAD + rowW / 2, hubCy = PAD + TOP_H / 2;

export default function PatternTaxonomy() {
  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>The catalog, in three questions</div>
      <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={760}
        ariaLabel="Design patterns split into three categories. Creational — how objects get made: Singleton, Factory, Abstract Factory. Structural — how objects are composed: Adapter, Composition, Flyweight, Proxy, Facade, Bridge, Decorator. Behavioral — how objects talk: Template Method, Strategy, State, Command, Mediator, Observer, Chain of Responsibilities, Iterator.">
        <DiagramBox cx={hubCx} cy={hubCy} w={210} h={TOP_H} label="Design patterns" note="named, reusable designs" sub={0} />
        {specs.map((s, i) => {
          const x = PAD + i * (CARD_W + GAP);
          return (
            <React.Fragment key={s.title}>
              <DiagramEdge from={{ x: hubCx, y: hubCy + TOP_H / 2 }} to={{ x: x + CARD_W / 2, y: cardY }} />
              <DiagramCard x={x} y={cardY} w={CARD_W} title={s.title} sections={s.sections} sub={i + 1} />
            </React.Fragment>
          );
        })}
      </DiagramSvg>
      <p className="mm-scene__caption">
        The three categories are not a filing convenience — they are three different
        questions. Ask <strong>how does this object get created</strong> and you are in the
        creational column; <strong>how are these objects wired together</strong> and you are in
        the structural one; <strong>who calls whom, and when</strong> and you are in the
        behavioral one. Most "which pattern is this?" questions are answered by picking
        the column first.
      </p>
    </div>
  );
}
