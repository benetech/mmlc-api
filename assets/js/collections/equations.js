// Equation collection
// ---------------
define([
  'underscore',
  'backbone',
  '/js/models/equation.js'
], function(_, Backbone, Equation){
  var EquationCollection = Backbone.Collection.extend({
    initialize: function(models, options) {
        this.offset = options.offset;
    },
    url: function() {
        return '/myEquations?offset=' + this.offset + '&access_token=' + App.user.get("access_token");
    },
    model: Equation,
  });
  return EquationCollection;
});
