const {  } = require('./helpers/calendar.data.helper.js')
const { buildStringOptions } = require('./helpers/command.helper.js');
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { getData, getCalendarsData, getCategoriesData, getGamesData, saveData } = require('../../data/utility/calendar.data.utility.js');

const optionConfigs = [
  { name: "game", description: "Game", required: true, autocomplete: true },
  { name: "emoji", description: "Emoji", required: true, autocomplete: true }
];

let command = new SlashCommandBuilder()
    .setName('setemoji')
    .setDescription('Set emoji')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)

optionConfigs.forEach(optionConfig => { 
  command.addStringOption(buildStringOptions(optionConfig));
});

module.exports = {
  data: command,
  async execute(interaction) {
    const gameSearch = interaction.options.getString('game');
    const emoji = interaction.options.getString('emoji');
    let games = getGamesData();

    if (!games.includes(gameSearch)) {
      return interaction.reply({
        content: "Game is not registered.",
        flags: MessageFlags.Ephemeral
      });
    }
    
    let game = games.find(game => game.game.toLowerCase() === gameSearch.toLowerCase());
    game.emoji = emoji;

    saveData();
    await updateMessage(interaction.client);

    await interaction.reply({
      content: `Emoji set for ${game}`,
      flags: MessageFlags.Ephemeral
    });
  },
  // autocomplete
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();

    const choices = Object.keys(data.games);

    const filtered = choices.filter(choice =>
      choice.toLowerCase().includes(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map(choice => ({
        name: choice,
        value: choice
      }))
    );

  }
};