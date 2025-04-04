const API_KEY = 'your-claude-api-key';
const BASE_URL = 'https://api.anthropic.com/v1/messages';

async function chatCompletion(message) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
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
        
        if (data.content && data.content[0]?.text) {
            const content = data.content[0].text;
            // 提取代码块，支持带语言标识和不带语言标识的代码块
            const codeMatch = content.match(/```(?:\w+)?\s*([\s\S]+?)\s*```/);
            return codeMatch ? codeMatch[1].trim() : content;
        }
        
        throw new Error('无效的响应格式');
    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}

module.exports = {
    chatCompletion
}; 