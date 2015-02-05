//Show change password form.
define([
  'jquery',
  'underscore',
  'backbone',
  'stickit',
  'validation',
  'js/models/change_password.js',
  'text!/templates/users/change_password.html'
], function($, _, Backbone, stickit, validation, ChangePassword, changePasswordTemplate) {
  var ForgotPasswordView = Backbone.View.extend({
    //div.
    tagName:  "div",

    events: {
      "submit form": "submitForm"
    },

    bindings: {
      "#password": "password",
      "#confirmPassword": "confirmPassword"
    },
    
    render: function() {
      var compiledTemplate = _.template(changePasswordTemplate)({changePassword: this.model});
      this.$el.html(compiledTemplate);
      this.stickit();
      validation.bind(this);
      return this;
    },

    submitForm: function(e) {
      e.preventDefault();
      var changePasswordView = this;
      if (this.model.isValid(true)) {
        //create user.
        changePasswordView.model.save(null, {
          success: function(model, response, options) { 
            changePasswordView.$("#changePassword").html(response.message);
          },
          error: function(model, response, options) {
            console.log(response);
            changePasswordView.$("#emailError").html(response.responseText);
            setTimeout(function() {
              changePasswordView.$("#emailError").attr('tabindex', '-1').focus();
            }, 250);
          }
        });
      } else {
        //set focus on first field with error.
        changePasswordView.$(".error:first").focus();
      }
    }
    
  });
  return ForgotPasswordView;
});
