/**
 * Staging environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var fs = require('fs');
module.exports = {
  hookTimeout: 80000,
  connections: {
     'stagingMongodbServer': {
        url: process.env.MONGO_URL
     }
  },

  models: {
     connection: 'stagingMongodbServer'
  },

  port: 443,
  
  /**
  * Deprecated: SSL configuration will be handled by AWS 
  */
  ssl: {
    key: fs.readFileSync('ssl/staging.mathmlcloud.org.key'),
    cert: fs.readFileSync('ssl/mathmlcloud.staging.crt'),
    ca: [fs.readFileSync('ssl/gd1.crt'), fs.readFileSync('ssl/gd2.crt'), fs.readFileSync('ssl/gd3.crt')]
  },
  /***************************************************************************
   * Set the log level                 *
   ***************************************************************************/

  log: {
    level: "debug"
  },

  transport: {
    service: process.env.SMTP_PROVIDER, 
    auth: {
        user: process.env.SMTP_SASL_USER,
        pass: process.env.SMTP_SASL_PASSWORD
    }
  }
};
