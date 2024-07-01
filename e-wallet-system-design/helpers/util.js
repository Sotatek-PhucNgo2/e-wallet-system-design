'use strict';


class Util {

    static generateUuid() {
        const uuidv4 = require('uuid/v4');
        return uuidv4();
    }
    static validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    static convertObjToFlattenObject(obj) {
        const flattenArr = this._convertObjToFlattenArray(obj);

        return (flattenArr || [])
            .filter(item => item)
            .reduce((flattenObj, {key, val}) => {
                flattenObj[key] = val;

                return flattenObj;
            }, {});
    }

    static _convertObjToFlattenArray(obj, parentKey = '') {
        return Object.entries(obj || {})
            .reduce((flattenArr, [key, val]) => {
                const flattenKey = parentKey ? `${parentKey}.${key}` : key;

                if (val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length) {
                    flattenArr = flattenArr.concat(
                        this._convertObjToFlattenArray(val, flattenKey)
                    );
                } else {
                    flattenArr.push({key: flattenKey, val});
                }

                return flattenArr;
            }, []);
    }

    static replaceTemplateWithParams(template, params) {
        let replaced = template || '';

        Object.entries(params || {}).forEach(([key, val]) => {

            if (params.hasOwnProperty(key)) {
                replaced = replaced.replace(new RegExp(`{{${key}}}`, 'g'), val !== null ? val : '');
            }
        });
        return replaced;
    }
}

module.exports = Util;
