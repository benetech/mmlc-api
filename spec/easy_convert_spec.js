describe("Simple math conversion", function() {
	var frisby = require('/usr/local/lib/node_modules/frisby');
	
	xit("handles algebra AsciiMath", function() {
		frisby.create("Simple algebra AsciiMath")
		.get('http://mathml-cloud.cloudapp.net/mathml/convert?mathType=AsciiMath&math="a^2+b^2=c^2"&description=true&svg=false')
		.expectStatus("200")
		.expectHeaderContains("content-type", "application/json")
		.toss();
	});
	
	it("dumps results", function() {
		frisby.create("Dump")
		.get('http://mathml-cloud.cloudapp.net/mathml/convert?mathType=AsciiMath&math="a^2+b^2=c^2"&description=true&svg=false')
		.inspectBody()
		.toss();
	});
});
