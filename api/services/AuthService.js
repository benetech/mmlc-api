var jwt = require('jwt-simple'), secret = 'm@th3l^7@ud';
module.exports = {

    logIn: function(req, res, user) {
      //Update user with new token.
      var token = AuthService.getToken(user);
      User.update({id: user.id}, {access_token: token}).exec(function(err, users) {
        return res.json(users[0]);
      });
    },

    logOut: function(req, res, user) {
      User.update({id: user.id}, {access_token: ""}).exec(function(err, users) {
        return res.json({message: 'logout successful'});
      });
    },

    sendForgotPasswordEmail: function(req, res, user) {
      ForgotPassword.create({user: user, token: AuthService.getToken(user)}).exec(function(err, forgotPassword) {
        var emailContent = "<p>Dear " + user.firstName + ",</p>";
        emailContent += "<p>You requested to reset your MathML Cloud password. Click the change password link below when you're ready to reset your password:</p>";
        var fpLink = "https:" + req.headers.host + "/changePassword?token=" + forgotPassword.token + "&username=" + user.username;
        emailContent += "<p><a href='" + fpLink + "'>Change Password</a></p>";
        emailContent += "<p>Thank you,<br>The MathML Cloud Team</p>"
        EmailService.send({
          from: "admin@mathmlcloud.org", 
          to: user.username, 
          subject: "Your MathML Cloud change password request",
          html: emailContent
        });
      });
    },

    getToken: function(user) {
      return jwt.encode(user.id, secret);
    }
};