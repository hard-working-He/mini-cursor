import React from 'react';

// 箭头图标组件
export const ArrowIcon = ({ isExpanded }) => (
    <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.15s ease'
        }}
    >
        <path
            d="M6 4L10 8L6 12"
            stroke="#c5c5c5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const BaseFileIcon = ({ color, children }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 1L2 2V14L3 15H13L14 14V4L13.7071 3.29289L10.7071 0.292893L10 0H3L2 1H3V14H13V4H9V1H3Z"
            fill={color}
        />
        {children}
    </svg>
);

export const FileIcons = {
    default: <BaseFileIcon color="#c5c5c5" />,
    html: <BaseFileIcon color="#E44D26">
        <path d="M8 4L12 5L11.5 12L8 13L4.5 12L4 5L8 4Z" fill="white"/>
        <path d="M8 5V12L11 11.5L11.5 5.5L8 5Z" fill="#B4B4B4"/>
        <path d="M6 6H10L9.5 10.5L8 11L6.5 10.5L6.3 8.5H7.5L7.6 9.5L8 9.7L8.4 9.5L8.5 8H6.2L6 6Z" fill="#242424"/>
    </BaseFileIcon>,
    css: <BaseFileIcon color="#1572B6">
        <path d="M8 4L12 5L11.5 12L8 13L4.5 12L4 5L8 4Z" fill="white"/>
        <path d="M8 5V12L11 11.5L11.5 5.5L8 5Z" fill="#B4B4B4"/>
        <path d="M10 6H6L6.2 7.5H8V9H6.4L6.6 10.5H8L7.9 11.5L8 12L9.5 11.5L9.8 8.5H8V7.5H10L10 6Z" fill="#242424"/>
    </BaseFileIcon>,
    scss: <BaseFileIcon color="#CD6799">
        <path d="M8 5C10.5 5 11.5 6.5 11 7.5C10.5 8.5 9 8 9 9C9 10 11 10.5 11 11.5C11 12.5 9 13 8 12" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    js: <BaseFileIcon color="#FFCA28">
        <path d="M8.5 6.5V10.5C8.5 11.5 8 12 7 12C6.2 12 5.7 11.5 5.5 11L6.5 10.5C6.6 10.8 6.8 11 7 11C7.2 11 7.5 10.9 7.5 10.5V6.5H8.5ZM11.5 11C10.7 11 10.2 10.5 10 10L11 9.5C11.1 9.8 11.3 10 11.5 10C11.7 10 12 9.9 12 9.5C12 9.1 11.7 9 11.2 8.8L11 8.7C10.2 8.4 9.7 8 9.7 7C9.7 6.2 10.2 5.7 11.2 5.7C11.9 5.7 12.4 6 12.7 6.5L11.7 7C11.6 6.7 11.4 6.5 11.2 6.5C11 6.5 10.8 6.7 10.8 7C10.8 7.3 11 7.4 11.5 7.6L11.7 7.7C12.6 8 13.1 8.4 13.1 9.4C13.1 10.4 12.3 11 11.5 11Z" fill="#242424"/>
    </BaseFileIcon>,
    jsx: <BaseFileIcon color="#00D8FF">
        <path d="M8 9.5C8.8284 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5ZM8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5Z" fill="#242424"/>
        <path d="M8 4.5C9.5 4.5 12.5 5 12.5 8C12.5 11 9.5 11.5 8 11.5" stroke="#242424" strokeWidth="1" strokeLinecap="round"/>
        <path d="M8 11.5C6.5 11.5 3.5 11 3.5 8C3.5 5 6.5 4.5 8 4.5" stroke="#242424" strokeWidth="1" strokeLinecap="round"/>
    </BaseFileIcon>,
    ts: <BaseFileIcon color="#3178C6">
        <path d="M8 4H4V12H12V8" stroke="white" strokeWidth="1"/>
        <path d="M9 7V11M9 7L11 7M9 9H11" stroke="white" strokeWidth="1"/>
        <circle cx="6" cy="9" r="1" fill="white"/>
    </BaseFileIcon>,
    tsx: <BaseFileIcon color="#3178C6">
        <path d="M8 9.5C8.8284 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z" fill="white"/>
        <path d="M8 4.5C9.5 4.5 12.5 5 12.5 8C12.5 11 9.5 11.5 8 11.5" stroke="white" strokeWidth="1"/>
        <path d="M8 11.5C6.5 11.5 3.5 11 3.5 8C3.5 5 6.5 4.5 8 4.5" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    json: <BaseFileIcon color="#FAC863">
        <path d="M6.5 6C7.5 6 8 6.5 8 7.5C8 8.5 7.5 9 6.5 9C5.5 9 5 8.5 5 7.5C5 6.5 5.5 6 6.5 6ZM6.5 10C8.2 10 9 8.9 9 7.5C9 6.1 8.2 5 6.5 5C4.8 5 4 6.1 4 7.5C4 8.9 4.8 10 6.5 10ZM9.5 6C10.5 6 11 6.5 11 7.5C11 8.5 10.5 9 9.5 9C8.5 9 8 8.5 8 7.5C8 6.5 8.5 6 9.5 6ZM9.5 10C11.2 10 12 8.9 12 7.5C12 6.1 11.2 5 9.5 5C7.8 5 7 6.1 7 7.5C7 8.9 7.8 10 9.5 10Z" fill="#242424"/>
    </BaseFileIcon>,
    md: <BaseFileIcon color="#519ABA">
        <path d="M5 11V5H6L8 7.5L10 5H11V11H10V6.8L8 9.3L6 6.8V11H5Z" fill="#242424"/>
    </BaseFileIcon>,
    py: <BaseFileIcon color="#3572A5">
        <path d="M8 4C10 4 11 5 11 6V7H5V9H11V10C11 11 10 12 8 12C6 12 5 11 5 10" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    go: <BaseFileIcon color="#00ADD8">
        <path d="M6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6" stroke="white" strokeWidth="1"/>
        <circle cx="6.5" cy="7.5" r="1" fill="white"/>
        <circle cx="9.5" cy="7.5" r="1" fill="white"/>
    </BaseFileIcon>,
    rs: <BaseFileIcon color="#DEA584">
        <path d="M8 5L6 8L8 11" stroke="white" strokeWidth="1"/>
        <path d="M8 5L10 8L8 11" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    pdf: <BaseFileIcon color="#DB4437">
        <path d="M4 4H12V12H4V4Z" stroke="white" strokeWidth="1"/>
        <path d="M6 6H10M6 8H10M6 10H8" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    svg: <BaseFileIcon color="#FFB13B">
        <path d="M4 6L8 4L12 6V10L8 12L4 10V6Z" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    gitignore: <BaseFileIcon color="#F05032">
        <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>,
    env: <BaseFileIcon color="#4CAF50">
        <path d="M4 8C4 6 5 4 8 4C11 4 12 6 12 8C12 10 11 12 8 12C5 12 4 10 4 8Z" stroke="white" strokeWidth="1"/>
    </BaseFileIcon>
};

export const getFileIcon = (extension) => {
    if (!extension) return FileIcons.default;
    const ext = extension.toLowerCase().replace('.', '');
    return FileIcons[ext] || FileIcons.default;
}; 