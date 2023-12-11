import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
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
        style={{height:"500px"}}
        required
        placeholder={placeholder}
        disabled={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
