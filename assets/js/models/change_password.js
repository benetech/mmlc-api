define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var ChangePassword = Backbone.Model.extend({
    urlRoot : '/changePassword',
    blacklist: ["confirmPassword"],

    validation: {
      password: {
        required: true
      },
      confirmPassword: {
        equalTo: 'password'
      }
    },

    toJSON: function(options) {
        return _.omit(this.attributes, this.blacklist);
    }
    
  });
  return ChangePassword;
});
