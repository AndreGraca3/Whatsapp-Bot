const express = require("express");
const client = require("../whatsapp/whatsapp.js");
const webApi = require("./api/webApi.js");
const routes = require("./routes/routes.js");
const config = require("../config/config.js");

const app = express();

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  if (req.headers.authorization !== config.TOKEN) {
    res.status(401).json({
      error: "no-auth",
      code: 401,
      message: "You are not authorized to access this resource",
    });
    return;
  }
  next();
});

// routes
app.use("/whatsapp", routes(webApi(client)));

// start bot and server
client.on("ready", () => {
  const port = config.PORT || 2000;
  app.listen(port, () => console.log(`Server listening on port ${port}...`));
});

console.log("Starting up bot...");
client.initialize().catch((e) => {
  console.error("Error starting up bot: ", e.message ?? e);
  process.exit(1);
});
