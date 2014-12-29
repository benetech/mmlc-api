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
      "#termsOfService": "termsOfService",
      "#organization": "organization",
      "input[name='organizationTypes']": "organizationTypes"
    },

    //div.
    el:  $("#mmlcModal"),
    
    render: function() {
      this.model = new User();
      var compiledTemplate = _.template(signUpTemplate)({user: this.model});
      this.$("#mmlcModalBody").html(compiledTemplate);
      this.$("#mmlcModalLabel").html("Register");
      this.stickit();
      validation.bind(this);
      return this;
    },

    createUser: function(e) {
      var signUp = this;
      e.preventDefault();
      if (this.model.isValid(true)) {
        //create user.
        signUp.model.save(null, {success: function() { 
          $('#mmlcModal').modal('hide');
        }});
      } else {
        //set focus on first field with error.
        signUp.$(".error:first").focus();
      }
    }
    
  });
  return SignUpView;
});
