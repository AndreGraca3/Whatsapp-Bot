const { MessageMedia } = require("whatsapp-web.js");
const Command = require("./Command");
const chartService = require("../../../../services/chart");
const statsData = require("../../../data/statsData");

class Stats extends Command {
  constructor() {
    super("Show commands usage");
    this.timeout = 5000;
  }

  async handle(message) {
    const chat = await message.getChat();
    const userIds = []
    if(chat.isGroup) {
      chat.participants.forEach((participant) => {
        userIds.push(participant.id._serialized);
      });
    } else {
      const contact = await message.getContact();
      userIds.push(contact.id._serialized);
    }
    const dataset = await statsData.getAllUsages(userIds);
    const chartUrl = chartService.generateBarChart("Commands Usage", dataset.activeUsers, dataset.stats);
    const media = await MessageMedia.fromUrl(chartUrl, { unsafeMime: true });
    await message.replyWithReactions(media, ["📊", "🤖"]);
  }
}

module.exports = {
  Stats,
  command: new Stats(),
}