const isSpam = require("./antiSpam");
const nostalgia = require("./rules/nostalgia");
const revelio = require("./rules/revelio");
const sticker = require("./rules/sticker");
const sweaty = require("./rules/sweaty");
const ping = require("./rules/ping");

const handlers = {
  sweaty,
};

const cmdHandlers = {
  "!sticker": sticker,
  "!revelio": revelio,
  "!pvtrevelio": revelio,
  "!nostalgia": nostalgia,
  "!ping": ping,
};

async function handle(message) {
  for (const handlerCmd in cmdHandlers) {
    if (message.body != handlerCmd) continue;
    // from this point, a handler was triggered
    if (isSpam(message.author)) return;

    message.trySendReaction("⌛");
    try {
      await cmdHandlers[handlerCmd](message);
      message.trySendReaction("✅");
    } catch (e) {
      console.log(e.message);
      message.trySendReaction(e.symbol ?? "⚠️", 3);
    }
    return;
  }
}

module.exports = {
  handlers,
  handle,
};
