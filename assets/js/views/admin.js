//Admin View.
define([
  'jquery',
  'underscore',
  'backbone',
  'js/views/equations.js',
  'js/views/pagination.js',
  'js/views/feedback.js',
  'js/views/users.js',
  'js/views/html5_uploads.js',
  'js/collections/admin_equations.js',
  'js/collections/admin_feedback.js',
  'js/collections/admin_users.js',
  'js/collections/admin_html5s.js',
  'text!/templates/admin.html'
], function($, _, Backbone, EquationsView, PaginationView, FeedbackView, UsersView, UploadsView, EquationsCollection, FeedbackCollection, UsersCollection, Html5sCollection, adminTemplate) {
  var AdminView = Backbone.View.extend({
    render: function() {
      var compiledTemplate = _.template(adminTemplate)({dashboard: this.model});;
      this.$el.html(compiledTemplate);
      var adminView = this;
      //Add the tab content.
      adminView.addEquations();
      adminView.addFeedback();
      adminView.addUsers();
      adminView.addUploads();
      return this;
    },

    addEquations: function() {
      var adminView = this;
      adminView.equations = new EquationsCollection();
      adminView.equations.fetch({
        success: function(collection, response, options) {
          adminView.renderEquations();
          adminView.addPagination(adminView.equations, adminView.$('#equations .pagination'));
          adminView.listenTo(adminView.equations, 'reset', adminView.renderEquations);  
        }
      });
    },

    renderEquations: function() {
      if (this.equationsView) {
        this.equationsView.remove();
      }
      //Add equations.
      this.equationsView = new EquationsView({collection: this.equations});
      this.$("#equations .results").html(this.equationsView.render().el);
      this.equationsView.delegateEvents();
    },

    addFeedback: function() {
      var adminView = this;
      adminView.feedback = new FeedbackCollection();
      adminView.feedback.fetch({
        success: function(collection, response, options) {
          adminView.renderFeedback();
          adminView.addPagination(adminView.feedback, adminView.$('#feedback .pagination'));
          adminView.listenTo(adminView.feedback, 'reset', adminView.renderFeedback);  
        }
      });
    },

    renderFeedback: function() {
      if (this.feedbackView) {
        this.feedbackView.remove();
      }
      this.feedbackView = new FeedbackView({collection: this.feedback});
      this.$("#feedback .results").html(this.feedbackView.render().el);
      this.feedbackView.delegateEvents();
    },

    addUsers: function() {
      var adminView = this;
      adminView.users = new UsersCollection();
      adminView.users.fetch({
        success: function(collection, response, options) {
          adminView.renderUsers();
          adminView.addPagination(adminView.users, adminView.$('#users .pagination'));
          adminView.listenTo(adminView.users, 'reset', adminView.renderUsers);  
        }
      });
    },

    renderUsers: function() {
      if (this.usersView) {
        this.usersView.remove();
      }
      //Add users
      this.usersView = new UsersView({collection: this.users});
      this.$("#users .results").html(this.usersView.render().el);
      this.usersView.delegateEvents();
    },

    addUploads: function() {
      var adminView = this;
      adminView.uploads = new Html5sCollection();
      adminView.uploads.fetch({
        success: function(collection, response, options) {
          adminView.renderUploads();
          adminView.addPagination(adminView.uploads, adminView.$('#html5 .pagination'));
          adminView.listenTo(adminView.uploads, 'reset', adminView.renderUploads);  
        }
      });
    },

    renderUploads: function() {
      if (this.uploadsView) {
        this.uploadsView.remove();
      }
      //Add uploads
      console.log(this.uploads);
      this.uploadsView = new UploadsView({collection: this.uploads});
      this.$("#html5 .results").html(this.uploadsView.render().el);
      this.uploadsView.delegateEvents();
    },

    addPagination: function(collection, pagination) {
      var paginationView = new PaginationView({collection: collection, el: pagination});
      paginationView.render();
      paginationView.delegateEvents();  
    }
  });
  return AdminView;
});
