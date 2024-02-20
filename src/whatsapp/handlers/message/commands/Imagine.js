const { MessageMedia } = require("whatsapp-web.js");
const {
  TooManyRequestsError,
  InvalidUsageError,
} = require("../../../../whatsapp/exceptions/exceptions");
const Command = require("./Command");
const aiService = require("../../../../services/ai/image");

class Imagine extends Command {
  constructor() {
    super("(BETA) Generate an AI image from a prompt. One user at a time!");
  }

  isBusy = false;

  async handle(message, args) {
    if (this.isBusy) throw new TooManyRequestsError();

    this.isBusy = true;
    try {
      const prompt = args._.slice(1).join(" ");
      if (!prompt) throw InvalidUsageError();
      const predictionUrl = await aiService.generateImage(prompt);

      const media = await MessageMedia.fromUrl(predictionUrl, {
        unsafeMime: true,
      });
      await message.replyWithReactions(media, undefined, undefined, {
        isViewOnce: true,
      });
    } catch (e) {
      throw e;
    } finally {
      this.isBusy = false;
    }
  }
}

module.exports = {
  command: new Imagine(),
};
