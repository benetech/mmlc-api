define([
  'underscore',
  'backbone',
  'js/collections/components.js'
], function(_, Backbone, Components) {
  var Feedback = Backbone.Model.extend({
    urlRoot: '/feedback',

    initialize: function() {
        this.set({components: new Components(this.get("components"))});
    }
  });
  return Feedback;
});
