import { Client, GatewayIntentBits, Events, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* ===============================
   INTERACTION HANDLER (ALL COMMANDS)
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
          "<a:fire:123456789012345678> **Premium SMP Experience**\n" +
          "<a:diamond:123456789012345678> Custom Features\n" +
          "<a:star:123456789012345678> Active Community\n\n" +
          "🚀 **Stay tuned for updates!**"
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
      await interaction.editReply("✅ Message sent successfully!");
    }

  } catch (err) {
    console.error("❌ Command Error:", err);

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
