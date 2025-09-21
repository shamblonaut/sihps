import React from "react";

const SearchBar = ({
  searchTerm,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  onClearSearch,
}) => (
  <div className="search-container">
    <div className="search-inputs">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search problems by title, organization, theme..."
          value={searchTerm}
          onChange={onSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={onClearSearch} className="clear-button">
            ✕
          </button>
        )}
      </div>

      <select
        value={categoryFilter}
        onChange={onCategoryChange}
        className="category-select"
      >
        <option value="">All Categories</option>
        <option value="Software">Software</option>
        <option value="Hardware">Hardware</option>
      </select>
    </div>
  </div>
);

export default SearchBar;

// **NOTE:** The <style> block is removed entirely and moved to global.css
