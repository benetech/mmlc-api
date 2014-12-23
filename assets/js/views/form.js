// Filename: views/form.js
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/equation.js',
  '/js/views/html5.js',
  'js/models/equation.js',
  'js/models/html5.js'
], function($, _, Backbone, Bootstrap, EquationView, Html5View, Equation, Html5){
  var FormView = Backbone.View.extend({
    el: $('#equation-form'),
    events: {
      "click .tab": "setFocusOnH1",
      "submit #mml-editor": "convertEquation",
      "submit #html5-editor": "uploadHtml5",
      "click #downloadSVG": "hideOutputOptions",
      "click #downloadPNG": "hideOutputOptions",
      "click #json": "showOutputOptions"
    },

    setFocusOnH1: function() {
      setTimeout(function() {
        $("h1").attr('tabindex', '-1').focus();
      }, 500);
    },

    uploadHtml5: function(e) {
      if ($("#html5").val() == "") {
        alert ("Please select a HTML5 file to upload.");
        return false;
      }
      $("#errorMessage").html("");
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
        $("#errorMessage").text("There was an error converting your math: " + jqXHR.responseText);
        $("#processing").hide();
        setTimeout(function() {
          $("#errorMessage").attr('tabindex', '-1').focus();
        }, 500);
      }).success(function(data) {
        var html5View = new Html5View();
        html5View.model = new Html5(data);
        html5View.render();
        $("#upload").prop("value", "Upload File");
      });
    },

    convertEquation: function(e) {
      var formView = this;
      $("#errorMessage").html("");
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
      var url = "/equation?" + $('#mml-editor').serialize(); 
      $("#processing").show();
      $.ajax({
        type: "POST",
        url: url,
        dataType: 'json'
      }).fail(function(jqXHR, textStatus, errorThrown) {
        $("#errorMessage").text("There was an error converting your math: " + jqXHR.responseText);
        $("#processing").hide();
        setTimeout(function() {
          $("#errorMessage").attr('tabindex', '-1').focus();
        }, 500);
      }).success(function(data) {
        var equationView = new EquationView();
        equationView.model = new Equation(data);
        equationView.render();
      });
    },

    hideOutputOptions: function() {
      $("#outputOptions").hide();
    }
  });
  // Our module now returns our view
  return FormView;
});