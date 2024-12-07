/**
 * Generates the HTML structure for the blog
 * Includes styling, navigation, and scripts for both the homepage and individual blog posts
 */

import { Metadata, NavigationInfo } from './utils';

export function generateHTML(title: string, content: string, metadata: Metadata, navigationInfo: NavigationInfo | null): string {
  const displayTitle = metadata.header || title;
  const displaySubheader = metadata.subheader || '';
  const displayCreator = metadata.creator || '';
  const displayDate = metadata.creation_date || '';

  const navigationHtml = navigationInfo ? `
    <nav class="blog-navigation">
      ${navigationInfo.prev ? `<a href="/${navigationInfo.prev.file}" class="nav-button prev-post">← Previous Post</a>` : '<span class="nav-button disabled">← Previous Post</span>'}
      <a href="/" class="nav-button home">Home</a>
      ${navigationInfo.next ? `<a href="/${navigationInfo.next.file}" class="nav-button next-post">Next Post →</a>` : '<span class="nav-button disabled">Next Post →</span>'}
    </nav>
  ` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css" integrity="sha384-3UiQGuEI4TTMaFmGIZumfRPtfKQ3trwQE2JgosJxCnGmQpL/lJdjpcHkaaFwHlcI" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css">
      <style>
        /* ... (CSS styles remain unchanged) ... */
        :root {
          --background: #F4F4F9;
          --text: #333333;
          --links: #1A73E8;
          --header: #1A73E8;
          --blocks: #FFFFFF;
          --highlights: #BBDEFB;
          --code-bg: #F0F0F0;
          --code-color: #333333;
          --code-keyword: #0000FF;
          --code-function: #795E26;
          --code-string: #A31515;
          --code-number: #098658;
          --code-comment: #008000;
        }

        body.dark-mode {
          --background: #121212;
          --text: #E0E0E0;
          --links: #4D90FE;
          --header: #1A73E8;
          --blocks: #1F1F1F;
          --highlights: #90CAF9;
          --code-bg: #2B2B2B;
          --code-color: #E0E0E0;
          --code-keyword: #CC7832;
          --code-function: #FFC66D;
          --code-string: #6A8759;
          --code-number: #6897BB;
          --code-comment: #808080;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background-color: var(--background);
          color: var(--text);
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .metadata {
          text-align: center;
          margin-bottom: 20px;
        }

        .metadata h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          color: var(--header);
        }

        .metadata h2 {
          font-size: 1.5em;
          margin-bottom: 20px;
        }

        .creator-date {
          display: flex;
          justify-content: center;
          gap: 50px;
          font-size: 1.2em;
        }

        .creator-date span {
          color: var(--text);
        }

        h1, h2, h3, h4, h5, h6 {
          color: var(--header);
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        a {
          color: var(--links);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        pre {
          background-color: var(--code-bg);
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
        }

        pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }

        code {
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          font-size: 0.9em;
          background-color: var(--code-bg);
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }

        blockquote {
          border-left: 4px solid var(--highlights);
          margin: 1em 0;
          padding: 0.5em 1em;
          background-color: var(--blocks);
          font-style: italic;
        }

        ul, ol {
          padding-left: 2em;
        }

        li {
          margin-bottom: 0.5em;
        }

        table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 1em;
        }

        th, td {
          border: 1px solid var(--text);
          padding: 0.5em;
          text-align: left;
        }

        th {
          background-color: var(--blocks);
          font-weight: bold;
        }

        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em auto;
        }

        .separator {
          border-top: 2px solid var(--links);
          margin: 2em 0;
        }

        .dark-mode-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: var(--links);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--background);
          transition: background-color 0.3s ease;
        }

        .dark-mode-toggle:hover {
          background-color: var(--highlights);
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 2em;
        }

        .file-block {
          background-color: var(--blocks);
          border-radius: 8px;
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .file-block:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .file-block h2 {
          margin: 0 0 10px 0;
          font-size: 1.4em;
          color: var(--header);
        }

        .file-block .subheader {
          font-size: 1em;
          color: var(--text);
          margin-bottom: 10px;
        }

        .file-block .metadata {
          display: flex;
          justify-content: space-between;
          font-size: 0.9em;
          color: var(--text);
        }

        .file-block .creator, .file-block .date {
          display: inline-block;
        }

        .blog-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 2em;
          margin-bottom: 2em;
        }

        .nav-button {
          padding: 10px 15px;
          background-color: var(--links);
          color: var(--background);
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .nav-button:hover {
          background-color: var(--highlights);
          text-decoration: none;
        }

        .nav-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .scroll-to-top {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: var(--links);
          color: var(--background);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          transition: opacity 0.3s ease;
          opacity: 0;
        }

        .scroll-to-top.visible {
          opacity: 1;
        }

        @media (max-width: 600px) {
          .content {
            padding: 10px;
          }

          .creator-date {
            flex-direction: column;
            gap: 10px;
          }

          .file-grid {
            grid-template-columns: 1fr;
          }

          .blog-navigation {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .nav-button {
            width: 100%;
            text-align: center;
          }
        }

        /* Override highlight.js styles */
        .hljs {
          background-color: var(--code-bg) !important;
          color: var(--text) !important;
        }

        /* Syntax highlighting */
        .hljs-keyword { color: var(--code-keyword); }
        .hljs-function { color: var(--code-function); }
        .hljs-string { color: var(--code-string); }
        .hljs-number { color: var(--code-number); }
        .hljs-comment { color: var(--code-comment); }

        /* KaTeX styles */
        .katex { font-size: 1.1em; }
      </style>
    </head>
    <body>
      <button class="dark-mode-toggle" onclick="toggleDarkMode()" aria-label="Toggle Dark Mode">
        <span id="darkModeIcon">🌙</span>
      </button>
      <div class="content">
        ${navigationHtml}
        <div class="metadata">
          <h1>${displayTitle}</h1>
          ${displaySubheader ? `<h2>${displaySubheader}</h2>` : ''}
          <div class="creator-date">
            ${displayCreator ? `<span><strong>Author:</strong> ${displayCreator}</span>` : ''}
            ${displayDate ? `<span><strong>Date:</strong> ${displayDate.split('/').reverse().join('/')}</span>` : ''}
          </div>
        </div>
        <div class="separator"></div>
        ${content}
        ${navigationHtml}
      </div>
      <div id="scrollToTop" class="scroll-to-top">↑</div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.js" integrity="sha384-G0qdxDKPACxT5Wn8wDYDN9pVGnkq0JiY+D6PwEVTbiz1u6PGZK4ChOf8Trd+yenm" crossorigin="anonymous"></script>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon();
          }
          hljs.highlightAll();
          renderMathInElement(document.body, {
            delimiters: [
              {left: "$$", right: "$$", display: true},
              {left: "$", right: "$", display: false},
              {left: "\$$", right: "\$$", display: false},
              {left: "\\[", right: "\\]", display: true}
            ],
            throwOnError : false
          });

          const scrollToTopButton = document.getElementById('scrollToTop');
          window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
              scrollToTopButton.classList.add('visible');
            } else {
              scrollToTopButton.classList.remove('visible');
            }
          });

          scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          });
        });

        function toggleDarkMode() {
          const isDarkMode = document.body.classList.toggle('dark-mode');
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
          updateDarkModeIcon();
        }

        function updateDarkModeIcon() {
          const darkModeIcon = document.getElementById('darkModeIcon');
          darkModeIcon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        }
      </script>
    </body>
    </html>
  `;
}

