const { createGameChoices, createCategoryChoices, buildStringOption } = require("./helpers/command.helper.js");
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");

// there could be room for adding a version number override for specific timestamps on a game
// however this is still to be implemented and tested
const optionConfigs = [
  { name: "game", description: "Game name", required: true, choices: createGameChoices() },
  { name: "category", description: "Livestream / Patch / Phase 2, etc.", required: true, choices: createCategoryChoices() },
  { name: "time", description: "<t:unix:F> OR unix timestamp", required: true }
];

const command = new SlashCommandBuilder()
  .setName("add-timestamp")
  .setDescription("Add new banner/event");

optionConfigs.forEach(optionConfig => {
  command.addStringOption(buildStringOption(optionConfig));
});

module.exports = {
  data: command,
  async execute(interaction) {
    const category = interaction.options.getString("category");
    await interaction.reply(category);
  }
};