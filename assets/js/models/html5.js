define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var Html5 = Backbone.Model.extend({
    urlRoot : '/html5'
    
  });
  return Html5;
});
