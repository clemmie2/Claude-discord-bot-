require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const messageCreate = require("./events/messageCreate");
const interactionCreate = require("./events/interactionCreate");

client.on("messageCreate", (m) => messageCreate(client, m));
client.on("interactionCreate", (i) => interactionCreate(client, i));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);