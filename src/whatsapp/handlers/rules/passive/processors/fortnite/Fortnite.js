const Handler = require("../../../../Handler");
const { MessageMedia } = require("whatsapp-web.js");
const { promises } = require("fs");
const { fortniteMediaPath } = require("../../../../../../config/config.js");

class Fortnite extends Handler {
  constructor() {
    super();
    this.commands = ["fortnite", "fort"];
    this.timeout = 10;
  }

  async handle(message) {
    const randomEmojis = getRandomEmojis(FORTNITE_EMOJIS, 2);
    
    const fortniteMedia = await promises.readdir(fortniteMediaPath);
    const randomMedia =
      fortniteMedia[Math.floor(Math.random() * fortniteMedia.length)];

    const audioMsg = await message.sendReactedMessage(
      MessageMedia.fromFilePath(`${fortniteMediaPath}/${randomMedia}`),
      ["⏮️"].concat(randomEmojis)
    );
  }
}

function getRandomEmojis(emojisArray, count) {
  const shuffledEmojis = [...emojisArray].sort(() => Math.random() - 0.5);
  return shuffledEmojis.slice(0, count);
}

const FORTNITE_EMOJIS = ["🕒", "✨", "🎮", "🎉", "❤️", "🙌"];

module.exports = new Fortnite();
