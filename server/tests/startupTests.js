const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Browser = require('zombie');
Browser.site = 'http://localhost:3000';

//import sequelize functionality to add test data directly
const { Topics, Accesses, Users } = require('../dataAccessLayer/sequelize.js');

chai.use(chaiHttp);

let testTopics = [
    {
        title:'CS 560: Software engineering',
        description: 'SE'
    },
    {
        title:'CS 445G: Operating Systems',
        description: 'by Qi Li'
    },
    {
        title: 'CS 555 Data Science',
        description: 'formerly AI'
    },
    {
        title: 'CS 570 Security',
        description: 'idk'
    }];


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
        username: "mr_T",//2
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
    }
]

let idToDestroy = null;

suite('Unit Tests', function() {
    suite('signup.js', function() {
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

        //teardown signup.js
        suiteTeardown(function(){
            Users.destroy({
                where:{
                    username:testUsers[0].username
                }
            })
        })

    })
})


