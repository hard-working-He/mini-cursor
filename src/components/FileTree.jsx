import React, { useState, useEffect } from 'react';

const FileTreeHeader = ({ onOpenFile }) => (
    <div className="file-tree-header">
        文件浏览
        <button onClick={onOpenFile}>打开本地文件</button>
    </div>
);

const FileItem = ({ file, onClick }) => (
    <div
        className={`file-item ${file.type}`}
        onClick={onClick}
    >
        {file.type === 'directory' ? '📁' : '📄'} {file.name}
    </div>
);

const EmptyState = () => (
    <div className="empty-state">
        暂无打开的文件
        <p>点击上方按钮从您的电脑中选择文件</p>
    </div>
);

const FileTree = ({ onFileSelect }) => {
    const [files, setFiles] = useState([]);

    const handleOpenFile = async () => {
        try {
            // 调用 electron 的 dialog 来打开文件选择器
            const result = await window.api.openFile();
            if (result) {
                // 从结果中获取文件路径和内容
                const filePath = result.path;
                const fileName = filePath.split(/[/\\]/).pop();
                
                setFiles(prevFiles => [...prevFiles, {
                    name: fileName,
                    path: filePath,
                    type: 'file'
                }]);
                
                // 通知父组件选中的文件路径和内容
                onFileSelect(filePath);
            }
        } catch (error) {
            console.error('打开文件失败:', error);
        }
    };

    const handleFileClick = (file) => {
        onFileSelect(file.path);
    };

    return (
        <div className="file-tree">
            <FileTreeHeader onOpenFile={handleOpenFile} />
            <div className="file-tree-content">
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <FileItem
                            key={index}
                            file={file}
                            onClick={() => handleFileClick(file)}
                        />
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default FileTree; 