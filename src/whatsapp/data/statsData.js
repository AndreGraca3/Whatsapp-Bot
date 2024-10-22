const Redis = require("ioredis");
const redis = new Redis();

const prefix = "wpp_stats";

module.exports = {
  async addUsage(userId, userName, handlerName) {
    await redis.incr(`${prefix}:${userId}:${userName}:${handlerName}`);
  },

  async getAllUsages(userIds) {
    const stats = {};
    const activeUsersSet = new Set();

    for (const id of userIds) {
      const pattern = `${prefix}:${id}:*`;
      const userKeys = await redis.keys(pattern);

      for (const commandUsage of userKeys) {
        const [_, __, name, commandName] = commandUsage.split(":"); // wpp_stats:92:andre:revelio
        const value = await redis.get(commandUsage); // 4

        stats[commandName] = {
          ...(stats[commandName] || {}),
          [name]: value,
        };
        activeUsersSet.add(name);
      }
    }

    return { stats, activeUsers: [...activeUsersSet] };
  },
};
