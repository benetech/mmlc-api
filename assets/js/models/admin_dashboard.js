define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var AdminDashboard = Backbone.Model.extend({
    url: function() {
      return '/admin?access_token=' + App.user.get("access_token");
    }
  });
  return AdminDashboard;
});
