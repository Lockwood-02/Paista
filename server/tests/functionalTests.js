const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;


const Browser = require('zombie');
Browser.site = 'http://localhost:3000';
const browser = new Browser();

chai.use(chaiHttp);

let testUser = {
    username: "alt_ajt",
    password: 'P@ssw0rd',
    email: 'ajamt@ky.gov',
    firstName:'Andrew',
    lastName:'Toussaint'
}

let testTopics = [
    {
        title:"CS445G", //0
        description:"Operating Systems - Graduate",
    },
    {
        title:"CS560", //1
        description:"Software Engineering", 
    },
]

let testPosts = [
    {
        Title:'How do I center a div?',//0
        Body: 'does anyone know?',
        Deleted:false,
        Anonymous:true,
        Type:'Unresolved',
        Thread_ID:null,
        Solution_ID:null
    },
    {
        Title:'Quiz on Friday',//1
        Body: 'topic will be node.js testing',
        Deleted:false,
        Anonymous:false,
        Type:'Announcement',
        Thread_ID:null,
        Solution_ID:null
    },
    {
        Title:'How do I center a div?',//2
        Body: 'does anyone know?',
        Deleted:false,
        Anonymous:true,
        Type:'nonexistant_type',
        Thread_ID:null,
        Solution_ID:null
    },
    {
        Title:'How do I center a div?',//3
        Body: 'does anyone know?',
        Deleted:false,
        Anonymous:true,
        Type:'nonexistant_type',
        Thread_ID:null,
        Solution_ID:null
    },
    {
        Title:'How do I center a div?',//4
        Body: 'does anyone know?',
        Deleted:false,
        Anonymous:true,
        Type:'nonexistant_type',
        Thread_ID:null,
        Solution_ID:null
    },
]

suite('Functional Tests', function() {
    suite('Home Page', function(){
        suiteSetup(function(done){
            return browser.visit('/',done);
        });

        test('Home Page', function(done){
            assert.isNotNull(browser.site);
            const h1Elements = browser.queryAll('h1');
            const h1texts = h1Elements.map(h => h.textContent);
            assert.include(h1texts, 'Paista', "Paista header is missing or text changed, should be 'Paista'");
            assert.include(h1texts, 'Home', "Home header is missing or text changed, should be 'Home'");
            assert.include(h1texts, 'Courses', "Course header is missing or text changed, should be 'Courses'");
            done();
        });
    })

    suite('Signup', function(){
        suiteSetup(function(done){
            return browser.visit('/login',done);
        });

        test('UI format', function(done){
            assert.isNotNull(browser.site, "page doesn't exist");
            const h1Elements = browser.queryAll('h1');
            const h1texts = h1Elements.map(h => h.textContent);
            assert.include(h1texts, 'Login');
            browser.assert.elements('input#username',1);
            browser.assert.elements('input#password',1);
            browser.assert.text('button','Login');
            const labels = browser.queryAll('label');
            const labelTexts = labels.map(l => l.textContent);
            assert.include(labelTexts, "Username:");
            assert.include(labelTexts, "Password:");
            done();
        });


    })


    suiteTeardown(function(){
        browser.destroy();
    });
})