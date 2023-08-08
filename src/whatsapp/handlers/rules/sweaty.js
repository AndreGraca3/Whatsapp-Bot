const { searchTriggers } = require("../../../utils.js");
const { SWEATY_TRIGGERS } = require("../../../config/config.js")

module.exports = async function sweaty(message) {
  if (message.fromMe) return;
  if (
    searchTriggers(message.body.toLowerCase(), SWEATY_TRIGGERS) ||
    (message.hasQuotedMsg &&
      searchTriggers(
        (await message.getQuotedMessage()).body.toLowerCase(),
        SWEATY_TRIGGERS
      ))
  ) {
    sendReaction(message, "👆");
    sendReaction(message, "🛁", 2);
    sendReaction(message, "🥵", 4);
  }
};
