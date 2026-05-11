const { generateResponse } = require("../services/aiService");
const { getMemory, saveMemory } = require("../services/memoryService");
const { getPersona } = require("../services/personaService");
const { isAllowedChannel } = require("../services/whitelistService");
const config = require("../config");

const cooldown = new Map();

module.exports = async (client, message) => {
  if (message.author.bot) return;

  if (!isAllowedChannel(message.channel.id)) return;

  const now = Date.now();
  const last = cooldown.get(message.author.id) || 0;
  if (now - last < config.behavior.cooldownMs) return;
  cooldown.set(message.author.id, now);

  const isMentioned = message.mentions.users.has(client.user.id);
  if (!config.behavior.replyToMessages && !isMentioned) return;

  const history = await getMemory(message.author.id);
  const personaKey = await getPersona(message.author.id);

  const systemPrompt = {
    role: "system",
    content: config.personas[personaKey] || config.personas.claude
  };

  const messages = [
    systemPrompt,
    ...history,
    { role: "user", content: message.content }
  ];

  await message.channel.sendTyping();

  // "streaming simulation"
  const reply = await generateResponse(messages);

  let buffer = "";
  const chunks = reply.match(/.{1,60}/g) || [reply];

  const sent = await message.reply("...");

  for (const chunk of chunks) {
    buffer += chunk;
    await new Promise(r => setTimeout(r, 250));
  }

  await sent.edit(buffer);

  const updated = [
    ...history,
    { role: "user", content: message.content },
    { role: "assistant", content: buffer }
  ];

  saveMemory(message.author.id, updated);
};