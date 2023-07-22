import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import handlersModule from "./handlers/handlers.js";
const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth({dataPath: "../../wwebjs/"}),
  webVersionCache: {path: "../../wwebjs/"},
  puppeteer: {
    headless: true,
    executablePath: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
  },
});

const handlers = handlersModule(client);

client.on("qr", async (qr) => {
  qrcode.generate(qr, { small: true });
  await client.pupPage.screenshot({ path: "../../wwebjs/qrCode.jpeg" });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message_create", async (message) => {
  // console.log(`chatId: ` + (await message.getChat()).id._serialized);  // Find chatId

  if (await handlers.sweaty(message)) return;

  if (!message.body.startsWith("!")) return;
  // From this point, only command messages

  if (await handlers.handle(message, handlers.revelio)) return;

  if (await handlers.handle(message, handlers.sticker)) return;

  if (await handlers.handle(message, handlers.nostalgia)) return;
});

export default client;
