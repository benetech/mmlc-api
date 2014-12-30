// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'js/views/form.js',
  'js/views/nav_bar.js',
  'js/views/equation.js',
  'js/views/equations.js',
  'js/models/equation.js',
  'js/collections/equations.js'
], function($, _, Backbone, FormView, NavBarView, EquationView, EquationsView, Equation, EquationCollection){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'equation/:id': 'showEquation',
      'equations': 'showEquations',

      // Default
      '*actions': 'defaultAction'
    },

    initializeNav: function() {
      var navBar = new NavBarView();
      navBar.render();   
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('route:showEquation', function(id) {
      var equationView = new EquationView();
      equationView.model = new Equation({id: id});
      equationView.model.fetch({
        success: function() {
          $("#main-content").html(equationView.render().el)
        }
      });
      app_router.initializeNav();
    });

    app_router.on('route:showEquations', function(){
      var equationsView = new EquationsView();
      equationsView.collection = new EquationCollection();
      equationsView.collection.fetch({
        success: function() {
          $("#main-content").html(equationsView.render().el);    
        }
      });
    });

    app_router.on('route:defaultAction', function(actions){
      var formView = new FormView();
      formView.render();
      app_router.initializeNav();
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});