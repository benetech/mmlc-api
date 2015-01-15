define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Feedback = Backbone.Model.extend({
    url: function(){
        return App.API + '/feedback';
    }
  });
  return Feedback;
});
