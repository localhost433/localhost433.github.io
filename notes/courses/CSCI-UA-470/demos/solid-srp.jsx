import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, CrossOut, diagramCardHeight, cls } from "@course";

/* note 16 — SRP, drawn as the lecture drew it: the Invoice god-class crossed
   out on the left, the split on the right. Invoice keeps the DATA (its one
   responsibility); the register keeps the BOOKKEEPING (adding, deleting,
   sorting invoices — a different responsibility, a different reason to
   change). The hollow diamond says the register aggregates invoices. */

const bad = cls("Invoice",
  ["- no : int", "- date : String", "- details : String"],
  ["+ addInvoice() : void", "+ deleteInvoice() : void", "+ sortInvoices() : void"]);

const invoice = cls("Invoice", ["- no : int", "- date : String", "- details : String"], []);
const register = cls("InvoiceRegister",
  ["- invoices : List<Invoice>"],
  ["+ addInvoice() : void", "+ deleteInvoice() : void", "+ sortInvoices() : void"]);

const BAD = { x: 30, y: 60, w: 200, h: diagramCardHeight(bad.sections) };
// Keep the two replacement classes on one shared baseline: the connector then
// reads as a relationship, rather than making Invoice look subordinate.
const INV = { x: 330, y: 74, w: 200, h: diagramCardHeight(invoice.sections) };
const REG = { x: 610, y: 74, w: 210, h: diagramCardHeight(register.sections) };

export default function SolidSrp() {
  const cx = BAD.x + BAD.w / 2, cy = BAD.y + BAD.h / 2;
  return (
    <DiagramSvg viewBox="0 0 850 300" maxWidth={760}
      ariaLabel="Single Responsibility Principle. Left, crossed out: one Invoice class holding both the invoice data (no, date, details) and the bookkeeping operations (addInvoice, deleteInvoice, sortInvoices). Right: the split — Invoice keeps only the data; a separate InvoiceRegister holds a list of invoices and the three operations, aggregating Invoice with a hollow diamond.">
      <text x={cx} y={40} textAnchor="middle" style={{ fill: "var(--mm-hl)", fontSize: 15, fontWeight: 800 }}>
        BEFORE — two jobs, one class
      </text>
      <DiagramCard x={BAD.x} y={BAD.y} w={BAD.w} title={bad.title} sections={bad.sections} sub={3} />
      {/* the lecture's red X — the whole god-class is the mistake */}
      <CrossOut x={BAD.x} y={BAD.y} w={BAD.w} h={BAD.h} />

      <text x={287} y={cy + 6} textAnchor="middle" style={{ fill: "var(--mm-cell-fg)", fontSize: 24, fontWeight: 800 }}>⇒</text>

      <text x={575} y={40} textAnchor="middle" style={{ fill: "var(--mm-cell-fg)", fontSize: 15, fontWeight: 800 }}>
        AFTER — data here, bookkeeping there
      </text>
      <UmlLink from={{ x: REG.x, y: 160 }} to={{ x: INV.x + INV.w, y: 160 }} kind="aggregate" />
      <DiagramCard x={INV.x} y={INV.y} w={INV.w} title={invoice.title} sections={invoice.sections} sub={0} />
      <DiagramCard x={REG.x} y={REG.y} w={REG.w} title={register.title} sections={register.sections} sub={2} />

      <text x={425} y={286} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        same cure for Car: totalSales does not belong on Car — a static counter (or a registry) tracks the fleet
      </text>
    </DiagramSvg>
  );
}
