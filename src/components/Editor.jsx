import React, { useEffect, useRef } from 'react';
import './Editor.css';
import { EditorState } from '@codemirror/state';
import { 
  EditorView, 
  keymap, 
  lineNumbers, 
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection
} from '@codemirror/view';
import { 
  defaultKeymap, 
  history, 
  historyKeymap,
  indentWithTab
} from '@codemirror/commands';
import { 
  indentUnit, 
  syntaxHighlighting, 
  defaultHighlightStyle,
  bracketMatching
} from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

// 创建一个简化版的 Cursor 主题
const cursorTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    backgroundColor: "#1e1e1e"
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "'SF Mono', Menlo, Monaco, 'Courier New', monospace",
    lineHeight: "1.5"
  },
  ".cm-content": {
    caretColor: "#fff",
    padding: "10px 0"
  },
  ".cm-line": {
    padding: "0 16px"
  },
  ".cm-cursor": {
    borderLeftColor: "#fff",
    borderLeftWidth: "2px"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 255, 255, 0.05)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(255, 255, 255, 0.05)"
  },
  ".cm-gutters": {
    backgroundColor: "#1e1e1e",
    color: "#858585",
    border: "none",
    borderRight: "1px solid #333"
  },
  ".cm-lineNumbers": {
    minWidth: "40px"
  }
});

const Editor = ({ onInit, initialValue = '// 在这里编写代码' }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      try {
        console.log('Initializing CodeMirror editor with Cursor theme...');
        
        // 创建编辑器配置，逐步添加功能
        const startState = EditorState.create({
          doc: initialValue,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            drawSelection(),
            history(),
            bracketMatching(),
            indentUnit.of("  "),
            syntaxHighlighting(defaultHighlightStyle),
            keymap.of([
              ...defaultKeymap,
              ...historyKeymap,
              indentWithTab
            ]),
            javascript(),
            cursorTheme
          ]
        });

        // 创建编辑器视图
        const view = new EditorView({
          state: startState,
          parent: editorRef.current
        });

        viewRef.current = view;
        console.log('Editor initialized successfully');

        if (onInit) {
          // 创建一个兼容的 API 接口
          const editorAPI = {
            getValue: () => view.state.doc.toString(),
            setValue: (value) => {
              view.dispatch({
                changes: { from: 0, to: view.state.doc.length, insert: value }
              });
            },
            getPosition: () => {
              const pos = view.state.selection.main.head;
              const line = view.state.doc.lineAt(pos);
              return {
                lineNumber: line.number,
                column: pos - line.from + 1
              };
            },
            getModel: () => ({
              getValueInRange: ({ startLineNumber, startColumn, endLineNumber, endColumn }) => {
                try {
                  const start = view.state.doc.line(startLineNumber).from + startColumn - 1;
                  const end = view.state.doc.line(endLineNumber).from + endColumn - 1;
                  return view.state.sliceDoc(start, end);
                } catch (e) {
                  console.error('Error in getValueInRange:', e);
                  return '';
                }
              },
              getLineCount: () => view.state.doc.lines
            }),
            executeEdits: (source, edits) => {
              try {
                view.dispatch({
                  changes: edits.map(edit => {
                    const start = view.state.doc.line(edit.range.startLineNumber).from + edit.range.startColumn - 1;
                    const end = view.state.doc.line(edit.range.endLineNumber).from + edit.range.endColumn - 1;
                    return { from: start, to: end, insert: edit.text };
                  })
                });
                return true;
              } catch (e) {
                console.error('Error in executeEdits:', e);
                return false;
              }
            },
            revealLineInCenter: (lineNumber) => {
              try {
                const line = view.state.doc.line(lineNumber);
                view.dispatch({
                  effects: EditorView.scrollIntoView(line.from, { y: 'center' })
                });
              } catch (e) {
                console.error('Error in revealLineInCenter:', e);
              }
            },
            addCommand: (keyCombination, handler) => {
              view.dispatch({
                effects: keymap.of([{
                  key: "Ctrl-Enter",
                  run: () => {
                    handler();
                    return true;
                  }
                }])
              });
            }
          };

          // 设置全局引用
          window.editor = editorAPI;
          onInit(editorAPI);
        }
      } catch (error) {
        console.error('Error initializing CodeMirror:', error);
      }
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [onInit, initialValue]);

  return (
    <div 
      className="editor-wrapper" 
      ref={editorRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Editor; 