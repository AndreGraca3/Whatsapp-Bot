module.exports = async function ping(message) {
  const ping = Date.now() - message.timestamp * 1000;

  const [contact, chat] = await Promise.all([
    message.getContact(),
    message.getChat(),
  ]);

  await message.reply(getTemplate(ping, contact.name, chat.name));
};

function getTemplate(ping, name, chatName) {
  return `Pong!🏓
  🟢 Bot is online
  📡 ${ping}ms
  🕒 ${new Date().toLocaleTimeString("pt-PT")}
  🙋‍♂️ ${name}
  👥 ${chatName}`;
}
