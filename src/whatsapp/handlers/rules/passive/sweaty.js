const { searchTriggers } = require("../../../../utils.js");
const { SWEATY_TRIGGERS } = require("../../../../config/config.js");

module.exports = async function sweaty(message) {
  if (message.fromMe) return;
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
  const content = message.body.toLowerCase().replace(specialCharsRegex, "");

  if (searchTriggers(content, SWEATY_TRIGGERS))
    message.trySendReactions(["👆", "🛁", "🥵"]);
};
