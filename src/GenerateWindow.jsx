import React from 'react';
import './GenerateWindow.css';

function GenerateWindow({ isOpen, onClose, onSubmit, prompt, setPrompt }) {
  if (!isOpen) return null;

  return (
    <div className="GenWin">
      <div className="GenWin-content">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
        />
        <button onClick={() => onSubmit(prompt)}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default GenerateWindow;
