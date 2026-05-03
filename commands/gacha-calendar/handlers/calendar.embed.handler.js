const { getData, getCalendarSpreadsheetUrl, getCalendarsData, getGamesData, getCategoriesData, saveData } = require("../../../data/utility/calendar.data.utility.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");

async function sendNewEmbed(channel, data, gkey, embed, row) {
  const msg = await channel.send({
    embeds: [embed],
    components: [row]
  });

  data.calendars.guilds[gkey].messageId = `${msg.id}`;
  console.log(data.calendars.guilds[gkey].messageId);
  saveData(data);
}

// handle calendar embed
// whether inserting or updating the embed
async function handleCalendarEmbed(client, guildId, channelId = null, interaction = null) {
  const data = getData();
  const now = Math.floor(Date.now() / 1000);
  let gkey = Object.keys(data.calendars.guilds).find(guild => data.calendars.guilds[guild].guildId === guildId);
  if (gkey === undefined) {
    data.calendars.guilds.push({ guildId: `${guildId}`, channelId: channelId !== null ? `${channelId}` : null, messageId: null });
    gkey = data.calendars.guilds.length - 1;
  }

  const guild = data.calendars.guilds[gkey];
  if (guild?.guildId === guildId && (channelId ?? guild?.channelId) != null) {
    let channel;
    // when param channelId isn't null, set the new channel id to the guild data and fetch channel
    // when channelId is null and guild data's channelId isn't null, fetch the guild data's channel
    // otherwise i have no idea how we got this far, exit the calendar embed handler lmao
    if (channelId !== null) {
      data.calendars.guilds[gkey].channelId = `${channelId}`;
      channel = await client.channels.fetch(`${channelId}`);
    } else if (guild?.channelId !== null) {
      channel = await client.channels.fetch(`${guild?.channelId}`);
    } else {
      console.log("Calendar Embed Handler has somehow entered this far without a provided channel id, exiting Calendar Embed Handler.");
      return;
    }

    // Embed Builder
    const embed = new EmbedBuilder()
      .setTitle("📅 Gacha Calendar")
      .setColor(0x58c2ff)
      .setDescription(
        "- Times may be estimates until fully confirmed" +
        "\n- New patches usually go live ~1 hour earlier"
      )
      .setThumbnail("https://i.imgur.com/mb8uB0C.png");

    // Add Game Fields
    for (const [key, game] of Object.entries(data.games)) {
      const sortedTimestamps = [...game.timestamps].sort((a, b) => a.time - b.time);

      let value = "";

      if (sortedTimestamps.length === 0) {
        value = "*No entries yet*";
      } else {
        for (const timestamp of sortedTimestamps) {
          // Do not display timestamp when these conditions are met:
          // - Timestamp value is null
          // - Timestamp visibility is set to hidden
          // - Timestamp value is has been exceeded by current time
          if (timestamp.time === null || !timestamp.visible || timestamp.time < now) continue;

          // // When the timestamp category is Livestream
          // if (!data.categories[timestamp.category].includes("Livestream"))
          //   value += `**${game.version === "Unspecified" ? "Unspecified" : game.version + 0.1} ${data.categories[timestamp.category]}**`;
          // else
          //   value += `**${game.version === "Unspecified" ? "Unspecified" : game.version} ${data.categories[timestamp.category]}**`;

          value += `**${game.version === "Unspecified" ? "Unspecified" : game.version} ${data.categories[timestamp.category]}**`;

          // Phase 2 auto region times
          if (!data.categories[timestamp.category].includes("Phase 2")) {
            value += ` — <t:${timestamp.time}:f>\n`;
            continue;
          }

          value += `\n`;
          value += `- Asia Banner — <t:${timestamp.time}:f>\n`;
          value += `- Europe Banner — <t:${timestamp.time + (7 * 3600)}:f>\n`;
          value += `- America Banner — <t:${timestamp.time + (13 * 3600)}:f>\n`;
        }
      }

      embed.addFields({
        name: `${game.emoji || ""} __**${game.game}**__`,
        value: value,
        inline: false
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("📅 Gacha Calendar Spreadsheet")
        .setStyle(ButtonStyle.Link)
        .setURL(getCalendarSpreadsheetUrl())
    );

    try {
      if (data.calendars.guilds[gkey].messageId !== null) {
        const msg = await channel.messages.fetch(`${guild.messageId}`);
        await msg.edit({
          content: null,
          embeds: [embed],
          components: [row]
        });
      } else {
        console.log("Calendar Embed does not exist, creating new Calendar Embed.");
        sendNewEmbed(channel, data, gkey, embed, row);

        if (interaction !== null) {
          interaction.reply({
            content: "Gacha Calendar has been created.",
            flags: [MessageFlags.Ephemeral]
          });
        }
      }
    } catch (err) {
      if (err.code === 10008) {
        console.log("Previous Calendar Embed seems to have been deleted, creating new Calendar Embed.");
        sendNewEmbed(channel, data, gkey, embed, row);
      } else {
        console.error(err);
      }
    }
  }

  // for (const [gkey, guild] of Object.entries(data.calendars.guilds)) {
  //   if (guild?.guildId === guildId || (guild?.channelId ?? channelId) != null) {
  //     let channel;
  //     if (channelId !== null) {
  //       data.calendars.guilds[gkey].channelId = channelId;
  //       channel = await client.channels.fetch(channelId);
  //     } else {
  //       channel = await client.channels.fetch(guild.channelId);
  //     }

  //     // Embed Builder
  //     const embed = new EmbedBuilder()
  //       .setTitle("📅 Gacha Calendar")
  //       .setColor(0x58c2ff)
  //       .setDescription(
  //         "- Times may be estimates until fully confirmed" +
  //         "\n- New patches usually go live ~1 hour earlier"
  //       )
  //       .setThumbnail("https://i.imgur.com/mb8uB0C.png");

  //     // add game fields
  //     for (const [key, game] of Object.entries(data.games)) {
  //       const sortedTimestamps = [...game.timestamps].sort((a, b) => a.time - b.time);

  //       let value = "";

  //       if (sortedTimestamps.length === 0) {
  //         value = "*No entries yet*";
  //       } else {
  //         for (const timestamp of sortedTimestamps) {
  //           // Do not display timestamp when these conditions are met:
  //           // - Timestamp value is null
  //           // - Timestamp visibility is set to hidden
  //           // - Timestamp value is has been exceeded by current time
  //           if (timestamp.time === null || !timestamp.visible || timestamp.time < now) continue;

  //           // // When the timestamp category is Livestream
  //           // if (!data.categories[timestamp.category].includes("Livestream"))
  //           //   value += `**${game.version === "Unspecified" ? "Unspecified" : game.version + 0.1} ${data.categories[timestamp.category]}**`;
  //           // else
  //           //   value += `**${game.version === "Unspecified" ? "Unspecified" : game.version} ${data.categories[timestamp.category]}**`;

  //           value += `**${game.version === "Unspecified" ? "Unspecified" : game.version} ${data.categories[timestamp.category]}**`;

  //           // Phase 2 auto region times
  //           if (!data.categories[timestamp.category].includes("Phase 2")) {
  //             value += ` — <t:${timestamp.time}:f>\n`;
  //             continue;
  //           }

  //           value += `\n`;
  //           value += `- Asia Banner — <t:${timestamp.time}:f>\n`;
  //           value += `- Europe Banner — <t:${timestamp.time + (7 * 3600)}:f>\n`;
  //           value += `- America Banner — <t:${timestamp.time + (13 * 3600)}:f>\n`;
  //         }
  //       }

  //       embed.addFields({
  //         name: `${game.emoji || ""} __**${game.game}**__`,
  //         value: value,
  //         inline: false
  //       });
  //     }

  //     const row = new ActionRowBuilder().addComponents(
  //       new ButtonBuilder()
  //         .setLabel("📅 Gacha Calendar Spreadsheet")
  //         .setStyle(ButtonStyle.Link)
  //         .setURL(getCalendarSpreadsheetUrl())
  //     );

  //     try {
  //       if (data.calendars.guilds[gkey].messageId !== null) {
  //         const msg = await channel.messages.fetch(`${guild.messageId}`);

  //         await msg.edit({
  //           content: null,
  //           embeds: [embed],
  //           components: [row]
  //         });
  //       } else {
  //         console.log("Calendar Embed does not exist, creating new Calendar Embed.");
  //         const msg = await channel.send({
  //           embeds: [embed],
  //           components: [row]
  //         });

  //         data.calendars.guilds[gkey].messageId = msg.id;
  //         console.log(data.calendars.guilds[gkey].messageId);
  //         saveData(data);

  //         if (interaction !== null) {
  //           interaction.reply({
  //             content: "Gacha Calendar has been created.",
  //             flags: [MessageFlags.Ephemeral]
  //           });
  //         }
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }
}

module.exports = {
  handleCalendarEmbed
};