var config = require('./config.json');
config = config[process.env.NODE_ENV || 'development'];

module.exports = config;