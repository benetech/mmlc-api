define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var Component = Backbone.Model.extend({
    url: function(){
        return App.API + '/component';
    }
  });
  return Component;
});
