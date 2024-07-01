'use strict';

const Sequelize = require('sequelize');

let _dbInstance = {};

const initDatabase = (config, schemas) => {
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port,
        dialect: 'postgres',
        dialectOptions: {
            useUTC: false,
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });

    sequelize.authenticate()
        .then(() => {
            console.log('Successfully connected to postgres!');
        })
        .catch((err) => {
            console.error(`Error during connect to postgres. ${err}`);
        });

    _dbInstance = schemas(sequelize);
    _dbInstance.sequelize = sequelize;

    return _dbInstance;
}

const getDatabase = () => {
    return _dbInstance;
}

module.exports = {
    initDatabase,
    getDatabase,
}
