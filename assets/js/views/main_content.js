//
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap'
], function($, _, Backbone, bootstrap, warnUserTemplate) {
  var MainContentView = Backbone.View.extend({
    showView: function(view) {
        var mainContentView = this;
        if (mainContentView.currentView) {
            //avoid memory leaks.
            mainContentView.currentView.remove();
        }
        mainContentView.currentView = view;
        mainContentView.currentView.render();
        $("#main-content").html(mainContentView.currentView.el);
    } 
    
  });
  return MainContentView;
});
