import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./styles.css"
const RichTextEditor = ({ value, onChange, readOnly,placeholder }) => {
  const handleEditorChange = (content) => {
    onChange(content);
  };

  return (
    <div>
      <ReactQuill
        value={value}
        onChange={handleEditorChange}
        readOnly={readOnly}
        style={{
          height:"500px",
          backgroundColor: readOnly ? '#e9ecef' : ''
      }}
        required
        placeholder={placeholder}
        disabled={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
