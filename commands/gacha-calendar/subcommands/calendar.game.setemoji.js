const { getGames } = require("../helpers/calendar.data.helper.js");
const { buildStringOptions, createGameChoices } = require("../helpers/command.helper.js");
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const { getData, getCalendarsData, getCategoriesData, getGamesData, saveData } = require("../../../data/utility/calendar.data.utility.js");

const optionConfigs = [
  { name: "game", description: "Game", required: true, choices: createGameChoices() },
  { name: "emoji", description: "Emoji", required: true, autocomplete: true }
];

const setEmojiSubcommand = new SlashCommandSubcommandBuilder()
  .setName("setemoji")
  .setDescription("Set Game Emoji");

optionConfigs.forEach(optionConfig => {
  setEmojiSubcommand.addStringOption(buildStringOptions(optionConfig));
});

async function executeSetEmojiSubcommand(interaction) {
  // do setemoji things
}

module.exports = {
  setEmojiSubcommand,
  executeSetEmojiSubcommand
};