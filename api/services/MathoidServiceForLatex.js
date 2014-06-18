//Call mathoid and excecute callback 
exports.callMathoid = function(mathoid, cb) {

  //Global variable to store the DataURI of the PNG Image.
  var ImageDataURI = "";

  var exec = require('child_process').exec;
  // The cartmanSvg variable is just a sample of SVG text.  It should be deleted.
  var svgToPngDataUri = function(svgString, callback) {
  // The path to where ImageMagick is installed.
  var magick = ".";
  // Make a system call to ImageMagick's "convert" utility, passing SVG to stdin
  // and writing PNG bytes to stdout.
  var convert = exec(
      "convert svg:- png:-",
      {
        "env" : {
          "MAGICK_HOME": magick,
          "DYLD_LIBRARY_PATH": magick + "/lib"
        }
      },
      function (error, stdout, stderr) {
        var pngBytesBase64 = new Buffer(stdout, 'binary').toString('base64');
        var dataUri = 'data:image/png;base64,' + pngBytesBase64;
        callback(dataUri);

        // The rest of the routine is for debugging.  It can be deleted.
        console.log('<p>stderror: ' + stderr);
        if (error !== null) {
          console.log('<p>exec error: ' + error);
        } else {
          console.log('<p>it worked!');
        }
      });

  // Make sure stdout is interpreted as binary data and the SVG is treated as a
  // utf-8 string.
  convert.stdout.setEncoding('binary');
  convert.stdin.setEncoding('utf-8');

  // Pass the SVG text to the process.  It will invoke callback asynchronously.
  convert.stdin.write(svgString);
  convert.stdin.end();
}
	
  var http = require('http');
  console.log("Calling mathoid with http://23.251.135.48:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=tex");
  var jsonResponse = '';
  http.get("http://23.251.135.48:16000/?q=" + encodeURIComponent(mathoid.mathml) + "&format=json&type=tex", function(mathoidResponse) {
  	mathoidResponse.on("data", function(chunk) {
		jsonResponse += chunk;
 	});
	  
  	mathoidResponse.on('end', function() {
 		  var Jsonobj= JSON.parse(jsonResponse);
  		  svgToPngDataUri(Jsonobj.svg, function(dataUri) {
  				ImageDataURI=dataUri;
  	 	  });
	  
	 	 setTimeout(function(){
	  		 Jsonobj.dataUri = ImageDataURI;
  		 	 console.log("[ INSIDE SERVICE ] " + Jsonobj.dataUri);
  	 	 	 cb(Jsonobj);
  	 	 	 console.log('end call to mathoid');
		  },3000);

        });
  }).on('error', function(e) {
	 console.log("Got error: " + e.message);
	 cb(null);
       });
};
