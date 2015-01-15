// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'js/views/form.js',
  'js/views/nav_bar.js',
  'js/views/equation.js',
  'js/views/equations.js',
  'js/views/html5.js',
  'js/models/equation.js',
  'js/models/html5.js',
  'js/collections/equations.js',
  'js/collections/html5s.js',
  'js/views/html5_uploads.js',
  'js/views/about.js'
], function($, _, Backbone, FormView, NavBarView, EquationView, EquationsView, Html5View, Equation, Html5, EquationCollection, Html5Collection, Html5UploadsView, AboutView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'equation/:id': 'showEquation',
      'equations/:offset': 'showEquations',
      'equations': 'showEquations',
      'uploads': 'showUploads',
      'uploads/:offset': 'showUploads',
      'html5/:id': 'showHtml5',
      'about': 'showAbout',

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
      var equation = new Equation({id: id});
      equation.fetch({
        success: function(model, response, options) {
          equationView.model = new Equation(response);
          $("#main-content").html(equationView.render().el)
        }
      });
    });

    app_router.on('route:showHtml5', function(id) {
      var html5View = new Html5View();
      html5View.model = new Html5({id: id});
      html5View.model.fetch({
        success: function() {
          $("#main-content").html(html5View.render().el)
        }
      });
      app_router.initializeNav();
    });

    app_router.on('route:showEquations', function(offset) {
      var skip = offset ? offset : 0;
      var equationsView = new EquationsView();
      equationsView.collection = new EquationCollection([], {offset: skip});
      equationsView.collection.fetch({
        success: function() {
          $("#main-content").html(equationsView.render().el);   
        }
      });
      app_router.initializeNav();
    });

    app_router.on('route:showUploads', function(offset){
      var skip = offset ? offset : 0;
      var uploadsView = new Html5UploadsView();
      uploadsView.collection = new Html5Collection([], {offset: skip});
      uploadsView.collection.fetch({
        success: function() {
          $("#main-content").html(uploadsView.render().el);    
        }
      });
      app_router.initializeNav();
    });
	
	app_router.on('route:showAbout', function() {
		var aboutView = new AboutView();
		$("#main-content").html(aboutView.render().el);
		app_router.initializeNav();
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