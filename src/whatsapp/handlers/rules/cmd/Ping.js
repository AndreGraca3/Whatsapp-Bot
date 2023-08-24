const { formatTime } = require("../../../../utils");
const Handler = require("../../Handler");

class Ping extends Handler {
  constructor() {
    super();
    this.timeout = 5;
    this.commands = ["ping"];
  }

  async handle(message) {
    const ping = Date.now() - message.timestamp * 1000;

    const [contact, chat] = await Promise.all([
      message.getContact(),
      message.getChat(),
    ]);

    const template = getTemplate(
      ping,
      contact.name,
      chat.isGroup ? chat.name : undefined,
      message.deviceType
    );
    await message.reply(template);
  }
}

function getTemplate(ping, name, chatName, deviceType) {
  return `Pong! 🏓
  🟢 Online for ${formatTime(process.uptime())}
  📡 ${ping}ms
  🕒 ${new Date().toLocaleTimeString("pt-PT")}
  🙋‍♂️ ${name}${chatName ? `\n  👥 ${chatName}` : ""}
  📱 ${deviceType}`;
}

module.exports = new Ping();
