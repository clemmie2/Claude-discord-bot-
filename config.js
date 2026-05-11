module.exports = {
  ai: {
    model: "meta/llama-3.1-70b-instruct",
    baseURL: "https://integrate.api.nvidia.com/v1/chat/completions",
    maxTokens: 900,
    temperature: 0.7
  },

  memory: {
    maxMessages: 20
  },

  behavior: {
    cooldownMs: 4000,
    replyToMentions: true,
    replyToMessages: true
  },

  whitelist: {
    enabled: true,
    channels: [] // add channel IDs here
  },

  personas: {
    claude: "You are Claude-like: precise, structured, calm, highly helpful.",
    strict: "You are extremely strict, concise, minimal wording, no fluff.",
    coder: "You are a senior software engineer. Focus on clean code and architecture.",
    assistant: "You are a general helpful AI assistant."
  },

  defaultPersona: "claude"
};