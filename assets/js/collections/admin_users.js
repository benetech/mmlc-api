// Admin User collection
// ---------------
define([
  'underscore',
  'backbone',
  'paginator',
  '/js/models/user.js'
], function(_, Backbone, paginator, User){
  var AdminUserCollection = Backbone.PageableCollection.extend({
    model: User,
    url: function() {
      return '/admin/users?access_token=' + App.user.get("access_token");
    },

    state: {
      pageSize: 20
    },

    parseState: function (resp, queryParams, state, options) {
      return {totalRecords: resp.numUsers};
    },

    // get the actual records
    parseRecords: function (resp, options) {
      return resp.users;
    }
  });
  return AdminUserCollection;
});
