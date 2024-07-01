'use strict';


exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect("/admin/auth/login");
    }
};

exports.requiresLogout = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.render('err/occurs-error', {
            layout: false,
            message_title: "Vui lòng đăng xuất để thực hiện action"
        });
    } else {
        return next();
    }
};

