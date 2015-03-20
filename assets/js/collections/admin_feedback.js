// Admin Feedback collection
// ---------------
define([
  'underscore',
  'backbone',
  'paginator',
  '/js/models/feedback.js'
], function(_, Backbone, paginator, Feedback){
  var AdminFeedbackCollection = Backbone.PageableCollection.extend({
    model: Feedback,
    url: function() {
      return '/admin/feedback?access_token=' + App.user.get("access_token");
    },

    state: {
      pageSize: 20
    },

    parseState: function (resp, queryParams, state, options) {
      return {totalRecords: resp.numFeedback};
    },

    // get the actual records
    parseRecords: function (resp, options) {
      return resp.feedback;
    }
  });
  return AdminFeedbackCollection;
});
