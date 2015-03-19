//List of users
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/users/users.html'
], function($, _, Backbone, usersTemplate) {
  var UsersView = Backbone.View.extend({

    //div.
    tagName:  "div",
    
    render: function() {
      var compiledTemplate = _.template(usersTemplate)({users: this.collection.models});
      this.$el.html(compiledTemplate);
      return this;
    }
  });
  return UsersView;
});
