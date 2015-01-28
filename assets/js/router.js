// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'pace',
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
  'js/views/about.js',
  'js/views/main_content.js'
], function($, _, Backbone, pace, FormView, NavBarView, EquationView, EquationsView, Html5View, Equation, Html5, EquationCollection, Html5Collection, Html5UploadsView, AboutView, MainContentView){
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

    initialize: function() {
      //One instance of the nav bar.
      var navBar = new NavBarView();
      navBar.render();   
      App.navBar = navBar;

      //Keep track of where we are.
      this.mainContentView = new MainContentView();
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.initialize();

    app_router.on('route:showEquation', function(id) {
      var equationView = new EquationView();
      var equation = new Equation({id: id});
      equation.fetch({
        success: function(model, response, options) {
          equationView.model = new Equation(response);
          app_router.mainContentView.showView(equationView);
        }
      });
    });

    app_router.on('route:showHtml5', function(id) {
      var html5View = new Html5View();
      html5View.model = new Html5({id: id});
      html5View.model.fetch({
        success: function() {
          app_router.mainContentView.showView(html5View);
        }
      });
    });

    app_router.on('route:showEquations', function(offset) {
      var skip = offset ? offset : 0;
      var equationsView = new EquationsView();
      equationsView.collection = new EquationCollection([], {offset: skip});
      equationsView.collection.fetch({
        success: function() {
          app_router.mainContentView.showView(equationsView);   
        }
      });
    });

    app_router.on('route:showUploads', function(offset){
      var skip = offset ? offset : 0;
      var uploadsView = new Html5UploadsView();
      uploadsView.collection = new Html5Collection([], {offset: skip});
      uploadsView.collection.fetch({
        success: function() {
          app_router.mainContentView.showView(uploadsView);
        }
      });
    });
	
  	app_router.on('route:showAbout', function() {
  		var aboutView = new AboutView();
  		app_router.mainContentView.showView(aboutView);
  	});

    app_router.on('route:defaultAction', function(actions){
      app_router.mainContentView.showView(new FormView());
    });
    Backbone.history.start();
    Backbone.history.on("all", function (route, router) {
      $("#results").html("");
    });
    return app_router;
  };
  return {
    initialize: initialize
  };
});