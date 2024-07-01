'use strict';

const BasePostgresEntity = require('../../../core/base-postgres-entity');

class UsersEntity extends BasePostgresEntity {

    constructor() {
        super();
        this.initModel(this._modelConstants.POSTGRES.TABLE.USERS);
    }

    findById(id) {
        return this._model.findByPk(id);
    }

    add(data, transaction = null) {
        return this._model.create(data, transaction);
    }
}

module.exports = new UsersEntity();
