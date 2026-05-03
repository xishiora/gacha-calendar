const { createGameChoices, createCategoryChoices, buildStringOptions } = require("../helpers/command.helper.js");
const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, MessageFlags } = require("discord.js");

const optionConfigs = [
  { name: "game", description: "Game Name", required: true, choices: createGameChoices() },
  { name: "version", description: "Game Version Number", required: true }
];

const gameSubcommandGroup = new SlashCommandSubcommandGroupBuilder()
  .setName("game")
  .setDescription("Game Options");

const gameSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a game to the Gacha Calendar"),
  new SlashCommandSubcommandBuilder()
    .setName("edit")
    .setDescription("Edit game details within the Gacha Calendar"),
  new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a game from the Gacha Calendar")
    .addStringOption(buildStringOptions(optionConfigs[0]))
];
optionConfigs.forEach(optionConfig => {
  gameSubcommands.forEach(subcommand => {
    if (subcommand.name !== "remove")
      subcommand.addStringOption(buildStringOptions(optionConfig));
  });
});

gameSubcommands.forEach(subcommand => {
  gameSubcommandGroup.addSubcommand(subcommand);
});

async function addGame(interaction) {
  
}

async function editGame(interaction) {

}

async function removeGame(interaction) {

}

async function executeGameSubcommands(interaction) {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "add":
      addGame(interaction);
      break;
    case "edit":
      editGame(interaction);
      break;
    case "remove":
      removeGame(interaction);
      break;
    default:
      interaction.reply({
        content: `Invalid subcommand: ${subcommand} of game has been attempted to be run.\nThis subcommand does not exist.`,
        flags: [MessageFlags.Ephemeral]
      });
  }
}

module.exports = {
  gameSubcommandGroup,
  executeGameSubcommandGroup
};