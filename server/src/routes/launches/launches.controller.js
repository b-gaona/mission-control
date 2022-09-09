const {getAllLaunches, addNewLaunch, existsLaunch, abortLaunch} = require("../../models/launches.model");

const {getPagination} = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const {skip, limit} = getPagination(req.query); // To read the body of the GET request we use req.query
  const launches = await getAllLaunches({skip, limit});
  return res.status(200).json(launches); //.values gives us a iterable like an array of the values of the map
}

async function httpAddLaunch(req, res) {
  const launch = req.body;

  //Check if it has all the keys
  if(launch.mission && launch.rocket && launch.launchDate && launch.target){
    launch.launchDate = new Date(launch.launchDate);
    
    //The isNaN verifies if it's not a number, the dates can converted to number with the .valueOf, and that's what the inNaN does. If the date is a string, the date won't be able to be converted to number, so, the result of the isNaN function would be true
    if(isNaN(launch.launchDate)){
      return res.status(400).json({error: "Invalid date"});
    }

    await addNewLaunch(launch);  
    return res.status(201).json(launch);
  }

  return res.status(400).json({error: "Missing required launch property"})
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id; //Reads the route and get the id, remember that it has to be a Number
  
  const exists = await existsLaunch(launchId);
  
  if(!exists){
    //If launch doesn't exist
    return res.status(404).json({
      error: "Launch not found"
    })
  }

  const aborted = await abortLaunch(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch
}