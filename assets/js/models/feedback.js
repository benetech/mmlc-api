define([
  'app',
  'underscore',
  'backbone'
], function(app, _, Backbone){
  var Feedback = Backbone.Model.extend({
    url: function(){
        return App.API + '/feedback';
    }
  });
  return Feedback;
});
