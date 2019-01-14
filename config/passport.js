var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
BearerStrategy = require('passport-http-bearer').Strategy;
module.exports = {
  http: {
    middleware: {
      passportInit: passport.initialize(),
    }
  }
};
