import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* =========================
   SLASH COMMANDS
========================= */
const commands = [
  // /infoboard
  new SlashCommandBuilder()
    .setName("infoboard")
    .setDescription("Show StromMC Network information"),

  // /say (admin only)
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send a normal message as the bot (Admin only)")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // /sayembed (admin only)
  new SlashCommandBuilder()
    .setName("sayembed")
    .setDescription("Send an embed message like Dyno (Admin only)")
    .addStringOption(option =>
      option
        .setName("title")
        .setDescription("Embed title")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("description")
        .setDescription("Embed description (use \\n for new lines)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(cmd => cmd.toJSON());

/* =========================
   REGISTER COMMANDS
========================= */
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🔄 Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
})();

/* =========================
   BOT READY
========================= */
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

/* =========================
   INTERACTIONS
========================= */
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  /* -------- /infoboard -------- */
  if (interaction.commandName === "infoboard") {
    const embed = new EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle("🌩️ StromMC Network")
      .setDescription(
        "**Server IP:** _Coming Soon_\n" +
        "**Port:** _Coming Soon_\n\n" +
        "🎮 **Available Modes**\n" +
        "🟢 Survival\n" +
        "⚔️ Bedwars\n" +
        "💀 Lifesteal\n" +
        "🕹️ Arcade\n" +
        "🌌 Custom Realms (3+)\n\n" +
        "🚀 High performance • Custom gameplay • Big updates coming soon!"
      )
      .setFooter({ text: "Official StromMC Network • StromMC" });

    await interaction.reply({ embeds: [embed] });
  }

  /* -------- /say -------- */
  if (interaction.commandName === "say") {
    const message = interaction.options.getString("message");
    await interaction.channel.send(message);
    await interaction.reply({ content: "✅ Message sent.", ephemeral: true });
  }

  /* -------- /sayembed -------- */
  if (interaction.commandName === "sayembed") {
    const title = interaction.options.getString("title");
    const description = interaction.options
      .getString("description")
      .replace(/\\n/g, "\n");

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: "Official StromMC Network" });

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: "✅ Embed sent.", ephemeral: true });
  }
});

/* =========================
   LOGIN
========================= */
client.login(process.env.TOKEN);
