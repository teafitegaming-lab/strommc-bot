import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("infoboard")
  .setDescription("Show StromMC server information");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: [command.toJSON()] }
  );
  console.log("Slash command registered");
})();

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "infoboard") {
    const embed = new EmbedBuilder()
      .setColor(0x00d4ff)
      .setTitle("👑 StromMC | The Mining ⛏️")
      .setDescription(
        "**Official Community Hub of StromMC**\n\n" +
        "✨ Updates • 🎉 Events • 🐯 Community\n\n" +
        "**🌐 Server Info**\n" +
        "🔹 IP: `play.strommc.xyz`\n" +
        "🔹 Bedrock Port: `19132`\n" +
        "🟢 Java + Bedrock Supported"
      )
      .setFooter({ text: "StromMC • Official" });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("👑 About Owner")
        .setStyle(ButtonStyle.Danger)
        .setURL("https://youtube.com"),
      new ButtonBuilder()
        .setLabel("📺 YouTube")
        .setStyle(ButtonStyle.Link)
        .setURL("https://youtube.com"),
      new ButtonBuilder()
        .setLabel("🛡️ Strom Team")
        .setStyle(ButtonStyle.Success)
        .setURL("https://discord.com")
    );

    await interaction.reply({ embeds: [embed], components: [buttons] });
  }
});

client.login(process.env.TOKEN);
