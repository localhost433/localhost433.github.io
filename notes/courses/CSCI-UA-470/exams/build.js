"use strict";
const fs = require("fs");
const path = require("path");
const { inlineExam } = require("./lib.js");

const DIR = __dirname;                                  // .../exams
const CDIR = path.resolve(DIR, "..");                   // .../CSCI-UA-470
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
  const d = path.join(DIR, "data");
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".js") && !f.endsWith(".test.js"))
    .map((f) => path.join(d, f));
}
function main(){
  let n = 0;
  for (const file of dataFiles()){
    const data = require(file);
    const html = buildOne(data);
    const out = path.join(CDIR, data.meta.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log("  " + path.relative(CDIR, file) + "  ->  " + data.meta.out);
    n++;
  }
  console.log("built " + n + " exam(s).");
}
if (require.main === module) main();
module.exports = { buildOne, engineLibSource, dataFiles };
