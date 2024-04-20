const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');
const bcrypt = require('bcrypt');

const { Users, Topics, Posts } = require('../dataAccessLayer/sequelize.js');

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

suite('Post router tests', function(){
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

        testTopics.forEach(topic => {
            topic.userID = newUser.id;
        })

        

        console.log("Created user: ", newUser);
        topic0 = await Topics.create(testTopics[0]);
        testTopics[0].id = topic0.id;
        topic1 = await Topics.create(testTopics[1]);
        testTopics[1].id = topic1.id;

        testPosts.forEach((post,i) => {
            post.Creator_ID = newUser.id;
            post.Topic_ID = testTopics[0].id;
        })

        console.log("Created test posts: ", testPosts[0]);
    })

    test('Create valid post', (done) => {
        chai.request(server)
        .post('/api/Posts')
        .send(testPosts[0])
        .end(async function(err,res){
            assert.equal(res.status,201);
            assert.include(res.body, testPosts[0]);

            dbPost = await Posts.findByPk(res.body.ID);

            assert.include(dbPost, testPosts[0]);
            testPosts[0].ID = dbPost.ID;
            done();
        })
    })

    test('Create post with invalid type', (done) => {
        chai.request(server)
        .post('/api/Posts')
        .send(testPosts[2])
        .end(function(err,res){
            assert.equal(res.status,500);
            assert.deepEqual(res.body, {error: "attempted to create post with invalid type"})
            done();
        })
    })

    test('Create post with null creator id', (done) => {

        testPosts[3].Creator_ID = null;

        chai.request(server)
        .post('/api/Posts')
        .send(testPosts[3])
        .end(function(err,res){
            assert.equal(res.status,500);
            done();
        })
    })

    test('Create post with null topic id', (done) => {

        testPosts[4].Topic_ID = null;

        chai.request(server)
        .post('/api/Posts')
        .send(testPosts[4])
        .end(function(err,res){
            assert.equal(res.status,500);
            done();
        })
    })

    test('Create a post with a thread ID', (done) => {
        testPosts[1].Thread_ID = testPosts[0].ID;
        chai.request(server)
        .post('/api/Posts')
        .send(testPosts[1])
        .end(async function(err,res){
            assert.equal(res.status,201);
            assert.include(res.body, testPosts[1]);

            dbPost = await Posts.findByPk(res.body.ID);

            assert.include(dbPost, testPosts[1]);
            testPosts[1].ID = dbPost.ID;
            done();
        })
    })

    test('Get posts', (done) => {
        chai.request(server)
        .get('/api/Posts')
        .end((err,res) =>{
            assert.equal(res.status,200);
            assert.include(res.body[0], testPosts[0]);
            assert.include(res.body[1], testPosts[1]);
            done();
        })
    })

    test('Get post by id', (done) => {
        chai.request(server)
        .get('/api/Posts/' + testPosts[1].ID)
        .end((err,res) =>{
            assert.equal(res.status,200);
            assert.include(res.body, testPosts[1]);
            done();
        })
    })


    suiteTeardown(async function(){
        await Posts.destroy({
            where:{
                id:testPosts.map(x=>x.ID)
            }
        })

        await Users.destroy({
            where:{
                id:testUser.id
            }
        })

        await Topics.destroy({
            where:{
                id:testTopics.map(x=>x.id)
            }
        })
    })
})