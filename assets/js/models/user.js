define([
  'underscore',
  'backbone',
  'validation'
], function(_, Backbone, validation){
  var User = Backbone.Model.extend({
    urlRoot : '/user',
    blacklist: ["confirmEmail", "confirmPassword", "termsOfService"],

    validation: {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        username: {
          pattern: 'email',
        },
        confirmEmail: {
          equalTo: 'username'
        },
        password: {
            required: true
        },
        confirmPassword: {
          equalTo: 'password'
        },
        termsOfService: {
            acceptance: true
        }
    },

    labels: {
        username: 'Email'
    },

    toJSON: function(options) {
        return _.omit(this.attributes, this.blacklist);
    }
    
  });
  return User;
});
