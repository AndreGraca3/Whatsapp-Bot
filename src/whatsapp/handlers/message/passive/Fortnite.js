const Handler = require("./Processor");
const { MessageMedia } = require("whatsapp-web.js");
const { promises } = require("fs");
const { fortniteMediaPath } = require("../../../../config/config.js");

let fortniteMedia;
promises.readdir(fortniteMediaPath).then((media) => {
  fortniteMedia = media; // change to sync version
});

class Fortnite extends Handler {
  constructor() {
    super(["fortnite", "fort"]);
  }

  async handle(message) {
    const randomMedia =
      fortniteMedia[Math.floor(Math.random() * fortniteMedia.length)];

    await message.replyWithReactions(
      MessageMedia.fromFilePath(`${fortniteMediaPath}/${randomMedia}`),
      getRandomEmojis(FORTNITE_EMOJIS, 1)
    );
  }
}

function getRandomEmojis(emojisArray, count) {
  const shuffledEmojis = [...emojisArray].sort(() => Math.random() - 0.5);
  return shuffledEmojis.slice(0, count);
}

const FORTNITE_EMOJIS = ["👋"];

module.exports = new Fortnite();
