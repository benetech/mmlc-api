/**
* Feedback.js
*
* @description :: Feedback for a single equation and its different components. 
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	equation: {
  		model: 'equation',
  		required: true
  	},
  	components: {
  		collection: 'component'
  	},
  	comments: {
  		type: 'string',
  		required: true
  	},
    submittedBy: {
      model: 'user'
    }
  }
};

