require("dotenv").config({path: "../../.env"})

const SWEATY_TRIGGERS = [
  "ow",
  "overwatch",
  "pc",
  "pro clubs",
  "clubes profissionais",
  "clubs",
  "fifa",
];

module.exports = {
  PORT: process.env.PORT,
  PRIVATE_GROUP_ID: process.env.PRIVATE_GROUP_ID,
  MAIN_GROUP_ID: process.env.MAIN_GROUP_ID,
  NOSTALGIA_GROUP_ID: process.env.NOSTALGIA_GROUP_ID,
  SWEATY_TRIGGERS,
  nostalgicMediaPath: process.env.NOSTALGIC_MEDIA_PATH,
};
