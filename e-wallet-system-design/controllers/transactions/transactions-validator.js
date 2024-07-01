'use strict';

const {body} = require('../../helpers/validator');


exports.transferValidator = [
    body('fromWalletId', 'number', {required: true}),
    body('toWalletId', 'number', {required: true}),
    body('amount', 'number', {required: true}),
    body('nonce', 'number', {required: true})
];
