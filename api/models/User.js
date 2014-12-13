/**
* User.js
*
* @description :: Users of MathML Cloud's API.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
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
      enum: ['admin', 'user']
    },
    equations: {
      collection: 'equation',
      via: 'submittedBy'
    },
    organization: {
      type: 'string',
      required: false
    },
    organizationalAffiliation: {
      collection: 'string',
      enum: ['K-12 Education', 'Post-Secondary Education', 'Learning Management System', 
        'Academic Administration', 'Original Content Author', 'Publisher / Product Owner', 
        'Service Provider', 'Classroom Instructor', 'Other']
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
 
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        }else{
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
};

