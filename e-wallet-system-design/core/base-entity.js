'use strict';

const BaseCore = require('../core/base-core');
const modelConstants = require('../helpers/model-constants');

class BaseEntity extends BaseCore {

    constructor() {
        super();
        this._modelConstants = modelConstants;
    }
}

module.exports = BaseEntity;
