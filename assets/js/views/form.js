// Filename: views/form.js
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/equation.js',
  '/js/views/html5.js',
  'js/models/equation.js',
  'js/models/html5.js',
  'text!/templates/form.html'
], function($, _, Backbone, Bootstrap, EquationView, Html5View, Equation, Html5, formTemplate){
  var FormView = Backbone.View.extend({

    el: $('#main-content'),

    events: {
      "click .tab": "clickTab",
      "submit #mml-editor": "convertEquation",
      "submit #html5-editor": "uploadHtml5",
      "click #downloadSVG": "hideOutputOptions",
      "click #downloadPNG": "hideOutputOptions",
      "click #json": "showOutputOptions"
    },

    render: function() {
      var formView = this;
      var compiledTemplate = _.template(formTemplate);
      formView.$el.html(compiledTemplate);
      return this;
    },

    clickTab: function() {
      var formView = this;
      setTimeout(function() {
        $("h1").attr('tabindex', '-1').focus();
      }, 500);
      formView.$("#results").html("");
    },

    uploadHtml5: function(e) {
      var formView = this;
      if ($("#html5").val() == "") {
        alert ("Please select a HTML5 file to upload.");
        return false;
      }
      formView.$(".errorMessage").html("");
      $("#results").html("");
      $("#upload").prop("value", "Please wait, uploading html5");
      e.preventDefault();
      var data = new FormData();
      data.append("outputFormat", $("input[name='outputFormat']:checked").val());
      data.append("preview", $("input[name='preview']").val());
      data.append("html5", $("#html5")[0].files[0]);
      $.ajax({
        url: '/html5',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST'
      }).fail(function(jqXHR, textStatus, errorThrown) {
        formView.$(".errorMessage").text("There was an error converting your math: " + jqXHR.responseText);
        $("#processing").hide();
        setTimeout(function() {
          formView.$(".errorMessage").attr('tabindex', '-1').focus();
        }, 500);
      }).success(function(data) {
        var html5View = new Html5View();
        html5View.model = new Html5(data);
        formView.$("#results").html(html5View.render().el);
      }).always(function() {
        $("#upload").prop("value", "Upload File");
      });
    },

    convertEquation: function(e) {
      var formView = this;
      formView.$(".errorMessage").html("");
      $("#results").html("");
      if ($("#downloadPNG").prop("checked") == true) {
        $('#mml-editor').attr("action", "/equation/png");
      } else if ($("#json").prop("checked") == true) {
        e.preventDefault();
        if ($("#mml-input").val() != "") {
          formView.convert();
        } else {
          alert("Please enter an equation.");
        }
      }
    },

    convert: function() {
      var formView = this;
      $("#go").prop("value", "Please wait, converting equation.");
      var url = "/equation?" + $('#mml-editor').serialize(); 
      $.ajax({
        type: "POST",
        url: url,
        dataType: 'json'
      }).fail(function(jqXHR, textStatus, errorThrown) {
        formView.$(".errorMessage").text("There was an error converting your math: " + jqXHR.responseText);
        $("#processing").hide();
        setTimeout(function() {
          formView.$(".errorMessage").attr('tabindex', '-1').focus();
        }, 500);
      }).success(function(data) {
        var equationView = new EquationView();
        equationView.model = new Equation(data);
        formView.$("#results").html(equationView.render().el);
        setTimeout(function() {
          formView.$("h2:first").attr('tabindex', '-1').focus();
        }, 500);
      }).always(function() {
        $("#go").prop("value", "Convert Equation");
      });
    },

    hideOutputOptions: function() {
      $("#outputOptions").hide();
    }
  });
  // Our module now returns our view
  return FormView;
});