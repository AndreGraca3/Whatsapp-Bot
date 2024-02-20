const {
  NOSTALGIA_GROUP_ID,
  nostalgicMediaPath,
} = require("../../../../config/config.js");
const { MessageMedia } = require("whatsapp-web.js");
const { promises } = require("fs");
const Command = require("./Command.js");
const { InvalidUsageError } = require("../../../exceptions/exceptions.js");

class Nostalgia extends Command {
  constructor() {
    super("Send nostalgic media (only in nostalgia group)");
  }

  async handle(message) {
    if (!message.fromMe && message.from != NOSTALGIA_GROUP_ID) throw new InvalidUsageError()

    const nostalicMedia = await promises.readdir(nostalgicMediaPath);
    const randomMedia =
      nostalicMedia[Math.floor(Math.random() * nostalicMedia.length)];

    const media = MessageMedia.fromFilePath(
      `${nostalgicMediaPath}/${randomMedia}`
    );

    await message.replyWithReactions(media, ["🕓"]);
  }
}

module.exports = {
  command: new Nostalgia(),
};