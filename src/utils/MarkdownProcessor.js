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
    // 1. Initial Markdown cleanup and inline processing
    let tempHtml = markdown
      // REMOVE HORIZONTAL RULES
      .replace(/^[\s-]*[-]{3,}[\s-]*$/gm, "")
      // CONVERT STANDARD MARKDOWN LINKS
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>',
      )
      // CONVERT EMBEDDED/PLAIN URLs
      .replace(
        /(?<!["'])(\bhttps?:\/\/\S+)/g,
        '<a href="$1" target="_blank">$1</a>',
      )
      // Handle bold tags
      .replace(/(\*\*|__)(.+?)\1/g, "<strong>$2</strong>")
      // Handle italic tags
      .replace(/(\*|_)(.+?)\1/g, "<em>$2</em>")
      // Handle Headings (This MUST run before lists)
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // 2. BLOCK LEVEL PROCESSING (Lists, Paragraphs)

    let lines = tempHtml.split("\n");
    let outputHtml = [];
    let inList = false;
    let currentListHtml = "";
    let currentListTag = "";

    // Regex for detecting and stripping ANY list marker (ordered or unordered)
    const listMarkerStripRegex =
      /^\s*(?:-|\d+\.|\d+\)|[a-z]\. |[a-z]\)|\([a-z]\))\s*/i;
    const orderedListTypeRegex =
      /^\s*(?:\d+\.|\d+\)|[a-z]\. |[a-z]\)|\([a-z]\))\s*/i;
    const numberedListRegex = /^\s*(?:\d+\.|\d+\))\s*/;
    const letteredListRegex = /^\s*(?:[a-z]\. |[a-z]\)|\([a-z]\))\s*/i;

    // Function to close the current list block
    const closeList = () => {
      if (inList) {
        outputHtml.push(
          `${currentListHtml}${currentListTag.replace("<", "</")}`,
        );
        currentListHtml = "";
        currentListTag = "";
        inList = false;
      }
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      const isListItem = trimmedLine.match(listMarkerStripRegex);

      // --- Process List Items ---
      if (isListItem) {
        let nextListTag = "";

        // Determine the list type and appropriate HTML tag
        if (trimmedLine.startsWith("-")) {
          nextListTag = "<ul>";
        } else if (trimmedLine.match(numberedListRegex)) {
          nextListTag = "<ol>";
        } else if (trimmedLine.match(letteredListRegex)) {
          nextListTag = '<ol type="a">';
        } else {
          // If it looks like a list item but doesn't match a known tag type, treat as paragraph content
          // This shouldn't happen with the current regexes, but is a safety net.
          nextListTag = null;
        }

        if (nextListTag) {
          const isSameListType = inList && currentListTag === nextListTag;

          // If we are starting a NEW list, or switching list types, close the old one
          if (!inList || !isSameListType) {
            closeList();
            currentListTag = nextListTag;
            inList = true;
          }

          // Strip the marker and add the list item
          const cleanContent = trimmedLine
            .replace(listMarkerStripRegex, "")
            .trim();
          currentListHtml += `<li>${cleanContent}</li>`;
        } else {
          // Treat as a paragraph line if the line is not a recognizable list item
          closeList();
          outputHtml.push(line);
        }
      } else {
        // --- Process Non-List Content (Headings, Paragraphs, etc.) ---
        closeList(); // End any open list

        // Only wrap lines in <p> if they haven't been processed as headings
        if (
          trimmedLine &&
          !trimmedLine.includes("<h1>") &&
          !trimmedLine.includes("<h2>") &&
          !trimmedLine.includes("<h3>")
        ) {
          // Ensure double blank lines create paragraph breaks
          if (trimmedLine === "") {
            outputHtml.push(""); // Preserve blank line for eventual double-break paragraph logic
          } else {
            outputHtml.push(`<p>${trimmedLine}</p>`);
          }
        } else if (trimmedLine) {
          outputHtml.push(trimmedLine); // Headings already processed, just push the HTML
        }
      }
    }
    closeList(); // Ensure the last list block is closed

    // 3. Final cleanup: Merge adjacent <p> tags if necessary (though the line-by-line approach mostly prevents this) and merge output.
    return outputHtml.filter((block) => block.trim() !== "").join("\n");
  },
};

export default MarkdownProcessor;
