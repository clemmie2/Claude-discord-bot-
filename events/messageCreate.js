const { generateResponse } = require("../services/aiService");
const { getMemory, saveMemory } = require("../services/memoryService");
const { getServerMemory, saveServerMemory } = require("../services/serverMemoryService");
const { getPersona } = require("../services/personaService");
const { isAllowedChannel } = require("../services/whitelistService");
const config = require("../config");

const cooldown = new Map();

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  // whitelist check
  if (!isAllowedChannel(message.channel.id)) return;

  // cooldown
  const now = Date.now();
  const last = cooldown.get(message.author.id) || 0;
  if (now - last < config.behavior.cooldownMs) return;
  cooldown.set(message.author.id, now);

  const shouldReply =
    config.behavior.replyToMessages ||
    message.mentions.users.has(client.user.id);

  if (!shouldReply) return;

  const [userMem, serverMem, persona] = await Promise.all([
    getMemory(message.author.id),
    getServerMemory(message.guild.id),
    getPersona(message.author.id)
  ]);

  const systemPrompt = {
    role: "system",
    content: config.personas[persona]
  };

  const messages = [
    systemPrompt,
    ...serverMem,
    ...userMem,
    { role: "user", content: message.content }
  ];

  await message.channel.sendTyping();

  const reply = await generateResponse(messages);

  // streaming-style effect (chunk edit)
  const chunks = reply.match(/.{1,80}/g) || [reply];

  const sent = await message.reply("...");
  let buffer = "";

  for (const chunk of chunks) {
    buffer += chunk;
    await new Promise(r => setTimeout(r, 180));
  }

  await sent.edit(buffer);

  const updatedUser = [
    ...userMem,
    { role: "user", content: message.content },
    { role: "assistant", content: buffer }
  ];

  const updatedServer = [
    ...serverMem,
    { role: "user", content: message.content },
    { role: "assistant", content: buffer }
  ];

  saveMemory(message.author.id, updatedUser);
  saveServerMemory(message.guild.id, updatedServer);
};