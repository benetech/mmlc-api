//List of feedback.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'moment',
  'text!/templates/feedback/feedback.html'
], function($, _, Backbone, moment, bootstrap, feedbackTemplate) {
  var FeedbackView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(feedbackTemplate)({feedback: this.collection.models});
      this.$el.html(compiledTemplate);
      return this;
    }
    
  });
  return FeedbackView;
});
