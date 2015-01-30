//List of components
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/components/components.html'
], function($, _, Backbone, bootstrap, componentsTemplate) {
  var ComponentsView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(componentsTemplate)({components: this.collection});
      this.$el.html(compiledTemplate);
      return this;
    }
    
  });
  return ComponentsView;
});
