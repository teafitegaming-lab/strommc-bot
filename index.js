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
   CLIENT
========================= */
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* =========================
   SLASH COMMANDS
========================= */
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
        .setDescription("Message to send")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("sayembed")
    .setDescription("Send an embed message (Admin only)")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Embed content (multi-line supported)")
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
  } catch (err) {
    console.error(err);
  }
})();

/* =========================
   READY
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
      .setColor(0xE53935)
      .setTitle("📢 StromMC Information Board")
      .setDescription(
        "✨ **Welcome to StromMC!** ✨\n\n" +
        "🔥 **Premium SMP Experience**\n" +
        "💎 Custom Features\n" +
        "⭐ Active Community\n\n" +
        "🎮 **Available Modes**\n" +
        "🟢 Survival\n" +
        "⚔️ Bedwars\n" +
        "💀 Lifesteal\n" +
        "🕹️ Arcade\n" +
        "🌌 Custom Realms (Coming Soon)\n\n" +
        "🚀 Stay tuned for updates!"
      )
      .setFooter({ text: "Official StromMC Network" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  /* -------- /say -------- */
  if (interaction.commandName === "say") {
    const message = interaction.options.getString("message");

    await interaction.channel.send({
      content: message,
      allowedMentions: { parse: [] }
    });

    await interaction.reply({
      content: "✅ Message sent.",
      ephemeral: true
    });
  }

  /* -------- /sayembed -------- */
  if (interaction.commandName === "sayembed") {
    const message = interaction.options.getString("message");

    const embed = new EmbedBuilder()
      .setColor(0xE53935)
      .setDescription(message) // IMPORTANT: untouched text
      .setFooter({ text: "Official StromMC Network" })
      .setTimestamp();

    await interaction.channel.send({
      embeds: [embed],
      allowedMentions: { parse: [] }
    });

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
