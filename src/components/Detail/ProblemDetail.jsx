import React from "react";
import Markdown from "markdown-to-jsx"; // Import the external library

import DetailMetadata from "./DetailMetadata";

const ProblemDetail = ({
  selectedProblem,
  currentProblemIndex,
  filteredProblemsLength,
  navigateProblem,
}) => {
  if (!selectedProblem) return null;

  return (
    <div className="problem-detail">
      {/* Navigation */}
      <div className="detail-navigation">
        <button
          onClick={() => navigateProblem(-1)}
          disabled={currentProblemIndex <= 0}
          className="nav-button"
        >
          Previous
        </button>
        <span className="problem-count">
          Problem {currentProblemIndex + 1} of {filteredProblemsLength}
        </span>
        <button
          onClick={() => navigateProblem(1)}
          disabled={currentProblemIndex >= filteredProblemsLength - 1}
          className="nav-button"
        >
          Next
        </button>
      </div>

      <DetailMetadata problem={selectedProblem} />

      {/* Content */}
      <div className="content-section">
        <h1 className="problem-title-detail">{selectedProblem.title}</h1>

        {/* FIX: Use the external Markdown component here */}
        <div className="problem-content">
          <Markdown>{selectedProblem.content}</Markdown>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="shortcuts-info">
        <span>
          <kbd>Esc</kbd> Back to list
        </span>
        <span>
          <kbd>←</kbd> Previous
        </span>
        <span>
          <kbd>→</kbd> Next
        </span>
      </div>
    </div>
  );
};

export default ProblemDetail;
