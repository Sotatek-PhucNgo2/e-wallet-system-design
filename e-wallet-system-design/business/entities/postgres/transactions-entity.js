'use strict';

const BasePostgresEntity = require('../../../core/base-postgres-entity');

class TransactionsEntity extends BasePostgresEntity {

    constructor() {
        super();
        this.initModel(this._modelConstants.POSTGRES.TABLE.TRANSACTIONS);
    }

    findById(id, transaction = null) {
        return this._model.findByPk(id, {transaction});
    }

    create(fromWalletId, toWalletId, amount, nonce, transaction = null) {
        const data = {
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            amount: amount,
            nonce: nonce
        };
        return this._model.create(data, transaction);
    }
}

module.exports = new TransactionsEntity();
