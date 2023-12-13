import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./styles.css"
const RichTextEditor = ({ value, onChange, readOnly, placeholder }) => {
  // const handleEditorChange = (content) => {
  //   onChange(content);
  // };
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // Basic formatting
        [{ 'header': 1 }, { 'header': 2 }], // Headers
        [{ 'size': ['small', false, 'large', 'huge'] }], // Font sizes
        [{ 'color': [] }, { 'background': [] }], // Color and background color
        ['link', 'image', 'video'], // Links, images, and videos
        ['clean'], // Remove formatting
      ],
    },
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'size',
    'color', 'background',
    'link', 'image', 'video',
  ];

  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={{
          height: "500px",
          backgroundColor: readOnly ? '#e9ecef' : ''
        }}
        required
        placeholder={placeholder}
        disabled={readOnly}
        formats={formats}
      />
    </div>

  );
};

export default RichTextEditor;
