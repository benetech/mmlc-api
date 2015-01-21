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

    el: $('#main-content'),

    events: {
      "submit #mml-editor": "submitConversionForm",
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
      formView.$("#go").hide();
      formView.$(".spinner").show();
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
        formView.$("#go").show();
        formView.$(".spinner").hide();
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
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/html5', true, null, null, null, true, true);
      xhr.onload = function () {
        //202 == accepted.
        if (xhr.status === 202) {
          var html5 = JSON.parse(xhr.response);
          App.router.navigate('#/html5/' + html5.id, {trigger: true});
        } else {
          formView.$(".errorMessage").text("There was an error converting your math: " + xhr.responseText);
          formView.$("#go").show();
          formView.$(".spinner").hide();
          setTimeout(function() {
            formView.$(".errorMessage").attr('tabindex', '-1').focus();
          }, 500);
        }
      };
      xhr.send(data);
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
        svg: formView.$("input[name=svg]").prop("checked"),
        mml: formView.$("input[name=mml]").prop("checked"),
        png: formView.$("input[name=png]").prop("checked"),
        description: formView.$("input[name=description]").prop("checked")
      });
      if (typeof(App.user) != "undefined") {
        equation.set({access_token: App.user.get("access_token")});
      }
      equation.save(null, {
        success: function(model, response, options) {
          App.router.navigate('#/equation/' + response.id, {trigger: true});
        },
        error: function(model, response, options) {
          formView.$(".errorMessage").text("There was an error converting your math: " + response);
          setTimeout(function() {
            formView.$(".errorMessage").attr('tabindex', '-1').focus();
          }, 500);
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