import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

// Header Component
const ChatHeader = ({ selectedModel, onModelChange }) => (
    <div className="chat-header">
        <span className="chat-title">AI 助手</span>
        <select 
            className="model-select"
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
        >
            <option value="zhipu">智谱 AI</option>
            <option value="claude">Claude</option>
        </select>
    </div>
);

// Message Components
const MessageItem = ({ message }) => (
    <div className={`message ${message.role}`}>
        <div className="message-content">
            {message.content}
        </div>
    </div>
);

const LoadingDots = () => (
    <div className="message assistant">
        <div className="message-content loading">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
        </div>
    </div>
);

// Input Component
const ChatInput = ({ input, setInput, handleSubmit, isLoading }) => (
    <form className="chat-input" onSubmit={handleSubmit}>
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入问题..."
            disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
            发送
        </button>
    </form>
);

// Content Component
const ChatContent = ({ messages, isLoading, messagesEndRef, streamContent }) => (
    <div className="chat-messages">
        {messages.map((msg, index) => (
            <MessageItem key={index} message={msg} />
        ))}
        {isLoading && <LoadingDots />}
        <div ref={messagesEndRef} />
        {streamContent && (
            <div className="stream-content">
                {streamContent}
            </div>
        )}
    </div>
);

// Main Chat Component
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('zhipu');
    const messagesEndRef = useRef(null);
    const editorRef = useRef(null);
    const [streamContent, setStreamContent] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (window.editor && !editorRef.current) {
            editorRef.current = window.editor;
        }
    }, []);

    const handleCodeComplete = async (prompt) => {
        setIsLoading(true);
        try {
            const editor = editorRef.current;
            if (!editor) {
                throw new Error('编辑器未初始化');
            }

            const model = editor.getModel();
            const position = editor.getPosition();
            
            const before = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });
            
            const after = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: model.getLineCount(),
                endColumn: model.getLineMaxColumn(model.getLineCount())
            });

            const stream = await window.api.chat({
                message: prompt,
                type: 'code_complete',
                editorContent: { before, after }
            });

            let content = '';
            const reader = stream.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const text = new TextDecoder().decode(value);
                const lines = text.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        
                        try {
                            const parsed = JSON.parse(data);
                            const newContent = parsed.choices[0].delta.content || '';
                            content += newContent;
                            setStreamContent(content);
                        } catch (e) {
                            console.error('Parse error:', e);
                        }
                    }
                }
            }

            // 将生成的代码插入编辑器
            if (content) {
                editor.executeEdits('code-completion', [{
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    },
                    text: content
                }]);
            }

        } catch (error) {
            console.error('Code completion error:', error);
            setMessages(prev => [...prev, { 
                role: 'error', 
                content: '代码生成失败，请重试。' 
            }]);
        } finally {
            setIsLoading(false);
            setStreamContent('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        const insertCodeWithAnimation = async (editor, code, position) => {
            // 先插入代码
            editor.executeEdits('code-insertion', [{
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                },
                text: code
            }]);

            // 获取插入后的代码范围
            const lines = code.split('\n');
            const endLine = position.lineNumber + lines.length - 1;
            const endColumn = lines.length > 1 ? 
                lines[lines.length - 1].length + 1 : 
                position.column + lines[0].length;

            // 添加高亮装饰器
            const decorations = editor.deltaDecorations([], [{
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: endLine,
                    endColumn: endColumn
                },
                options: {
                    className: 'code-insertion-highlight',
                    isWholeLine: true
                }
            }]);

            // 1.5秒后移除高亮
            setTimeout(() => {
                editor.deltaDecorations(decorations, []);
            }, 1500);

            // 滚动到插入位置
            editor.revealLineInCenter(position.lineNumber);
        };

        try {
            const response = await window.api.chat(userMessage, selectedModel);
            if (typeof response === 'string' && response.startsWith('错误:')) {
                setMessages(prev => [...prev, { 
                    role: 'error', 
                    content: response 
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: response 
                }]);
                
                if (userMessage.toLowerCase().includes('写') || 
                    userMessage.toLowerCase().includes('生成') || 
                    userMessage.toLowerCase().includes('实现')) {
                    const editor = editorRef.current;
                    if (editor) {
                        const position = editor.getPosition();
                        await insertCodeWithAnimation(editor, response, position);
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = error.message || '抱歉，发生了错误。请稍后重试。';
            setMessages(prev => [...prev, { 
                role: 'error', 
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <ChatHeader 
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
            />
            <ChatContent 
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                streamContent={streamContent}
            />
            <ChatInput 
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Chat; 