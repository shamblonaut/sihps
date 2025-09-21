import React from "react";
import MarkdownProcessor from "../../utils/MarkdownProcessor";
// Assuming you moved the metadata rendering into a sub-component (optional, but cleaner)

const DetailMetadata = ({ problem }) => {
  return (
    <div className="metadata-section">
      <div className="metadata-grid">
        {[
          {
            label: "Problem ID",
            value: problem.id,
            icon: "🆔",
          },
          {
            label: "Organization",
            value: problem.organization,
            icon: "🏛️",
          },
          {
            label: "Department",
            value: problem.department,
            icon: "🏢",
          },
          {
            label: "Category",
            value: problem.category,
            icon: "📂",
          },
          { label: "Theme", value: problem.theme, icon: "🎯" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="metadata-item">
            <div className="metadata-label">
              <span className="metadata-icon">{icon}</span>
              <span>{label}</span>
            </div>
            <span className="metadata-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProblemDetail = ({
  selectedProblem,
  currentProblemIndex,
  filteredProblemsLength,
  navigateProblem,
}) => {
  return (
    <div className="problem-detail">
      {/* Navigation */}
      <div className="detail-nav">
        <div className="detail-nav-counter">
          Problem {currentProblemIndex + 1} of {filteredProblemsLength}
        </div>
        <div className="detail-nav-buttons">
          <button
            onClick={() => navigateProblem(-1)}
            disabled={currentProblemIndex === 0}
            className="nav-button"
          >
            ← Previous
          </button>
          <button
            onClick={() => navigateProblem(1)}
            disabled={currentProblemIndex === filteredProblemsLength - 1}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Metadata */}
      <DetailMetadata problem={selectedProblem} />

      {/* Content */}
      <div className="content-section">
        <h1 className="problem-title-detail">{selectedProblem.title}</h1>
        <div
          className="problem-content"
          // Safe usage to render the processed markdown HTML
          dangerouslySetInnerHTML={{
            __html: MarkdownProcessor.toHTML(selectedProblem.content),
          }}
        />
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
