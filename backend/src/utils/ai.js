import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateEmbeddings = async (text) => {
  try {
    // For text embeddings, use the embedding-001 model
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error.message);
    // Return a zero vector fallback or rethrow
    throw new Error("Failed to generate embeddings with Gemini");
  }
};

export const answerQuestion = async (question, context) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Context: ${context}
      
      Question: ${question}
      
      Answer the question based strictly on the context provided. If the answer is not in the context, state that the information is not available in the lecture notes.
      Provide a concise and helpful answer.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Return in format expected by controller
    return { answer: text };
  } catch (error) {
    console.error("Gemini QA Error:", error.message);
    throw new Error("Failed to answer question with Gemini");
  }
};

// Simple similarity search using dot product (cosine similarity approximation)
export const findMostRelevantContext = (
  questionEmbedding,
  lectureEmbeddings
) => {
  if (!lectureEmbeddings || lectureEmbeddings.length === 0) {
    return null;
  }

  let maxSimilarity = -1;
  let mostRelevantIndex = 0;

  for (let i = 0; i < lectureEmbeddings.length; i++) {
    // Ensure dimensions match
    if (!lectureEmbeddings[i] || lectureEmbeddings[i].length !== questionEmbedding.length) {
        continue;
    }
      
    let similarity = 0;
    for (let j = 0; j < questionEmbedding.length; j++) {
      similarity += questionEmbedding[j] * lectureEmbeddings[i][j];
    }

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostRelevantIndex = i;
    }
  }

  return {
    index: mostRelevantIndex,
    similarity: maxSimilarity,
  };
};

export const translateText = async (text, targetLanguageCode) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // targetLanguageCode: 'hi' (Hindi), 'mr' (Marathi), 'en' (English)
    
    const langMap = {
        'hi': 'Hindi',
        'mr': 'Marathi',
        'en': 'English'
    };
    
    const targetLang = langMap[targetLanguageCode] || 'English';
    
    const prompt = `Translate the following text to ${targetLang}:\n\n"${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return text; // Return original on failure
  }
};

export const splitTextIntoChunks = (text, chunkSize = 500) => {
  const chunks = [];
  const words = text.split(" ");
  let currentChunk = [];

  for (const word of words) {
    currentChunk.push(word);
    if (currentChunk.join(" ").length >= chunkSize) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
};
