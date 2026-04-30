function parseTimestamp(input) {
  if (!input) return null;

  const match = input.match(/<t:(\d+):?[A-Za-z]?>/);
  if (match) return Number(discordMatch[1]);

  if (/^\d+$/.test(input)) return Number(input);

  // return unix time
  return Math.floor(new Date(input).getTime() / 1000);
}

module.exports = {
  parseTimestamp
};