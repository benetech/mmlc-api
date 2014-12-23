/**
* html5.js
*
* @description :: An html document or fragment.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    filename: 'string',
  	source: {
      type: 'string',
      required: true
    },
    output: 'string',
    outputFormat: {
        type: 'string',
        required: true,
        enum: ['svg', 'png', 'description', 'mml']
    },
    equations: {
    	collection: 'equation',
    	via: 'html5'
    },
    status: {
      type: 'string',
      required: true,
      enum: ['accepted', 'processing', 'completed', 'failed']
    },
    comments: {
      type: 'string'
    }
  }
};

