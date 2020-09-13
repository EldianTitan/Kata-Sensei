const path = require('path');
const configfile = require(path.join(__dirname, 'config.json'));

module.exports = {
	config: configfile,
}