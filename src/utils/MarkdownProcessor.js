// src/utils/MarkdownProcessor.js

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
      // Headings
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^---$/gim, "")
      .split("\n\n")
      .map((paragraph) => {
        // Skip list processing if it's a heading line (already processed)
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
            .map((item) => `<li>${item.replace("- ", "")}</li>`)
            .join("");
          return `<ul>${listItems}</ul>`;
        }
        // Paragraphs
        return paragraph.trim() ? `<p>${paragraph}</p>` : "";
      })
      .join("\n");

    return html;
  },
};

export default MarkdownProcessor;
