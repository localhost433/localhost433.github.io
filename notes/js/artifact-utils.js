/* artifact-utils.js — pure helpers for the note artifact pipeline.
   UMD: browser sets window.ArtifactUtils; Node sets module.exports (for tests). */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ArtifactUtils = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // "artifact" | "artifact src=demos/x.jsx" | 'artifact src="a b.jsx"' |
  // "artifact src=demos/x.jsx static"  (the `static` flag = a non-interactive
  // diagram: the host renders it bare, with no collapsible "Interactive demo" bar)
  function parseArtifactInfo(info) {
    const t = String(info || "").trim();
    if (t !== "artifact" && !t.startsWith("artifact ")) return { isArtifact: false, src: null };
    const m = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s]+))/.exec(t);
    // flags = whatever's left after dropping `artifact` and any `src=...` value,
    // so a filename containing "static" can't be mistaken for the flag.
    const flags = t.replace(/^artifact\b/, "")
      .replace(/\bsrc\s*=\s*(?:"[^"]+"|'[^']+'|[^\s]+)/, " ")
      .trim().split(/\s+/).filter(Boolean);
    return { isArtifact: true, src: m ? (m[1] || m[2] || m[3]) : null, static: flags.includes("static") };
  }

  function resolveArtifactSrc(course, src) {
    const c = String(course || ""), s = String(src || "");
    if (!c || !s) throw new Error("resolveArtifactSrc: course and src required");
    if (s.includes("..")) throw new Error("resolveArtifactSrc: '..' not allowed");
    return "/notes/courses/" + c + "/" + s.replace(/^\/+/, "");
  }

  const RESERVED = new Set(["react", "react-dom", "react-dom/client"]);
  function scanBareSpecifiers(source) {
    const src = String(source || ""), found = new Set();
    const re = /\bimport\b[^'"]*?from\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) {
      const spec = m[1] || m[2];
      if (!spec) continue;
      if (spec.startsWith(".") || spec.startsWith("/")) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(spec)) continue;        // http:, https:, blob:, data:
      if (spec.startsWith("@kit") || spec.startsWith("@course")) continue;
      if (RESERVED.has(spec)) continue;
      found.add(spec);
    }
    return Array.from(found);
  }

  function ensureDefaultExport(source) {
    const src = String(source || "");
    if (/\bexport\s+default\b/.test(src)) return src;
    return src + "\n;export default (typeof App !== 'undefined' ? App : null);\n";
  }

  function buildLibImports(specifiers, esmBase) {
    const base = esmBase || "https://esm.sh/", out = {};
    (specifiers || []).forEach(function (spec) {
      out[spec] = base + spec + "?external=react,react-dom";
    });
    return out;
  }

  return { parseArtifactInfo, resolveArtifactSrc, scanBareSpecifiers, ensureDefaultExport, buildLibImports };
});
