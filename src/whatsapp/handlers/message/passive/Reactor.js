const Processor = require("./Processor");

class Reactor extends Processor {
  constructor() {
    super(["ow", "overwatch"]);
  }

  async handle(message) {
    message.trySendReactions(["👆", "🛁", "🥵"]);
  }
}

module.exports = new Reactor();
