const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false, //Get all the data of the API
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  //.data is the value that axios gives as the response of the post method
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    //flatMap is used to join arrays that are nested
    //We do this because payloads is an array and for each element of the array it has an array of customers
    const customers = payloads.flatMap((payload) => {
      return payload["customers"]; //For each payload it will return the array of the customers
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  //We check if the first launch of the Space X API exists in the database
  const firtsLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (!firtsLaunch) {
    await populateLaunches();
  }
  return;
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunch(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  //The sort receives the field as a parameter, and the "-" is because DESC order
  const latestLaunch = await launches.findOne().sort("-flightNumber"); //Return an object

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches({ skip, limit }) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({flightNumber: 1}) //Sort by the flightNumber: 1 - ASC / -1 - DESC
    .skip(skip) //The number of elements to skip
    .limit(limit); //The number of elements to show
}

async function saveLaunch(launch) {
  //If the flightNumber field value matches with the current flightnumber of the object it will overwrite, if don't it will create a new launch
  await launches.findOneAndUpdate(
    //We don't use updateOne because the $setOnInsert, remember that property is risky
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function addNewLaunch(launch) {
  //Validating if the target matches with the planets list
  const planet = await planets.findOne({ keplerName: launch.target }); //Returns an object

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const latestFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ["NASA", "Space X"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunch(launchId) {
  return await launches.findOneAndUpdate(
    { flightNumber: launchId },
    {
      //If it matches it updates these fields
      upcoming: false,
      success: false,
    }
  );
}

module.exports = {
  existsLaunch,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  loadLaunchesData,
};
