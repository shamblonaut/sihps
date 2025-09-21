import React, { useState } from "react";
import { highlightText } from "../../utils/utils";

const ProblemCard = ({ problem, searchTerm, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(problem.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`problem-card ${isHovered ? "hovered" : ""}`}
    >
      <div className="gradient-accent" />

      <div className="card-header">
        <span className="problem-id">{problem.id}</span>
        <span className={`category-badge ${problem.category.toLowerCase()}`}>
          {problem.category}
        </span>
      </div>

      <h3
        className="problem-title"
        // Safe usage for highlighting text within the title
        dangerouslySetInnerHTML={{
          __html: highlightText(problem.title, searchTerm),
        }}
      />

      <p
        className="problem-org"
        // Safe usage for highlighting text within the organization name
        dangerouslySetInnerHTML={{
          __html: highlightText(problem.organization, searchTerm),
        }}
      />

      <div className="problem-theme">{problem.theme}</div>
    </div>
  );
};

export default ProblemCard;
