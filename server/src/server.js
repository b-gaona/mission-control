const http = require("http");

require("dotenv").config(); //To able the configurations in the .env file

const app = require("./app");
const {mongoConnect} = require("./services/mongo");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 3000; //To avoid conflict with the 3000 that's using React

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();