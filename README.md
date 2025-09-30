# Robin's Personal Site

This repository contains the source code for my personal website. The site serves as a platform to share my thoughts, projects, and other content I find interesting.

## Features

- **Blog**: Posts about various topics, including school, life, and random ideas.
- **Projects**: A showcase of personal projects and experiments.
- **Comments**: Visitors can leave comments on blog posts, with support for author names and timestamps.
- **Dark Mode**: Toggle between light and dark themes.
- **Math Support**: Render mathematical expressions using MathJax.
- **Markdown Parsing**: Blog posts are written in Markdown and rendered dynamically.
- **Notes**: Course notes rendered from Markdown (with front-matter), featuring MathJax support and an auto-generated table of contents.
- **Pagination & Filtering**: Browse blog posts by tag or search with pagination.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Client-side Libraries**:
  - [js-yaml](https://github.com/nodeca/js-yaml) — parse front-matter in notes  
  - [DOMPurify](https://github.com/cure53/DOMPurify) — sanitize rendered HTML  
  - [MathJax](https://www.mathjax.org/) — render LaTeX/math expressions  
  - [Marked.js](https://github.com/markedjs/marked) — Markdown -> HTML parsing  

- **Server-side Libraries** (As Vercel Serverless Functions):
  - [node-fetch](https://github.com/node-fetch/node-fetch) — HTTP client  
  - [sanitize-html](https://github.com/apostrophecms/sanitize-html) — clean user input  
  - [@upstash/redis](https://github.com/upstash/upstash-redis) — KV caching  
  - [pg](https://github.com/brianc/node-postgres) — Neon Serverless Postgres driver
- **Backend**: Node.js (serverless via Vercel)
  - Comments: cached in Upstash Redis + kept in Neon Postgres

## Deployment

This site is deployed on [Vercel](https://vercel.com/) with automatic GitHub-triggered builds.  

## Terms / AI Usage

Use of this content for training machine learning or AI models is expressly prohibited without prior written consent. See `TERMS.md` for full details.

## Contact

Feel free to reach out via:

- **Email**: robinchen@nyu.edu
- **Github**: [localhost433](https://github.com/localhost433)
