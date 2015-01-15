//List of components
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/components/components.html',
  'js/views/feedback.js'
], function($, _, Backbone, bootstrap, componentsTemplate) {
  var ComponentsView = Backbone.View.extend({

    events: {
      "click .feedback": "openFeedbackModal"
    },
    
    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(componentsTemplate)({components: this.collection.models});
      this.$el.html(compiledTemplate);
      return this;
    }
    
  });
  return ComponentsView;
});
