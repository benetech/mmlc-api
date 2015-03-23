/**
 * Authenticate user (if available) for this request only.
 */
var error_responses = {
    "invalid_token" : { errorCode: "91", message: "Invalid token."}
};
var passport = require('passport');
module.exports = function (req, res, ok) {
    if (typeof(req.param("access_token")) != "undefined" && req.param("access_token").length > 0) {
        passport.authenticate('bearer', {session: false}, function(err, user, info) {
            if (err) return ok(err);
            if (user) {
                req.logIn(user, function(err) {
                    if (err) res.send(err);
                    return ok();
                });
            } else {
                return res.badRequest({message: "Invalid token."});
            }
        })(req, res);
    } else {
        ok();
    }
};