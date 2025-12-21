const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env");
    return;
  }
  
  console.log("🔑 API Key found");

  const genAI = new GoogleGenerativeAI(apiKey); // v1beta is default
  
  // Use REST API to list models
  console.log("🔄 Listing models via REST API...");
  try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (!response.ok) {
          const text = await response.text();
          console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
          console.error(`Body: ${text}`);
          return;
      }
      const data = await response.json();
      if (data.models) {
          console.log("✅ Available Models:");
          data.models.forEach(m => {
              if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                 console.log(` - ${m.name.replace('models/', '')} (${m.displayName})`);
              }
          });
      } else {
          console.log("⚠️ No models found in response:", data);
      }
      
  } catch (error) {
      console.error("❌ List models failed:", error.message);
  }
}

testGemini();
