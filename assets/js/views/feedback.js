//Feedback View.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/equations/equation.html'
], function($, _, Backbone, equationTemplate) {
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
      var url = "/feedback?" + feedbackView.$('.commentsForm').serialize(); 
      console.log(url);
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
    }
    
  });
  return FeedbackView;
});
