const { getData, getCalendarsData, getGamesData, getCategoriesData } = require("../../../data/utility/calendar.data.utility.js");

const games = [];
let categories = [];

/**
 * Gets the games listing contained within the Calendar Games data.
 * @returns {Array} Array containing game names.
 */
function getGames() {
  // store gamesData
  const gamesData = getGamesData();

  // populate games array with list of game names from data.json
  if (games.length === 0) {
    for (const game of getGamesData())
      games.push(game.game);
  } else if (games.length < gamesData.length) {
    // add new game that has been added
    gamesData.at(-1);
  }

  return games;
};

/**
 * Gets the categories listing contained within the Calendar data.
 * @returns {Array} Array containing categories.
 */
function getCategories() {
  if (categories.length === 0 || categories < getCategoriesData().length)
    categories = getCategoriesData();
  return categories;
}

module.exports = {
  getGames,
  getCategories
};