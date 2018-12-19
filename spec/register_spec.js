// With Frisby installed globally, we need the full path to find it
var frisby = require('frisby');

// Local testing
var base_url = 'http://localhost:1337';

var randomUsername = function() {
    return Math.random() * (100 - 0);
}
// Server testing
//var base_url = 'https://staging.mathmlcloud.org';

describe("Register", function() {
    beforeEach(function() {
        this.users = [];
    });

    afterEach(function(done) {
        User.destroy({username: this.users}, done);
    });

    it("Valid User", function(doneFn) {
        var username = randomUsername() + '@benetech.org';
        this.users.push(username);
        frisby.post(base_url + '/user', {
            username: username,
            password: '123456',
            firstName: 'Spec',
            lastName: 'Valid',
            role: 'user',
            termsOfService: true
        })
        .expect('status', 200)
        .done(doneFn);
    });
    it("Valid User with organization", function(doneFn) {
        var username = randomUsername() + '@benetech.org';
        this.users.push(username);
        frisby.post(base_url + '/user', {
            username: username,
            password: '123456',
            firstName: 'Spec',
            lastName: "W'Organization",
            role: 'user',
            termsOfService: true,
            organization: "Benetech"
        })
        .expect('status', 200)
        .expect('json', {
            organization: "Benetech"
        })
        .done(doneFn);
    });
    it("Valid User with organization types", function(doneFn) {
        var username = randomUsername() + '@benetech.org';
        this.users.push(username);
        frisby.post(base_url + '/user', {
            username: username,
            password: '123456',
            firstName: 'Spec',
            lastName: "W'Organization",
            role: 'user',
            termsOfService: true,
            organization: "Benetech",
            organizationTypes: ["K-12 Education", "Post-Secondary Education"]
        })
        .expect('status', 200)
        .expect('json', {
            organizationTypes: ["K-12 Education", "Post-Secondary Education"]
        })
        .done(doneFn);
    });

    it("Invalid User", function(doneFn) {
        var username = randomUsername() + '@benetech.org';
        this.users.push(username);
        frisby.post(base_url + '/user', {
            username: username,
            password: '123456',
            role: 'user',
            termsOfService: false,
            organization: "Benetech",
            organizationTypes: ["K-12 Education", "Post-Secondary Education"]
        })
        .expect('status', 500)
        .done(doneFn);
    });
    
    //Test dupe user.
    var dupeUsername = randomUsername() + "@benetech.org";
    it("Duplicate user User", function(doneFn) {
        this.users.push(dupeUsername);
        frisby.post(base_url + '/user', {
            username : dupeUsername,
            password : '123456',
            firstName: 'Spec',
            lastName: 'Valid',
            role: 'user',
            termsOfService: true
        })
        .expect('status', 200)
        .then(function() {
            frisby.post(base_url + '/user', {
                username : dupeUsername,
                password : '123456',
                firstName: 'Spec',
                lastName: 'Valid',
                role: 'user',
                termsOfService: true
            })
            .expect('status', 400)
            .done(doneFn);
        });
    });

});
