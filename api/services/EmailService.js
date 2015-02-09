var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport(sails.config.transport));
module.exports = {
    send: function(options) {
        transporter.sendMail(options, function(error, info) {
            if(error){
                console.log(error);
            } 
        });
    }
};