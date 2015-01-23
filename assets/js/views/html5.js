//HTML5 Upload
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/html5s/html5.html',
  'js/collections/html5_equations.js',
  '/js/views/equations.js',
  'js/views/warnUser.js'
], function($, _, Backbone, bootstrap, html5Template, Html5EquationCollection, EquationsView, WarnUserView) {
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
      $("a:not(#registerLink)").on("click", {html5View: html5View}, html5View.warnUser);
      App.router.on("route", function(route, params) {
        if (typeof(html5View.timerId) != "undefined") clearTimeout(html5View.timerId);
      });
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
    },

    warnUser: function(event) {
      var html5View = event.data.html5View;
      if (typeof(App.user) == "undefined" && ["accepted", "processing"].indexOf(html5View.model.get("status")) !== -1) {
        event.preventDefault();
        var continueTo = $(event.currentTarget).attr("href");
        var warnUserView = new WarnUserView();
        warnUserView.render();
        warnUserView.$("#continue").attr("href", continueTo);
        $("#mmlcModal").modal('show');
        warnUserView.$("#continue").on("click", function(e) {
          //Unbind warning.
          $("a:not(#registerLink)").off("click", html5View.warnUser);  
        });
        return false;
      } else {
        return true;
      }
    }
    
  });
  return Html5View;
});
