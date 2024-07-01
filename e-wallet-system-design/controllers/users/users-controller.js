'use strict';

const BaseController = require('../../core/base-controller');

class UsersController extends BaseController {

    constructor() {
        super();

        this.getUsers = this._call(() => this._facade.getUsers());
    }

}

module.exports = UsersController;
