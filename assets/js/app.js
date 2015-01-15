// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'router', 
  'validation',
  'js/models/csrf.js',
  'js/models/user.js'
], function($, _, Backbone, Bootstrap, Router, validation, Csrf, User) {

  var API = "https://api.staging.mathmlcloud.org";

  var user;

  var router;

  var initialize = function() {
    var app = this;
    //See if we have a logged in user.
    $.get("/loggedInUser").done(function(data) {
      if (data != "") {
        app.user = new User(data);
      }
    });
    //From here on out, go through API.
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
      options.url = app.API + options.url;
    });

    //Get csrf token.
    var csrf = new Csrf();
    csrf.fetch({
      success: function() {
        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
          options.xhrFields = {
            withCredentials: true
          };
          jqXHR.setRequestHeader('X-CSRF-Token', csrf.get('_csrf'));
          options.url = app.API + options.url;
        });
        // Pass in our Router module and call it's initialize function
        Router.initialize();
      }
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
    API: API
  };
});

