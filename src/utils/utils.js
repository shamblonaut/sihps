export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  // The original used <mark> with inline styles, which is fine for highlight
  return text.replace(
    regex,
    '<mark style="background: #fef3c7; padding: 0.1em 0.2em; border-radius: 3px;">$1</mark>',
  );
};
