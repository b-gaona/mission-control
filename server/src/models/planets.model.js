/*
  Downloaded:
  https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative
  https://www.npmjs.com/package/csv-parse
*/

const { parse } = require("csv-parse");

const path = require("path");
const fs = require("fs");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  //As it receives an JS object as parameter, we find the keys using the ""
  return (
    planet["koi_disposition"] === "CONFIRMED" && //It should be confirmed as a planet
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 && //The amount of stellar flux
    planet["koi_prad"] < 1.6
  ); //The radius size
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    //With .createReadStream we create a new stram data and we read it
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      //Pipe function will parse all the data given, this functions only works with readable streams
      .pipe(
        parse({
          comment: "#", //Treats this lines as comments
          columns: true, //Returns it as a JS object
        })
      )
      //If it gets data, the results array will push it
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
          console.log(data.kepler_name);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        //En este caso se usa el await solo para esperar el arreglo, no para el metodo.length
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  //https://mongoosejs.com/docs/api/model.html#model_Model-find
  // {} means no filters, but we can match documents, for example {keplerName: "Bla bla"}
  return await planets.find({}, "keplerName -_id"); //The second parameter is the field that we need to extract, if we need more just add " ", if we want all except one "-field"
}

async function savePlanet(planet) {
  try {
    //It adds a document in our planets collection
    //The first parameter is the filter, so, it will update just the one that matches with that filter
    //The second parameter is the new value, if it's compatible, the value is exactly the same
    //The third says that if it's not compatible, the planet will be created
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        // insert + update = upsert  <- Just inserts if it doesn't exist
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Couldn't save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
