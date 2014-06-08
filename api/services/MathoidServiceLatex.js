//Call mathoid and excecute callback 
exports.callMathoid = function(mathoid, cb) {
	var http = require('http');
	console.log("Calling mathoid with http://23.251.135.48:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=tex");
	var jsonResponse = '';
	http.get("http://23.251.135.48:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=tex", function(mathoidResponse) {
	  mathoidResponse.on("data", function(chunk) {
		jsonResponse += chunk;
	  });
	  mathoidResponse.on('end', function() {
	    console.log(jsonResponse);
		cb(JSON.parse(jsonResponse));
	    console.log('end call to mathoid');
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  cb(null);
	});
};
