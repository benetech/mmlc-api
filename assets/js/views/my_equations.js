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
  'js/views/pagination.js',
  'js/collections/equations.js'
], function($, _, Backbone, bootstrap, myEquationsTemplate, equationsTemplate, paginationTemplate, EquationsView, PaginationView, EquationCollection) {
  var MyEquationsView = Backbone.View.extend({

    //div.
    tagName:  "div",

    
    render: function() {
      var myEquationsView = this;
      var compiledTemplate = _.template(myEquationsTemplate);
      myEquationsView.$el.html(compiledTemplate);
      myEquationsView.collection = new EquationCollection();

      myEquationsView.collection.fetch({
        success: function(collection, response, options) {
          //Add equations.
          myEquationsView.renderEquations();

          //Add pagination.
          var paginationView = new PaginationView({collection: myEquationsView.collection, el: myEquationsView.$('#pagination')});
          paginationView.render();
          paginationView.delegateEvents();

          //Listen for a change to the collection from pagination.
          myEquationsView.listenTo(myEquationsView.collection, 'reset', myEquationsView.renderEquations);  
        }
      });
      return myEquationsView;
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
