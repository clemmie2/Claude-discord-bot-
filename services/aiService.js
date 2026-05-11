const axios = require("axios");
const config = require("../config");

async function generateResponse(messages) {
  const res = await axios.post(
    config.ai.baseURL,
    {
      model: config.ai.model,
      messages,
      temperature: config.ai.temperature,
      max_tokens: config.ai.maxTokens
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices?.[0]?.message?.content || "No response.";
}

module.exports = { generateResponse };