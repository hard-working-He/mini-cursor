const API_KEY = '4bd81c927a744f368cb794948000e851.gc0gRhtYIDI9txzk';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function chatCompletion(message) {
    try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
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
        
        if (data.choices && data.choices[0]) {
            const content = data.choices[0].message.content;
            // 提取代码块，支持带语言标识和不带语言标识的代码块
            const codeMatch = content.match(/```(?:\w+)?\s*([\s\S]+?)\s*```/);
            return codeMatch ? codeMatch[1].trim() : content;
        }
        
        throw new Error('无效的响应格式');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

module.exports = {
    chatCompletion
}; 