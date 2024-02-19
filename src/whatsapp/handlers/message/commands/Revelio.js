const { PRIVATE_GROUP_ID } = require("../../../../config/config");
const {
  PermissionDeniedError,
  IncompleteOperationError,
  InvalidUsageError,
} = require("../../../exceptions/exceptions.js");
const Command = require("./Command.js");

class Revelio extends Command {
  constructor() {
    super("Reveal view once media");
  }

  async handle(message) {
    if (!message.hasQuotedMsg) throw new InvalidUsageError();
    const quotedMsg = await message.getQuotedMessage();
    if (!quotedMsg.hasMedia || !quotedMsg._data.isViewOnce)
      throw new InvalidUsageError();
    if (!message.fromMe && message.author != quotedMsg.author) throw new PermissionDeniedError();

    const media = await quotedMsg.downloadMedia();
    if (!media) throw new IncompleteOperationError();

    await message.replyWithReactions(
      media,
      ["✨"]
    );
  }
}

module.exports = {
  command: new Revelio(),
}
