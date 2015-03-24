var crypto = require('crypto');
var compare = require('secure-compare');
var Buffer = require('buffer').Buffer;
module.exports = {
    verify_signature: function(req, callback) {
        if (typeof(process.env.SECRET_TOKEN) == "undefined") {
            callback("Please set the SECRET_TOKEN.");
        } else if (typeof(payload_body) == "undefined") {
            callback("Payload body not set.");
        } else {
            var signature = 'sha1=' + crypto.createHmac('sha1', process.env.SECRET_TOKEN);
            req.on("data", function(data) {
                signature.update(data).digest('hex');
            });
            req.on("end", function() {
                console.log(signature);
                console.log(req.headers['x-hub-signature']);
                if (compare(signature, req.headers['x-hub-signature'])) {
                    callback(null);
                } else {
                    callback("Signatures didn't match!");
                }
            });
        }
    }
};