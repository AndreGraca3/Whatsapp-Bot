import express from "express";
import client from "../whatsapp/whatsapp.js";
import webApi from "./api/webApi.js";
import routes from "./routes/routes.js";

client.initialize();

const app = express()
app.use(express.json())

app.use(routes(webApi(client)))