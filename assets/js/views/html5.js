//HTML5 Upload
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/html5s/html5.html',
  'js/collections/html5_equations.js',
  '/js/views/equations.js'
], function($, _, Backbone, html5Template, Html5EquationCollection, EquationsView) {
  var Html5View = Backbone.View.extend({
    //div.
    tagName:  "div",

    // Render the html5
    render: function() {
      var html5View = this;
      var compiledTemplate = _.template(html5Template)({html5: html5View.model});
      html5View.$el.html(compiledTemplate);
      setTimeout(function() {
        html5View.$("h2:first").attr('tabindex', '-1').focus();
      }, 500);
      if (typeof(html5View.timerId) != "undefined") clearTimeout(html5View.timerId);
      if (html5View.model.get("status") == "accepted" || html5View.model.get("status") == "processing") {
        html5View.doPoll();
      } else if (html5View.model.get("status") == "completed") {
        //get equations.
        var equationsView = new EquationsView();
        equationsView.collection = new Html5EquationCollection([], { id: html5View.model.get("id") });
        equationsView.collection.fetch({
          success: function(collection) {
            equationsView.$el = html5View.$('#equations');
            equationsView.render();
            equationsView.delegateEvents();
          }
        });
      }
      return this;
    },

    doPoll: function() {
      var html5View = this;
      html5View.timerId = setInterval(function() {
        html5View.model.fetch({
          success: function() {
            if (html5View.model.hasChanged("status")) {
              html5View.render();
            } 
          }
        });
      }, 5000);
    }
    
  });
  return Html5View;
});
