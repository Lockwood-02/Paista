/*const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');
const bcrypt = require('bcrypt');

const { Users, Topics, Posts, EditHistories } = require('../dataAccessLayer/sequelize.js');

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

let testEditHistories = [
    
]

suite('EditHistory router tests', function(){
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

    suiteTeardown(async function(){
        await EditHistories.destroy({
            where:{
                id:testEditHistories.map(x=>x.ID)
            }
        })

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
})*/