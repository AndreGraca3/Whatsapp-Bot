const { BOT_PREFIX } = require("../../../../config/config");

class Command {
  constructor(description) {
    this.timeout = 0; // in seconds
    this.description = description;
    this.users = {};
    this.permissions = []; // TODO
  }

  async handle(message) {
    throw new Error("Not implemented");
  }

  getHelp() {
    const optionsHelp = this.getOptionsHelp();
    return `Usage: ${this.getUsageHelp()}\n\n${this.description}${
      optionsHelp ? `\n\nOptions:\n${optionsHelp}` : ""
    }`;
  }

  getUsageHelp() {
    return `${BOT_PREFIX}${this.constructor.name.toLowerCase()}`;
  }

  getOptionsHelp() {
    return;
  }

  isSpam(author) {
    if (this.timeout == 0) return false;
    const lastTriggeredByUser = this.users[author];
    const now = Date.now();
    this.users[author] = now;
    if (now - (lastTriggeredByUser ?? 0) < this.timeout) return true;
    return false;
  }
}

module.exports = Command;
