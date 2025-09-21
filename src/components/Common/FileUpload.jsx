import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const FileUpload = ({ onFileUpload, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const file = files.find(
      (f) => f.name.endsWith(".md") || f.name.endsWith(".txt"),
    );
    if (file) onFileUpload({ target: { files: [file] } });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`file-upload ${isDragOver ? "drag-over" : ""}`}
    >
      <div className="upload-icon">📄</div>
      <h3 className="upload-title">Load Problems from Markdown</h3>
      <p className="upload-description">
        {isDragOver
          ? "Drop your file here!"
          : "Drag and drop your markdown file, or click to select"}
      </p>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <label className="upload-button">
          Choose File
          <input
            type="file"
            accept=".md,.txt"
            onChange={onFileUpload}
            style={{ display: "none" }}
          />
        </label>
      )}
    </div>
  );
};

export default FileUpload;
