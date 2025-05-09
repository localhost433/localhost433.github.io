# Robin's Personal Site

This repository contains the source code for my personal website. The site serves as a platform to share my thoughts, projects, and other content I find interesting.

## Features

- **Blog**: Posts about various topics, including school, life, and random ideas.
- **Projects**: A showcase of personal projects and experiments.
- **Comments**: Visitors can leave comments on posts, with support for author names and timestamps.
- **Dark Mode**: Toggle between light and dark themes.
- **Math Support**: Render mathematical expressions using MathJax.
- **Markdown Parsing**: Blog posts are written in Markdown and rendered dynamically.
- **Pagination & Filtering**: Browse posts by tag or search with pagination.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Libraries**:
  - [Marked.js](https://github.com/markedjs/marked) — Markdown parsing
  - [MathJax](https://www.mathjax.org/) — Math rendering in posts
  - [DOMPurify](https://github.com/cure53/DOMPurify) — HTML sanitization for user-generated content
- **Backend**: Node.js (serverless functions via Vercel)
  - Dynamic comment storage using either:
    - JSON file (local/dev)
    - [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (prod)

## Contact

Feel free to reach out via:

- **Email**: robinchen@nyu.edu
- **Github**: [localhost433](https://github.com/localhost433)
