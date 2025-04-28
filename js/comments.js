// Vercel serverless function
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const slug = req.query.slug;
    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }
    const comments = await kv.get(`comments:${slug}`) || [];
    return res.status(200).json(comments);
  }

  if (method === 'POST') {
    const { slug, text } = req.body;
    if (!slug || !text) {
      return res.status(400).json({ error: "Missing slug or text" });
    }
    const comments = await kv.get(`comments:${slug}`) || [];
    const newComment = { text, timestamp: Date.now() };
    comments.push(newComment);
    await kv.set(`comments:${slug}`, comments);
    return res.status(201).json(newComment);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

document.addEventListener("DOMContentLoaded", () => {
    const slug = new URLSearchParams(window.location.search).get('id');
    if (!slug) return;

    const commentsList = document.getElementById("comments-list");
    const form = document.getElementById("comment-form");

    // Load existing comments
    fetch(`/api/comments?slug=${slug}`)
        .then(res => res.json())
        .then(comments => {
            comments.forEach(comment => {
                const p = document.createElement("p");
                p.textContent = comment.text;
                commentsList.appendChild(p);
            });
        })
        .catch(err => {
            console.error("Failed to load comments", err);
        });

    // Submit new comment
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("comment-text").value.trim();
        if (text.length === 0) return;

        fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slug, text })
        })
        .then(res => res.json())
        .then(newComment => {
            const p = document.createElement("p");
            p.textContent = newComment.text;
            commentsList.appendChild(p);
            document.getElementById("comment-text").value = "";
        })
        .catch(err => {
            console.error("Failed to post comment", err);
        });
    });
});