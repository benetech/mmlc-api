//List of feedback a user has submitted.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/feedback/my_feedback.html',
  'text!/templates/feedback/feedback.html',
  'text!/templates/pagination.html',
  'js/views/feedback.js',
  'js/views/pagination.js'
], function($, _, Backbone, bootstrap, myFeedbackTemplate, feedbackTemplate, paginationTemplate, FeedbackView, PaginationView) {
  var MyFeedbackView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    
    render: function() {
      var compiledTemplate = _.template(myFeedbackTemplate);
      this.$el.html(compiledTemplate);

      //Add user's feedback.
      this.renderFeedback();

      //Add pagination.
      var paginationView = new PaginationView({collection: this.collection, el: this.$('#pagination')});
      paginationView.render();
      paginationView.delegateEvents();

      //Listen for a change to the collection from pagination.
      this.listenTo(this.collection, 'reset', this.renderFeedback);

      return this;
    },

    renderFeedback: function() {
      //remove any old ones.
      if (this.feedbackView) {
        //avoid memory leaks.
        this.feedbackView.remove();
      }
      //Add equations.
      this.feedbackView = new FeedbackView({collection: this.collection});
      this.$("#feedback").html(this.feedbackView.render().el);
      this.feedbackView.delegateEvents();
    }
    
  });
  return MyFeedbackView;
});
