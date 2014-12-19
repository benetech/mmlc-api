// Image Collection
// ---------------
define([
  'underscore',
  'backbone',
  '/js/models/equation.js'
], function(_, Backbone, Equation){
  var Html5EquationCollection = Backbone.Collection.extend({
    initialize: function(models, options) {
        this.id = options.id;
    },
    url: function() {
        return '/html5/' + this.id + '/equations';
    },
    model: Equation,
  });
  return Html5EquationCollection;
});
