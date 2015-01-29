//Default paginator.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/pagination.html'
], function($, _, Backbone, paginationTemplate) {

  var PaginationView = Backbone.View.extend({

    //div.
    tagName:  "div",

    events: {
      "click .page": "getPage"
    },

    render: function() {
      var compiledTemplate = _.template(paginationTemplate)({paginator: this.collection});
      this.$el.html(compiledTemplate);
      return this;
    },

    getPage: function(e) {
      e.preventDefault();
      var page = $(e.currentTarget).data("page");
      var paginationView = this;
      //Please listen for the reset event on this collection to rerender your view.
      paginationView.collection.getPage(page, {reset:true}).done(function() {
        paginationView.render();  
        setTimeout(function() {
          paginationView.$(".active > a").focus();
        }, 500);
      });
    }

  });
  return PaginationView;
});
