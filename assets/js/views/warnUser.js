//Warn user about leaving the page.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/warnUser.html'
], function($, _, Backbone, bootstrap, warnUserTemplate) {
  var WarnUserView = Backbone.View.extend({

    //div.
    el:  $("#mmlcModal"),

    events: {
      "click #continue": "closeModal"
    },
    
    render: function() {
      var compiledTemplate = _.template(warnUserTemplate);
      this.$("#mmlcModalBody").html(compiledTemplate);
      this.$("#mmlcModalLabel").html("Warning");
      return this;
    },

    closeModal: function() {
      $("#mmlcModal").modal('hide');
    }
    
  });
  return WarnUserView;
});
