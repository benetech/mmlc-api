var assert = require('assert');
const { Given, When, Then } = require('cucumber');
var fs = require('fs');
var path = require('path');

Given('a ZIP file', function() {
    var zipPath = path.resolve(__dirname, '../../../spec/data/sample-math.zip');
    this.formData = {
        'html5': {
            value: fs.createReadStream(zipPath),
            options: {
                filename: 'sample-math.zip',
                contentType: 'application/zip'
            }
        }
    };
});

Given('a request method of PUT', function() {
    this.method = 'put';
});

Given('a bogus equation ID', function() {
    this.equationID = 'abcdefg';
});

Given('an English equation', function() {
    this.equation = {
        mathType: 'English',
        math: 'a plus b'
    }
});

Then(/I should get an error code of (\d+)/, function(errorCode) {
    assert.equal(this.lastBody.errorCode, errorCode);
});

Then(/I should get a status code of (\d+)/, function(statusCode) {
    assert.equal(this.lastResponse.statusCode, statusCode);
});

Then('I should get an error message', function() {
    assert(this.lastBody.code || this.lastBody.errorCode);
    assert(this.lastBody.details || this.lastBody.message);
});
