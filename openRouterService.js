const OpenRouter = require('./Router/openrouter');
const config = require('./config.json');

async function fetchAIResponse(message) {
    const router = new OpenRouter(config.OPEN_ROUTER_API_KEY);
    return await router.generate(message);
}

module.exports = { fetchAIResponse };
