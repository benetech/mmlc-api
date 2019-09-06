const { BeforeAll, AfterAll, After } = require('cucumber');
var sails = require('sails');

BeforeAll(function(done) {
    // Tests expect to run with NODE_ENV=development
    process.env.NODE_ENV = 'development';
    sails.lift({
        // Your sails app's configuration files will be loaded automatically,
        // but you can also specify any other special overrides here for testing purposes.

        // For example, we might want to skip the Grunt hook,
        // and disable all logs except errors:
        hooks: { grunt: false },
        log: { level: 'info' },
    }, done);
});

AfterAll(function(done) {
    sails.lower(done);
});

After(function(done) {
    if (this.username) {
        User.destroy({username: this.username}, done);
    }
});
