//List of equations
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!/templates/equations/my_equations.html',
  'text!/templates/equations/equations.html',
  'text!/templates/pagination.html',
  'js/views/equations.js',
  'js/views/pagination.js'
], function($, _, Backbone, bootstrap, myEquationsTemplate, equationsTemplate, paginationTemplate, EquationsView, PaginationView) {
  var MyEquationsView = Backbone.View.extend({

    //div.
    tagName:  "div",

    
    render: function() {
      var compiledTemplate = _.template(myEquationsTemplate);
      this.$el.html(compiledTemplate);

      //Add equations.
      this.renderEquations();

      //Add pagination.
      var paginationView = new PaginationView({collection: this.collection, el: this.$('#pagination')});
      paginationView.render();
      paginationView.delegateEvents();

      //Listen for a change to the collection from pagination.
      this.listenTo(this.collection, 'reset', this.renderEquations);

      return this;
    },

    renderEquations: function() {
      //remove any old ones.
      if (this.equationsView) {
        //avoid memory leaks.
        this.equationsView.remove();
      }
      //Add equations.
      this.equationsView = new EquationsView({collection: this.collection});
      this.$("#equations").html(this.equationsView.render().el);
      this.equationsView.delegateEvents();
    }
    
  });
  return MyEquationsView;
});
