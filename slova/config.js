const { readFileSync } = require('fs');
const yaml = require('yaml');

module.exports = yaml.parse(readFileSync('./config.yml').toString());