const {
  PermissionDeniedError,
  IncompleteOperationError,
  InvalidUsageError,
} = require("../../../exceptions/exceptions.js");
const Command = require("./Command.js");

class Sticker extends Command {
  constructor() {
    super(
      "Create a sticker from media attached in the message or a quoted one"
    );
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

    await message.replyWithReactions(media, undefined, undefined, {
      sendMediaAsSticker: true,
      stickerAuthor: `Graca's Memes`,
      stickerName: "sticker encomendado",
    });
  }
}

module.exports = {
  command: new Sticker(),
};
