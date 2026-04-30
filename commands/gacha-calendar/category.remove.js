const { createGameChoices, createCategoryChoices, buildStringOption } = require('./helpers/command.helper.js');
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

const optionConfigs = [
  { name: "type", description: "Livestream / Patch / Phase 2 etc", required: true },
];

let command = new SlashCommandBuilder()
    .setName('remove-category')
    .setDescription('Remove Timestamp Category');

optionConfigs.forEach(optionConfig => { 
  command.addStringOption(buildStringOption(optionConfig));
});

module.exports = {
	data: command,
	async execute(interaction) {
		await interaction.reply('Executing remove-category command!');
	},
};