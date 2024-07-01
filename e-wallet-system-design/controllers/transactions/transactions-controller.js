'use strict';

const BaseController = require('../../core/base-controller');

class TransactionsController extends BaseController {

    constructor() {
        super();

        this.transfer = this._call((req, data) => this._facade.transfer(data));
    }

}

module.exports = TransactionsController;
