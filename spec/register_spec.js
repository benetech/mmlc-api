// With Frisby installed globally, we need the full path to find it
var frisby = require('/usr/local/lib/node_modules/frisby');

// Local testing
var base_url = 'http://localhost:1337';

var randomUsername = function() {
    return Math.random() * (100 - 0);
}
// Server testing
//var base_url = 'https://staging.mathmlcloud.org';

describe("Register", function() {
    frisby.create("Valid User")
        .post(base_url + '/user', {
            username : randomUsername() + "@benetech.org",
            password : '123456',
            firstName: 'Spec',
            lastName: 'Valid',
            termsOfService: true
        })
        .expectStatus(200)
        .toss();
    frisby.create("Valid User with organization")
        .post(base_url + '/user', {
            username : randomUsername() + "@benetech.org",
            password : '123456',
            firstName: 'Spec',
            lastName: "W'Organization",
            termsOfService: true,
            organization: "Benetech"
        })
        .expectStatus(200)
        .expectJSON( {
            organization: "Benetech"
        })
        .toss();
    frisby.create("Valid User with organization")
        .post(base_url + '/user', {
            username : randomUsername() + "@benetech.org",
            password : '123456',
            firstName: 'Spec',
            lastName: "W'Organization",
            termsOfService: true,
            organization: "Benetech"
        })
        .expectStatus(200)
        .expectJSON( {
            organization: "Benetech"
        })
        .toss();
    frisby.create("Valid User with organization types")
        .post(base_url + '/user', {
            username : randomUsername() + "@benetech.org",
            password : '123456',
            firstName: 'Spec',
            lastName: "W'Organization",
            termsOfService: true,
            organization: "Benetech",
            organizationTypes: ["K-12 Education", "Post-Secondary Education"]
        })
        .expectStatus(200)
        .expectJSON( {
            organizationTypes: ["K-12 Education", "Post-Secondary Education"]
        })
        .toss();

    frisby.create("Invalid User")
        .post(base_url + '/user', {
            username : randomUsername() + "@benetech.org",
            password : '123456',
            termsOfService: false,
            organization: "Benetech",
            organizationTypes: ["K-12 Education", "Post-Secondary Education"]
        })
        .expectStatus(400)
        .toss();
    
    //Test dupe user.
    var dupeUsername = randomUsername() + "@benetech.org";
    frisby.create("User with " + dupeUsername + " -- Valid")
        .post(base_url + '/user', {
            username : dupeUsername,
            password : '123456',
            firstName: 'Spec',
            lastName: 'Valid',
            termsOfService: true
        })
        .expectStatus(200)
        .toss();
    frisby.create("Duplicate user User")
        .post(base_url + '/user', {
            username : dupeUsername,
            password : '123456',
            firstName: 'Spec',
            lastName: 'Valid',
            termsOfService: true
        })
        .expectStatus(400)
        .toss();


});
