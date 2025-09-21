import React, { useMemo } from "react";

const QuickFilters = ({ problems, activeFilters, onFilterChange }) => {
  const getQuickFilters = useMemo(() => {
    // This logic relies on the problem structure created by MarkdownProcessor
    return [
      {
        type: "tech",
        label: "AI/ML",
        value: "ai",
        count: problems.filter(
          (p) => p.searchText.includes("ai") || p.searchText.includes("ml"),
        ).length,
      },
      {
        type: "tech",
        label: "IoT",
        value: "iot",
        count: problems.filter((p) => p.searchText.includes("iot")).length,
      },
      {
        type: "tech",
        label: "Mobile",
        value: "mobile",
        count: problems.filter(
          (p) =>
            p.searchText.includes("mobile") || p.searchText.includes("app"),
        ).length,
      },
      {
        type: "category",
        label: "Software",
        value: "Software",
        count: problems.filter((p) => p.category === "Software").length,
      },
      {
        type: "category",
        label: "Hardware",
        value: "Hardware",
        count: problems.filter((p) => p.category === "Hardware").length,
      },
    ].filter((f) => f.count > 0);
  }, [problems]);

  if (getQuickFilters.length === 0) return null;

  return (
    <div className="quick-filters">
      {getQuickFilters.map((filter) => {
        const isActive = activeFilters.includes(filter.value);
        return (
          <button
            key={`${filter.type}-${filter.value}`}
            onClick={() => onFilterChange(filter.type, filter.value)}
            className={`filter-button ${isActive ? "active" : ""}`}
          >
            {filter.label}
            <span className="count">{filter.count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilters;
