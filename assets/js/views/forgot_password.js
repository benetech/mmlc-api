//List of feedback.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/users/forgot_password.html'
], function($, _, Backbone, forgotPasswordTemplate) {
  var ForgotPasswordView = Backbone.View.extend({
    //div.
    tagName:  "div",

    events: {
      "submit form": "submitForm"
    },
    
    render: function() {
      var compiledTemplate = _.template(forgotPasswordTemplate)();
      this.$el.html(compiledTemplate);
      return this;
    },

    submitForm(e) {
      e.preventDefault();
      var forgotPasswordView = this;
      if (forgotPasswordView.$("#username").val() != "") {
        $.post("/user/forgotPassword?username=" + forgotPasswordView.$("#username").val(), function(data) {
            forgotPasswordView.$("#forgotPassword").html(data.message);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR.responseText);
            forgotPasswordView.$("#emailError").html(jqXHR.responseText);
            setTimeout(function() {
              forgotPasswordView.$("#emailError").attr('tabindex', '-1').focus();
            }, 250);
        });
      } else {
        forgotPasswordView.$("#usernameGroup").addClass("has-error");
        forgotPasswordView.$("#username").addClass("error");
      }
    }
    
  });
  return ForgotPasswordView;
});
