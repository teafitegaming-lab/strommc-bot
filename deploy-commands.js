import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

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
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("⏳ Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Slash commands registered successfully!");
  } catch (error) {
    console.error(error);
  }
})();
