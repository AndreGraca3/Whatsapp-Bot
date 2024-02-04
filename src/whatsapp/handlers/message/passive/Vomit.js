const Processor = require("./Processor");

class Vomit extends Processor {
  constructor() {
    super(["pro clubs", "clubes profissionais", "clubs", "fifa"]);
  }

  async handle(message) {
    message.trySendReactions(["🤢", "🤮"]);
  }
}

module.exports = new Vomit();
