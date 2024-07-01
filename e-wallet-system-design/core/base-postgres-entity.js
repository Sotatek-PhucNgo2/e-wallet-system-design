'use strict';

const BaseEntity = require('../core/base-entity');
const PostgresModel = require('../models/postgres/postgres-model');

class BasePostgresEntity extends BaseEntity {

    constructor() {
        super();
    }

    initModel(modelName) {
        this._model = new PostgresModel(modelName)
    }
}

module.exports = BasePostgresEntity;
