const { getData, getCalendarsData, getGamesData, getCategoriesData } = require("../../../data/utility/calendar.data.utility.js");

const games = [];
let categories = [];

/**
 * Gets the games listing contained within the Calendar Games data.
 * @returns {Array} Array containing game names.
 */
function getGames() {
  // store games data
  const gamesData = getGamesData();

  // populate games array with list of game names from data.json
  if (games.length === 0 || games.length > gamesData.length) {
    for (const game of getGamesData())
      games.push(game.game);
  } else if (games.length === gamesData.length - 1) {
    // add new game that has been added
    games.push(gamesData.at(-1).game);
  }

  return games;
};

/**
 * Gets the categories listing contained within the Calendar data.
 * @returns {Array} Array containing categories.
 */
function getCategories() {
  const categoriesData = getCategoriesData();
  if (categories.length === 0 || categories < categoriesData.length)
    categories = getCategoriesData();
  return categories;
}

module.exports = {
  getGames,
  getCategories
};