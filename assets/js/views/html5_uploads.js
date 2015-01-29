//List user's html5 uploads.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/html5s/html5_uploads.html'
], function($, _, Backbone, bootstrap, html5UploadsTemplate) {
  var Html5UploadsView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(html5UploadsTemplate)({html5Uploads: this.collection.models});
      this.$el.html(compiledTemplate);
      return this;
    }
    
  });
  return Html5UploadsView;
});
