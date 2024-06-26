const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');
const bcrypt = require('bcrypt');

const Browser = require('zombie');
Browser.site = 'http://localhost:3000';

//import sequelize functionality to add test data directly
const { Users } = require('../dataAccessLayer/sequelize.js');

chai.use(chaiHttp);

let testUsers = [
    {
        username: "andrew",//0
        password: 'P@ssw0rd',
        email: 'andrew@ky.gov',
        firstName:'Andrew',
        lastName:'Toussaint'
    },
    {
        username: "andrew",//1
        password: 'P@ssw0rd',
        email: 'andrew2@ky.gov',
        firstName:'Andrew',
        lastName:'Toussaint'
    },
    {
        username: "andrew2",//2
        password: 'P@ssw0rd',
        email: 'andrew@ky.gov',
        firstName:'Andrew',
        lastName:'Toussaint'
    },
    {
        username: 'mo!se',//3
        password: 'aX409sYn#',
        email: 'moise@hotmail.com',
        firstName: 'Moise',
        lastName: 'Kayuni'
    },
    {
        username: 'isaac',//4
        password: 'password',
        email: 'isaac@gmail.com',
        firstName: 'Isaac',
        lastName: 'Lockwood'
    },
    {
        username: 'i',//5
        password: 'password',
        email: 'isaac@gmail.com',
        firstName: 'Isaac',
        lastName: 'Lockwood'
    },
    {
        username: "email_goon",//6
        password: 'P@ssw0rd',
        email: 'ky.gov',
        firstName:'Andrew',
        lastName:'Toussaint'
    }
]

let idToDestroy = null;

suite('User Signup Unit Tests', function() {
    suite('signup.js - signup', function() {
        test('Signup valid user', function(done){
            let user = testUsers[0];
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(async function(err,res){
                //response recieved
                assert.equal(res.status, 200);
                //response data is as expected
                assert.equal(res.body.username, user.username);
                assert.notEqual(res.body.password, user.password);//must be hashed!
                assert.equal(res.body.email, user.email);
                assert.equal(res.body.firstName, user.firstName);
                assert.equal(res.body.lastName, user.lastName);

                //check the database is correctly updated
                dbUser = await Users.findByPk(res.body.id);
                idToDestroy = res.body.id;

                assert.equal(dbUser.username, user.username);
                assert.notEqual(dbUser.password, user.password);//must be hashed!
                assert.equal(dbUser.email, user.email);
                assert.equal(dbUser.firstName, user.firstName);
                assert.equal(dbUser.lastName, user.lastName);

                done();
            })
        })

        test('Singup an existing user', function(done){
            let user = testUsers[1]
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.deepEqual({error:'username is taken'}, res.body);
                done();
            });
        })

        test('Singup an existing email', function(done){
            let user = testUsers[2]
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.deepEqual({error:'email address is taken'}, res.body);
                done();
            });
        })

        test('Signup a user with invalid username', function(done){
            let user = testUsers[3];
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(async function(err,res){
                assert.equal(res.status, 200);
                assert.deepEqual({error:"username uses invalid characters"}, res.body);

                //ensure no username in the database
                dbUser = await Users.findOne({
                    where:{
                        username:user.username
                    }
                })
                assert.isNull(dbUser);

                done();
            })
        })

        test('Signup a user with a short username', function(done){
            let user = testUsers[5];
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(async function(err,res){
                assert.equal(res.status, 200);
                assert.deepEqual({error: "username is too short"}, res.body);
                dbUser = await Users.findOne({
                    where:{
                        username:user.username
                    }
                })
                assert.isNull(dbUser);
                done();
            })
        })

        test('Signup a user with a weak password', function(done){
            let user = testUsers[4];
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.deepEqual({error: 'Password must be at least 8 characters including a number, upper letter, lower case letter, and at least one special character: !@#$%^&*()'}, res.body);
                done();
            })
        })

        test('Signup a user with a invalid email address', function(done){
            let user = testUsers[6];
            chai.request(server)
            .post('/api/signup')
            .send(user)
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.deepEqual({error: "email address is invalid"}, res.body);
                done();
            })
        })

        //teardown signup.js
        suiteTeardown(function(){
            Users.destroy({
                where:{
                    id: idToDestroy
                }
            })
        })

    })

    suite('signup.js - login', function() {

        suiteSetup(async function(){
            const { username, password, email, firstName, lastName } = testUsers[0]

            const hashedPassword = await bcrypt.hash(password, 10);
        
            // Create a new user using Sequelize model methods with hashed password
            const newUser = await Users.create({
                username,
                hashedPassword: hashedPassword,
                email,
                firstName,
                lastName
            });
            idToDestroy = newUser.id;
        })

        test('login a valid user', function(done){
            let credentials = {username: testUsers[1].username, password: testUsers[1].password}

            chai.request(server)
            .post('/api/login')
            .send(credentials)
            .end(async function(err,res){
                assert.equal(res.status, 200);

                dbUser = await Users.findOne({
                    where:{
                        username: testUsers[1].username
                    }
                })

                idToDestroy = dbUser.id;

                done();
            });
        })

        test('login with wrong password', function(done){
            let credentials = {username: testUsers[1].username, password: "invalid"}
            chai.request(server)
            .post('/api/login')
            .send(credentials)
            .end(function(err,res){
                assert.equal(res.status, 401);
                done();
            });
        })

        test('login with nonexistant username', function(done){
            let credentials = {username: "nonexistantusername", password: "P@ssw0rd"}
            chai.request(server)
            .post('/api/login')
            .send(credentials)
            .end(function(err,res){
                assert.equal(res.status, 401);
                done();
            });
        })

        suiteTeardown(async function(){
            Users.destroy({
                where:{
                    username: (testUsers.map(x => x.username))
                }
            })
        })
    })
})


