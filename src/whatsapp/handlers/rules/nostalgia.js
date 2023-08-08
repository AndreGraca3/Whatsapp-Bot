const {
  NOSTALGIA_GROUP_ID,
  nostalgicMediaPath,
} = require("../../../config/config.js");
const { MessageMedia } = require("whatsapp-web.js");
const { promises } = require("fs");

module.exports = async function nostalgia(message) {
  if (!message.fromMe && message.from != NOSTALGIA_GROUP_ID) return;
  const nostalicMedia = await promises.readdir(nostalgicMediaPath);
  const randomMedia =
    nostalicMedia[Math.floor(Math.random() * nostalicMedia.length)];

  const media = MessageMedia.fromFilePath(nostalgicMediaPath + randomMedia);

  await message.reply(media, undefined, { caption: "🕓" });
  return true;
};
