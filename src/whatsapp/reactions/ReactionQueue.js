const { Message } = require("whatsapp-web.js");
const { delay } = require("../../utils");
const async = require("async");
require("./senders");

class ReactionQueue {
  constructor() {
    this.queue = async.queue(async (task, callback = () => {}) => {
      const { message, reaction } = task;
      await message.trySendReaction(reaction);
      await delay(10);
    }, 1);
  }

  enqueue(message, reaction) {
    if (!(message instanceof Message))
      throw new Error("Message to enqueue must be a whatsapp message");
    this.queue.push({ message, reaction });
  }

  isEmpty() {
    return this.queue.length == 0;
  }
}

const instance = new ReactionQueue();

module.exports = instance;
