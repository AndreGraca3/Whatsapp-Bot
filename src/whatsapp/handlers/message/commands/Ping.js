const { timeSince } = require("../../../../utils");
const Command = require("./Command");

class Ping extends Command {
  constructor() {
    super("Show bot status");
    this.timeout = 5000;
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
    await message.replyWithReactions(template);
  }
}

function getTemplate(ping, name, chatName, deviceType) {
  return `Pong! 🏓
  🟢 Online for ${timeSince(process.uptime())}
  📡 ${ping}ms
  🕒 ${new Date().toLocaleTimeString("pt-PT")}
  🙋‍♂️ ${name}${chatName ? `\n  👥 ${chatName}` : ""}
  📱 ${deviceType}`;
}

module.exports = {
  command: new Ping(),
}
