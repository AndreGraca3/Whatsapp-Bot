const { Message } = require("whatsapp-web.js");
const messsageQueue = require("./ReactionQueue");
const { delay } = require("../../utils");

/**
 * Tries to send a reaction to a message
 *
 * @param {string} reaction - The reaction to be added. It can be an emoji string, a custom emoji object, or a ReactionEmoji object.
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
 * Send reactions to a message with a delay between each reaction.
 * @param {Array} reactions - The reactions to be added in order.
 * @param {number} [timeoutBetween] - The timeout in milliseconds between each reaction added. Default is 2000.
 * @returns {Promise<void>} - A Promise that resolves when all reactions have been sent.
 */
Message.prototype.trySendReactions = async function (reactions, timeoutBetween) {
  if (reactions.length === 0) {
    return;
  }

  await this.trySendReaction(reactions[0]);
  await delay(timeoutBetween);

  const reactionsLeft = reactions.slice(1);
  await this.trySendReactions(reactionsLeft, timeoutBetween);
};

/**
 * Queues a reaction to a message
 *
 * @param {string} reaction - The reaction to be added. It can be an emoji string, a custom emoji object, or a ReactionEmoji object.
 * @returns {void}
 */
Message.prototype.queueReaction = async function (reaction) {
  messsageQueue.enqueue(this, reaction);
};

/**
 * Sends a message and reacts to it
 * @param {string} content - The content of the message to be sent.
 * @param {Array} reactions - The reactions to be added in order. Default is ["🤖"].
 * @returns {Promise<Message>} - A Promise that resolves to the sent message.
 */
Message.prototype.sendReactedMessage = async function (content, reactions = ["🤖"], caption) {
  const message = await this.reply(content, undefined, caption);
  await message.trySendReactions(reactions);
  return message;
};