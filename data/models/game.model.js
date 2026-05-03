const { getCategoriesData } = require("../utility/calendar.data.utility");

const gameModel = {
  game: null,
  emoji: "",
  version: null,
  timestamps: []
};

const timestampModel = {
  category: 0,
  time: null,
  banner: "",
  visible: true,
  version_override: null
};

function createGame(gameName, version = null, emoji = "", timestamps = null) {
  const game = gameModel;
  game.game = gameName;
  game.emoji = emoji;
  game.version = version;
  if (timestamps === null) {
    getCategoriesData().forEach((category, index) => {
      const timestamp = timestampModel;
      timestamp.category = index;
      game.timestamps.push(timestamp);
    });
  }
  return game;
}

module.exports = {
  createGame
};