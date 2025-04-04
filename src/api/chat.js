const config = require('./config');

// 智谱 AI 接口
async function zhipuChat(message) {
    try {
        const response = await fetch(`${config.zhipu.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.zhipu.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "codegeex-4",
                messages: [{
                    role: "system",
                    content: "你是一个专业的编程助手。请用代码块(用```包裹)返回代码，代码要简洁、高效、易读。"
                }, {
                    role: "user",
                    content: message
                }],
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }

        const data = await response.json();
        return extractCode(data.choices[0].message.content);
    } catch (error) {
        console.error('Zhipu API Error:', error);
        throw error;
    }
}

// Claude 接口
async function claudeChat(message) {
    try {
        const response = await fetch(`${config.claude.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'x-api-key': config.claude.apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: "claude-3-opus-20240229",
                max_tokens: 4096,
                messages: [{
                    role: "user",
                    content: message
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }

        const data = await response.json();
        return extractCode(data.content[0].text);
    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}

// 提取代码块的公共函数
function extractCode(content) {
    const codeMatch = content.match(/```(?:\w+)?\s*([\s\S]+?)\s*```/);
    return codeMatch ? codeMatch[1].trim() : content;
}

module.exports = {
    zhipuChat,
    claudeChat
}; 