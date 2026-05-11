const { runAgent } = require("../services/agent");

const { getMemory, saveMemory } = require("../services/memoryService");
const {
  getServerMemory,
  saveServerMemory
} = require("../services/serverMemoryService");

const { getPersona } = require("../services/personaService");
const { isAllowedChannel } = require("../services/whitelistService");

const config = require("../config");

const cooldown = new Map();

module.exports = async (client, message) => {
  try {
    // Ignore bots
    if (message.author.bot) return;

    // Guild only safety (prevents DM crashes if server memory used)
    if (!message.guild) return;

    // Channel whitelist
    if (!isAllowedChannel(message.channel.id)) return;

    // Cooldown system
    const now = Date.now();
    const last = cooldown.get(message.author.id) || 0;

    if (now - last < config.behavior.cooldownMs) return;
    cooldown.set(message.author.id, now);

    // Trigger logic: mention OR enabled auto-reply
    const shouldReply =
      config.behavior.replyToMessages ||
      message.mentions.users.has(client.user.id);

    if (!shouldReply) return;

    // Load memory layers in parallel
    const [userMem, serverMem, persona] = await Promise.all([
      getMemory(message.author.id),
      getServerMemory(message.guild.id),
      getPersona(message.author.id)
    ]);

    // System prompt (Claude-level behavior)
    const systemPrompt = {
      role: "system",
      content: config.personas[persona] || config.personas.claude
    };

    // Build context
    const messages = [
      systemPrompt,
      ...serverMem,
      ...userMem,
      { role: "user", content: message.content }
    ];

    // Typing indicator (UX improvement)
    await message.channel.sendTyping();

    // ===== AGENT MODE EXECUTION =====
    const reply = await runAgent(messages);

    // ===== Streaming-style simulation =====
    const chunks = reply.match(/.{1,80}/g) || [reply];

    const sent = await message.reply("Thinking...");
    let buffer = "";

    for (const chunk of chunks) {
      buffer += chunk;
      await new Promise((r) => setTimeout(r, 180));
    }

    await sent.edit(buffer);

    // ===== MEMORY UPDATE =====
    const updatedUserMem = [
      ...userMem,
      { role: "user", content: message.content },
      { role: "assistant", content: buffer }
    ];

    const updatedServerMem = [
      ...serverMem,
      { role: "user", content: message.content },
      { role: "assistant", content: buffer }
    ];

    saveMemory(message.author.id, updatedUserMem);
    saveServerMemory(message.guild.id, updatedServerMem);
  } catch (err) {
    console.error("messageCreate error:", err);

    // Fail-safe response
    try {
      await message.reply("Error processing request.");
    } catch {}
  }
};