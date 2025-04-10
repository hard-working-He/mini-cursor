import React, { useState } from 'react';

const FileIcon = ({ type, extension }) => {
    // 简化图标，只根据文件类型和主要语言分类显示
    const getIcon = () => {
        if (type === 'directory') {
            return '📁';
        }
        
        // 根据文件类型分组显示图标
        const ext = extension.toLowerCase();
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            return '📝'; // JavaScript/TypeScript 文件
        }
        if (['.html', '.css'].includes(ext)) {
            return '🌐'; // Web 文件
        }
        if (['.py', '.go', '.java', '.cpp', '.c', '.rs'].includes(ext)) {
            return '⚙️'; // 编程语言文件
        }
        if (['.json', '.md'].includes(ext)) {
            return '📄'; // 文档文件
        }
        return '📄'; // 默认文件图标
    };

    return <span className="file-icon">{getIcon()}</span>;
};

const FileTreeItem = ({ item, onSelect, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (item.type === 'directory') {
            setIsExpanded(!isExpanded);
        } else {
            onSelect(item);
        }
    };

    return (
        <div className="file-tree-item">
            <div
                className={`file-item ${item.type}`}
                style={{ paddingLeft: `${level * 20}px` }}
                onClick={handleClick}
            >
                <FileIcon type={item.type} extension={item.extension || ''} />
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree = ({ onFileSelect }) => {
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
                <button onClick={handleOpenDirectory}>打开文件夹</button>
            </div>
            <div className="file-tree-content">
                {files.length > 0 ? (
                    files.map((item, index) => (
                        <FileTreeItem
                            key={index}
                            item={item}
                            onSelect={handleFileSelect}
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