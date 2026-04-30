const { getGamesData, getCategoriesData } = require('./calendar.data.helper');
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
} = require('discord.js');

// create an object containing the games in the calendar
// this is used to populate the choices for the game option in the slash command
function createGameChoices() {
  let choices = [];
  for (const game of getGames())
    choices.push({ name: game, value: game });

  return choices;
}

function createCategoryChoices() {
  let choices = [];
  let categories = getCategories();
  for (const category in categories) {
    choices.push({ name: categories[category], value: category });
  }

  return choices;
}

function buildChannelOptions(optionConfig, channelTypes = ["text"]) {
  let option = new SlashCommandChannelOption();

  for (const option of optionConfig) {
    option[option] = optionConfig[option];

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
  let option = new SlashCommandStringOption();

  for (const option of optionConfig)
    option[option] = optionConfig[option];
  
  return option;
}

module.exports = {
  createGameChoices,
  createCategoryChoices,
  buildStringOptions,
  buildChannelOptions
};