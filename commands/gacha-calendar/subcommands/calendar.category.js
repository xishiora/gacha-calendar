const { createGameChoices, createCategoryChoices, buildStringOptions } = require("../helpers/command.helper.js");
const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");

const optionConfigs = [
  { name: "type", description: "Livestream / Patch / Phase 2 etc", required: true }
];

const categorySubcommandGroup = new SlashCommandSubcommandGroupBuilder()
  .setName("category")
  .setDescription("Category Options");

const categorySubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a new timestamp category for the Gacha Calendar"),
  new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a timestamp category for the Gacha Calendar")
];

optionConfigs.forEach(optionConfig => {
  categorySubcommands.forEach(subcommand => {
    subcommand.addStringOption(buildStringOptions(optionConfig));
  });
});

categorySubcommands.forEach(subcommand => {
  categorySubcommandGroup.addSubcommand(subcommand);
});

async function addCategory(interaction) {

}

async function removeCategory(interaction) {

}

async function executeCategorySubcommands(interaction) {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "add":
      addCategory(interaction);
      break;
    case "remove":
      removeCategory(interaction);
      break;
    default:
      interaction.reply({
        content: `Invalid subcommand: ${subcommand} of category has been attempted to be run.\nThis subcommand does not exist.`,
        flags: [MessageFlags.Ephemeral]
      });
  }
}

module.exports = {
  categorySubcommandGroup,
  executeCategorySubcommands
};