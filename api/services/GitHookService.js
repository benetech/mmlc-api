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
            var signature = crypto.createHmac('sha1', new Buffer(process.env.SECRET_TOKEN)).update(payload_body).digest('hex');
            if (compare(signature, header_signature)) {
                callback(null);
            } else {
                callback("Signatures didn't match!");
            }
        }
    }
};