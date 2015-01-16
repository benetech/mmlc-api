define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var Component = Backbone.Model.extend({
    urlRoot: '/component'
  });
  return Component;
});
