import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// 创建 React 18 的根节点
const root = createRoot(document.getElementById('root'));

// 渲染 React 应用
root.render(<App />); 