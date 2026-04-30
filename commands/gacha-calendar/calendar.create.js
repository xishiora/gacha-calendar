const { buildStringOptions, buildChannelOptions } = require('./helpers/command.helper.js');
const { SlashCommandBuilder, MessageFlags, ChannelType, PermissionFlagsBits } = require('discord.js');

let channelOptionConfigs = [
  { name: "target", description: "Channel to display the Gacha Calendar in", required: true }
];

let command = new SlashCommandBuilder()
    .setName('create-calendar')
    .setDescription('Create Gacha Calendar display in server!')
//     .addChannelOption(
//       o => o
//         .setName('target')
//         .setDescription('Channel to display the Gacha Calendar in.')
//         .setRequired(true)
//         .addChannelTypes(ChannelType.GuildText)
// );

channelOptionConfigs.forEach(optionConfig => { 
  // buildChannelOptions not fully implemented don't know if it will work
  command.addChannelOption(buildChannelOptions(optionConfig));
});

module.exports = {
	data: command,
	async execute(interaction) {
    const guildId = interaction.guildId;
    const channelId = interaction.options.getString('target');
		await interaction.reply('Executing create calendar command!');
	},
};