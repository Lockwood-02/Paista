const mocha = require('chai');
const testDir = './tests';
const testFiles = [] //add .js test file names as strings to here in order to run them

testFiles.forEach(file => {
    mocha.addFile(testDir + file);
});

module.exports = mocha;