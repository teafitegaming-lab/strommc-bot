import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";

/* =========================
   CLIENT SETUP
========================= */
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
        .setDescription("Message to send (supports line breaks)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // /sayembed (admin only)
  new SlashCommandBuilder()
    .setName("sayembed")
    .setDescription("Send a premium embed message (Admin only)")
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
   READY EVENT
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
      .setColor(0xff2b2b)
      .setTitle("📢 StromMC Information Board")
      .setDescription(
        "✨ **Welcome to StromMC Network!** ✨\n\n" +

        "━━━━━━━━━━━━━━━━━━\n" +
        "🔥 **Premium Minecraft Experience**\n" +
        "💎 Custom & Unique Features\n" +
        "⭐ Active Community\n\n" +

        "━━━━━━━━━━━━━━━━━━\n" +
        "🎮 **Available Game Modes**\n" +
        "🟢 Survival\n" +
        "⚔️ Bedwars\n" +
        "💀 Lifesteal\n" +
        "🕹️ Arcade\n" +
        "🌌 Custom Realms (2–3+)\n\n" +

        "━━━━━━━━━━━━━━━━━━\n" +
        "🌐 **Server Information**\n" +
        "🖥️ **IP:** _Coming Soon_\n" +
        "🔌 **Port:** _Coming Soon_\n\n" +

        "🚀 Stay tuned for updates & big reveals!"
      )
      .setFooter({ text: "Official StromMC Network" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  /* -------- /say -------- */
  if (interaction.commandName === "say") {
    const message = interaction.options.getString("message");
    await interaction.channel.send(message);
    await interaction.reply({
      content: "✅ Message sent successfully.",
      ephemeral: true
    });
  }

  /* -------- /sayembed -------- */
  if (interaction.commandName === "sayembed") {
    const title = interaction.options.getString("title");
    const description = interaction.options
      .getString("description")
      .replace(/\\n/g, "\n");

    const embed = new EmbedBuilder()
      .setColor(0xff2b2b)
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: "Official StromMC Network" })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({
      content: "✅ Embed sent successfully.",
      ephemeral: true
    });
  }
});

/* =========================
   LOGIN
========================= */
client.login(process.env.TOKEN);
