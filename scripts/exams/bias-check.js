"use strict";
/* Answer-bias report for every exam data file.

   Two biases a multiple-choice bank can carry without anyone intending them:
   the correct option sitting in one slot more than the others, and the correct
   option being systematically the longest (the "most complete" answer) or the
   shortest. The runtime shuffle hides the first on screen but not in the shipped
   JSON; nothing hides the second. This prints both per file so a bank can be
   checked before it is built.

   usage: node scripts/exams/bias-check.js            all courses
          node scripts/exams/bias-check.js 473        files whose path contains "473" */
const path = require("path");
const { dataFiles } = require("./build.js");

const filter = process.argv[2] || "";
const files = dataFiles().filter((f) => f.file.includes(filter));
if (!files.length) { console.error("no exam data files match", JSON.stringify(filter)); process.exit(1); }

let bad = 0;
for (const { file } of files) {
  const { questions } = require(file);
  const n = questions.length;
  const pos = {};
  let longest = 0, shortest = 0, sumC = 0, sumW = 0, nW = 0;
  for (const q of questions) {
    const ci = q.options.findIndex((o) => o.correct);
    pos[ci] = (pos[ci] || 0) + 1;
    const L = q.options.map((o) => o.text.length);
    const mx = Math.max(...L), mn = Math.min(...L);
    if (L[ci] === mx && L.filter((v) => v === mx).length === 1) longest++;
    if (L[ci] === mn && L.filter((v) => v === mn).length === 1) shortest++;
    sumC += L[ci]; L.forEach((v, i) => { if (i !== ci) { sumW += v; nW++; } });
  }
  const slots = Object.keys(pos).sort().map((k) => `${k}:${pos[k]}`).join(" ");
  const maxSlot = Math.max(...Object.values(pos));
  // flags: one slot holding more than half the answers, or the correct option
  // strictly longest / shortest in more than 40% of questions (chance is ~25%)
  const flags = [];
  if (maxSlot > n / 2) flags.push("position");
  if (longest > 0.4 * n) flags.push("longest");
  if (shortest > 0.4 * n) flags.push("shortest");
  if (flags.length) bad++;
  console.log(
    `${path.relative(process.cwd(), file)}\n` +
    `  n=${n}  slots ${slots}  strictly-longest ${longest}  strictly-shortest ${shortest}` +
    `  mean len correct ${(sumC / n).toFixed(1)} vs wrong ${(sumW / nW).toFixed(1)}` +
    (flags.length ? `  <-- ${flags.join(", ")}` : ""));
}
process.exit(bad ? 2 : 0);
