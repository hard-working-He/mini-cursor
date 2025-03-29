import React from 'react';

const RunButton = ({ onClick }) => (
    <div className="run-button-container">
        <button className="run-button" onClick={onClick} title="Ctrl+Enter">
            <svg viewBox="0 0 16 16">
                <path d="M4 2v12l8.5-6L4 2z"/>
            </svg>
            运行代码
        </button>
    </div>
);

const SaveButton = ({ onClick }) => (
    <button className="save-button" onClick={onClick} title="Ctrl+S">
        保存
    </button>
);

const Toolbar = ({ onRun, onSave }) => (
    <div className="toolbar">
        <RunButton onClick={onRun} />
        <SaveButton onClick={onSave} />
    </div>
);

export default Toolbar; 