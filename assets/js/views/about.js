//About View.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/about.html'
], function($, _, Backbone, aboutTemplate) {
  var AboutView = Backbone.View.extend({

    render: function() {
      var compiledTemplate = _.template(aboutTemplate)();
      this.$el.html(compiledTemplate);
      return this;
    }
	});
  return AboutView;
});
