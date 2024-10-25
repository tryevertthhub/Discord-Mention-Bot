const { fetchAIResponse } = require('./openRouterService');

async function generateRelatedQuestions(userMessage) {
    const prompt = `Based on the user's question: "${userMessage}", suggest 3 related questions.`;
    try {
        // Fetch AI-generated related questions
        const response = await fetchAIResponse(prompt);

        // Split the response into individual questions
        const relatedQuestions = response.split('\n').filter(q => q.trim() !== '');
        return relatedQuestions.slice(0, 3); // Return first 3 related questions
    } catch (error) {
        console.error('Error generating related questions:', error);
        return null; // Ensure it returns null on failure
    }
}

module.exports = { generateRelatedQuestions };
