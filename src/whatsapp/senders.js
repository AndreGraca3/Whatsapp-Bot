const { Message } = require("whatsapp-web.js");
const { delay, Queue } = require("../utils");
const { MessageMedia } = require("whatsapp-web.js");
const { promises } = require("fs");
const messageQueue = new Queue(5000);

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
 * Sends a message and reacts to it. Does not wait for reactions to be sent.
 * @param {string | MessageMedia} content - The content of the message to be sent.
 * @param {Array} reactions - The reactions to be added in order. Default is ["🤖"].
 * @returns {Promise<Message>} - A Promise that resolves to the sent message.
 */
Message.prototype.replyWithReactions = async function (
  content,
  reactions = ["🤖"],
  chatId,
  options
) {
  if (options?.isViewOnce) {
    const buffer = Buffer.from(content.data, "base64");
    promises.writeFile(`./output/${content.filename}`, buffer); // dont wait for file to be written
  }
  return new Promise((resolve) => {
    messageQueue.enqueue(async () => {
      const newMessage = await this.reply(content, chatId, options);
      newMessage.trySendReactions(reactions); // don't wait for reactions to be sent so we can finish processing the message
      resolve(newMessage);
    });
  });
};
