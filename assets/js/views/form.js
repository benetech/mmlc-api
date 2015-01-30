// Filename: views/form.js
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/equation.js',
  '/js/views/html5.js',
  'js/views/sign_up.js',
  'js/models/equation.js',
  'js/models/html5.js',
  'text!/templates/form.html'
], function($, _, Backbone, Bootstrap, EquationView, Html5View, SignUpView, Equation, Html5, formTemplate) {
  var FormView = Backbone.View.extend({

    tagName:  "div",

    events: {
      "submit .mml-editor": "submitConversionForm",
      "click input[name=conversionType]": "toggleFormSection",
      "click .register": "showRegisterModal"
    },

    render: function() {
      var formView = this;
      var compiledTemplate = _.template(formTemplate)({user: App.user});
      formView.$el.html(compiledTemplate);
      return this;
    },

    submitConversionForm: function(e) {
      e.preventDefault();
      var formView = this;
      formView.$("#go").val("Processing...");
      var conversionType = formView.$("input[name=conversionType]:checked");
      if (conversionType.attr("id") == "singleEquation") {
        formView.convertEquation(e);
      } else {
        formView.uploadHtml5(e);
      }
    },

    uploadHtml5: function(e) {
      var formView = this;
      if ($("#html5").val() == "") {
        alert ("Please select a HTML5 file to upload.");
        formView.$("#go").val("Process");
        return false;
      }
      formView.$(".errorMessage").html("");
      $("#results").html("");
      var data = new FormData();
      data.append("outputFormat", $("input[name='outputFormat']:checked").val());
      if (typeof(App.user) != "undefined") {
        data.append("access_token", App.user.get("access_token"));
      }
      data.append("html5", formView.$("#html5")[0].files[0], formView.$("#html5")[0].files[0].name);
      $.ajax({
        url: '/html5',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST'
      }).fail(function(jqXHR, textStatus, errorThrown) {
        var errResponse = $.parseJSON(jqXHR.responseText);
        var errMsg = errResponse.message ? errResponse.message : jqXHR.responseText;
        formView.$(".errorMessage").text("There was an error converting your math: " + errMsg);
        formView.$("#go").val("Process");
        setTimeout(function() {
          formView.$(".errorMessage").attr('tabindex', '-1').focus();
        }, 500);
      }).success(function(data) {
        App.router.navigate('#/html5/' + data.id, {trigger: true});
      });
    },

    convertEquation: function(e) {
      var formView = this;
      formView.$(".errorMessage").html("");
      $("#results").html("");
      if (formView.$("#mml-input").val() != "") {
        formView.convert();
      } else {
        alert("Please enter an equation.");
      }      
    },

    convert: function() {
      var formView = this;
      var equation = new Equation();
      equation.set({
        math: formView.$("textarea[name=math]").val(),
        mathType: formView.$("input[name=mathType]:checked").val(),
        svg: true,
        mml: true,
        png: true,
        description: true
      });
      if (typeof(App.user) != "undefined") {
        equation.set({access_token: App.user.get("access_token")});
      }
      equation.save(null, {
        success: function(model, response, options) {
          App.router.navigate('#/equation/' + response.id, {trigger: true});
        },
        error: function(model, response, options) {
			var message = response.responseJSON.message || "Unknown";
			formView.$(".errorMessage").text("There was an error converting your math: " + message);
          setTimeout(function() {
            formView.$(".errorMessage").attr('tabindex', '-1').focus();
          }, 500);
          formView.$("#go").val("Process");
        }
      });
    },

    hideOutputOptions: function() {
      $("#outputOptions").hide();
    },

    toggleFormSection: function(e) {
      var radio = $(e.currentTarget);
      var enable = radio.prop("id");
      var disable = enable == "singleEquation" ? "multipleEquations" : "singleEquation";
      $("." + enable).prop("disabled", false);
      $("." + disable).prop("disabled", true);

    },

    showRegisterModal: function(e) {
      e.preventDefault();
      var signUpView = new SignUpView();
      signUpView.render();
      $("#mmlcModal").modal('show');
      $("#mmlcModal").on('hidden.bs.modal', function (e) {
        App.navBar.render();
      });
    }
  });
  // Our module now returns our view
  return FormView;
});