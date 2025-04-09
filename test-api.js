require("dotenv").config();
const { OpenAI } = require("openai");

// Initialize OpenAI with NVIDIA API
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function testApiConnection() {
  try {
    console.log("Testing API connection...");
    console.log("API Key:", process.env.NVIDIA_API_KEY ? "Present" : "Missing");
    console.log("Base URL:", "https://integrate.api.nvidia.com/v1");

    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Hello, this is a test message. Please respond with 'API connection successful!'",
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content || "No response";
    console.log("API Response:", response);
    console.log("API connection successful!");
  } catch (error) {
    console.error("API Test Error:", error);
  }
}

testApiConnection();
