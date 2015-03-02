// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'router', 
  'pace',
  'validation',
  'js/models/csrf.js',
  'js/models/user.js'
], function($, _, Backbone, Bootstrap, Router, pace, validation, Csrf, User) {

  var user;
  var navBar;
  var router;

  var initialize = function() {
    pace.start({document: false, ajax: {trackMethods: ['GET', 'POST', 'PUT', 'DELETE']}, restartOnRequestAfter: 250, minTime: 250});
    var app = this;
    //See if we have a logged in user.
    $.get("/loggedInUser").done(function(data) {
      if (data != "") {
        app.user = new User(data);
      }
      // Pass in our Router module and call it's initialize function
      app.router = Router.initialize();
    });

    
    
    //initialize validation.
    validation.configure({
      forceUpdate: true,
      labelFormatter: "label"
    });

    _.extend(validation.callbacks, {
      valid: function (view, attr, selector) {
        var el = view.$('[name=' + attr + ']'), group = el.closest('.form-group');
        group.removeClass('has-error');
        el.removeClass('error');
        group.find('.help-block').html('').addClass('hidden');
      },
      invalid: function (view, attr, error, selector) {
        var el = view.$('[name=' + attr + ']'), group = el.closest('.form-group');
        group.addClass('has-error');
        el.addClass('error');
        group.find('.help-block').html(error).removeClass('hidden');
      }
    });


  }

  return App = {
    initialize: initialize,
    user: user,
    navBar: navBar,
    router: router
  };
});

