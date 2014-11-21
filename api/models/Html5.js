/**
* html5.js
*
* @description :: An html document or fragment.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    filename: 'string',
  	source: 'string',
    output: 'string',
    outputFormat: {
        type: 'string',
        required: true,
        enum: ["SVG", "NativeMML", "IMG", "PNG", "None"]
    },
    equations: {
    	collection: 'equation',
    	via: 'html5'
    }
  }
};

