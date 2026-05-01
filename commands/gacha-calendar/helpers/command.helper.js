const { getGames, getCategories } = require("./calendar.data.helper");
const {
  ChannelType,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandNumberOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
  PermissionFlagsBits
} = require("discord.js");

// create an object containing the games in the calendar
// this is used to populate the choices for the game option in the slash command

/**
 * Creates an array containing the game choices for a /slash command
 * @returns {Array} choices.
 */
function createGameChoices() {
  const choices = [];
  for (const game of getGames())
    choices.push({ name: game, value: game });

  return choices;
}

function createCategoryChoices() {
  const choices = [];
  const categories = getCategories();
  for (const category in categories)
    choices.push({ name: categories[category], value: category });

  return choices;
}

function buildChannelOptions(optionConfig, channelTypes = ["text"]) {
  const option = new SlashCommandChannelOption();

  for (const opt of optionConfig) {
    option[opt] = optionConfig[opt];

    // not fully implemented don't know if it will work
    channelTypes.forEach(channelType => {
      option.channel_types.push(ChannelType.find(
        c => c.constructor.name.toLowerCase().includes(channelType.toLowerCase())
      ));
    });
  }
  
  return option;
}

function buildStringOptions(optionConfig) {
  const option = new SlashCommandStringOption();

  for (const opt of optionConfig)
    option[opt] = optionConfig[opt];
  
  return option;
}

module.exports = {
  createGameChoices,
  createCategoryChoices,
  buildStringOptions,
  buildChannelOptions
};