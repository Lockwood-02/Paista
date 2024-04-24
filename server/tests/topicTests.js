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
    userClass:1,
    firstName:'Andrew',
    lastName:'Toussaint'
}

let testTopics = [
    {
        title:"CS445G", //0
        description:"Operating Systems - Graduate",
        private: false,
        closed: false,
        deleted: false
    },
    {
        title:"CS560", //1
        description:"Software Engineering",
        private: false,
        closed: false,
        deleted: false
    },
    {
        title:"CS560: Software Engineering",//2
        description:"Software Engineering", 
        private: false,
        closed: false,
        deleted: false
    },
    {
        title:"CS560: Software Engineering",//3
        description:"with Dr.Xing!", 
        private: false,
        closed: false,
        deleted: false
    }
]

suite('Topic router tests', function(){

    suiteSetup(async function(){
        //create a test user to own the topics
        const { username, password, email, userClass, firstName, lastName } = testUser

            const hashedPassword = await bcrypt.hash(password, 10);
        
            // Create a new user using Sequelize model methods with hashed password
            const newUser = await Users.create({
                username,
                hashedPassword: hashedPassword,
                userClass,
                email,
                firstName,
                lastName
            });
            testUser.id = newUser.id;
            testTopics[0].userID = testUser.id;
            testTopics[1].userID = testUser.id;
            //add a topic just to pad the GET request
            await Topics.create(testTopics[0]);
    })

    test('Create a valid topic', function(done){
        let testTopic = testTopics[1]
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
            assert.equal(res.status, 200);
            agent.post('/api/topics')
            .send(testTopic)
            .end(async function(err,res){
    
                assert.equal(res.status, 201);
                assert.deepInclude(res.body, testTopic);
                
                let dbTopic = await Topics.findOne({
                    where:{
                        title:testTopic.title
                    }
                })
    
                //used in the get by id test
                testTopics[1].id = dbTopic.id
    
                assert.isNotNull(dbTopic);
                assert.equal(dbTopic.description, testTopic.description);
                assert.equal(dbTopic.userID, testTopic.userID)
                done();
            })
		})
    })

    
    test('Create a topic with a title longer than 255 characters', function(done){
        let longTitle = "t".repeat(300);
        let testTopic = { title:longTitle, description:"Software Engineering", userID:testUser.id }
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
            agent.post('/api/topics')
            .send(testTopic)
            .end(async function(err,res){
                assert.equal(res.status, 500);
                done();
            })
		})
    })

    test('Create a topic with a description longer than 1000 characters', function(done){
        let longDesc = "x".repeat(3000);
        let testTopic = { title:"Normal_Title", description:longDesc, userID:testUser.id }
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
            agent.post('/api/topics')
            .send(testTopic)
            .end(async function(err,res){
                assert.equal(res.status, 500);
                done();
            })
		})  
    })

    test('Create a topic with a name that already exists', function(done){
        let {title, description, userID, private, closed, deleted} = testTopics[1]
        let testTopic = {title, description, userID, private, closed, deleted}
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
            assert.equal(res.status, 200);
            agent.post('/api/topics')
            .send(testTopic)
            .end(async function(err,res){
                assert.deepEqual(res.body, {error:"Topic name is already in use"});
                done();
            })
        })     
    })

    test('Get existing topics', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.get('/api/topics')
            .end(function(err,res){
                console.log("Res: ", res.body, "title: ", testTopics[0]);
                assert.deepInclude(res.body[1],testTopics[0]);
                assert.deepInclude(res.body[0],testTopics[1]);
                done();
            })
		})
    })

    test('Get Topic by id', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.get('/api/topics/'+testTopics[1].id)
            .end(function(err, res){
                assert.deepInclude(res.body,testTopics[1]);
                done();
            })
		}) 
    })

    test('Get Topic by nonexistant id', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.get('/api/topics/a')
            .end(function(err, res){
                assert.equal(res.status, 404);
                done();
            })
		})
    })

    test('Update topic title', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.put('/api/topics/'+testTopics[1].id)
            .send({title: testTopics[2].title})
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.deepInclude(res.body, testTopics[2]);
                done();
            })
		})
    })

    test('Update topic description', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.put('/api/topics/'+testTopics[1].id)
            .send({description: testTopics[3].description})
            .end(function(err,res){
                assert.equal(res.status, 200);
                assert.deepInclude(res.body, testTopics[3]);
                done();
            })
		})
    })

    test('Update nonexistant topic', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.put('/api/topics/a')
            .send({description: testTopics[3].description})
            .end(function(err, res){
                assert.equal(res.status, 404);
                done();
            })
		})
    })

    test('delete topic', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.delete('/api/topics/' + testTopics[1].id)
            .end(async function(err, res){
                assert.equal(res.status, 204);
                console.log("made it here, not sure");
                let dbTopic = await Topics.findByPk(testTopics[1].id)
    
                assert.isNull(dbTopic);
                done();
            })
		}) 
    })

    test('delete nonexistant topic', function(done){
        let agent = chai.request.agent(server)
        agent.post('/api/login')
        .send({
            username: testUser.username,
            password: testUser.password
        }).end((err,res) => {
			assert.equal(res.status, 200);
			agent.delete('/api/topics/a')
            .end(function(err, res){
                assert.equal(res.status, 404);
                done();
            })
		})  
    })

    suiteTeardown(async function(){
        //remove the test user
        Topics.destroy({
            where:{
                title: (testTopics.map(x => x.title))
            }
        })

        Users.destroy({
            where:{
                id: testUser.id
            }
        })

    })
})