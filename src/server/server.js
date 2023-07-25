import express from "express";
import client from "../whatsapp/whatsapp.js";
import webApi from "./api/webApi.js";
import routes from "./routes/routes.js";

console.log("Starting up bot...");

client.initialize();

const app = express();
app.use(express.json());

app.use("/whatsapp", routes(webApi(client)));
