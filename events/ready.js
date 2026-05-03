const { Events } = require("discord.js");
const { handleCalendarEmbed } = require("../commands/gacha-calendar/handlers/calendar.embed.handler.js");

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log("Attempting to instantiate or update all Calendar Embeds that have been set.");
    client.guilds.cache.forEach(guild => {
      handleCalendarEmbed(client, guild.id);
      setInterval(async () => {
        try {
          handleCalendarEmbed(client, guild.id);
          // Sleep for a short duration between each server to avoid limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error("Failed to edit message:", error);
        }
      }, 3600000);
    });
  }
};