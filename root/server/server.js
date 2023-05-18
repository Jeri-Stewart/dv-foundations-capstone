// imports and packages needed to create/run server USE W5 WEDNESDAY AND WK 4 TUES
// require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const { SERVER_PORT } = process.env;
// const { seed } = require("./seed.js");
// const {getUserInfo, updateUserInfo, getUserAppt, requestAppointment} = require('./controller.js')

// initialize express
// const app = express();

//middleware to help execute endppoint
app.use(express.json());
app.use(cors());

// using controller
// const controller = require("./controller"); // DUP FORM ABOVE

// destructure the variables
/* const { getHouses, createHouse, updateHouse, deleteHouse } = controller; */

app.listen(8000, () => console.log("Server running on port 8000"));

// app.get("/api/users", (req, res) => {});

//app.get("/weather/:temperature", (req, res) => {});

/*
"scripts": {
    "test": "jest",
    "start": "npm-run-all -p nodemon browser-sync",
    "nodemon": "nodemon server.js",
    "browser-sync": "browser-sync start --proxy localhost:8000 --files=**/ //* // --ignore=node_modules --reload-delay 10000 --no-ui" */
