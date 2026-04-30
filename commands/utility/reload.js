const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption(
      o => o
        .setName('command')
        .setDescription('The command to reload.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const commandName = interaction.options.getString('command');
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(`There is no command with name \`${commandName}\`!`);
    }

    // Remove the command from the cache and reload it
    delete require.cache[require.resolve(`./${command.data.name}.js`)];
    // Try to reload the command and catch any errors that occur during reloading
    try {
      // Require the new command file and set it in the commands collection
      const newCommand = require(`./${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);

      // Reply with success message if command was reloaded successfully
      await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
    } catch (err) {
      console.error(err);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${err.message}\``,
      );
    }
  },
};