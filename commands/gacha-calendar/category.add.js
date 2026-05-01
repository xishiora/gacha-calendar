const { createGameChoices, createCategoryChoices, buildStringOptions } = require("./helpers/command.helper.js");
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");

const optionConfigs = [
  { name: "type", description: "Livestream / Patch / Phase 2 etc", required: true }
];

const command = new SlashCommandBuilder()
  .setName("add-category")
  .setDescription("Add a new Timestamp Category");

optionConfigs.forEach(optionConfig => {
  command.addStringOption(buildStringOptions(optionConfig));
});

module.exports = {
  data: command,
  async execute(interaction) {
    await interaction.reply("Executing add-category command!");
  }
};