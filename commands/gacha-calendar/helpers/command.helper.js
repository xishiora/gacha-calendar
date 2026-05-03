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

/**
 * Creates an Object Array containing the game choices for /slash commands
 * @returns {Array} Object array with game choices.
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

  for (const [key, value] of Object.entries(optionConfig)) {
    option[key] = value;

    // not fully implemented don't know if it will work
    channelTypes.forEach(channelType => {
      option.channel_types?.push(ChannelType.find(
        c => c.constructor.name.toLowerCase().includes(channelType.toLowerCase())
      ));
    });
  }
  
  return option;
}

function buildStringOptions(optionConfig) {
  const option = new SlashCommandStringOption();

  for (const [key, value] of Object.entries(optionConfig))
    option[key] = value;
  
  return option;
}

module.exports = {
  createGameChoices,
  createCategoryChoices,
  buildStringOptions,
  buildChannelOptions
};