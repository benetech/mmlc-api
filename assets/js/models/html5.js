define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var Html5 = Backbone.Model.extend({
    url: function(){
        return App.API + '/html5';
    }
  });
  return Html5;
});
