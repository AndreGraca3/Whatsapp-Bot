const {searchTriggers} = require("../../../../utils");

class Processor {
  constructor(triggers) {
    this.dismissedUsers = []; // TODO: implement dismissed users
    this.triggers = triggers;
  }

  isTriggered(message) {
    // can be overriden
    if (message.fromMe) return; // TODO: implement dismissed users
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
    const content = message.body.toLowerCase().replace(specialCharsRegex, "");

    return searchTriggers(content, this.triggers);
  }

  async handle(message) {
    throw new Error("Not implemented");
  }
}

module.exports = Processor;
