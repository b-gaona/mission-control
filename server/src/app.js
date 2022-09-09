const express = require("express");
const cors = require("cors"); //To enable CORS
const morgan = require("morgan"); //To control the logs and the requests, to avoid multiple requests and sature the server
const helmet = require("helmet");

const path = require("path");

const api = require("./routes/api");

const app = express(helmet());

app.use(cors({
  origin: "http://localhost:3000", //This server can do requests to the server, it's like a whitelist
})); //To allow cross origin

app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")))

app.use("/v1", api);

app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.get("/upcoming", (req, res)=>{
  res.sendFile(path.join(__dirname, "..", "public", "upcoming.html"));
});
app.get("/history", (req, res)=>{
  res.sendFile(path.join(__dirname, "..", "public", "history.html"));
});

module.exports = app;
