const nostalgia = require("./rules/cmd/Nostalgia");
const revelio = require("./rules/cmd/Revelio");
const sticker = require("./rules/cmd/Sticker");
const reactPattern = require("./rules/passive/reactPattern");
const ping = require("./rules/cmd/Ping");
const { BOT_PREFIX } = require("../../config/config");

const passiveHandlers = {
  reactPattern,
};

let cmdHandlers = {
  sticker,
  revelio,
  revelio,
  nostalgia,
  ping,
};

function initialize() {
  console.log("Initializing handlers");
  const handlers = {};
  for (const handler in cmdHandlers) {
    cmdHandlers[handler].commands.forEach((cmd) => {
      handlers[cmd] = cmdHandlers[handler];
    });
  }
  cmdHandlers = handlers;
}

async function handle(message) {
  Object.values(passiveHandlers).forEach(async (handler) => {
    await handler(message);
  });

  if (!message.body.startsWith(BOT_PREFIX)) return;
  // From this point, only command messages

  const splitBody = message.body.split(" ");
  const handler = cmdHandlers[splitBody[0].substring(1)];
  if (!handler || handler.isSpam(message.author)) return;

  message.queueReaction("⌛");
  try {
    await handler.handle(message);
    message.queueReaction("✅");
  } catch (e) {
    console.log(e.message);
    message.queueReaction(e.symbol ?? "⚠️");
  }
}

module.exports = {
  initialize,
  handle,
};
