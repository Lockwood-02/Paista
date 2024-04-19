const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');
const bcrypt = require('bcrypt');


//import sequelize functionality to add test data directly
const { Users, Topics } = require('../dataAccessLayer/sequelize.js');

chai.use(chaiHttp);


let testUser = {
    username: "andrew",
    password: 'P@ssw0rd',
    email: 'andrew@ky.gov',
    firstName:'Andrew',
    lastName:'Toussaint'
}

suite('Topic router tests', function(){

    suiteSetup(async function(){
        //create a test user to own the topics
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
    })

    test('Create a valid topic', function(done){
        let testTopic = { title:"CS560", description:"Software Engineering", userID:testUser.id }
        chai.request(server)
        .post('/api/topics')
        .send(testTopic)
        .end(async function(err,res){

            assert.equal(res.status, 201);
            assert.deepInclude(res.body, testTopic);
            
            dbTopic = await Topics.findOne({
                where:{
                    title:testTopic.title
                }
            })

            assert.isNotNull(dbTopic);
            assert.equal(dbTopic.description, testTopic.description);
            assert.equal(dbTopic.userID, testTopic.userID)
            done();
        })
    })

    
    test('Create a topic with a title longer than 255 characters', function(done){
        let longTitle = "t".repeat(300);
        let testTopic = { title:longTitle, description:"Software Engineering", userID:testUser.id }
        chai.request(server)
        .post('/api/topics')
        .send(testTopic)
        .end(async function(err,res){
            assert.equal(res.status, 500);
            done();
        })
    })

    test('Create a topic with a description longer than 1000 characters', function(done){
        let longDesc = "x".repeat(3000);
        let testTopic = { title:"Normal_Title", description:longDesc, userID:testUser.id }
        chai.request(server)
        .post('/api/topics')
        .send(testTopic)
        .end(async function(err,res){
            assert.equal(res.status, 500);
            done();
        })
    })


    suiteTeardown(async function(){
        //remove the test user
        Users.destroy({
            where:{
                id: testUser.id
            }
        })

        Topics.destroy({
            where:{
                title:"CS560"
            }
        })
    })
})