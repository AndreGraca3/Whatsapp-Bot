const express = require("express");
const client = require("../whatsapp/whatsapp.js");
const webApi = require("./api/webApi.js");
const routes = require("./routes/routes.js");
const config = require("../config/config.js");

const app = express();
app.use(express.json());

app.use("/whatsapp", routes(webApi(client)));

client.on("ready", () => {
  app.listen(config.PORT || 2000, () => console.log("Server Listening..."));
});
