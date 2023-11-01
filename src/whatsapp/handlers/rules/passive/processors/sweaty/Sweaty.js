const Handler = require("../../../../Handler");

class Sweaty extends Handler {
  constructor() {
    super();
    this.commands = [
      "ow",
      "overwatch",
      "pro clubs",
      "clubes profissionais",
      "clubs",
      "fifa",
    ];
  }

  async handle(message) {
    message.trySendReactions(["👆", "🛁", "🥵"]);
  }
}

module.exports = new Sweaty();