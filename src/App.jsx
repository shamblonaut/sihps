import React, { useState, useCallback, useEffect, useMemo } from "react";

// Utilities and Data
import { debounce } from "./utils/utils";
import MarkdownProcessor from "./utils/MarkdownProcessor";

// Components
import Header from "./components/Header";
// FileUpload component is no longer used for the initial load
import LoadingSpinner from "./components/Common/LoadingSpinner";
import SearchBar from "./components/List/SearchBar";
import QuickFilters from "./components/List/QuickFilters";
import ProblemCard from "./components/List/ProblemCard";
import ProblemDetail from "./components/Detail/ProblemDetail";
import "./styles/global.css";

// Define the static file path
const STATIC_PROBLEM_FILE = "/problems.md";

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HackathonProblemNavigator = () => {
  // State management
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentView, setCurrentView] = useState("loading"); // Initial state is 'loading'
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  // --- PROBLEM LOADING LOGIC ---
  const loadStaticProblems = useCallback(async () => {
    setIsLoading(true);
    setCurrentView("loading");
    try {
      // 1. Fetch the file content from the public path
      const response = await fetch(STATIC_PROBLEM_FILE);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const content = await response.text();
      const parsedProblems = MarkdownProcessor.parseContent(content);

      if (parsedProblems.length > 0) {
        setProblems(parsedProblems);
        setFilteredProblems(parsedProblems);
        setCurrentView("list"); // Move to list view on success
      } else {
        console.warn("No valid problems found in the static file.");
        setCurrentView("error");
      }
    } catch (error) {
      console.error("Error loading static file:", error);
      setCurrentView("error"); // Move to a dedicated error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect to run the loading function once on component mount
  useEffect(() => {
    loadStaticProblems();
  }, [loadStaticProblems]);
  // -----------------------------

  // Debounced search logic
  const filterProblems = useCallback(
    (searchTerm, categoryFilter, activeFilters) => {
      let filtered = problems.filter((problem) => {
        const matchesSearch =
          !searchTerm || problem.searchText.includes(searchTerm.toLowerCase());
        const matchesCategory =
          !categoryFilter || problem.category === categoryFilter;
        const matchesFilters =
          activeFilters.length === 0 ||
          activeFilters.some(
            (filter) =>
              problem.searchText.includes(filter.toLowerCase()) ||
              problem.category === filter,
          );
        return matchesSearch && matchesCategory && matchesFilters;
      });

      setFilteredProblems(filtered);
    },
    [problems],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        filterProblems(term, categoryFilter, activeFilters);
      }, 300),
    [filterProblems, categoryFilter, activeFilters],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView === "detail") {
        if (e.key === "Escape") {
          showListView();
        } else if (e.key === "ArrowLeft") {
          navigateProblem(-1);
        } else if (e.key === "ArrowRight") {
          navigateProblem(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentView, currentProblemIndex, filteredProblems]);

  // Event handlers (simplified, removed file upload handler)
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    filterProblems(searchTerm, category, activeFilters);
  };

  const handleQuickFilter = (type, value) => {
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter((f) => f !== value)
      : [...activeFilters, value];

    setActiveFilters(newFilters);
    filterProblems(searchTerm, categoryFilter, newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setActiveFilters([]);
    setFilteredProblems(problems);
  };

  const showProblemDetail = (problemId) => {
    const problem = problems.find((p) => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setCurrentProblemIndex(
        filteredProblems.findIndex((p) => p.id === problemId),
      );
      setCurrentView("detail");
    }
  };

  const showListView = () => {
    setCurrentView("list");
    setSelectedProblem(null);
  };

  const navigateProblem = (direction) => {
    const newIndex = currentProblemIndex + direction;
    if (newIndex >= 0 && newIndex < filteredProblems.length) {
      const nextProblem = filteredProblems[newIndex];
      showProblemDetail(nextProblem.id);
    }
  };

  return (
    <div className="app">
      <Header
        currentView={currentView}
        currentProblemIndex={currentProblemIndex}
        filteredProblemsLength={filteredProblems.length}
        showListView={showListView}
      />

      <main className="main-content">
        {(currentView === "loading" || currentView === "error") && (
          <div className="file-upload">
            {currentView === "loading" ? (
              <>
                <div className="upload-icon">⏳</div>
                <h3 className="upload-title">Loading Problems...</h3>
                <LoadingSpinner />
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  className="upload-icon"
                  style={{ color: "var(--color-error)" }}
                >
                  ❌
                </div>
                <h3 className="upload-title">Failed to Load Content</h3>
                <p className="upload-description">
                  Could not load problems from the static file at{" "}
                  <code>{STATIC_PROBLEM_FILE}</code>. Please check its path and
                  format.
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === "list" && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onClearSearch={() => {
                setSearchTerm("");
                filterProblems("", categoryFilter, activeFilters);
              }}
            />

            <QuickFilters
              problems={problems}
              activeFilters={activeFilters}
              onFilterChange={handleQuickFilter}
            />

            {(searchTerm || categoryFilter || activeFilters.length > 0) && (
              <div className="results-summary">
                <span>
                  Showing {filteredProblems.length} of {problems.length}{" "}
                  problems
                </span>
                <button onClick={clearAllFilters} className="clear-all-button">
                  Clear all filters
                </button>
              </div>
            )}

            {filteredProblems.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>No problems found matching your criteria</p>
                <p className="no-results-subtitle">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="problem-grid">
                {filteredProblems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    searchTerm={searchTerm}
                    onClick={showProblemDetail}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentView === "detail" && selectedProblem && (
          <ProblemDetail
            selectedProblem={selectedProblem}
            currentProblemIndex={currentProblemIndex}
            filteredProblemsLength={filteredProblems.length}
            navigateProblem={navigateProblem}
          />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return <HackathonProblemNavigator />;
};

export default App;
