import React from "react";

const Header = ({
  currentView,
  currentProblemIndex,
  filteredProblemsLength,
  showListView,
}) => (
  <header className="header">
    <div className="header-content">
      <div className="logo">
        🚀 <p>Hackathon Problems</p>
      </div>
      {currentView === "detail" && (
        <div className="header-nav">
          <span className="problem-counter">
            {currentProblemIndex + 1} of {filteredProblemsLength}
          </span>
          <button onClick={showListView} className="back-button">
            ← Back to List
          </button>
        </div>
      )}
    </div>
  </header>
);

export default Header;
