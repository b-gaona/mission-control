# NASA Mission Control
## Table of contents

* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)

### General info
------------
It's created with Node.js, Express.js, Vanilla JS, Sass and some npm modules. It uses an MVC architecture. The server side is written with Node.js and Express.js, and the client side is written in basic HTML, CSS and Vanilla JS. This project uses information of a dataset about the Kepler exoplanets. Here's the link: [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative "Kepler Exoplanets").

This project has 3 pages, one where you can launch, another where you can decide if the launches are aborted, and the last one is a history of all the launches that have been registered.

### Technologies
------------
Project is created with:
* Node.js.
* Express.js.
* Vanilla JS.
* Jest.
* MongoDB.
* Mongoose.
* SCSS.

### Setup
------------
To run this project, install it locally using npm:
```
$ cd `yourFolderPath`
$ npm install
$ npm run start-server
```
Don't forget to create your env variables in the server side. The **PORT** variable is the port where the server runs, and the **MONGO_URL** is the link provided by MongoDB Atlas.

Finally, use the `npm run start-server` command to start the server. If you don't start the server, you won't be able to see the decks and cards. Once you have done that, open `http://localhost:yourSelectedPort/` in your prefered browser and enjoy.

**NOTE:** The client code is already compressed in the public folder inside the server folder, but if you want to do changes in that code, do it in the src folder inside of the client folder. And when you have finished use the `npm run watch` command.

### Features
------------
* Pagination is used in the part where all the registered launches are.
* The .csv files are located in the data folder inside the server folder.
* The endpoints are mentioned in the routes folder.
* The schemas are located in the models folder. There's defined the way that the card or deck has to be sent.
* Unit tests are performed only upon creation and fetching of launches. The tests were done with Jest.
