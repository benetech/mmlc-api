// Admin Html5 collection
// ---------------
define([
  'underscore',
  'backbone',
  'paginator',
  '/js/models/html5.js'
], function(_, Backbone, paginator, Html5){
  var AdminHtml5Collection = Backbone.PageableCollection.extend({
    model: Html5,
    url: function() {
      return '/admin/html5uploads?access_token=' + App.user.get("access_token");
    },

    state: {
      pageSize: 20
    },

    parseState: function (resp, queryParams, state, options) {
      return {totalRecords: resp.numHtml5s};
    },

    // get the actual records
    parseRecords: function (resp, options) {
      return resp.html5s;
    }
  });
  return AdminHtml5Collection;
});
