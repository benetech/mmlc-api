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
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
    }
  }
};
