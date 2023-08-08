const { PRIVATE_GROUP_ID } = require("../../../config/config.js");

const {
  PermissionDeniedError,
  IncompleteOperationError,
  InvalidUsageError,
} = require("../../exceptions/exceptions.js");

module.exports = async function revelio(message) {
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
  return true;
};
