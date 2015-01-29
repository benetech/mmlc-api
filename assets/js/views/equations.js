//List of equations
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/equations/equations.html',
  'js/views/equation.js',
  'js/models/equation.js'
], function($, _, Backbone, bootstrap, equationsTemplate, EquationView, Equation) {
  var EquationsView = Backbone.View.extend({

    events: {
      "click .feedback": "openFeedbackModal"
    },
    
    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(equationsTemplate)({equations: this.collection.models});
      this.$el.html(compiledTemplate);
      return this;
    },

    openFeedbackModal: function(e) {
      e.preventDefault();
      var link = $(e.currentTarget);
      var equationView = new EquationView();
      var equation = new Equation(this.collection.get(link.data("model")));
      equation.fetch({
        success: function(model, response, options) {
          equationView.model = new Equation(response);
          $("#mmlcModalBody").html(equationView.render().el);
          $("#mmlcModalLabel").html("Submit Feedback");
          equationView.render();
          $("#mmlcModal").modal('show');
        }
      });
    }
    
  });
  return EquationsView;
});
