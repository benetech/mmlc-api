define([
  'underscore',
  'backbone',
  'js/collections/components.js'
], function(_, Backbone, Components){
  var Equation = Backbone.Model.extend({
    urlRoot : '/equation',

    initialize: function() {
        this.set({components: new Components(this.get("components"))});
    }
  });
  return Equation;
});
