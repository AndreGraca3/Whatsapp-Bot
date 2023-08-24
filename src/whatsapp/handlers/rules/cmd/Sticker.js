const {
  PermissionDeniedError,
  IncompleteOperationError,
  InvalidUsageError,
} = require("../../../exceptions/exceptions.js");
const Handler = require("../../Handler");

class Sticker extends Handler {
  constructor() {
    super();
    this.commands = ["sticker"];
  }

  async handle(message) {
    let media;
    if (message.hasMedia) media = await message.downloadMedia();
    else if (message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg.hasMedia) throw new InvalidUsageError();
      if (quotedMsg._data.isViewOnce && !message.fromMe)
        throw new PermissionDeniedError();
      media = await quotedMsg.downloadMedia();
    } else throw new InvalidUsageError();

    if (!media) throw new IncompleteOperationError();

    await message.reply(media, undefined, {
      sendMediaAsSticker: true,
      stickerAuthor: `Graca's Memes`,
      stickerName: "sticker encomendado",
    });
  }
}

module.exports = new Sticker();
