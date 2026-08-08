const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

/* Guard against the failure this test was written for.
 *
 * vercel.json uses `builds`, so a file is only deployed when its path matches one of
 * the `src` globs. `notes/js/**` was listed as `*.js` only, which silently dropped
 * `seq-order-logic.mjs` — the module the artifact host injects as `@course/seq-order`.
 * Every artifact on the site then died with "Failed to resolve module specifier", while
 * local `npm run dev` (which serves straight off disk) worked perfectly and the page's
 * own `.artifact-error` hook never fired, because the failure happens INSIDE the
 * sandboxed iframe. Nothing in CI or in a local browser could see it.
 *
 * So: every site-absolute asset path hard-coded in the runtime JS must both exist on
 * disk and be covered by a vercel.json build glob.
 */

const ROOT = path.resolve(__dirname, "../..");
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));

// vercel's glob subset: `**/` spans zero or more directories, `*` stays within one.
function globToRegExp(glob) {
  let out = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        if (glob[i + 2] === "/") { out += "(?:.*/)?"; i += 2; }
        else { out += ".*"; i += 1; }
      } else { out += "[^/]*"; }
    } else if ("\\^$.|?+()[]{}".includes(c)) {
      out += "\\" + c;
    } else {
      out += c;
    }
  }
  return new RegExp("^" + out + "$");
}

const buildMatchers = (vercel.builds || []).map((b) => globToRegExp(b.src));
const isDeployed = (rel) => buildMatchers.some((re) => re.test(rel));

// Site-absolute paths written as literals in the runtime JS (note.js fetches these to
// build the artifact iframe's module + css layers). Course-scoped paths are templated,
// so they are checked separately below.
function literalAssetPaths() {
  const dir = path.join(ROOT, "notes/js");
  const found = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".js") && !f.endsWith(".mjs")) continue;
    if (f.endsWith(".test.js")) continue;
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of src.matchAll(/["'`](\/(?:notes|js|css|assets)\/[A-Za-z0-9._/-]+\.[A-Za-z0-9]+)["'`]/g)) {
      found.add(m[1]);
    }
  }
  return [...found].sort();
}

test("vercel.json glob subset behaves as expected", () => {
  const g = globToRegExp("notes/js/**/*.js");
  assert.equal(g.test("notes/js/note.js"), true);
  assert.equal(g.test("notes/js/seq-order-logic.mjs"), false, "the original bug");
  assert.equal(globToRegExp("notes/js/**/*.mjs").test("notes/js/seq-order-logic.mjs"), true);
  assert.equal(globToRegExp("notes/courses/**/*").test("notes/courses/X/demos/a.js"), true);
  assert.equal(globToRegExp("*.html").test("note.html"), true);
  assert.equal(globToRegExp("*.html").test("a/b.html"), false);
});

test("every asset path hard-coded in notes/js exists on disk", () => {
  const missing = literalAssetPaths().filter((p) => !fs.existsSync(path.join(ROOT, p.slice(1))));
  assert.deepEqual(missing, [], "referenced but not present in the repo");
});

test("every asset path hard-coded in notes/js is covered by a vercel build glob", () => {
  const undeployed = literalAssetPaths().filter((p) => !isDeployed(p.slice(1)));
  assert.deepEqual(undeployed, [], "present in the repo but never deployed — 404 in production");
});

test("the shared artifact layers are deployed", () => {
  // The exact set gatherSharedLayers() pulls for a course page. A 404 on any one of
  // these breaks every artifact on the site, not just one figure.
  const course = "notes/courses/CSCI-UA-470";
  for (const rel of [
    "notes/artifacts/theme.css",
    "notes/artifacts/kit.jsx",
    "notes/artifacts/kit.js",
    "notes/js/seq-order-logic.mjs",
    `${course}/demos/_shared.css`,
    `${course}/demos/_kit.jsx`,
    `${course}/demos/_kit.js`,
    `${course}/index.json`,
  ]) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `missing on disk: ${rel}`);
    assert.ok(isDeployed(rel), `not matched by any vercel.json build glob: ${rel}`);
  }
});
