import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder
} from 'discord.js';

/* ================== CLIENT ================== */
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ================== COMMAND ================== */
const commands = [
  new SlashCommandBuilder()
    .setName('infoboard')
    .setDescription('Send a multiline announcement with emojis')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Your announcement (supports new lines & animated emojis)')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

/* ================== REGISTER COMMAND ================== */
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error(err);
  }
})();

/* ================== READY ================== */
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

/* ================== INTERACTION ================== */
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'infoboard') return;

  try {
    // prevents "application did not respond"
    await interaction.deferReply({ ephemeral: true });

    const text = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor(0x00b0f4)
      .setDescription(text) // preserves line breaks & emojis
      .setFooter({ text: 'StromMC • Official Announcement' })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.editReply('✅ Announcement sent successfully!');
  } catch (error) {
    console.error(error);
    if (interaction.deferred) {
      await interaction.editReply('❌ Failed to send announcement.');
    }
  }
});

/* ================== LOGIN ================== */
client.login(process.env.TOKEN);
