'use strict';

const TransactionsEntity = require('../../entities/postgres/transactions-entity');
const WalletsEntity = require('../../entities/postgres/wallets-entity');
const UsersEntity = require('../../entities/postgres/users-entity');
const BaseComponent = require('../../../core/base-component');

class TransactionComponent extends BaseComponent {

    constructor() {
        super();
    }


    async transfer(data) {

        try {
            const {fromWalletId, toWalletId, amount, nonce} = data;
            // Kiểm tra số dư
            const [fromWallet, toWallet] = await Promise.all([
                WalletsEntity.findById(fromWalletId),
                WalletsEntity.findById(toWalletId)
            ]);

            if (parseFloat(fromWallet?.balance ?? 0) < amount) {
                throw {message: 'Insufficient balance'};
            }

            // Tạo transaction
            const transaction = await TransactionsEntity.create(fromWalletId, toWalletId, amount, nonce);

            // Cập nhật số dư các ví
            await WalletsEntity.updateBalance(fromWalletId, -amount);
            await WalletsEntity.updateBalance(toWalletId, amount);


            this.sendNotification(fromWallet.user_id, toWallet.user_id, transaction).then();

            return this._handleResult(true);
        } catch (e) {
            return this._handleError(e);
        }
    }

    // sendNotification(fromUser, toUser, transaction);
    async sendNotification(fromUserId, toUserId, transaction) {
        // Gửi thông báo
        // check same user
        if (fromUserId === toUserId) {
            return;
        }
        const [fromUser, toUser] = await Promise.all([
            UsersEntity.findById(fromUserId),
            UsersEntity.findById(toUserId)
        ]);
        // sleep 3s
        setTimeout(() => {
            console.log('Send notification to ' + fromUser.email + ' and ' + toUser.email + ' about transaction ' + transaction.transaction_id + ' success!');
        }, 3000);
    }

}

module.exports = new TransactionComponent();
