const { getData, saveData } = require("../../data/utility/calendar.data.utility.js");
const { buildStringOptions, buildChannelOptions } = require("./helpers/command.helper.js");
const { handleCalendarEmbed } = require("./handlers/calendar.embed.handler.js");
const { SlashCommandBuilder, MessageFlags, ChannelType, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");

// import subcommand groups and subcommands
const { categorySubcommandGroup, executeCategorySubcommands } = require("./subcommands/calendar.category.js");
const { gameSubcommandGroup, executeGameSubcommands } = require("./subcommands/calendar.game.js");
const { setEmojiSubcommand, executeSetEmojiSubcommand } = require("./subcommands/calendar.game.setemoji.js");
const { timestampSubcommandGroup, executeTimestampSubcommands } = require("./subcommands/calendar.timestamp.js");

const channelOptionConfigs = [
  { name: "target", description: "Channel to display the Gacha Calendar in", required: false }
];

const calendarCommand = new SlashCommandBuilder()
  .setName("calendar")
  .setDescription("Calendar Command Group")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks);

const calendarSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("create")
    .setDescription("Create Gacha Calendar display in server."),
  new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove Gacha Calendar from current server.")
];

channelOptionConfigs.forEach(optionConfig => {
  calendarSubcommands.find(subcommand => subcommand.name === "create")
    .addChannelOption(buildChannelOptions(optionConfig));
});

function createCalendarCommand() {
  if (calendarSubcommands.length > 0) {
    calendarSubcommands.forEach(subcommand => {
      calendarCommand.addSubcommand(subcommand);
    });
  }

  calendarCommand.addSubcommandGroup(categorySubcommandGroup);

  return calendarCommand;
}

async function removeCalendar(interaction, subcommand = "remove") {
  const client = interaction.client;
  const guildId = interaction.guildId;
  const data = getData();
  const key = Object.keys(data.calendars.guilds).find(guild => data.calendars.guilds[guild].guildId === guildId);

  if (key !== undefined) {
    const guild = data.calendars.guilds[key];
    if (guild?.guildId === guildId) {
      try {
        // Fetch Guild Channel then fetch the message and delete
        const channel = await client.channels.fetch(`${guild?.channelId}`);
        const msg = await channel.messages.fetch(`${guild?.messageId}`);
        msg.delete();
      } catch (err) {
        if (err.code === 10003)
          console.log(`Channel ${guild?.channelId} in Guild ${guild?.guildId} no longer exists.`);
        else if (err.code === 10008)
          console.log(`Message ${guild?.channelId} in Channel ${guild?.channelId} @ Guild ${guild?.guildId} no longer exists.`);
        else
          console.error("An unexpected error has occurred: ", err);
      }
      // after message is deleted set channel and message IDs to null
      // then commit data to the local json file
      guild.channelId = null;
      guild.messageId = null;
      data.calendars.guilds[key] = guild;
      saveData(data);

      if (subcommand === "remove") {
        // reply to user that the calendar has been removed
        interaction.reply({
          content: "Gacha Calendar has been removed.",
          flags: [MessageFlags.Ephemeral]
        });
      }
    }
  } else {
    if (subcommand === "remove") {
      // reply to user that there is no calendar to remove in this server
      interaction.reply({
        content: "There is no Gacha Calendar to remove from this server.",
        flags: [MessageFlags.Ephemeral]
      });
    }
  }
}

module.exports = {
  data: createCalendarCommand(),
  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup();
    switch (group) {
      case "category":
        // found in subcommands/calendar.category.js
        executeCategorySubcommands(interaction);
        break;
      case "game":
        // found in subcommands/calendar.game.js
        break;
      default: {
        const client = interaction.client;
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
          case "create": {
            const guildId = interaction.guildId;
            // set channel id based on target channel id
            // if target not set, set to interaction channel id
            const channelId = interaction.options.getChannel("target") ?
              interaction.options.getChannel("target").id :
              interaction.channelId;
            removeCalendar(interaction, subcommand);
            handleCalendarEmbed(client, guildId, channelId, interaction);
            break;
          }
          case "remove":
            removeCalendar(interaction);
            break;
          case "setemoji":
            // do something
            break;
        }
      }
    }
  }
};