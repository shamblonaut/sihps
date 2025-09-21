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

export default DetailMetadata;
