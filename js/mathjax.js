window.MathJax = {
    loader: { load: ['[tex]/textmacros'] },
    tex: {
        packages: { '[+]': ['noerrors', 'ams', 'textmacros'] },
        macros: {
            qed: "\\square",
            ran: "\\text{ran}",
            N: "\\mathbb{N}",
            Z: "\\mathbb{Z}",
            Q: "\\mathbb{Q}",
            R: "\\mathbb{R}",
            C: "\\mathbb{C}",
            X: "\\mathbb{X}",
            M: "\\mathcal{M}",
            E: "\\mathbb{E}",
            im: "\\text{im}",
            rank: "\\text{rank}",
            Span: "\\text{span}",
            sgn: "\\text{sgn}",
            abs: ["\\left| #1 \\right|", 1],
            conj: ["\\overline{#1}", 1],
            tr: ["\\text{Tr}(#1)", 1],
            id: "\\text{id}",
            bi: ["\\left( #1, #2 \\right)", 2],
            sig: ["\\left( #1, #2, #3 \\right)", 3],
            inr: ["\\left( #1, #2 \\right)", 2],
            norm: ["\\left|\\left| #1 \\right|\\right|", 1],
            proj: ["\\text{proj}_{#1}", 1],
            textipa: ['\\class{ipa}{#1}', 1],
            Var: ["\\text{Var}(#1)", 1],
            Cov: ["\\text{Cov}(#1, #2)", 2]
        },
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    svg: {
        fontCache: 'global'
    },
    chtml: {
    },
};