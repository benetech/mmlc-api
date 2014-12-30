//Nav bar.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/sign_up.js',
  'text!/templates/user_nav.html',
  'text!/templates/public_nav.html',
  'js/models/user.js'
], function($, _, Backbone, bootstrap, SignUpView, userNavTemplate, publicNavTemplate, User) {
  var NavBarView = Backbone.View.extend({

    events: {
      "submit .login": "logInUser",
      "click #registerLink": "showRegisterModal",
      "click #logout": "logOutUser",
      "click .pageLink": "setFocusOnH1"
    },
    
    //div.
    el:  $("#optionalNav"),

    setFocusOnH1: function() {

      setTimeout(function() {
        $("h1:first").attr('tabindex', '-1').focus();
      }, 1500);
    },

    render: function() {
      var navBar = this;
      $.get("/loggedInUser").done(function(data) {
        if (data != "") {
          navBar.model = new User(data);
          var compiledTemplate = _.template(userNavTemplate)({user: navBar.model});
        } else {
          var compiledTemplate = _.template(publicNavTemplate);
        }
        navBar.$el.html(compiledTemplate);
        return navBar;
      });
    },
    
    logInUser: function(e) {
      var navbar = this;
      e.preventDefault();
      var submitForm = $(e.currentTarget);
      $.post($(submitForm).attr("action"), {username: $("#username").val(), password: $("#password").val()}, function(data) {
        if (data) {
          if (typeof(data.message) != "undefined") {
            alert(data.message);
          } else {
            navbar.render();
          }
        }
      });
    },

    logOutUser: function(e) {
      var navbar = this;
      e.preventDefault();
      $.get("/auth/logout", function(data) {
        if(data == "logout successful") {
          navbar.render();
        }
      });
    },

    showRegisterModal: function(e) {
      e.preventDefault();
      var navBar = this;
      var signUpView = new SignUpView();
      signUpView.render();
      $("#mmlcModal").modal('show');
      $("#mmlcModal").on('hidden.bs.modal', function (e) {
        navBar.render();
      });
    }
    
  });
  return NavBarView;
});
