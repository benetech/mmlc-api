// Utility properties available to all step definitions
var apickli = require('apickli');

function World() {
	this.apickli = new apickli.Apickli('http', '192.168.99.100:1337');
};

module.exports = function() {
	this.World = World;
}