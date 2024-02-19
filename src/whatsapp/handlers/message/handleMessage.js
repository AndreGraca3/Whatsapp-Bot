const yargs = require("yargs");
const { BOT_PREFIX } = require("../../../config/config");
const statsData = require("../../data/statsData");

// command handlers
const { command: nostalgia } = require("./commands/Nostalgia");
const { command: revelio } = require("./commands/Revelio");
const { command: sticker } = require("./commands/Sticker");
const { command: ping } = require("./commands/Ping");
const { command: imagine } = require("./commands/Imagine");
const { Help } = require("./commands/Help");
const { Stats, command: stats } = require("./commands/Stats");
// passive handlers
const reactor = require("./passive/Reactor");
const vomit = require("./passive/Vomit");

const passiveHandlers = {
  reactor,
  vomit,
};

const cmdHandlers = {
  sticker,
  imagine,
  revelio,
  ping,
  nostalgia,
  stats,
};

const cmdProcessor = yargs
  .scriptName("") // Removes the script name from usage output
  .version(false)
  .usage("Usage: <command> [options]")
  .help(false);

function initializeCommands() {
  if (BOT_PREFIX.length > 1) {
    throw new Error("Invalid BOT_PREFIX: must be a single character");
  }
  // register commands to yargs
  Object.values(cmdHandlers)
    .map((handler) => ({
      command: BOT_PREFIX + handler.constructor.name.toLowerCase(),
      describe: handler.description,
      builder: (yargs) => {
        yargs.option("help", {
          alias: "h",
          description: "Show help",
          type: "boolean",
        });
        if (handler.options) {
          Object.entries(handler.options).forEach(([key, value]) => {
            yargs.option(key, value);
          });
        }
      },
    }))
    .forEach((command) => {
      cmdProcessor.command(command);
    });
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
  const commandName = splitBody[0].substring(1);
  const handler = cmdHandlers[commandName];
  if (!handler || handler.isSpam(message.author)) return;

  await message.trySendReaction("⌛");
  const args = cmdProcessor.parse(splitBody);
  try {
    if (args.help)
      await message.replyWithReactions(await cmdProcessor.getHelp());
    else await handler.handle(message, args);
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
