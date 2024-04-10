const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Browser = require('zombie');
Browser.site = 'http://localhost:3000';

chai.use(chaiHttp);

suite('Example Tests', function() {
    suite('Example of a sub-suite', function() {
        test('Example server test', function(done){
            chai.request(server)
            .get('/api/test')
            .end(function(err,res){
                assert.equal(res.status, 200);
                //...more tests here
                done();
            });
        });
    });

    suite('Browser tests', function(){
        const browser = new Browser();
        suiteSetup(function(done) {
          return browser.visit('/',done);
        })      
        test('Zombie demo', function(done){
            browser.assert.isNotNull(browser.site);
            browser.assert.text('h1','Paista');
            done();
        });
        suiteTeardown(function(){
            browser.destroy();
        })
    });
});