require('dotenv').config();

// 配置文件，可以从环境变量或配置文件加载
module.exports = {
    zhipu: {
        apiKey: process.env.ZHIPU_API_KEY,
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
    },
    claude: {
        apiKey: process.env.CLAUDE_API_KEY,
        baseUrl: 'https://api.anthropic.com/v1'
    }
}; 