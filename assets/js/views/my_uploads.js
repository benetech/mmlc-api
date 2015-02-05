//List user's html5 uploads.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/html5_uploads.js',
  'js/views/pagination.js',
  'js/collections/html5s.js',
  'text!/templates/html5s/my_uploads.html',
  'text!/templates/html5s/html5_uploads.html'
], function($, _, Backbone, bootstrap, Html5UploadsView, PaginationView, Html5Collection, myUploadsTemplate, html5UploadsTemplate) {
  var MyUploadsView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    render: function() {
      var uploadsView = this;
      var compiledTemplate = _.template(myUploadsTemplate);
      uploadsView.$el.html(compiledTemplate);
      uploadsView.collection = new Html5Collection();
      uploadsView.collection.fetch({
        success: function(collection, response, options) {
          //Add uploads.
          uploadsView.renderUploads();

          //Add pagination.
          var paginationView = new PaginationView({collection: uploadsView.collection, el: uploadsView.$('#pagination')});
          paginationView.render();
          paginationView.delegateEvents();

          //Listen for a change to the collection from pagination.
          uploadsView.listenTo(uploadsView.collection, 'reset', uploadsView.renderUploads);
        }
      });
      return uploadsView;
    },

    renderUploads: function() {
      //remove any old ones.
      if (this.uploadsView) {
        //avoid memory leaks.
        this.uploadsView.remove();
      }
      //Add uploads
      this.uploadsView = new Html5UploadsView({collection: this.collection});
      this.$("#uploads").html(this.uploadsView.render().el);
      this.uploadsView.delegateEvents();
    }
    
  });
  return MyUploadsView;
});
