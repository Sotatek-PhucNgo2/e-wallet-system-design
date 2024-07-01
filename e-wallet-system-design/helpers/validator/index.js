'use strict';

const validator = require('express-validator');

const body = (field, type, options = {}) => validate('body', field, type, options);
const param = (field, type, options = {}) => validate('param', field, type, options);
const query = (field, type, options = {}) => validate('query', field, type, options);
const header = (field, type, options = {}) => validate('header', field, type, options);

const validate = (object, field, type, options = {}) => {
    let validation = validator[object](field);

    if (options && options.exists) {
        validation = validation.exists().withMessage(`${field} is required`);
    } else if (options && options.if_exists) {
        let childValidation = validator[object](options.if_exists);
        validation = validation.if(
            childValidation.exists({
                values: options.if_exists === true ? 'undefined' : options.if_exists
            })
        );
    } else {
        validation = validation.optional({nullable: true});
    }

    validation = validateType(validation, field, type);

    return validation;
};

const validateType = (validation, field, type) => {
    if (Array.isArray(type)) return validation.isIn(type).withMessage(`${field} is not valid`);

    if (type instanceof RegExp) return validation.matches(type).withMessage(`${field} is not valid format`);

    switch (type) {
        case 'uuid':
            return validation.isUUID().withMessage(`${field} must be UUID`);
        case 'string':
            return validation.isString().withMessage(`${field} must be string`);
        case 'integer':
            return validation.isInt().withMessage(`${field} must be integer`).toInt();
        case 'float':
            return validation.isFloat().withMessage(`${field} must be float`).toFloat();
        case 'boolean':
            return validation.isBoolean().withMessage(`${field} must be boolean`).toBoolean();
        case 'array':
            return validation.isArray().withMessage(`${field} must be array`).toArray();
        case 'object':
            return validation.isObject().withMessage(`${field} must be object`);
        case 'email':
            return validation.isEmail().withMessage(`${field} must be valid email`);
        case 'datetime':
            return validation.custom(value => new Date(value).getTime() > 0).withMessage(`${field} must be valid date`);
    }

    return validation;
}

module.exports = {
    body,
    param,
    query,
    header,
    validator,
};
