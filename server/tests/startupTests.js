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
        username: "andrew",
        password: 'abc123',
        email: 'andrew@ky.gov',
        firstName:'Andrew',
        lastName:'Toussaint'
    },
    {
        username: 'moise',
        password: 'aX409sYn#',
        email: 'moise@hotmail.com',
        firstName: 'Moise',
        lastName: 'Kayuni'
    },
    {
        username: 'isaac',
        password: 'password',
        email: 'isaac@gmail.com',
        firstName: 'Isaac',
        lastName: 'Lockwood'
    }
]

suite('Startup Tests', function() {
    suite('Unit Tests', function() {
        suite('signup.js', function() {
            test('Signup valid user', function(done){
                let user = testUsers[0];
                chai.request(server)
                .post('/api/signup')
                .send(user)
                .end( async function(err,res){
                    //response recieved
                    assert.equal(res.status, 200);
                    //response data is as expected
                    assert.equal(res.data.username, user.username);
                    
                    done();
                })
            })
        })
    })
    //functional tests
})
