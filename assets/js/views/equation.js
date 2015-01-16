//Describe view.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/equations/equation.html',
  'js/models/feedback.js',
  'js/models/equation.js',
  'js/views/components.js',
  'js/collections/components.js'
], function($, _, Backbone, equationTemplate, Feedback, Equation, ComponentsView, ComponentsCollection) {
  var EquationView = Backbone.View.extend({

    events: {
      "submit .commentsForm": "submitComments",
      "click #updateEquation": "updateEquation"
    },

    //div.
    tagName:  "div",
    
    // Render the equation.
    render: function() {
      var compiledTemplate = _.template(equationTemplate)({equation: this.model});
      this.$el.html(compiledTemplate);
      var componentsView = new ComponentsView();
      componentsView.$el = this.$('#components');
      componentsView.collection = this.model.get("components");
      componentsView.render();
      componentsView.delegateEvents();
      return this;
    },

    submitComments: function(e) {
      var feedbackView = this;
      e.preventDefault();
      var feedback = new Feedback();

      var url = "/feedback?" + feedbackView.$('.commentsForm').serialize(); 
      $.ajax({
        type: "POST",
        url: url,
        dataType: 'json'
      }).done(function(data) {
        $("#commentsMessaging").html("Thank you for your feedback!");
        setTimeout(function() {
          $("#commentsMessaging").attr('tabindex', '-1').focus();
        }, 500);
      });
    },

    updateEquation: function(e) {
      e.preventDefault();
      var equationView = this;
      equationView.model.save({math: equationView.$("#equationMath").val()}, {
        success: function(model, response, options) {
          var updatedEquation = new Equation(response);
          var componentsView = new ComponentsView();
          componentsView.collection = updatedEquation.get("components");
          equationView.$("#components").html(componentsView.render().el);
          setTimeout(function() {
            equationView.$("h2:first").attr('tabindex', '-1').focus();
          }, 500);
        },
        error: function(model, response, options) {
          equationView.$(".errorMessage").text("There was an error converting your math: " + response);
          setTimeout(function() {
            equationView.$(".errorMessage").attr('tabindex', '-1').focus();
          }, 500);
        }
      });
    }
    
  });
  return EquationView;
});
