define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Feedback = Backbone.Model.extend({
    urlRoot: '/feedback'
  });
  return Feedback;
});
