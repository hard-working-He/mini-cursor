import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/editor/editor.all.js';

// 设置 Monaco 环境
self.MonacoEnvironment = {
    getWorkerUrl: function (_, label) {
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.js';
        }
        if (label === 'json') {
            return './json.worker.js';
        }
        return './editor.worker.js';
    }
};

const Editor = ({ onInit }) => {
    const editorRef = useRef(null);
    const editorInstanceRef = useRef(null);

    useEffect(() => {
        let editor = null;

        const initEditor = async () => {
            if (editorRef.current && !editorInstanceRef.current) {
                try {
                    editor = monaco.editor.create(editorRef.current, {
                        value: '// 在这里编写代码',
                        language: 'javascript',
                        theme: 'vs-dark',
                        automaticLayout: true,
                        minimap: {
                            enabled: false
                        },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        cursorStyle: 'line'
                    });

                    // 配置 JSX 支持
                    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                        jsx: monaco.languages.typescript.JsxEmit.React,
                        jsxFactory: 'React.createElement',
                        reactNamespace: 'React',
                        allowNonTsExtensions: true,
                        allowJs: true,
                        target: monaco.languages.typescript.ScriptTarget.Latest
                    });

                    editorInstanceRef.current = editor;

                    if (onInit) {
                        onInit(editor);
                    }
                } catch (error) {
                    console.error('Monaco Editor initialization error:', error);
                }
            }
        };

        initEditor();

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.dispose();
                editorInstanceRef.current = null;
            }
        };
    }, [onInit]);

    return (
        <div 
            className="editor-wrapper" 
            ref={editorRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default Editor; 