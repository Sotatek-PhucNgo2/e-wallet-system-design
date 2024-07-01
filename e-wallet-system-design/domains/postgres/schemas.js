'use strict';

const modelConstants = require('../../helpers/model-constants');
const {Sequelize} = require('sequelize');

module.exports = (db) => {

    const DataTypes = Sequelize.DataTypes;

    const Users = db.define('users', {
        user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        username: {type: DataTypes.STRING(255), allowNull: false},
        email: {type: DataTypes.STRING(255), allowNull: false, unique: true},
        created_at: {type: DataTypes.DATE, defaultValue: Sequelize.NOW}
    });

    const Wallets = db.define('wallets', {
        wallet_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        balance: {type: DataTypes.DECIMAL(11, 10), defaultValue: 0.00},
        created_at: {type: DataTypes.DATE, defaultValue: Sequelize.NOW}
    });

    const Transactions = db.define('transactions', {
        transaction_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        from_wallet: {type: DataTypes.INTEGER},
        to_wallet: {type: DataTypes.INTEGER},
        amount: {type: DataTypes.DECIMAL(15, 2), allowNull: false},
        nonce: {type: DataTypes.INTEGER, allowNull: false},
        created_at: {type: DataTypes.DATE, defaultValue: Sequelize.NOW}
    });

    // Define relationships
    Users.hasOne(Wallets, {foreignKey: 'user_id'});
    Wallets.belongsTo(Users, {foreignKey: 'user_id'});
    Transactions.belongsTo(Wallets, {foreignKey: 'from_wallet'});
    Transactions.belongsTo(Wallets, {foreignKey: 'to_wallet'});

    return {
        [modelConstants.POSTGRES.TABLE.USERS]: Users,
        [modelConstants.POSTGRES.TABLE.TRANSACTIONS]: Transactions,
        [modelConstants.POSTGRES.TABLE.WALLETS]: Wallets
    };
};
