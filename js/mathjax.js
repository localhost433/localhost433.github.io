window.MathJax = {
    tex: {
        packages: { '[+]': ['noerrors', 'ams'] },
        macros: {
            qed: "\\square",
            ran: "\\text{ran}",
            N: "\\mathbb{N}",
            Z: "\\mathbb{Z}",
            Q: "\\mathbb{Q}",
            R: "\\mathbb{R}",
            C: "\\mathbb{C}",
            Li: "\\mathcal{L}",
            M: "\\mathcal{M}",
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
            proj: ["\\text{proj}_{#1}", 1],
        },
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    svg: {
        fontCache: 'global'
    }
};
