const fs = require('node:fs');
const path = require('node:path');

/**
 * Gets all of the bot's Gacha Calendar data
 * @returns {object} containing data.
 */
function getData() {
  const raw_data = fs.readFileSync(path.join(process.cwd(), '/data/calendar.data.json'));
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
 * @returns {Array} containing data.
 */
function getGamesData() {
  return getData().games;
}

/**
 * Gets the Gacha Calendar's category data.
 * @returns {Array} containing data.
 */
function getCategoriesData() {
  return getData().categories;
}

module.exports = {
  getData,
  getCalendarsData,
  getGamesData,
  getCategoriesData
}