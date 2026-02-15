import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* =========================
   SLASH COMMAND HANDLER
========================= */
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  /* =========================
     /INFOBOARD
  ========================= */
  if (interaction.commandName === 'infoboard') {
    const embed = new EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle('🌍 StromMC Network')
      .setDescription(
        `**Available Modes**  
🟢 Survival  
🔴 Lifesteal  
🟣 Bedwars  
🟡 Arcade  
🔵 Custom Realms  

**Server Address**  
IP: *(Coming Soon)*  
Port: *(Coming Soon)*`
      )
      .setFooter({ text: 'Official StromMC Network' });

    await interaction.reply({ embeds: [embed] });
  }

  /* =========================
     /SAY (ADMIN ONLY)
  ========================= */
  if (interaction.commandName === 'say') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You must be an **Administrator** to use this command.',
        ephemeral: true
      });
    }

    const message = interaction.options.getString('message');

    await interaction.channel.send(message);
    await interaction.reply({ content: '✅ Message sent.', ephemeral: true });
  }

  /* =========================
     /SAYEMBED (ADMIN ONLY)
  ========================= */
  if (interaction.commandName === 'sayembed') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You must be an **Administrator** to use this command.',
        ephemeral: true
      });
    }

    const title = interaction.options.getString('title');
    const description = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: 'StromMC' });

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Embedded message sent.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
