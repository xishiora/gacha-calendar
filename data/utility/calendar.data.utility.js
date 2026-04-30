const fs = require('node:fs');
const path = require('node:path');

function getData() {
  const raw_data = fs.readFileSync(path.join(process.cwd(), '/data/calendar.data.json'));
  const data = JSON.parse(raw_data);
  return data;
}

function getCalendarsData() {
  return getData().calendars;
}

function getGamesData() {
  return getData().games;
}

function getCategoriesData() {
  return getData().categories;
}

module.exports = {
  getData,
  getCalendarsData,
  getGamesData,
  getCategoriesData
}