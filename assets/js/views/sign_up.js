//Sign Up View.
define([
  'jquery',
  'underscore',
  'backbone',
  'stickit',
  'validation',
  'text!/templates/users/sign_up.html',
  'js/models/user.js'
], function($, _, Backbone, stickit, validation, signUpTemplate, User) {
  var SignUpView = Backbone.View.extend({

    events: {
      "submit #signUp": "createUser"
    },

    bindings: {
      "#firstName": "firstName",
      "#lastName": "lastName",
      "#username": "username",
      "#confirmEmail": "confirmEmail",
      "#password": "password",
      "#confirmPassword": "confirmPassword",
      "#termsOfService": "termsOfService",
      "#organization": "organization",
      "input[name='organizationTypes']": "organizationTypes"
    },

    //div.
    el:  $("#mmlcModal"),
    
    render: function() {
      var signUp = this;
      signUp.model = new User();
      var compiledTemplate = _.template(signUpTemplate)({user: signUp.model});
      signUp.$("#mmlcModalBody").html(compiledTemplate);
      signUp.$("#mmlcModalLabel").html("Register");
      signUp.stickit();
      validation.bind(signUp);
      setTimeout(function() {
        signUp.$("input:first").focus();
      }, 1000);
      return this;
    },

    createUser: function(e) {
      var signUp = this;
      e.preventDefault();
      if (this.model.isValid(true)) {
        //create user.
        signUp.model.save(null, {
          success: function(model, response, options) { 
            App.user = new User(response);
            $("#homePageWelcome").hide();
            $('#mmlcModal').modal('hide');
          },
          error: function(model, response, options) {
            signUp.$(".errorMessage").text(response.responseJSON.message);
            setTimeout(function() {
              signUp.$(".errorMessage").attr('tabindex', '-1').focus();
            }, 500);
          }
        });
      } else {
        //set focus on first field with error.
        signUp.$(".error:first").focus();
      }
    }
    
  });
  return SignUpView;
});
