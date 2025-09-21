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
  // Assuming a global CSS class 'highlight-mark' is used for styling
  return text.replace(regex, '<mark class="highlight-mark">$1</mark>');
};

// --- HASH ROUTING UTILITIES ---

/**
 * Gets the current problem ID from the URL hash.
 * Returns the ID (e.g., 'P-001') or null if not found.
 */
export const getProblemIdFromHash = () => {
  // Hash format: #/problem/P-001
  const hash = window.location.hash;
  const match = hash.match(/^#\/problem\/([^/]+)$/);
  return match ? match[1] : null;
};

/**
 * Sets the URL hash to the list view or a specific problem detail view.
 */
export const setHashRoute = (problemId) => {
  if (problemId) {
    window.location.hash = `/problem/${problemId}`;
  } else {
    // Navigate to the root (list view)
    window.location.hash = "";
  }
};
