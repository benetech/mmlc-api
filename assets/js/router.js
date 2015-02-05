// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'pace',
  'js/views/form.js',
  'js/views/nav_bar.js',
  'js/views/equation.js',
  'js/views/my_equations.js',
  'js/views/my_uploads.js',
  'js/views/my_feedback.js',
  'js/views/html5.js',
  'js/models/equation.js',
  'js/models/html5.js',
  'js/models/change_password.js',
  'js/collections/equations.js',
  'js/collections/html5s.js',
  'js/collections/feedback.js',
  'js/views/about.js',
  'js/views/main_content.js',
  'js/views/forgot_password.js',
  'js/views/change_password.js'
], function($, _, Backbone, pace, FormView, NavBarView, EquationView, MyEquationsView, MyUploadsView, MyFeedbackView, Html5View, Equation, Html5, ChangePassword, EquationCollection, Html5Collection, FeedbackCollection, AboutView, MainContentView, ForgotPasswordView, ChangePasswordView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'equation/:id': 'showEquation',
      'equations/:offset': 'showEquations',
      'equations': 'showEquations',
      'feedback': 'showFeedback',
      'uploads': 'showUploads',
      'uploads/:offset': 'showUploads',
      'html5/:id': 'showHtml5',
      'about': 'showAbout',
      'forgotPassword': 'showForgotPassword',
      'changePassword?token=:token&username=:username': 'showChangePassword',

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

    app_router.on('route:showEquations', function(page) {
      if (typeof(App.user) != "undefined") {
        var equationsView = new MyEquationsView();
        equationsView.collection = new EquationCollection();
        equationsView.collection.fetch({
          success: function(collection, response, options) {
            app_router.mainContentView.showView(equationsView);  
          }
        });
      } else {
        app_router.navigate('#/', {trigger: true});
      }
    });

    app_router.on('route:showUploads', function(page){
      if (typeof(App.user) != "undefined") {
        var uploadsView = new MyUploadsView();
        uploadsView.collection = new Html5Collection();
        uploadsView.collection.fetch({
          success: function(collection, response, options) {
            app_router.mainContentView.showView(uploadsView);
          }
        });
      } else {
        app_router.navigate('#/', {trigger: true});
      }
    });

    app_router.on('route:showFeedback', function(page){
      if (typeof(App.user) != "undefined") {
        var feedbackView = new MyFeedbackView({collection: new FeedbackCollection()});
        feedbackView.collection.fetch({
          success: function(collection, response, options) {
            app_router.mainContentView.showView(feedbackView);
          }
        });
      } else {
        app_router.navigate('#/', {trigger: true});
      }
    });
	
  	app_router.on('route:showAbout', function() {
  		var aboutView = new AboutView();
  		app_router.mainContentView.showView(aboutView);
  	});

    app_router.on('route:showForgotPassword', function() {
      var forgotPasswordView = new ForgotPasswordView();
      app_router.mainContentView.showView(forgotPasswordView);
    });

    app_router.on('route:showChangePassword', function(token, username) {
      var changePasswordView = new ChangePasswordView();
      changePasswordView.model = new ChangePassword({token: token, username: username});
      app_router.mainContentView.showView(changePasswordView);
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