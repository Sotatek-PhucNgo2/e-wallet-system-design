'use strict';

const BaseCore = require('../../core/base-core');
const TransactionComponent = require('../components/transactions/transactions-component');

class Facade extends BaseCore {

    constructor() {
        super();
    }

    transfer(data) {
        return TransactionComponent.transfer(data);
    }
}

module.exports = new Facade();
