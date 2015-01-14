define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var Equation = Backbone.Model.extend({
    urlRoot : '/equation'
  });
  return Equation;
});
