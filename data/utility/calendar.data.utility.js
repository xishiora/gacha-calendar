const fs = require("node:fs");
const path = require("node:path");

let localData = { };

/**
 * Loads all of the bot's Gacha Calendar data
 */
function loadData() {
  // read calendar.data.json from root process directory in folder named data
  // this is only assumed to work as long as the server's file structure 
  // stays the same as the codebase's
  const rawData = fs.readFileSync(path.join(process.cwd(), "/data/calendar.data.json"));
  localData = Object.preventExtensions(JSON.parse(rawData));
}

/**
 * Gets all of the bot's Gacha Calendar data
 * @returns {object} containing data.
 */
function getData() {
  if (Object.keys(localData).length === 0) loadData();
  return localData;
}

/**
 * Gets the Gacha Calendar Spreadsheet URL.
 * @returns {string} string containing the Gacha Calendar Spreadsheet URL.
 */
function getCalendarSpreadsheetUrl() {
  if (Object.keys(localData).length === 0) loadData();
  return localData.calendarUrl;
}

/**
 * Gets the bot's Gacha Calendar data pertaining to which guilds it is in and what channel and message the calendar is at.
 * @returns {object} containing data.
 */
function getCalendarsData() {
  if (Object.keys(localData).length === 0) loadData();
  return localData.calendars;
}

/**
 * Gets the Gacha Calendar's category data.
 * @returns {Array} containing an array of games data.
 */
function getCategoriesData() {
  if (Object.keys(localData).length === 0) loadData();
  return localData.categories;
}

/**
 * Gets the Gacha Calendar's games data.
 * @returns {Array} containing an array of games data.
 */
function getGamesData() {
  if (Object.keys(localData).length === 0) loadData();
  return localData.games;
}

function saveData(data) {
  localData = data;
  fs.writeFileSync(path.join(process.cwd(), "/data/calendar.data.json"), JSON.stringify(localData, null, 2));
}

module.exports = {
  getData,
  getCalendarSpreadsheetUrl,
  getCalendarsData,
  getGamesData,
  getCategoriesData,
  saveData
};