const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const bcrypt = require('bcrypt');

const { Users, Topics, Posts } = require('../dataAccessLayer/sequelize.js');

const Browser = require('zombie');
Browser.site = 'http://localhost:3000';
const browser = new Browser();

chai.use(chaiHttp);

let testUser = {
    username: "anotherAndrew",
    password: 'P@ssw0rd',
    email: 'ana@ky.gov',
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
            assert.include(h1texts, 'Courses +', "Course header is missing or text changed, should be 'Courses'");
            done();
        });
    })

    suite('Login', function(){
        suiteSetup(async function(){
            const { username, password, email, firstName, lastName } = testUser

            const hashedPassword = await bcrypt.hash(password, 10);
        
            // Create a new user using Sequelize model methods with hashed password
            const newUser = await Users.create({
                username,
                hashedPassword: hashedPassword,
                email,
                firstName,
                lastName
            });
            testUser.id = newUser.id;
            await browser.visit('/login');
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

        test('Logging in', async function(){
            assert.isNotNull(browser.site, "page doesn't exist");

            await browser.fill('username', testUser.username);
            await browser.fill('hashedPassword', testUser.password);

            await browser.pressButton('button#loginButton');
            browser.assert.success("button press failed");
            browser.assert.url("http://localhost:3000/");
            browser.assert.text("p#rootUsername", testUser.username);
        });

        suiteTeardown(async function(){
            await Users.destroy({
                where:{
                    id:testUser.id
                }
            });
        });
    });

    suite('Signup', function(){
        suiteSetup(async function() {
            await browser.visit('/signup');
        });

        test('UI format', function(done){
            assert.isNotNull(browser.site, "page doesn't exist");
            const h1Elements = browser.queryAll('h1');
            const h1texts = h1Elements.map(h => h.textContent);
            assert.include(h1texts, 'Sign Up');
            browser.assert.elements('input#username',1);
            browser.assert.elements('input#password',1);
            browser.assert.elements('input#email',1);
            browser.assert.elements('input#firstName',1);
            browser.assert.elements('input#lastName',1);
            browser.assert.text('button','Sign up');
            const labels = browser.queryAll('label');
            const labelTexts = labels.map(l => l.textContent);
            assert.include(labelTexts, "Username:");
            assert.include(labelTexts, "Password:");
            assert.include(labelTexts, "Email:");
            assert.include(labelTexts, "First Name:");
            assert.include(labelTexts, "Last Name:");
            done();
        });

        test('Signing up', async function(){
            assert.isNotNull(browser.site, "page doesn't exist");

            await browser.fill('input#username',testUser.username);
            await browser.fill('input#password',testUser.password);
            await browser.fill('input#email',testUser.email);
            await browser.fill('input#firstName',testUser.firstName);
            await browser.fill('input#lastName',testUser.lastName);

            await browser.pressButton('button#signupButton');
            browser.assert.success('button press failed')
            browser.assert.url("http://localhost:3000/login")
            //check to ensure user is added to database
            const db = await Users.findOne({
                where:{
                    username:testUser.username
                }
            })
            assert.isNotNull(db);
        })

        suiteTeardown(async function(){
            Users.destroy({
                where:{
                    username:testUser.username
                }
            });
        });
    })


    suiteTeardown(async function(){
        
        browser.destroy();
    });
})