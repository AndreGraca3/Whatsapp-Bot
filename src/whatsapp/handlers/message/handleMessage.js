const { BOT_PREFIX } = require("../../../config/config");
const statsData = require("../../data/statsData");

// command handlers
const { command: nostalgia } = require("./commands/Nostalgia");
const { command: revelio } = require("./commands/Revelio");
const { command: sticker } = require("./commands/Sticker");
const { command: ping } = require("./commands/Ping");
const { Help } = require("./commands/Help");
const { Stats, command: stats } = require("./commands/Stats");
// passive handlers
const reactor = require("./passive/Reactor");
const vomit = require("./passive/Vomit");
const fortnite = require("./passive/Fortnite");

const passiveHandlers = {
  reactor,
  vomit,
  // fortnite,
};

const cmdHandlers = {
  sticker,
  revelio,
  ping,
  nostalgia,
  stats,
};

function initializeCommands() {
  if (BOT_PREFIX.length > 1) {
    throw new Error("Invalid BOT_PREFIX: must be a single character");
  }
  Object.assign(cmdHandlers, { help: new Help(cmdHandlers) });
}

async function handle(message) {
  const contact = await message.getContact();
  if (!contact.isMyContact && !message.fromMe) return; // don't allow messages from unknown contacts

  if (!message.body.startsWith(BOT_PREFIX)) {
    await Promise.all(
      Object.values(passiveHandlers).map((handler) => {
        if (handler.isTriggered(message)) return handler.handle(message);
      })
    );
    return;
  }
  // From this point, only command messages

  const splitBody = message.body.toLowerCase().split(" ");
  const handler = cmdHandlers[splitBody[0].substring(1)];
  if (!handler || handler.isSpam(message.author)) return;

  await message.trySendReaction("⌛");
  try {
    await handler.handle(message);
    await message.trySendReaction("✅");

    // store usage stats for all functional commands
    if (handler instanceof Stats || handler instanceof Help) return;
    await statsData.addUsage(
      contact.id._serialized,
      contact.pushname,
      handler.constructor.name
    );
  } catch (e) {
    console.error(e);
    await message.trySendReaction(e.symbol ?? "⚠️");
  }
}

initializeCommands();
module.exports = {
  handle,
};
