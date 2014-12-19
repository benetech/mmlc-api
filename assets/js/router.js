// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'js/views/form.js',
  'js/views/equation.js',
  'js/models/equation.js'
], function($, _, Backbone, FormView, EquationView, Equation){
  var AppRouter = Backbone.Router.extend({
    routes: {
      'showEquation/:id': 'showEquation',
      // Default
      '': 'home'
    }
  });

  var initialize = function() {
    var app_router = new AppRouter;
    app_router.on('route:home', function(actions) {
      //initialize the form.
      var formView = new FormView();
      formView.render();
    });
    Backbone.history.start({pushState: true});
  };
  return {
    initialize: initialize
  };
});