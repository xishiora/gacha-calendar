const { createGameChoices, createCategoryChoices, buildStringOptions } = require("../helpers/command.helper.js");
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } = require("discord.js");

// there could be room for adding a version number override for specific timestamps on a game
// however this is still to be implemented and tested
const optionConfigs = [
  { name: "game", description: "Game name", required: true, choices: createGameChoices() },
  { name: "category", description: "Livestream / Patch / Phase 2, etc.", required: true, choices: createCategoryChoices() },
  { name: "time", description: "<t:unix:F> OR Unix Timestamp", required: true },
  { name: "label", description: "Banner/Event for this Timestamp (Optional)", required: false }
  // { name: "visibility", description: "Timestamp Visibility", required: false, choices: [{ name: "Displayed", value: true }, { name: "Hidden", value: false }] }
];

const timestampSubcommandGroup = new SlashCommandSubcommandGroupBuilder()
  .setName("timestamp")
  .setDescription("Timestamp Options");

const timestampSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a new banner/event timestamp"),
  new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a banner/event timestamp"),
  new SlashCommandSubcommandBuilder()
    .setName("visibility")
    .setDescription("Set Calendar Timestamp Visibility")
];

optionConfigs.forEach(optionConfig => {
  timestampSubcommands.forEach(subcommand => {
    subcommand.addStringOption(buildStringOptions(optionConfig));
  });
});

timestampSubcommands.forEach(subcommand => {
  timestampSubcommandGroup.addSubcommand(subcommand);
});

async function addTimestamp(interaction) {

}

async function removeTimestamp(interaction) {

}

async function setTimestampVisibility(interaction) {

}

async function executeTimestampSubcommands(interaction) {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "add":
      addTimestamp(interaction);
      break;
    case "remove":
      removeTimestamp(interaction);
      break;
    case "visibility":
      // execute visibility
      break;
    default:
      interaction.reply({
        content: `Invalid subcommand: ${subcommand} of game has been attempted to be run.\nThis subcommand does not exist.`,
        flags: [MessageFlags.Ephemeral]
      });
  }
}


module.exports = {
  timestampSubcommandGroup,
  executeTimestampSubcommandGroup
};