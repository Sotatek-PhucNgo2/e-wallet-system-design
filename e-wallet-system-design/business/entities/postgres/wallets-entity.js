'use strict';

const BasePostgresEntity = require('../../../core/base-postgres-entity');

class WalletsEntity extends BasePostgresEntity {

    constructor() {
        super();
        this.initModel(this._modelConstants.POSTGRES.TABLE.WALLETS);
    }

    findById(id) {
        return this._model.findByPk(id);
    }

    add(data, transaction = null) {
        return this._model.create(data, transaction);
    }

    async updateBalance(walletId, amount, transaction = null) {
        const wallet = await this.findById(walletId);
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        wallet.balance = parseFloat(wallet.balance) + amount;
        return wallet.save({transaction});
    }

    async getUserByWalletId(walletId, transaction = null) {
        const wallet = await this._model.F({wallet_id: walletId});
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        return wallet.user;
    }
}

module.exports = new WalletsEntity();
