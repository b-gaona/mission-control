const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

//The use of v1 is to set a version to the API
api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;