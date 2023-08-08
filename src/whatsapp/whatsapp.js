const qrcode = require("qrcode-terminal");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");
const { Client, LocalAuth } = require("whatsapp-web.js");
const handlersModule = require("./handlers/handlers.js");
const { Message } = require("whatsapp-web.js");

/**
 * Adds a reaction to a message after a specified timeout.
 *
 * @param {Message} message - The message to which the reaction will be added.
 * @param {string|EmojiResolvable|ReactionEmoji} reaction - The reaction to be added. It can be an emoji string, a custom emoji object, or a ReactionEmoji object.
 * @param {number} [timeout=0] - The time in seconds to wait before adding the reaction. Defaults to 0, meaning no delay.
 * @returns {void}
 */
Message.prototype.trySendReaction = function sendReaction(
  reaction,
  timeout = 0
) {
  setTimeout(async () => {
    try {
      await this.react(reaction);
    } catch (e) {
      console.log("Could not react to message. " + e);
    }
  }, timeout * 1000);
};

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "../../wwebjs/" }),
  webVersionCache: { path: "../../wwebjs/" },
  puppeteer: {
    timeout: 6000,
    headless: true,
    executablePath: `/usr/bin/google-chrome-stable`,
  },
  ffmpegPath: ffmpeg.path,
});

client.on("qr", async (qr) => {
  qrcode.generate(qr, { small: true });
  await client.pupPage.screenshot({ path: "../../wwebjs/qrCode.jpeg" });
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message_create", async (message) => {
  // console.log(`chatId: ` + (await message.getChat()).id._serialized);  // Find chatId
  if (Date.now() / 1000 - message.timestamp > 30) return; // verify if message is new

  await handlersModule.handlers.sweaty(message);

  if (!message.body.startsWith("!")) return;
  // From this point, only command messages

  await handlersModule.handle(message);
});

console.log("Starting up bot...");
client.initialize();

module.exports = client;
