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
};

export default MarkdownProcessor;
