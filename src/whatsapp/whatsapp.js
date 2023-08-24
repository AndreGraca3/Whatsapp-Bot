const qrcode = require("qrcode-terminal");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");
const { Client, LocalAuth } = require("whatsapp-web.js");
const handlers = require("./handlers/handlers.js");
require("./reactions/senders.js")

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

  await handlers.handle(message);
});

handlers.initialize();
console.log("Starting up bot...");
client.initialize();

module.exports = client;
