/**
 * THIS FILE WAS ADDED AUTOMATICALLY by the Sails 1.0 app migration tool.
 */

module.exports.datastores = {

  // In previous versions, datastores (then called 'connections') would only be loaded
  // if a model was actually using them.  Starting with Sails 1.0, _all_ configured
  // datastores will be loaded, regardless of use.  So we'll only include datastores in
  // this file that were actually being used.  Your original `connections` config is
  // still available as `config/connections-old.js.txt`.

  productionMongodbServer: {
    adapter: 'sails-mongo',
    url: process.env.MONGO_URL
  },

  stagingMongodbServer: {
    adapter: 'sails-mongo',
    url: process.env.MONGO_URL
  },

  localMongodbServer: {
    adapter: 'sails-mongo',
    url: process.env.MONGO_URL
  }

};
