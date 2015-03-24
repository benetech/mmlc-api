var crypto = require('crypto');
var compare = require('secure-compare');
var Buffer = require('buffer').Buffer;
module.exports = {
    verify_signature: function(payload_body, header_signature, callback) {
        if (typeof(process.env.SECRET_TOKEN) == "undefined") {
            callback("Please set the SECRET_TOKEN.");
        } else if (typeof(payload_body) == "undefined") {
            callback("Payload body not set.");
        } else {
            var hmac = crypto.createHmac('sha1', process.env.SECRET_TOKEN);
            var signature = 'sha1=' + hmac.update(payload_body.toString()).digest('hex');
            console.log(payload_body);
            console.log(signature);
            console.log(header_signature);
            if (compare(signature, header_signature)) {
                callback(null);
            } else {
                callback("Signatures didn't match!");
            }
        }
    }
};