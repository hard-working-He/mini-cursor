const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/renderer.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'self'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ['javascript', 'typescript', 'json'],
            filename: '[name].worker.js',
            customLanguages: [
                {
                    label: 'javascript',
                    entry: 'typescript',
                    worker: {
                        id: 'vs/language/typescript/tsWorker',
                        entry: 'vs/language/typescript/ts.worker'
                    }
                }
            ]
        })
    ]
}; 