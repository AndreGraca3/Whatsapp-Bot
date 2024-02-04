const qrcode = require("qrcode-terminal");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");
const { Client, LocalAuth } = require("whatsapp-web.js");
const messageHandlers = require("./handlers/message/handleMessage.js");
require("./senders.js");
// const ReactionQueue = require("./senders.js");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./wwebjs/" }),
  webVersionCache: { path: "./wwebjs/" },
  puppeteer: {
    timeout: 6000,
    headless: true,
    executablePath: `/usr/bin/google-chrome-stable`,
    args: ["--no-sandbox"],
  },
  ffmpegPath: ffmpeg.path,
});

client.on("qr", async (qr) => {
  qrcode.generate(qr, { small: true });
  await client.pupPage.screenshot({ path: "./wwebjs/qrCode.jpeg" });
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message_create", async (message) => {
  // console.log(`chatId: ` + (await message.getChat()).id._serialized);  // Find chatId
  if (Date.now() / 1000 - message.timestamp > 30) return; // verify if message is new
  // message.reactionQueue = new ReactionQueue(message);
  await messageHandlers.handle(message);
  // delete message.reactionQueue;
});

client.on("message_reaction", async (reaction) => {
  // watch out for possible colisions with message_create (bot sends a message and then reacts to it then reaction handler is called)
});

module.exports = client;
