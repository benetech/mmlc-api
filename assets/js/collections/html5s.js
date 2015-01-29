// Html5 Uploads
// ---------------
define([
  'underscore',
  'backbone',
  'paginator',
  '/js/models/html5.js'
], function(_, Backbone, paginator, Html5){
  var Html5Collection = Backbone.PageableCollection.extend({
    model: Html5,
    url: function() {
      return '/myUploads?access_token=' + App.user.get("access_token");
    },

    state: {
      pageSize: 10
    },

    parseState: function (resp, queryParams, state, options) {
      return {totalRecords: resp.numHtml5s};
    },

    // get the actual records
    parseRecords: function (resp, options) {
      return resp.html5s;
    }
  });
  return Html5Collection;
});
