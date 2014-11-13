var frisby = require('/usr/local/lib/node_modules/frisby');

// For whatever reason, the DNS lookup isn't finding the host name. 
//var base_url = 'http://mathml-cloud.cloudapp.net';
var base_url = 'http://23.101.204.234';

frisby.create("Simple ASCII math")
	.post(base_url + '/mathml/convert', {
		mathType : 'AsciiMath', 
		math : 'a^2+b^2=c^2',
		description : 'true',
		svg : 'false'
	})
	.expectStatus(200)
	.expectJSON({
		description : 'a square plus b square equals c square'
	})
	.toss();
