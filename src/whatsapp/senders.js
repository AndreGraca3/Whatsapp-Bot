const { Message } = require("whatsapp-web.js");
const { delay } = require("../utils");
const async = require("async");

/**
 * Base function to try to send a reaction to a message.
 *
 * @param {string} reaction - The reaction to be added.
 * @returns {void}
 */
Message.prototype.trySendReaction = async function (reaction) {
  try {
    await this.react(reaction);
  } catch (e) {
    console.log("Could not react to message.");
  }
};

/**
 * A queue of reactions to be sent to a message.
 */
class ReactionQueue {
  constructor(message) {
    if (!(message instanceof Message))
      throw new Error("message must be a Whatsapp Message.");

    this.queue = async.queue(async (task, callback = () => {}) => {
      const { reaction, delayTime } = task;
      await message.trySendReaction(reaction);
      await delay(delayTime);
    }, 1);
  }

  enqueue(reaction, delayTime) {
    this.queue.push({ reaction, delayTime });
  }

  isEmpty() {
    return this.queue.length == 0;
  }
}

/**
 * Queues a reaction to a message
 *
 * @param {string} reaction - The reaction to be added. It can be an emoji string, a custom emoji object, or a ReactionEmoji object.
 * @returns {void}
 */
/*Message.prototype.queueReaction = function (reaction, delayTime = 5) {
  this.reactionQueue.enqueue(reaction, delayTime);
};*/

/**
 * Send reactions to a message with a delay between each reaction.
 * @param {Array} reactions - The reactions to be added in order.
 * @param {number} [timeoutBetween] - The timeout in milliseconds between each reaction added. Default is 2000.
 * @returns {Promise<void>} - A Promise that resolves when all reactions have been sent.
 */
Message.prototype.trySendReactions = async function (
  reactions,
  timeoutBetween = 2000
) {
  if (!reactions.length) return;

  await this.trySendReaction(reactions[0]);
  await delay(timeoutBetween);
  // await this.queueReaction(reactions[0], timeoutBetween);

  const reactionsLeft = reactions.slice(1);
  await this.trySendReactions(reactionsLeft, timeoutBetween);
};

/**
 * Sends a message and reacts to it
 * @param {string} content - The content of the message to be sent.
 * @param {Array} reactions - The reactions to be added in order. Default is ["🤖"].
 * @returns {Promise<Message>} - A Promise that resolves to the sent message.
 */
Message.prototype.replyWithReactions = async function (
  content,
  reactions = ["🤖"],
  chatId,
  options
) {
  const newMessage = await this.reply(content, chatId, options);
  // newMessage.reactionQueue = new ReactionQueue(newMessage);
  newMessage.trySendReactions(reactions); // don't wait for reactions to be sent so we can finish processing the message
  return newMessage;
};

module.exports = ReactionQueue;
