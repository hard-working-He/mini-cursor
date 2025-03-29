import React, { useState } from 'react';
import { ArrowIcon, getFileIcon } from './FileIcons';
import './FileTree.css';

const FileIcon = ({ type, extension, isExpanded }) => {
    if (type === 'directory') {
        return <ArrowIcon isExpanded={isExpanded} />;
    }
    return getFileIcon(extension);
};

const FileTreeItem = ({ item, onSelect, level = 0, activeFile }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (item.type === 'directory') {
            setIsExpanded(!isExpanded);
        } else {
            onSelect(item);
        }
    };

    const isActive = activeFile === item.path;

    return (
        <div className="file-tree-item">
            <div
                className={`file-item ${item.type} ${isActive ? 'active' : ''}`}
                style={{ paddingLeft: `${level * 12 + 24}px` }}
                onClick={handleClick}
            >
                <FileIcon 
                    type={item.type} 
                    extension={item.extension || ''} 
                    isExpanded={isExpanded}
                />
                <span className="file-name">{item.name}</span>
            </div>
            {item.type === 'directory' && isExpanded && (
                <div className="file-tree-children">
                    {item.children?.map((child, index) => (
                        <FileTreeItem
                            key={index}
                            item={child}
                            onSelect={onSelect}
                            level={level + 1}
                            activeFile={activeFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree = ({ onFileSelect, currentFile }) => {
    const [files, setFiles] = useState([]);

    const handleOpenDirectory = async () => {
        try {
            const result = await window.api.openDirectory();
            if (result) {
                setFiles(result.files);
            }
        } catch (error) {
            console.error('打开文件夹失败:', error);
        }
    };

    const handleFileSelect = (file) => {
        if (file.type === 'file') {
            onFileSelect(file.path);
        }
    };

    return (
        <div className="file-tree">
            <div className="file-tree-header">
                <span className="file-tree-title">文件浏览器</span>
                <div className="file-tree-actions">
                    <button className="file-tree-button" onClick={handleOpenDirectory}>
                        打开文件夹
                    </button>
                </div>
            </div>
            <div className="file-tree-content">
                {files.length > 0 ? (
                    files.map((item, index) => (
                        <FileTreeItem
                            key={index}
                            item={item}
                            onSelect={handleFileSelect}
                            activeFile={currentFile}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        暂无打开的文件
                        <p>点击上方按钮打开文件夹</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileTree; 