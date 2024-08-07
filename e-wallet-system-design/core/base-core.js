'use strict';

const Util = require('../helpers/util');
const TimeUtil = require('../helpers/time-util');
const Constants = require('../helpers/constants');
const EventUtil = require('../helpers/event-util');
const sysConfig = require('../configs/system-configs');
const log = sysConfig.log();

class BaseCore {

    constructor() {
        this._config = sysConfig;
        this._util = Util;
        this._timeUtil = TimeUtil;
        this._constant = Constants;
        this._log = log;
        this._eventUtil = EventUtil;
    }
}

module.exports = BaseCore;
