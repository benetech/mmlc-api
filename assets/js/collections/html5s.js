// Html5 Uploads
// ---------------
define([
  'underscore',
  'backbone',
  '/js/models/html5.js'
], function(_, Backbone, Html5){
  var Html5Collection = Backbone.Collection.extend({
    initialize: function(models, options) {
        this.offset = options.offset;
    },
    url: function() {
        return '/myUploads?offset=' + this.offset;
    },
    model: Html5,
  });
  return Html5Collection;
});
