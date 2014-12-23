//Nav bar.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap'
], function($, _, Backbone, bootstrap) {
  var NavBarView = Backbone.View.extend({

    events: {
      "submit .login": "logInUser",
      "click .register": "showRegisterModal"
    },
    
    //div.
    el:  $("#navbar"),

    initialize: function() {
      var navbar = this;
      //if the user is logged in, hide log in form.
      $.get("/loggedInUser").done(function(data) {
        console.log(data);
        if (data) {
          navbar.$("#login").hide();
        }  
      });
    },
    
    logInUser: function(e) {
      var navbar = this;
      e.preventDefault();
      var submitForm = $(e.currentTarget);
      $.post($(submitForm).attr("action"), {username: $("#username").val(), password: $("#password").val()}, function(data) {
        if (data) {
          alert("Hi!");
          navbar.$(".login").hide();
        }
      });
    },

    showRegisterModal: function(e) {
      e.preventDefault();
      
    }
    
  });
  return NavBarView;
});
