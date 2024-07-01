"use strict";


const express = require("express");
const Controller = require("./transactions-controller");
const validator = require("./transactions-validator");

const controller = new Controller();
const router = express.Router();


router.post("/transfer", validator.transferValidator, controller.transfer);

module.exports = router;
