const nostalgia = require("./rules/nostalgia");
const revelio = require("./rules/revelio");
const sticker = require("./rules/sticker");
const sweaty = require("./rules/sweaty");

const handlers = {
  sweaty,
};

const cmdHandlers = {
  "!sticker": sticker,
  "!revelio": revelio,
  "!pvtrevelio": revelio,
  "!nostalgia": nostalgia,
};

async function handle(message) {
  for (const handlerCmd in cmdHandlers) {
    if (message.body != handlerCmd) continue;
    message.trySendReaction("⌛");
    try {
      await cmdHandlers[handlerCmd](message);
    } catch(e) {
      console.log(e.message);
      message.trySendReaction(e.symbol ?? "⚠️", 2);
    }
    message.trySendReaction("✅");
    return;
  }
}

module.exports = {
  handlers,
  handle,
};
