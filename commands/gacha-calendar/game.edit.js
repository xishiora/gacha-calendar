const { createGameChoices, createCategoryChoices, buildStringOption,  } = require('./helpers/command.helper.js');
const { SlashCommandBuilder } = require('discord.js');

const optionConfigs = [
  { name: "game", description: "Game Name", required: true, choices: createGameChoices() },
  { name: "version", description: "Game Version Number", required: true },
];

let command = new SlashCommandBuilder()
    .setName('remove-game')
    .setDescription('Edit a game to the calendar');

optionConfigs.forEach(optionConfig => { 
  command.addStringOption(buildStringOption(optionConfig));
});

module.exports = {
	data: command,
	async execute(interaction) {
    const game = interaction.options.getString('game');
		await interaction.reply(game);
	},
};