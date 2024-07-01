'use strict';

require('dotenv').config();
const bunyan = require('bunyan');

const log = {
    development: () => {
        return bunyan.createLogger({name: 'development', level: 'debug'});
    },
    production: () => {
        return bunyan.createLogger({name: 'production', level: 'info'});
    },
    test: () => {
        return bunyan.createLogger({name: 'test', level: 'fatal'});
    }
};

module.exports = {
    name: process.env.NAME,

    siteKey: process.env.SITE_KEY,
    secretKey: process.env.SECRET_KEY,

    pgHost: process.env.PGHOST,
    pgUser: process.env.PGUSER,
    pgDataBase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT,


    bodyParserUrlencodedLimit: process.env.BODY_PARSER_URLENCODED_LIMIT,
    bodyParserJsonLimit: process.env.BODY_PARSER_JSON_LIMIT,

    log: (env) => {
        if (env) return log[env]();
        return log['development']();
    }
};
