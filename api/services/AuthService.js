var jwt = require('jwt-simple'), secret = 'm@th3l^7@ud';
module.exports = {

    logIn: function(req, res, user) {
        req.logIn(user, function(err) {
            if (err) res.send(err);
            //Update user with new token.
            var token = jwt.encode(user.id, secret);
            User.update({id: user.id}, {access_token: token}).exec(function(err, users) {
              if (req.wantsJSON) {
                return res.json(users[0]);
              } else {
                  return res.redirect("/");
              }
            });
        });
    }
};