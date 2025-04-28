window.MathJax = {
    tex: {
        packages: { '[+]': ['ams'] },
        macros: {
            qed: '\\square',
            ran: '\\text{ran}',
            N: '\\mathbb{N}', // Natural Numbers
            Z: '\\mathbb{Z}', // Integers
            Q: '\\mathbb{Q}', // Rational Numbers
            R: '\\mathbb{R}', // Real Numbers
            C: '\\mathbb{C}', // Complex Numbers
            Li: '\\mathcal{L}', // Linear maps
            M: '\\mathcal{M}', // Matrix Representation
            im: '\\text{im }', // Image, Range, Column space
            rank: '\\text{rank}', // Rank
            Span: '\\text{span}', // Span
            sgn: '\\text{sgn}', // sgn function
            inr: '\\left( #1, #2 \\right)', // Inner Product
            coord: '\\left( #1, #2 \\right)', // Coordinates
            norm: '\\left\\lVert #1 \\right\\rVert', // Norm
            conj: '\\overline{#1}', // Conjugate
            abs: '\\left| #1 \\right|', // Absolute Value
            proj: '\\text{proj}_{#1}', // Projection
            tr: '\\text{Tr}(#1)', // Trace
            id: '\\text{id}', // Identity
            bi: '\\left( #1, #2 \\right)', // Bilinear form
            sig: '\\left( #1, #2, #3 \\right)' // Signature
        },
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    svg: {
        fontCache: 'global'
    }
};
