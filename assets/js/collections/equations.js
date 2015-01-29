// Equation collection
// ---------------
define([
  'underscore',
  'backbone',
  'paginator',
  '/js/models/equation.js'
], function(_, Backbone, paginator, Equation){
  var EquationCollection = Backbone.PageableCollection.extend({
    model: Equation,
    url: function() {
      return '/myEquations?access_token=' + App.user.get("access_token");
    },

    state: {
      pageSize: 10
    },

    parseState: function (resp, queryParams, state, options) {
      return {totalRecords: resp.numEquations};
    },

    // get the actual records
    parseRecords: function (resp, options) {
      return resp.equations;
    }
  });
  return EquationCollection;
});
