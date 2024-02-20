require("dotenv").config({path: "./.env"})

const config = {
  TOKEN: process.env.TOKEN,
  PORT: process.env.PORT,
  BOT_PREFIX: process.env.BOT_PREFIX,
  PRIVATE_GROUP_ID: process.env.PRIVATE_GROUP_ID,
  MAIN_GROUP_ID: process.env.MAIN_GROUP_ID,
  NOSTALGIA_GROUP_ID: process.env.NOSTALGIA_GROUP_ID,
  nostalgicMediaPath: process.env.NOSTALGIC_MEDIA_PATH,
  fortniteMediaPath: process.env.FORTNITE_MEDIA_PATH,
  AI_IMAGE_API_TOKEN: process.env.AI_IMAGE_API_TOKEN,
};

function validateConfig() {
  Object.entries(config).forEach(([key, value]) => {
    if (!value) throw new Error(`Missing config value for ${key}`);
  });
}

validateConfig();

module.exports = config;