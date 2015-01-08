/**
 * Authenticate user (if available) for this request only.
 */
var passport = require('passport');
module.exports = function (req, res, ok) {
    if (typeof(req.param("username")) != "undefined" && typeof(req.param("password")) != "undefined") {
        passport.authenticate('local', {session: false}, function(err, user, info) {
            if ((err) || (!user)) {
                return res.badRequest("login failed");
            }
            req.logIn(user, function(err) {
                if (err) res.badRequest("login failed");
                ok();
            });
        }) (req, res)
    } else {
        ok();
    }
};