const { PRIVATE_GROUP_ID } = require("../../../../config/config");
const {
  PermissionDeniedError,
  IncompleteOperationError,
  InvalidUsageError,
} = require("../../../exceptions/exceptions.js");
const Handler = require("../../Handler");

class Revelio extends Handler {
  constructor() {
    super();
    this.commands = ["revelio", "pvtrevelio"];
  }

  async handle(message) {
    const quotedMsg = await message.getQuotedMessage();
    if (!quotedMsg.hasMedia || !quotedMsg._data.isViewOnce)
      throw new InvalidUsageError();
    if (!message.fromMe) throw new PermissionDeniedError();

    const media = await quotedMsg.downloadMedia();
    if (!media) throw new IncompleteOperationError();

    await message.reply(
      media,
      message.body === "!revelio" ? undefined : PRIVATE_GROUP_ID,
      { caption: "✨" }
    );
  }
}

module.exports = new Revelio();
