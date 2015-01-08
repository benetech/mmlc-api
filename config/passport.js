var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
BasicStrategy = require('passport-http').BasicStrategy;
module.exports = {
  http: {
    customMiddleware: function(app){
      console.log('Express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};