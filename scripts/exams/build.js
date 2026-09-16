"use strict";
const fs = require("fs");
const path = require("path");
const { inlineExam } = require("./lib.js");

const DIR = __dirname;                                  // .../scripts/exams
const ROOT = path.resolve(DIR, "..", "..");             // repo root
const COURSES = path.join(ROOT, "notes/courses");
const SHELL = () => fs.readFileSync(path.join(DIR, "shell.html.tmpl"), "utf8");

function engineLibSource(){
  return [
    fs.readFileSync(path.join(DIR, "engine/resume.js"), "utf8"),
    fs.readFileSync(path.join(DIR, "engine/review.js"), "utf8"),
  ].join("\n");
}
function buildOne(data){
  return inlineExam({ shell: SHELL(), engineLib: engineLibSource(), data });
}
function dataFiles(){
  const out = [];
  if (!fs.existsSync(COURSES)) return out;
  for (const course of fs.readdirSync(COURSES)) {
    const d = path.join(COURSES, course, "exams", "data");
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith(".js") || f.endsWith(".test.js")) continue;
      out.push({ file: path.join(d, f), courseDir: path.join(COURSES, course) });
    }
  }
  return out;
}
function main(){
  let n = 0;
  for (const { file, courseDir } of dataFiles()){
    const data = require(file);
    const html = buildOne(data);
    const out = path.join(courseDir, data.meta.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log("  " + path.relative(ROOT, file) + "  ->  " + path.relative(ROOT, out));
    n++;
  }
  console.log("built " + n + " exam(s).");
}
if (require.main === module) main();
module.exports = { buildOne, engineLibSource, dataFiles };
