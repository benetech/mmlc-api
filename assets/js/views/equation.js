//Describe view.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/equations/equation.html'
], function($, _, Backbone, equationTemplate) {
  var EquationView = Backbone.View.extend({

    events: {
      "submit .commentsForm": "submitComments"
    },

    //div.
    tagName:  "div",
    
    // Render the equation.
    render: function() {
      var compiledTemplate = _.template(equationTemplate)({equation: this.model});
      this.$el.html(compiledTemplate);
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
  return EquationView;
});
