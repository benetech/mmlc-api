/**
 * Authenticate user (if available) for this request only.
 */
var passport = require('passport');
module.exports = function (req, res, ok) {
    if (typeof(req.param("access_token")) != "undefined") {
        passport.authenticate('bearer', {session: false}, function(err, user, info) {
            if (err) return ok(err);
            if (user) {
                req.logIn(user, function(err) {
                    if (err) res.send(err);
                    return ok();
                });
            } else {
                return res.badRequest("Invalid token.");
            }
        })(req, res);
    } else {
        ok();
    }
};