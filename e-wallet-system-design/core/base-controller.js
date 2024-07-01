'use strict';

const BaseCore = require('../core/base-core');
const HandleResult = require('../domains/handleResult');
const Facade = require('../business/facade/facade');
const {validator: {validationResult, matchedData}} = require('../helpers/validator');

class BaseController extends BaseCore {

    constructor() {
        super();
        this._facade = Facade;

        this._call = (fn) => async (req, res) => {
            try {
                if (this._handleValidationResult(req, res)) return false;

                const data = matchedData(req);

                const result = await fn(req, data);

                this._handleResult(result, res);
            } catch (e) {
                this._handleError(e, res);
            }
        }
    }

    _handleResult(result, res) {
        res.send(new HandleResult(true, result));
    }

    _handleError(error, res) {
        this._log.error(error);

        res.send(new HandleResult(false, null, [{
            code: error.code || this._constant.ERROR_CODE.CONTROLLER,
            text: error.message || error
        }]));
    }

    _handleValidationResult(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errArr = errors.array().map(error => {
                return {code: this._constant.ERROR_CODE.VALIDATOR, text: error.msg};
            });

            res.send(new HandleResult(false, null, errArr));

            return errArr;
        }

        return null;
    }
}

module.exports = BaseController;
