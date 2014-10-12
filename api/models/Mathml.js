
/**
 * Mathml
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  //XXX This is in no way complete
  attributes: {
	asciiMath: 'STRING',
	altText: 'STRING',
	mathML: 'STRING',
	equationName: 'STRING',
	equationType: 'STRING',
    qualityScore: 'INTEGER',
	submittedBy: 'STRING'
  }

};
