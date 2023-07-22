import pkg from "../exceptions/exceptions.js";
import config from "../../config/config.js";
import { searchTriggers } from "../../utils.js";
import whatsappModule from "whatsapp-web.js";
import { promises } from "fs";

const { PermissionDeniedError, IncompleteOperationError, InvalidUsageError } =
  pkg;

const { MessageMedia } = whatsappModule;

const { SWEATY_TRIGGERS, NOSTALGIA_GROUP_ID, nostalgicMediaPath } = config;

export default function handlers(client) {
  /**
   * Adds a reaction to a message after a specified timeout.
   *
   * @param {Message} message - The message to which the reaction will be added.
   * @param {string|EmojiResolvable|ReactionEmoji} reaction - The reaction to be added. It can be an emoji string, a custom emoji object, or a ReactionEmoji object.
   * @param {number} [timeout=0] - The time in seconds to wait before adding the reaction. Defaults to 0, meaning no delay.
   * @returns {void}
   */
  function sendReaction(message, reaction, timeout = 0) {
    setTimeout(async () => {
      try {
        await message.react(reaction);
      } catch (e) {
        console.log("Could not react to message.");
      }
    }, timeout * 1000);
  }

  async function revelio(message) {
    if (message.body !== "!revelio" || !message.hasQuotedMsg) return;

    const quotedMsg = await message.getQuotedMessage();
    if (!quotedMsg.hasMedia) throw new InvalidUsageError();
    if (!message.fromMe) throw new PermissionDeniedError();

    const media = await quotedMsg.downloadMedia();
    if (!media) throw new IncompleteOperationError();

    await message.reply(media);
    return true;
  }

  async function sticker(message) {
    if (message.body !== "!sticker") return;

    let media;
    if (message.hasMedia) media = await message.downloadMedia();
    else if (message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg.hasMedia) throw new InvalidUsageError();
      media = await quotedMsg.downloadMedia();
    } else throw new InvalidUsageError();

    if (!media) throw new IncompleteOperationError();

    await message.reply(media, undefined, {
      sendMediaAsSticker: true,
      stickerAuthor: `Graca's Memes`,
      stickerName: "sticker encomendado",
    });
    return true;
  }

  async function sweaty(message) {
    if (
      searchTriggers(message.body.toLowerCase(), SWEATY_TRIGGERS) ||
      (message.hasQuotedMsg &&
        searchTriggers(
          (await message.getQuotedMessage()).body.toLowerCase(),
          SWEATY_TRIGGERS
        ))
    ) {
      sendReaction(message, "👆");
      sendReaction(message, "🛁", 2);
      sendReaction(message, "🥵", 4);
      return true;
    }
  }

  async function nostalgia(message) {
    if (message.body !== "!nostalgia") return;

    const nostalicMedia = await promises.readdir(nostalgicMediaPath);
    const randomMedia =
      nostalicMedia[Math.floor(Math.random() * nostalicMedia.length)];

    const media = MessageMedia.fromFilePath(nostalgicMediaPath + randomMedia);

    await message.reply(media, undefined, { caption: "⌛" });
    return true;
  }

  /**
   *
   * Dont use this if your handler reacts to message;
   * @param {Message} message - message received
   * @param {function} handler - handler to be executed
   * @returns true if handler was fired, false otherwise
   */
  async function handle(message, handler) {
    try {
      const res = await handler(message);
      sendReaction(message, "✅");
      return res;
    } catch (e) {
      console.log(e.message);
      sendReaction(message, e.symbol, 2);
    }
  }

  return {
    revelio,
    sticker,
    sweaty,
    nostalgia,
    sendReaction,
    handle,
  };
}
