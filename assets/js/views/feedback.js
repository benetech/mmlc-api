//Feedback View.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/equations/equation.html',
  'js/models/feedback.js'
], function($, _, Backbone, equationTemplate, Feedback) {
  var FeedbackView = Backbone.View.extend({

    events: {
      "submit .commentsForm": "submitComments"
    },

    //div.
    el:  $("#mmlcModal"),
    
    render: function() {
      var compiledTemplate = _.template(equationTemplate)({equation: this.model});
      this.$("#mmlcModalBody").html(compiledTemplate);
      this.$("#mmlcModalLabel").html("Submit Feedback");
      return this;
    },

    submitComments: function(e) {
      var feedbackView = this;
      e.preventDefault();
      var feedback = new Feedback();
      feedback.set({
        comments: feedbackView.$("textarea[name=comments]").val(),
        equation: feedbackView.$("input[name=equation]").val()
      });
      if (feedbackView.$("input[name=components]:checked").length > 0) {
        var components = [];
        $.each(feedbackView.$("input[name=components]:checked"), function(index, component) {
          components.push($(component).val());
        });
        feedback.set({components: components});  
      }
      if (App.user != "") {
        feedback.set({access_token: App.user.get("access_token")});
      }
      feedback.save(null, {
        success: function(model, response, options) {
          feedbackView.$("#commentsMessaging").html("Thank you for your feedback!");
          setTimeout(function() {
            $("#commentsMessaging").attr('tabindex', '-1').focus();
          }, 500);
        }
      });
    }
    
  });
  return FeedbackView;
});
