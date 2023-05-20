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

