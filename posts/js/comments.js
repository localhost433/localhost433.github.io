document.addEventListener("DOMContentLoaded", () => {
  const slug = new URLSearchParams(window.location.search).get("id");
  if (!slug) return;

  const commentsList = document.getElementById("comments-list");
  const form = document.getElementById("comment-form");
  const status = document.getElementById("comment-status");
  const submitButton = form?.querySelector('button[type="submit"]');
  const turnstileContainer = document.getElementById("comment-turnstile");
  const turnstileSiteKey = turnstileContainer?.dataset.siteKey?.trim() || "";
  if (!commentsList || !form) {
    console.error("Required DOM elements are missing");
    return;
  }

  const sanitize = window.DOMPurify?.sanitize || (s => s);
  let turnstileLoadPromise;
  let turnstileWidgetId = null;
  let turnstileToken = "";
  let turnstileResolve;
  let turnstileReject;

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function loadTurnstile() {
    if (!turnstileSiteKey) {
      return Promise.reject(new Error("Turnstile is not configured for this site."));
    }
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (turnstileLoadPromise) return turnstileLoadPromise;

    turnstileLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.turnstile);
      script.onerror = () => reject(new Error("Could not load the verification challenge."));
      document.head.appendChild(script);
    });
    return turnstileLoadPromise;
  }

  function getTurnstileToken() {
    if (turnstileToken) return Promise.resolve(turnstileToken);

    return loadTurnstile().then(turnstile => new Promise((resolve, reject) => {
      turnstileResolve = resolve;
      turnstileReject = reject;
      turnstileContainer.hidden = false;

      const options = {
        sitekey: turnstileSiteKey,
        callback: token => {
          turnstileToken = token;
          if (turnstileResolve) turnstileResolve(token);
          turnstileResolve = null;
          turnstileReject = null;
        },
        "expired-callback": () => {
          turnstileToken = "";
          setStatus("The verification expired. Please try again.");
        },
        "error-callback": () => {
          turnstileToken = "";
          if (turnstileReject) turnstileReject(new Error("Verification failed to load."));
          turnstileResolve = null;
          turnstileReject = null;
        },
      };

      if (turnstileWidgetId === null) {
        turnstileWidgetId = turnstile.render(turnstileContainer, options);
      } else {
        turnstile.reset(turnstileWidgetId);
      }
    }));
  }

  function add(comment) {
    const p = document.createElement("p");
    const author = sanitize(comment.author || "Anonymous");
    const text = sanitize(comment.text);

    let timeText = "";
    if (comment.timestamp) {
      const date = new Date(comment.timestamp);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      if (diff < 60) {
        timeText = "just now";
      } else if (diff < 3600) {
        timeText = `${Math.floor(diff / 60)} minutes ago`;
      } else if (diff < 86400) {
        timeText = `${Math.floor(diff / 3600)} hours ago`;
      } else {
        timeText = `${Math.floor(diff / 86400)} days ago`;
      }
    }
    if (timeText) {
      const timeEl = document.createElement("span");
      timeEl.className = "comment-time";
      timeEl.textContent = ` (${timeText})`;
      p.appendChild(timeEl);
    }

    p.innerHTML = `
      <strong>${author}:</strong> ${text}
      <span class="comment-time">${timeText}</span>
    `;
    commentsList.appendChild(p);
  }

  const base = window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://robinc.vercel.app';

  fetch(`${base}/api/comments?slug=${slug}`)
    .then(r => r.ok ? r.json() : [])
    .then(arr => {
      if (!arr.length) {
        const prodUrl = `https://robinc.vercel.app${window.location.pathname}${window.location.search}`;
        commentsList.innerHTML = `
          <p class="no-comments">
            No comments yet. Be the first!
            Or <a href="${prodUrl}" target="_blank" rel="noopener">
              view this post on robinc.vercel.app
            </a> if there are any comments there.
          </p>`;
      } else {
        arr.forEach(add);
      }
    })
    .catch(e => console.error("Failed to load comments", e));

  async function submitComment({ slug, text, author, website, turnstileToken: token }) {
    const response = await fetch(`${base}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, text, author, website, turnstileToken: token })
    });
    const payload = await response.json().catch(() => ({}));
    return { response, payload };
  }

  // New comment. Normal submissions do not load a challenge; the API asks for
  // one only after detecting a suspicious request or a burst of submissions.
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const textEl = document.getElementById("comment-text");
    const authEl = document.getElementById("comment-author");
    const websiteEl = document.getElementById("comment-website");
    const text = textEl.value.trim();
    const author = authEl.value.trim() || "Anonymous";
    const website = websiteEl?.value.trim() || "";
    if (!text) return;

    if (submitButton) submitButton.disabled = true;
    setStatus("Submitting comment…");

    try {
      let result = await submitComment({ slug, text, author, website, turnstileToken: "" });
      if (result.payload.error === "challenge_required") {
        setStatus("Please complete the verification challenge.");
        const token = await getTurnstileToken();
        result = await submitComment({ slug, text, author, website, turnstileToken: token });
      }

      if (!result.response.ok) {
        if (result.response.status === 409) throw new Error("That comment was already submitted.");
        if (result.response.status === 429) throw new Error("You are posting too quickly. Please try again later.");
        if (result.payload.error === "challenge_failed") throw new Error("Verification failed. Please try again.");
        throw new Error(result.response.statusText || "Comment could not be submitted.");
      }

      if (!result.payload.accepted) add(result.payload);
      turnstileToken = "";
      form.reset();
      setStatus("Comment posted.");
      requestAnimationFrame(() => textEl.focus());
    } catch (err) {
      console.error("Failed to post comment", err);
      setStatus(err.message || "Could not submit comment—please try again.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});
