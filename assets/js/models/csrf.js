define([
  'app',
  'underscore',
  'backbone'
], function(app, _, Backbone){
  var Csrf = Backbone.Model.extend({
    urlRoot: "/csrfToken"
  });
  return Csrf;
});
