const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

let command = new SlashCommandBuilder()
    .setName('remove-calendar')
    .setDescription('Remove Calendar')
    .addBooleanOption(
      o => o.setName('confirm-deletion')
        .setDescription('Remove Calendar? Y/N')
        .setRequired(true)
      )

module.exports = {
	data: command,
	async execute(interaction) {
		await interaction.reply('Executing remove calendar command!');
	},
};