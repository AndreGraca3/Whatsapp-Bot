const { searchTriggers } = require("../../../../utils.js");

const processors = {
  sweaty: require("./processors/sweaty/Sweaty.js"),
  fortnite: require("./processors/fortnite/Fortnite.js"),
};

module.exports = async function reactPattern(message) {
  if (message.fromMe) return;
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
  const content = message.body.toLowerCase().replace(specialCharsRegex, "");

  for (const processor of Object.values(processors)) {
    if (searchTriggers(content, processor.commands)) {
      if (processor.isSpam(message.author)) return;
      await processor.handle(message);
      return;
    }
  }
};
