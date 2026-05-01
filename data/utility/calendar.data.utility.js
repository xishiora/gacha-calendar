const fs = require("node:fs");
const path = require("node:path");

/**
 * Gets all of the bot's Gacha Calendar data
 * @returns {object} containing data.
 */
function getData() {
  // read calendar.data.json from root process directory in folder named data
  // this is only assumed to work as long as the server's file structure 
  // stays the same as the codebase's
  const raw_data = fs.readFileSync(path.join(process.cwd(), "/data/calendar.data.json"));
  const data = JSON.parse(raw_data);
  return data;
}

/**
 * Gets the bot's Gacha Calendar data pertaining to which guilds it is in and what channel and message the calendar is at.
 * @returns {object} containing data.
 */
function getCalendarsData() {
  return getData().calendars;
}

/**
 * Gets the Gacha Calendar's games data.
 * @returns {Array} containing an array of games data.
 */
function getGamesData() {
  return getData().games;
}

/**
 * Gets the Gacha Calendar's category data.
 * @returns {Array} containing an array of games data.
 */
function getCategoriesData() {
  return getData().categories;
}

module.exports = {
  getData,
  getCalendarsData,
  getGamesData,
  getCategoriesData
};