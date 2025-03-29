require.config({ paths: { 'vs': '../node_modules/monaco-editor/min/vs' }});

require(['vs/editor/editor.main'], function() {
    let editor = monaco.editor.create(document.getElementById('editor'), {
        value: '// 在这里编写代码\n',
        language: 'javascript',
        theme: 'vs-dark'
    });
}); 