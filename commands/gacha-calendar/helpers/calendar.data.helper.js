const { getData, getData, getCalendarsData, getGamesData, getCategoriesData } = require('../../../data/utility/calendar.data.utility.js');

function getGames() {
  // populate games array with list of game names from data.json
  let games = [];

  for (const game of getGamesData()) {
    games.push(game.game);
  }

  return games;
}

function getCategories() {
  // populate categories array with list of unique categories from data.json
  let categories = [];

  for (const category of getCategoriesData()) {
    categories.push(category);
  }

  return categories;
}

module.exports = {
  getGames,
  getCategories
}