module.exports = {
  ai: {
    model: "meta/llama-3.1-70b-instruct",
    baseURL: "https://integrate.api.nvidia.com/v1/chat/completions",
    maxTokens: 900,
    temperature: 0.7
  },

  behavior: {
    cooldownMs: 4000,
    replyToMessages: true
  },

  whitelist: {
    enabled: false,
    channels: [] // add allowed channel IDs here
  },

  memory: {
    maxMessages: 20
  },

  personas: {
    claude: "You are a precise, structured, helpful AI assistant like Claude.",
    strict: "You are extremely concise. No extra words.",
    coder: "You are a senior software engineer. Focus on clean production code.",
    assistant: "You are a general helpful AI assistant."
  },

  defaultPersona: "claude"
};