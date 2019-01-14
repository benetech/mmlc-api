var sails = require('sails');

var liftSails = {
    jasmineStarted: function(options, done) {
        // Tests expect to run with NODE_ENV=development
        process.env.NODE_ENV = 'development';
        sails.lift({
            // Your sails app's configuration files will be loaded automatically,
            // but you can also specify any other special overrides here for testing purposes.

            // For example, we might want to skip the Grunt hook,
            // and disable all logs except errors:
            hooks: { grunt: false },
            log: { level: 'error' },
        }, done);
    },
    jasmineDone: function(options, done) {
        sails.lower(done);
    }
}

jasmine.getEnv().addReporter(liftSails);
