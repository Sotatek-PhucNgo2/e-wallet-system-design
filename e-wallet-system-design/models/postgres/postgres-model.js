'use strict';

const db = require('../../configs/postgres');
const {getDatabase} = require('./index');


class PostgresModel {

    constructor(modelName) {
        this._dbInstance = getDatabase();
        this._model = this._dbInstance[modelName];

    }

    findAll(whereObj, attributes, joinArr, raw, nest) {
        return this._model.findAll({
            where: whereObj,
            attributes: attributes,
            include: (joinArr || []).map(joinObj => ({
                model: this._dbInstance[joinObj.model],
                attributes: joinObj.attributes,
                as: joinObj.as
            })),
            raw: raw,
            nest: nest,
        });
    }

    findByPk(pkValue, attributes, joinArr, raw, nest) {
        return this._model.findByPk(pkValue, {
            attributes: attributes,
            include: (joinArr || []).map(joinObj => ({
                model: this._dbInstance[joinObj.model],
                attributes: joinObj.attributes,
                as: joinObj.as
            })),
            raw: raw,
            nest: nest,
        });
    }

    create(createObj, transaction) {
        return this._model.create(createObj, {transaction: transaction})
            .then(result => result.get({plain: true}));
    }

    bulkCreate(createObj) {
        return this._model.bulkCreate(createObj);
    }

    update(updateObj, whereObj, transaction) {
        return this._model.update(updateObj, {where: whereObj, transaction: transaction});
    }

    execTransaction(getQueriesChain) {
        return this._dbInstance.sequelize.transaction(t => {
            // chain all your queries here. make sure you return them.
            return getQueriesChain(t);
        });
    }

    findOne(whereObj, attributes, joinArr, raw) {
        return this._model.findOne({
            where: whereObj,
            attributes: attributes,
            include: (joinArr || []).map(joinObj => ({
                model: this._dbInstance[joinObj.model],
                attributes: joinObj.attributes
            })),
            raw: raw,
        });
    }

    findAllWithJoin(whereObj, joinArr, attributes) {

        if (attributes) {
            if (joinArr && joinArr.length > 0) {
                for (var i = 0; i < joinArr.length; i++) {
                    if (joinArr[i].attributes && joinArr[i].attributes.length > 0) {
                        for (var j = 0; j < joinArr[i].attributes.length; j++) {
                            let colName = joinArr[i].attributes[j];
                            attributes.push([this._dbInstance.sequelize.col(`${joinArr[i].model}.${colName}`), colName]);
                        }
                    }
                }
            }
        }

        return this._model.findAll({
            where: whereObj,
            include: (joinArr || []).map(joinObj => ({
                model: this._dbInstance[joinObj.model],
                where: joinObj.where,
                attributes: [],
                nested: joinObj.nested ? joinObj.nested : false,
                required: joinObj.required ? joinObj.required : true,
            })),
            attributes: attributes,
            raw: true
        });
    }

    delete(whereObj, transaction) {
        return this._model.destroy({where: whereObj, transaction: transaction});
    }

    async rawQuery(query, replacements) {
        let retVal = await this._dbInstance.sequelize.query(query, {
            // logging: false,
            raw: true,
            replacements: replacements,
            type: this._dbInstance.sequelize.QueryTypes.SELECT
        });
        return retVal;
    }
}

module.exports = PostgresModel;
