const MarkdownProcessor = {
  extractMetadata: (section, key) => {
    const match = section.match(new RegExp(`\\*\\*${key}:\\*\\* (.+)`));
    return match ? match[1].trim() : "";
  },

  createSearchText: (title, metadata, content) => {
    return `${title} ${metadata.organization} ${metadata.department} ${metadata.theme} ${metadata.id} ${content}`.toLowerCase();
  },

  parseContent: (content) => {
    const problemSections = content
      .split(/^# Problem \d+:/gm)
      .filter((section) => section.trim());

    return problemSections
      .map((section) => {
        const lines = section.trim().split("\n");
        const title = lines[0].trim();

        const metadata = {
          id: MarkdownProcessor.extractMetadata(section, "Problem ID"),
          organization: MarkdownProcessor.extractMetadata(
            section,
            "Organization",
          ),
          department: MarkdownProcessor.extractMetadata(section, "Department"),
          category: MarkdownProcessor.extractMetadata(section, "Category"),
          theme: MarkdownProcessor.extractMetadata(section, "Theme"),
        };

        const contentStartIndex = section.indexOf("## ");
        const problemContent =
          contentStartIndex > -1 ? section.substring(contentStartIndex) : "";

        return {
          ...metadata,
          title,
          content: problemContent,
          searchText: MarkdownProcessor.createSearchText(
            title,
            metadata,
            problemContent,
          ),
        };
      })
      .filter((problem) => problem.id);
  },

  toHTML: (markdown) => {
    let html = markdown
      // 1. REMOVE HORIZONTAL RULES (lines with 3 or more hyphens)
      .replace(/^[\s-]*[-]{3,}[\s-]*$/gm, "")

      // 2. CONVERT STANDARD MARKDOWN LINKS: [text](url)
      // This must happen before processing plain URLs
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>',
      )

      // 3. CONVERT EMBEDDED/PLAIN URLs (must exclude strings already inside <a> tags)
      // This regex looks for URLs starting with http:// or https:// that are NOT immediately preceded by a quote (to avoid reprocessing links inside existing HTML tags)
      .replace(
        /(?<!["'])(\bhttps?:\/\/\S+)/g,
        '<a href="$1" target="_blank">$1</a>',
      )

      // 4. Handle bold tags (**text** and __text__)
      .replace(/(\*\*|__)(.+?)\1/g, "<strong>$2</strong>")
      // 5. Handle italic tags (*text* and _text_)
      .replace(/(\*|_)(.+?)\1/g, "<em>$2</em>")

      // 6. Handle Headings
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")

      // 7. Paragraph and List Processing
      .split("\n\n")
      .map((paragraph) => {
        // Skip list/paragraph processing if it's a heading line
        if (
          paragraph.includes("<h1>") ||
          paragraph.includes("<h2>") ||
          paragraph.includes("<h3>")
        ) {
          return paragraph;
        }
        // Unordered lists (simple - )
        if (paragraph.includes("- ")) {
          const items = paragraph
            .split("\n")
            .filter((line) => line.trim().startsWith("- "));
          const listItems = items
            .map((item) => `<li>${item.replace("- ", "").trim()}</li>`)
            .join("");
          return `<ul>${listItems}</ul>`;
        }
        // Paragraphs
        return paragraph.trim() ? `<p>${paragraph.trim()}</p>` : "";
      })
      .join("\n");

    return html;
  },
};

export default MarkdownProcessor;
