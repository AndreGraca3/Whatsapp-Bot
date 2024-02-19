const { BOT_PREFIX } = require("../../../../config/config");
const Command = require("./Command");

class Help extends Command {
  constructor(commands) {
    super("Show available commands");
    this.availableCommands = commands;
  }

  async handle(message) {
    // TODO: pass args from message handler to command handler
    const splitBody = message.body.toLowerCase().split(" ");
    if (splitBody.length > 1) {
      const cmd = this.availableCommands[splitBody[1]];
      if (cmd) {
        return await message.replyWithReactions(cmd.getHelp(), ["❓", "🤖"]);
      } else {
        return await message.replyWithReactions(
          `Command *${splitBody[1]}* not found`,
          ["🤷‍♂️", "🤖"]
        );
      }
    }

    await message.replyWithReactions(
      `Available commands:\n${Object.entries(this.availableCommands)
        .map(([name, cmd]) => `> *${BOT_PREFIX}${name}* - ${cmd.description}`)
        .join(
          "\n"
        )}\n\nGeneral Usage: <command> [options]\n\nType *<command> --help* to get more info about a specific command`,
      ["❓", "🤖"]
    );
  }
}

module.exports = {
  Help,
};
