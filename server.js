const express = require("express");
const bcrypt = require("bcryptjs");


const userRoute = require("./usersRouter.js");
const knexConnection = require("./data/dbConfig.js");

const server = express();



server.use(express.json());


server.use("/api/", userRoute);

module.exports = server;



