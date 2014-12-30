//List of equations
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/equations/equations.html',
  'js/views/feedback.js'
], function($, _, Backbone, bootstrap, equationsTemplate, FeedbackView) {
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
      var feedbackView = new FeedbackView();
      var equation = this.collection.get(link.data("model"));
      feedbackView.model = equation;
      feedbackView.render();
      $("#mmlcModal").modal('show');
    }
    
  });
  return EquationsView;
});
