import React from "react";
import { DiagramSvg, CompareCaption } from "@course";

/* L10 - text file versus binary file representation.
   The figure is intentionally not a memory-layout diagram. It compares two
   Java I/O contracts over the same logical values. Text output first converts
   values into characters and then encodes those characters. Binary output
   follows a byte-level format contract. The binary examples use
   DataOutputStream encodings: writeChar is a two-byte UTF-16 code unit,
   writeUTF is a two-byte byte-length plus modified UTF-8 payload for these
   ASCII characters, writeInt is four big-endian two's-complement bytes, and
   writeDouble is eight big-endian IEEE-754 bytes. ObjectOutputStream is a
   different binary format with stream headers, class descriptors, handles, and
   object records, not raw JVM heap bytes.

   Drawn at viewBox width 780 with maxWidth 780 so 1 unit ≈ 1 rendered px; the
   row labels and byte chips stay legible instead of being scaled down. */

const values = [
  { value: "'A'", type: "char" },
  { value: '"Hi"', type: "String" },
  { value: "2", type: "int" },
  { value: "3.4567", type: "double" },
];

const rows = [
  { value: "'A'", textOp: "print char A", textBytes: ["41"], binaryOp: "writeChar('A')", binaryBytes: ["00", "41"] },
  { value: '"Hi"', textOp: "print chars H i", textBytes: ["48", "69"], binaryOp: 'writeUTF("Hi")', binaryBytes: ["00", "02", "48", "69"] },
  { value: "2", textOp: "print digit 2", textBytes: ["32"], binaryOp: "writeInt(2)", binaryBytes: ["00", "00", "00", "02"] },
  { value: "3.4567", textOp: "print 3 . 4 5 6 7", textBytes: ["33", "2E", "34", "35", "36", "37"], binaryOp: "writeDouble(3.4567)", binaryBytes: ["40", "0B", "A7", "52", "54", "60", "AA", "65"] },
];

function panel(x, y, w, h, title, note, sub) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={15}
        style={{ fill: "var(--mm-panel-bg)", stroke: `var(--seg-${sub}-bd)`, strokeWidth: 1.4 }} />
      <rect x={x} y={y} width={w} height={46} rx={15}
        style={{ fill: `var(--seg-${sub}-bg)`, stroke: `var(--seg-${sub}-bd)`, strokeWidth: 1.4 }} />
      <text x={x + w / 2} y={y + 19} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${sub}-fg)`, fontSize: 15, fontWeight: 900 }}>{title}</text>
      <text x={x + w / 2} y={y + 35} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${sub}-fg)`, fontSize: 10.5, opacity: 0.78 }}>{note}</text>
    </g>
  );
}

function valueChip(x, y, value, type) {
  return (
    <g>
      <rect x={x} y={y} width={108} height={42} rx={9}
        style={{ fill: "var(--seg-stack-bg)", stroke: "var(--seg-stack-bd)", strokeWidth: 1.3 }} />
      <text x={x + 54} y={y + 16} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--seg-stack-fg)", fontSize: 13.5, fontWeight: 900 }}>{value}</text>
      <text x={x + 54} y={y + 31} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--seg-stack-fg)", fontSize: 9.5, opacity: 0.78 }}>{type}</text>
    </g>
  );
}

function byteChip(x, y, b, sub, w) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={5}
        style={{ fill: `var(--seg-${sub}-bg)`, stroke: `var(--seg-${sub}-bd)`, strokeWidth: 1.1 }} />
      <text x={x + w / 2} y={y + 12} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${sub}-fg)`, fontSize: 9.8, fontWeight: 900 }}>{b}</text>
    </g>
  );
}

function byteRun(x, y, bytes, sub) {
  const w = bytes.length > 5 ? 22 : 30;
  const gap = 3;
  return bytes.map((b, i) => byteChip(x + i * (w + gap), y, b, sub, w));
}

function recordRow(x, y, w, row, mode) {
  const sub = mode === "text" ? "heap" : "global";
  const op = mode === "text" ? row.textOp : row.binaryOp;
  const bytes = mode === "text" ? row.textBytes : row.binaryBytes;
  return (
    <g>
      <rect x={x} y={y} width={w} height={58} rx={10}
        style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-cell-bd)", strokeWidth: 1.05 }} />
      <rect x={x + 12} y={y + 13} width={62} height={32} rx={7}
        style={{ fill: "var(--seg-stack-bg)", stroke: "var(--seg-stack-bd)", strokeWidth: 1 }} />
      <text x={x + 43} y={y + 30} textAnchor="middle" dominantBaseline="central"
        style={{ fill: "var(--seg-stack-fg)", fontSize: 11.5, fontWeight: 900 }}>{row.value}</text>
      <text x={x + 86} y={y + 18} textAnchor="start" dominantBaseline="central"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 10.6, fontWeight: 800 }}>{op}</text>
      <text x={x + 86} y={y + 41} textAnchor="start" dominantBaseline="central"
        style={{ fill: "var(--mm-muted)", fontSize: 9 }}>bytes</text>
      {byteRun(x + 120, y + 29, bytes, sub)}
    </g>
  );
}

export default function FileTextVsBinary() {
  const PW = 352, TX = 26, BX = 402, RY = 192, RX_T = TX + 8, RX_B = BX + 8, RW = PW - 16;
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>Text file vs binary file - same values, different decoding rules</span>

      <DiagramSvg viewBox="0 0 780 506" maxWidth={780}
        ariaLabel="The same Java values shown as text output bytes and as DataOutputStream binary bytes. The file contains bytes; decoding gives those bytes meaning.">
        <rect x={12} y={14} width={756} height={478} rx={17}
          style={{ fill: "var(--mm-panel-bg)", stroke: "var(--mm-gap-bd)", strokeWidth: 1.3 }} />

        <text x={390} y={42} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 15.5, fontWeight: 900 }}>one logical sequence of Java values</text>
        {values.map((v, i) => valueChip(165 + i * 118, 58, v.value, v.type))}

        {panel(TX, 124, PW, 308, "Text file", "characters → encoded bytes", "heap")}
        {panel(BX, 124, PW, 308, "Binary file", "format-specific byte records", "global")}

        {rows.map((row, i) => recordRow(RX_T, RY + i * 60, RW, row, "text"))}
        {rows.map((row, i) => recordRow(RX_B, RY + i * 60, RW, row, "binary"))}

        <line x1="26" y1="450" x2="754" y2="450" style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1 }} />
        <text x={32} y={468} textAnchor="start"
          style={{ fill: "var(--mm-muted)", fontSize: 9.6 }}>Text bytes assume an ASCII/UTF-8-compatible encoding of these characters.</text>
        <text x={32} y={484} textAnchor="start"
          style={{ fill: "var(--mm-muted)", fontSize: 9.6 }}>The binary side is DataOutputStream primitive output; ObjectOutputStream uses a richer object-stream format.</text>
      </DiagramSvg>

      <CompareCaption
        cols={[
          { tag: "text", kind: "java", children: <>A text writer converts the value to characters first. The bytes are intended to be decoded as text.</> },
          { tag: "binary", kind: "cpp", children: <>A binary writer stores bytes according to a particular file or stream format. The reader must know that format.</> },
        ]}
        punch="A file is always bits. The difference is the decoding convention."
      />
    </div>
  );
}
