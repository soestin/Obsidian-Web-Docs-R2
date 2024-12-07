import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { generateHTML } from "./template";

interface Metadata {
  creation_date?: string;
  header?: string;
  subheader?: string;
  creator?: string;
}

function parseMetadata(content: string): [Metadata, string] {
  const metadataRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(metadataRegex);
  
  if (match) {
    const metadataStr = match[1];
    const metadata: Metadata = {};
    metadataStr.split('\n').forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      metadata[key as keyof Metadata] = value;
    });
    return [metadata, content.slice(match[0].length)];
  }
  
  return [{}, content];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Get the path and remove the leading slash
    let path = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

    // Check if a file is selected
    const isFileSelected = path !== "";

    // Add default ".md" if not present and a file is selected
    if (isFileSelected && !path.endsWith(".md")) {
      path += ".md";
    }

    // Add the "docs/" prefix to determine the file path in the bucket
    const objectPath = isFileSelected ? `docs/${path}` : "";

    let contentHtml = "";
    let title = "Documentation";
    let metadata: Metadata = {};

    if (isFileSelected) {
      // Retrieve the file from the R2 bucket
      const object = await env.OBSIDIAN_BUCKET.get(objectPath);

      if (object) {
        // Read the file content
        const markdownContent = await new Response(object.body).text();

        // Parse metadata
        const [parsedMetadata, content] = parseMetadata(markdownContent);
        metadata = parsedMetadata;

        // Convert Markdown to HTML with remark and additional plugins
        const processedContent = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkMath)
          .use(remarkRehype)
          .use(rehypeKatex)
          .use(rehypeHighlight)
          .use(rehypeStringify)
          .process(content);

        contentHtml = processedContent.toString();
        title = path.replace(".md", "");
      } else {
        contentHtml = "<p>File not found</p>";
      }
    } else {
      contentHtml = "<h1>Welcome to the Documentation</h1><p>Please access files directly by their URL.</p>";
    }

    // Generate the full HTML
    const fullHtml = generateHTML(title, contentHtml, metadata);

    // Set the appropriate headers for HTML output
    const headers = new Headers();
    headers.set("Content-Type", "text/html; charset=UTF-8");

    // Return the full HTML page
    return new Response(fullHtml, { headers });
  },
};

// Type definitions for Wrangler's environment
interface Env {
  OBSIDIAN_BUCKET: R2Bucket;
}

