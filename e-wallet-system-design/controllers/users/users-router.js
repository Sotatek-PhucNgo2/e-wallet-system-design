"use strict";

const auth = require('../../middlewares/authentication');
const express = require("express");
const Controller = require("./users-controller");

const controller = new Controller();
const router = express.Router();


router.get("/", controller.getUsers);

module.exports = router;
