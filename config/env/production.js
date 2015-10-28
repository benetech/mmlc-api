/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var fs = require('fs');
module.exports = {
  connections: {
     'productionMongodbServer': {
		 url: process.env.MONGO_URL
     }
  },

  models: {
     connection: 'productionMongodbServer'
  },

  /***************************************************************************
   * Set the port                        *
   ***************************************************************************/

  port: 443,

  /**
  * Deprecated: SSL configuration will be handled by AWS ELB.
  */
  ssl: {
    key: fs.readFileSync('ssl/mathmlcloud.org.key'),
    cert: fs.readFileSync('ssl/mathmlcloud.crt'),
    ca: [fs.readFileSync('ssl/gd1.crt'), fs.readFileSync('ssl/gd2.crt'), fs.readFileSync('ssl/gd3.crt')]
  },

  /***************************************************************************
   * Set the log level                 *
   ***************************************************************************/

  log: {
    level: "warn"
  }
};
