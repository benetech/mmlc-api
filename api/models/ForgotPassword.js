/**
* ForgotPassword.js
*
* @description :: Allocate a token to a user so he can reset his password.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    token: {
      type: 'string',
      required: true
    }
  }
};

