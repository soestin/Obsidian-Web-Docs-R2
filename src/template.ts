import { Metadata } from './types';

export function generateHTML(title: string, content: string, metadata: Metadata): string {
	const displayTitle = metadata.header || title;
	const displaySubheader = metadata.subheader || '';
	const displayCreator = metadata.creator || '';
	const displayDate = metadata.creation_date || '';

	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css" integrity="sha384-3UiQGuEI4TTMaFmGIZumfRPtfKQ3trwQE2JgosJxCnGmQpL/lJdjpcHkaaFwHlcI" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">
      <style>
        :root {
          /* Light Mode Colors */
          --background: #F4F4F9;
          --text: #333333;
          --links: #1A73E8;
          --header: #1A73E8;
          --blocks: #FFFFFF;
          --highlights: #BBDEFB;
        }

        body.dark-mode {
          /* Dark Mode Colors */
          --background: #121212;
          --text: #E0E0E0;
          --links: #4D90FE;
          --header: #1A73E8;
          --blocks: #1F1F1F;
          --highlights: #90CAF9;
        }

        body {
          font-family: 'Roboto', Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background-color: var(--background);
          color: var(--text);
        }

        .content {
          max-width: 800px;
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
          gap: 50px; /* Space between creator and date */
          font-size: 1.2em; /* Larger text for visibility */
        }

        .creator-date span {
          color: var(--text);
        }

        h1, h2, h3, h4, h5, h6 {
          color: var(--header);
        }

        a {
          color: var(--links);
        }

        pre {
          background-color: var(--blocks);
        }

        blockquote {
          border-left: 4px solid var(--highlights);
        }

        .separator {
          border-top: 2px solid var(--links);
        }

        .dark-mode-toggle {
            position:absolute; 
            top :10px; 
            right :10px; 
            background-color :var(--links); 
            border:none; 
            border-radius :50%; 
            width :40px; 
            height :40px; 
            cursor:pointer ; 
         }
         button:hover{
                   background-color: var(--highlights);
        }

        .dark-mode-toggle:hover {
          background-color: var(--highlights);
        }
      </style>
    </head>
    <body>
      <button class="dark-mode-toggle" onclick="toggleDarkMode()" aria-label="Toggle Dark Mode"></button>
      <div class="content">
        <div class="metadata">
          <h1>${displayTitle}</h1>
          ${displaySubheader ? `<h2>${displaySubheader}</h2>` : ''}
          <div class="creator-date">
            ${displayCreator ? `<span><strong>Creator:</strong> ${displayCreator}</span>` : ''}
            ${displayDate ? `<span><strong>Date:</strong> ${displayDate}</span>` : ''}
          </div>
        </div>
        <div class="separator"></div>
        ${content}
      </div>

      <script>
        // Check and apply the saved theme from localStorage
        document.addEventListener('DOMContentLoaded', () => {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
          }
        });

        // Function to toggle dark mode and save the choice
        function toggleDarkMode() {
          const isDarkMode = document.body.classList.toggle('dark-mode');
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
      </script>
    </body>
    </html>
  `;
}
