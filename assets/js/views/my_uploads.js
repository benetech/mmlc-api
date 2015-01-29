//List user's html5 uploads.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/html5_uploads.js',
  'js/views/pagination.js',
  'text!/templates/html5s/my_uploads.html',
  'text!/templates/html5s/html5_uploads.html'
], function($, _, Backbone, bootstrap, Html5UploadsView, PaginationView, myUploadsTemplate, html5UploadsTemplate) {
  var MyUploadsView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(myUploadsTemplate);
      this.$el.html(compiledTemplate);

      //Add uploads.
      this.renderUploads();

      //Add pagination.
      var paginationView = new PaginationView({collection: this.collection, el: this.$('#pagination')});
      paginationView.render();
      paginationView.delegateEvents();

      //Listen for a change to the collection from pagination.
      this.listenTo(this.collection, 'reset', this.renderUploads);

      return this;
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
