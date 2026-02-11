import {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

/* ===============================
   CLIENT
================================= */
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ===============================
   SLASH COMMANDS (REGISTER LIKE INFOBOARD)
================================= */
const commands = [
  new SlashCommandBuilder()
    .setName("infoboard")
    .setDescription("Show StromMC information board"),

  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send a message using the bot")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("Message to send")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🔄 Syncing slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Slash commands synced");
  } catch (err) {
    console.error("❌ Slash command sync error:", err);
  }
})();

/* ===============================
   BOT READY
================================= */
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* ===============================
   COMMAND HANDLER
================================= */
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    /* -------- /infoboard -------- */
    if (interaction.commandName === "infoboard") {
      const embed = new EmbedBuilder()
        .setTitle("📢 StromMC Information Board")
        .setDescription(
          "✨ **Welcome to StromMC!** ✨\n\n" +
          "<a:fire:123456789012345678> Premium SMP Experience\n" +
          "<a:diamond:123456789012345678> Custom Features\n" +
          "<a:star:123456789012345678> Active Community\n\n" +
          "🌐 **IP:** play.strommc.xyz\n" +
          "🔌 **Port:** 25565\n\n" +
          "🚀 Stay tuned for updates!"
        )
        .setColor(0xff0000)
        .setFooter({ text: "StromMC Network" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    /* -------- /say -------- */
    if (interaction.commandName === "say") {
      const text = interaction.options.getString("text");

      await interaction.deferReply({ ephemeral: true });
      await interaction.channel.send(text);
      await interaction.editReply("✅ Message sent!");
    }

  } catch (error) {
    console.error("❌ Interaction error:", error);

    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Something went wrong.",
        ephemeral: true
      });
    }
  }
});

/* ===============================
   LOGIN
================================= */
client.login(process.env.TOKEN);
