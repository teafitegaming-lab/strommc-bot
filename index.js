require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  REST,
  Routes
} = require("discord.js");

/* ───────────── Client ───────────── */

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ───────────── Slash Commands ───────────── */

const commands = [
  new SlashCommandBuilder()
    .setName("infoboard")
    .setDescription("Show StromMC Network information"),

  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send a normal message as the bot (Admin only)")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Message to send (multi-line supported)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("sayembed")
    .setDescription("Send an embed message (Admin only)")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Embed message (multi-line + animated emojis supported)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(cmd => cmd.toJSON());

/* ───────────── Register Commands ───────────── */

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
  } catch (err) {
    console.error("❌ Command registration failed:", err);
  }
})();

/* ───────────── Ready ───────────── */

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

/* ───────────── Interactions ───────────── */

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  /* ── /infoboard ── */
  if (interaction.commandName === "infoboard") {
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle("🌩️ StromMC Information Board")
      .setDescription(
        "✨ **Welcome to StromMC!** ✨\n\n" +
        "🔥 **Premium SMP Experience**\n" +
        "💎 Custom Features\n" +
        "⭐ Active Community\n\n" +
        "🌐 **Server IP:** _Coming Soon_\n" +
        "🔌 **Port:** _Coming Soon_\n\n" +
        "🚀 Stay tuned for updates!"
      )
      .setFooter({ text: "Official StromMC Network" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  /* ── /say ── */
  if (interaction.commandName === "say") {
    const message = interaction.options.getString("message");

    // ✅ Send message EXACTLY as typed (keeps new lines)
    await interaction.channel.send({ content: message });

    await interaction.reply({
      content: "✅ Message sent successfully.",
      ephemeral: true
    });
  }

  /* ── /sayembed ── */
  if (interaction.commandName === "sayembed") {
    const message = interaction.options.getString("message");

    // 🚨 CRITICAL FIX:
    // Do NOT modify message at all
    // This preserves:
    // ✔ line breaks
    // ✔ animated emojis
    // ✔ formatting
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setDescription(message)
      .setFooter({ text: "Official StromMC Network" })
      .setTimestamp();

    await interaction.reply({
      content: "✅ Embed sent successfully.",
      ephemeral: true
    });

    await interaction.channel.send({ embeds: [embed] });
  }
});

/* ───────────── Login ───────────── */

client.login(process.env.TOKEN);
