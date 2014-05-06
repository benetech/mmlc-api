//Call mathoid and excecute callback 
exports.callMathoid = function(mathoid, cb) {
	var http = require('http');
	console.log("http://192.168.33.10:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=mml");
	http.get("http://192.168.33.10:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=mml", function(mathoidResponse) {
	  mathoidResponse.on("data", function(chunk) {
		cb(JSON.parse(chunk));
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  cb(null);
	});
};