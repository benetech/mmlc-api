// Step definitions for the registration scenarios
var assert = require('assert');
var FormData = require('form-data');
var fs = require('fs');
var path = require('path');
const { Given, When, Then } = require('cucumber');

Given('a converted equation', function(callback) {
    this.makeEquation({
        mathType: 'AsciiMath',
        math: 'a^2+b^2=c^2',
        description: true,
        svg: true
    }, callback);
});

Given('an AsciiMath equation', function() {
    this.equation = {
        mathType: 'AsciiMath',
        math: 'a + b'
    }
});

Given(/^an HTML file containing equations$/, function() {
    var html5Path = path.resolve(__dirname, '../../../spec/data/sample-math.html');
    this.formData = {
        'html5': {
            value: fs.createReadStream(html5Path),
            options: {
                filename: 'sample-math.html',
                contentType: 'text/html'
            }
        }
    };
});

// When steps
When('I ask for a text description', function(callback) {
    this.equation.description = true;
    var this_ = this;
    this.makeEquation(this.equation, function(error) {
        if (error) {
            return callback();
        }
        this_.get('/equation/' + this_.equationID, function(error) {
            if (error) {
                callback(error);
            } else {
                callback();
            }
        });
    })
});

When('I ask for the first component by ID', function(callback) {
    this.componentID = this.lastBody.components[0].id;
    this.componentFormat = this.lastBody.components[0].format;
    var this_ = this;
    this.get('/component/' + this.componentID, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
});

When('I ask for the equation by ID', function(callback) {
    var equationID = this.equationID;
    var url = '/equation/' + equationID;

    this.get(url, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
});

When('I provide feedback on the equation', function(callback) {
    var this_ = this;
    this.post('/equation/' + this.equationID + '/feedback', {
        comments: 'Looks good to me!',
        access_token: this_.access_token
    }, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
});

When(/^I ask for (a|an) (\w+) conversion$/, function(a, format, callback) {
    this.formData['outputFormat'] = format.toLowerCase();
    this.post('/html5', null, callback, formData = this.formData);
});

// Then steps
Then('I should get back a description of the equation', function() {
    var body = JSON.parse(this.lastBody);
    assert(body.components[0]['format'], 'description');
    assert(body.components[0]['source'], 'a plus b');
});

Then('I should get back a full conversion description', function() {
    var body = JSON.parse(this.lastBody);
    assert(body.components, "Components of equation missing");
    assert(body.id, "ID of equation missing");
    assert(body.math, "Math of equation missing");
    assert(body.mathType, "MathType of math missing");
});

Then('I should get the component as a downloadable file', function() {
    var headers = this.lastResponse.headers;
    if (this.componentFormat == 'svg') {
        var contentDisposition = headers['content-disposition'];
        assert.equal(contentDisposition, 'attachment; filename="' + this.componentID + '.svg"');
        assert(this.lastBody.startsWith('<svg '));
    } else {
        assert.equal(this.lastBody, 'a squared plus b squared equals c squared');
    }
});

Then('I should get back a structure containing the feedback', function() {
    assert.equal(this.lastBody.comments, 'Looks good to me!');
    assert.equal(this.lastBody.equation, this.equationID);
});

Then('I should get back a confirmation of SVG output', function() {
    assert.equal(this.lastBody.status, 'accepted');
    assert.equal(this.lastBody.outputFormat, 'svg');
});
