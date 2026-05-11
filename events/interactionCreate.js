const { generateResponse } = require("../services/aiService");
const { getMemory, saveMemory } = require("../services/memoryService");
const { getPersona, setPersona } = require("../services/personaService");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // CHAT
  if (interaction.commandName === "chat") {
    await interaction.deferReply();

    const input = interaction.options.getString("prompt");

    const history = await getMemory(interaction.user.id);
    const persona = await getPersona(interaction.user.id);

    const messages = [
      { role: "system", content: "You are a Claude-like assistant." },
      ...history,
      { role: "user", content: input }
    ];

    const reply = await generateResponse(messages);

    saveMemory(interaction.user.id, [
      ...history,
      { role: "user", content: input },
      { role: "assistant", content: reply }
    ]);

    interaction.editReply(reply);
  }

  // PERSONA
  if (interaction.commandName === "persona") {
    const p = interaction.options.getString("type");

    setPersona(interaction.user.id, p);

    interaction.reply({
      content: `Persona set to **${p}**`,
      ephemeral: true
    });
  }

  // RESET
  if (interaction.commandName === "reset") {
    saveMemory(interaction.user.id, []);
    interaction.reply({ content: "Memory cleared.", ephemeral: true });
  }
};