/**
* User.js
*
* @description :: Users of MathML Cloud's API.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      required: true,
      enum: ['admin', 'user'],
      defaultsTo: 'user'
    },
    equations: {
      collection: 'equation',
      via: 'submittedBy'
    },
    uploads: {
      collection: 'html5',
      via: 'submittedBy'
    },
    organization: {
      type: 'string',
      required: false
    },
    organizationTypes: {
      type: 'array'
    },
    access_token: {
      type: 'string',
      required: false
    },
    termsOfService: {
      type: 'boolean',
      required: true
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
 
  beforeCreate: function(user, cb) {
    User.generateSalt(user, cb);  
  },

  beforeUpdate: function(user, cb) {
    User.generateSalt(user, cb);
  },

  generateSalt: function(user, cb) {
    if (user.password) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) {
            console.log(err);
            cb(err);
          } else{
            user.password = hash;
            cb(null, user);
          }
        });
      });
    } else {
      cb(null, user);
    }
    
  }
};

