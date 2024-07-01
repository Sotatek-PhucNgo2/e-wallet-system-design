'use strict';

const Sequelize = require('sequelize');
const sysConfig = require('./system-configs');
const schemasDB = require('../domains/postgres/schemas');
const {initDatabase} = require('../models/postgres');

initDatabase({
    database: sysConfig.pgDataBase,
    username: sysConfig.pgUser,
    password: sysConfig.pgPassword,
    host: sysConfig.pgHost
}, schemasDB);
