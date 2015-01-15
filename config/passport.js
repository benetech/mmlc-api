var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
BearerStrategy = require('passport-http-bearer').Strategy;
module.exports = {
  http: {
    customMiddleware: function(app){
      console.log('Express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(app.router);
    }
  }
};