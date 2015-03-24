var crypto = require('crypto');
var compare = require('secure-compare');
module.exports = {
    verify_signature: function(payload_body, header_signature, callback) {
        console.log(process.env.SECRET_TOKEN);
        console.log(payload_body);
        var signature = crypto.createHmac('sha1', process.env.SECRET_TOKEN).update(payload_body).digest('hex');
        if (compare(signature, header_signature)) {
            callback(null);
        } else {
            callback("Signatures didn't match!");
        }
    }
};