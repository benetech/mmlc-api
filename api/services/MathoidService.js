//Call mathoid and excecute callback 
exports.callMathoid = function(mathoid, cb) {
	var http = require('http');
	console.log("Calling mathoid with http://192.168.33.10:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=mml");
	var jsonResponse = '';
	http.get("http://192.168.33.10:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=mml", function(mathoidResponse) {
	  mathoidResponse.on("data", function(chunk) {
		jsonResponse += chunk;
	  });
	  mathoidResponse.on('end', function() {
		cb(JSON.parse(jsonResponse));
	    console.log('end call to mathoid');
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  cb(null);
	});
};