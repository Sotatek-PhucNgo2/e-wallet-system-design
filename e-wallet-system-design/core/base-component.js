'use strict';

const BaseCore = require('../core/base-core');

class BaseComponent extends BaseCore {

    constructor() {
        super();
    }

    _handleResult(result) {
        return result;
    }

    _handleError(error) {
        this._log.error(error);
        throw error;
    }
}

module.exports = BaseComponent;
