// /api/comments.js
export default async function handler(req, res) {
    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join(process.cwd(), 'comments.json');

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{}');
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (req.method === 'GET') {
        const { slug } = req.query;
        if (!slug) {
            return res.status(400).json({ error: "Missing slug" });
        }
        return res.status(200).json(data[slug] || []);
    }

    if (req.method === 'POST') {
        const { slug, text } = req.body;
        if (!slug || !text) {
            return res.status(400).json({ error: "Missing slug or text" });
        }
        if (!data[slug]) {
            data[slug] = [];
        }
        data[slug].push({
            text,
            timestamp: Date.now(),
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return res.status(201).json({ text, timestamp: Date.now() });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
