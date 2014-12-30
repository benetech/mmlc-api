// Equation collection
// ---------------
define([
  'underscore',
  'backbone',
  '/js/models/equation.js'
], function(_, Backbone, Equation){
  var EquationCollection = Backbone.Collection.extend({
    url: function() {
        return '/myEquations';
    },
    model: Equation,
  });
  return EquationCollection;
});
