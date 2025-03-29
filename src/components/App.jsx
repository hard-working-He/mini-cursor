import React, { useState, useRef } from 'react';
import * as monaco from 'monaco-editor';
import FileTree from './FileTree';
import Toolbar from './Toolbar';
import Editor from './Editor';
import OutputPanel from './OutputPanel';

const App = () => {
    const [currentFile, setCurrentFile] = useState(null);
    const outputRef = useRef(null);
    const editorInstanceRef = useRef(null);

    const handleEditorInit = (editor) => {
        editorInstanceRef.current = editor;
        window.editor = editor; // 如果其他地方还需要访问编辑器实例

        // 添加快捷键支持
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            () => runCode()
        );
    };

    const runCode = () => {
        const output = outputRef.current;
        output.innerHTML = '';
        
        try {
            const code = editorInstanceRef.current.getValue();
            const fn = new Function('console', 'React', 'ReactDOM', code);
            
            const customConsole = {
                log: (...args) => {
                    output.innerHTML += args.map(arg => 
                        typeof arg === 'object' ? 
                        JSON.stringify(arg, null, 2) : 
                        String(arg)
                    ).join(' ') + '\n';
                },
                error: (...args) => {
                    output.innerHTML += '<span style="color: #ff5555">' + 
                        args.join(' ') + '</span>\n';
                },
                clear: () => {
                    output.innerHTML = '';
                }
            };
            
            fn(customConsole, React, ReactDOM);
        } catch (err) {
            output.innerHTML += '<span style="color: #ff5555">' + 
                err.message + '</span>\n';
        }
    };

    const handleFileSelect = async (filePath) => {
        try {
            const content = await window.api.readFile(filePath);
            if (content && editorInstanceRef.current) {
                editorInstanceRef.current.setValue(content);
                setCurrentFile(filePath);
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    const handleSave = async () => {
        if (!editorInstanceRef.current) return;

        if (currentFile) {
            const content = editorInstanceRef.current.getValue();
            await window.api.saveFile(currentFile, content);
        } else {
            await window.api.saveFileAs(editorInstanceRef.current.getValue());
        }
    };

    return (
        <div className="app-container">
            <FileTree onFileSelect={handleFileSelect} />
            <div className="editor-container">
                <Toolbar onRun={runCode} onSave={handleSave} />
                <Editor onInit={handleEditorInit} />
                <OutputPanel ref={outputRef} />
            </div>
        </div>
    );
};

export default App; 