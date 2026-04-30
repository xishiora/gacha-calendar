const { createGameChoices, createCategoryChoices, buildStringOption,  } = require('./helpers/command.helper.js');
const { SlashCommandBuilder } = require('discord.js');

const optionConfigs = [
  { name: "game", description: "Game Name", required: true, choices: createGameChoices() },
];

let command = new SlashCommandBuilder()
    .setName('add-game')
    .setDescription('Add a game to the calendar');

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