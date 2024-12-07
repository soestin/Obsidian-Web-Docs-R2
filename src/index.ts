import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { generateHTML } from "./template";
import { parseMetadata, parseDate, BlogPost, Metadata } from "./utils";

async function listFiles(env: Env): Promise<BlogPost[]> {
  const rootPath = env.ROOT_PATH; // Haal de waarde van ROOT_PATH op
  const files = await env.OBSIDIAN_BUCKET.list({ prefix: `${rootPath}/` });
  const markdownFiles = files.objects.filter(obj => obj.key.endsWith('.md'));

  const blogPosts: BlogPost[] = await Promise.all(
    markdownFiles.map(async (obj) => {
      const file = await env.OBSIDIAN_BUCKET.get(obj.key);
      if (file) {
        const content = await file.text();
        const [metadata, _] = parseMetadata(content);
        return {
          file: obj.key.replace(`${rootPath}/`, '').replace('.md', ''),
          metadata
        };
      }
      return {
        file: obj.key.replace(`${rootPath}/`, '').replace('.md', ''),
        metadata: {}
      };
    })
  );

  // Sorteer bestanden op basis van creation_date
  return blogPosts.sort((a, b) => {
    const dateA = a.metadata.creation_date ? parseDate(a.metadata.creation_date) : new Date(0);
    const dateB = b.metadata.creation_date ? parseDate(b.metadata.creation_date) : new Date(0);
    return dateB.getTime() - dateA.getTime(); // Nieuwste eerst
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const rootPath = env.ROOT_PATH; // Haal de waarde van ROOT_PATH op
    const url = new URL(request.url);
    let path = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    const isFileSelected = path !== "";
    if (isFileSelected && !path.endsWith(".md")) {
      path += ".md";
    }
    const objectPath = isFileSelected ? `${rootPath}/${path}` : "";

    let contentHtml = "";
    let title = "Blog";
    let metadata: Metadata = {};
    let navigationInfo = null;

    const blogPosts = await listFiles(env);

    if (isFileSelected) {
      const object = await env.OBSIDIAN_BUCKET.get(objectPath);

      if (object) {
        const markdownContent = await new Response(object.body).text();
        const [parsedMetadata, content] = parseMetadata(markdownContent);
        metadata = parsedMetadata;

        const processedContent = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkMath)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeKatex)
          .use(rehypeHighlight)
          .use(rehypeSanitize)
          .use(rehypeSlug)
          .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(content);

        contentHtml = processedContent.toString();
        title = metadata.header || path.replace(".md", "");

        // Vind de huidige postindex
        const currentIndex = blogPosts.findIndex(post => post.file === path.replace(".md", ""));
        if (currentIndex !== -1) {
          navigationInfo = {
            prev: currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null,
            next: currentIndex > 0 ? blogPosts[currentIndex - 1] : null,
          };
        }
      } else {
        contentHtml = "<p>File not found</p>";
      }
    } else {
      // Genereer homepage met bestandslijsten
      const fileBlocks = blogPosts.map(({ file, metadata }) => `
        <div class="file-block">
          <a href="/${file}">
            <h2>${metadata.header || file}</h2>
            ${metadata.subheader ? `<p class="subheader">${metadata.subheader}</p>` : ''}
            <div class="metadata">
              ${metadata.creator ? `<span class="creator">By ${metadata.creator}</span>` : ''}
              ${metadata.creation_date ? `<span class="date">${metadata.creation_date}</span>` : ''}
            </div>
          </a>
        </div>
      `).join('');

      contentHtml = `
        <h1>Blog Posts</h1>
        <div class="file-grid">
          ${fileBlocks}
        </div>
      `;
    }

    const fullHtml = generateHTML(title, contentHtml, metadata, navigationInfo);
    const headers = new Headers();
    headers.set("Content-Type", "text/html; charset=UTF-8");

    return new Response(fullHtml, { headers });
  },
};

interface Env {
  OBSIDIAN_BUCKET: R2Bucket;
  ROOT_PATH: string; // Voeg ROOT_PATH toe aan de Env-interface
}