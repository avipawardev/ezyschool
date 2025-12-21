const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAIResponse = async (req, res) => {
  try {
    const { question, context, language = "english" } = req.body;
    
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `You are a helpful and knowledgeable teaching assistant for an online course platform. Your goal is to explain concepts clearly and concisely to students. Context from the lecture is provided if available. IMPORTANT: Please provide your response in ${language} language.`;
    
    const prompt = `${systemPrompt}\n\n${context ? `Context: ${context}\n\n` : ""}Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
        res.status(200).json({
            success: true,
            answer: text.trim(),
        });
    } else {
         res.status(500).json({
            success: false,
            message: "Failed to generate response from AI",
        });
    }

  } catch (error) {
    console.error("AI Controller Error Detailed:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching AI response",
      error: error.message 
    });
  }
};

module.exports = { getAIResponse };
