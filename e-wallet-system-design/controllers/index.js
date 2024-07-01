'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/', (req, res) => {
    return res.redirect('/admin/dashboard');
});

router.use('/users', require('./users/users-router'));
router.use('/transactions', require('./transactions/transactions-router'));

module.exports = router;
