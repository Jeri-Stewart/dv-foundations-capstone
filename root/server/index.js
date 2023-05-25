// imports and packages needed to create/run server USE W5 WEDNESDAY AND WK 4 TUES
require("dotenv").config();
const path = require("path");
const { CONNECTION_STRING } = process.env;
const PORT = process.env.PORT || 8000;
const express = require("express");
const flash = require("express-flash");
const session = require("express-session");

const app = express();
const cors = require("cors");
const { seed } = require("./seed.js");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

const Sequelize = require("sequelize");
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const {
  getMain,
  getHome,
  getCatalog,
  getReturns,
  sign,
  updateLoans,
  updateBookAvailability,
} = require("./controller.js");

//middleware to help execute endpoint
app.use(express.json());
app.use(cors());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

//seed database
app.get("/seed", seed);

// Test route to check the database connection
app.get("/test-connection", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.status(500).send("Failed to connect to the database.");
  }
});

//set the view engine
app.set("view engine", "ejs");
// set the views directory path relative to the root directory
app.set("views", path.join(__dirname, "../views"));

// render views
app.get("/", getMain);
app.get("/user/home/", getHome);
app.get("/user/catalog/", getCatalog);
app.get("/user/returns/", getReturns);

// sign up or sign in
app.post("/", sign);
//create row in loans
app.post("/user/catalog/", updateLoans);

// update books table
app.put("/user/catalog/", updateBookAvailability);

app.listen(PORT, () => console.log("Server running on port 8000"));
