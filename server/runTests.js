const Mocha = require('mocha');
const mocha = new Mocha();

const EventEmitter = require('events').EventEmitter;

const testDir = './tests';
const testFiles = ['test.js'] //add .js test file names as strings to here in order to run them

testFiles.forEach(file => {
    mocha.addFile(testDir + "/" + file);
});

const emitter = new EventEmitter();
emitter.run = function() {
    try{
        let runner = mocha.ui('tdd').run()
        .on('end', function() {
            console.log("test running complete!");
            emitter.emit('done');
        });
    }catch(e){
        console.log("Error with running emitter in server/runTests.js: ", e);
        throw(e);
    }
}

module.exports = emitter;