/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

console.log('SAILS CONFIG ENV = ' + sails.config.environment)
console.log('NODE_ENV = ' + process.env.NODE_ENV)

module.exports.bootstrap = function(cb) {

  sails.kue = require('kue'), sails.jobs = sails.kue.createQueue();
  sails.kue.app.listen(3000);
  QueueService.processJobs();

  if (sails.config.environment === 'staging') {
    sails.kue = require('kue'), sails.jobs = kue.createQueue({
      redis: {
        options: {
          // see https://github.com/mranney/node_redis#rediscreateclient
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
        }
      }
    });
    sails.kue.app.listen(3000);
    QueueService.processJobs();
  } else {
    sails.kue = require('kue'), sails.jobs = sails.kue.createQueue();
    sails.kue.app.listen(3000);
    QueueService.processJobs();
  }

  if (sails.config.environment != 'development') {
    var express = require("express"),
         app = express();

    app.get('*', function(req,res) {  
        res.redirect('https://' + req.headers.host + req.url)
    }).listen(80);  
  }
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
