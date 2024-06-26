const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');
const bcrypt = require('bcrypt');

const { Users, Topics, Accesses } = require('../dataAccessLayer/sequelize.js');

chai.use(chaiHttp);

let testUser = {
    username: "ajtoussaint",
    password: 'P@ssw0rd',
    email: 'ajt@ky.gov',
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

let accessIds = []

suite('Access router tests', function(){
    suiteSetup(async function(){
        //create a test user to own the topics/accesses
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
            console.log("Created user: ", newUser);
  
            //add a topics
            topic0 = await Topics.create({
                title: testTopics[0].title,
                description: testTopics[0].description,
                userID:testUser.id
            });
            console.log("Created topic: ", topic0);
            testTopics[0].id = topic0.id;
            topic1 = await Topics.create(testTopics[1]);
            testTopics[1].id = topic1.id;
    })


    test('Create a valid Access', function(done){
        let testAccess = {
            Users_ID: testUser.id,
            Topic_ID: testTopics[0].id,
            Access_Type:'basic'
        }
        chai.request(server)
        .post('/api/accesses')
        .send(testAccess)
        .end(async function(err, res){
            assert.equal(res.status, 201);
            assert.deepInclude(res.body, testAccess);

            let dbAccess = await Accesses.findOne({
                where:{
                    Users_ID: testAccess.Users_ID,
                    Topic_ID: testAccess.Topic_ID,
                    Access_Type: testAccess.Access_Type
                }
            })

            console.log("Found access: ", dbAccess);

            accessIds.push(dbAccess.ID);
            console.log("Added id to lsit: ", accessIds);
            assert.deepInclude(dbAccess, testAccess);
            done();
        })
    })

    test('Create invalid access', function(done){
        let testAccess = {
            Users_ID: 'a',
            Topic_ID: 'b',
            Access_Type:'basic'
        }
        chai.request(server)
        .post('/api/accesses')
        .send(testAccess)
        .end(function(err, res){
            assert.equal(res.status, 500);
            done();
        })
    });
  
    test('Get Accesses', function(done){
        chai.request(server)
        .get('/api/accesses')
        .end(function(err, res){
            assert.deepInclude(res.body[0],{
                Users_ID: testUser.id,
                Topic_ID: testTopics[0].id,
                Access_Type:'basic'
            })
            done();
        })
    })

    test('Get Access by id', function(done){
        chai.request(server)
        .get('/api/accesses/' + accessIds[0])
        .end(function(err, res){
            assert.deepInclude(res.body,{
                Users_ID: testUser.id,
                Topic_ID: testTopics[0].id,
                Access_Type:'basic'
            })
            done();
        })
    })

    test('Get Access by bad id', function(done){
        chai.request(server)
        .get('/api/accesses/a')
        .end(function(err, res){
            assert.equal(res.status, 404)
            assert.deepEqual(res.body, { error: 'Access not found' });
            done();
        })
    })

    test('Update Access type', function(done){
        chai.request(server)
        .put('/api/accesses/' + accessIds[0])
        .send({
            Users_ID: testUser.id,
            Topic_ID: testTopics[0].id,
            Access_Type:'moderator'
        })
        .end(function(err, res){
            assert.equal(res.status,200);
            assert.deepInclude(res.body,{
                Users_ID: testUser.id,
                Topic_ID: testTopics[0].id,
                Access_Type:'moderator'
            });
            done();
        })
    })

    test('Update access type with bad id', function(done){
        chai.request(server)
        .put('/api/accesses/a')
        .send({
            Users_ID: testUser.id,
            Topic_ID: testTopics[0].id,
            Access_Type:'moderator'
        })
        .end(function(err, res){
            assert.equal(res.status,404);
            assert.deepEqual(res.body,{ error: 'Access not found' });
            done();
        })
    })

    test('Delete access', function(done){
        chai.request(server)
        .delete('/api/accesses/' + accessIds[0])
        .end(function(err, res){
            assert.equal(res.status,204);
            accessIds.pop();
            done();
        })
    })

    test('Delete access that is not found', function(done){
        chai.request(server)
        .delete('/api/accesses/a')
        .end(function(err, res){
            assert.equal(res.status,404);
            assert.deepEqual(res.body,{ error: 'Access not found' });
            done();
        })
    })

    suiteTeardown(async function(){

        await Accesses.destroy({
            where:{
                id:accessIds
            }
        })

        await Users.destroy({
            where:{
                id:testUser.id
            }
        });

        await Topics.destroy({
            where:{
                title: (testTopics.map(x => x.title))
            }
        });
    })

})