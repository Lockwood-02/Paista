const express = require('express');
const router = express.Router();
const { Topic } = require('../dataAccessLayer/sequelize')//will need to include all table names in the import

//expects form input to sspecify a search string "search", a maximum number of results "limit"
// page is an optional input that will offset results by the associated limit
router.get('/topic', async (req, res) => {
    console.log("finding topic titles...");
    let search = req.body.search;
    let limit = req.body.limit > 100 ? 100 : req.body.limit;//100 absolute max
    let offset = limit * req.body.page;

    //clean search string of special characters and white space
    search = search.replace(/[^a-zA-Z0-9-_]/g, '');
    try {
        topics = Topic.findAll({
            where:{
                [Op.regexp]:search
            },
            limit: limit,
            offset: offset
        });
        data = topics.map( x => { return {title: x.title, description: x.description} });
        console.log("found matching topics: ", data);
        res.json(data);
    } catch(err){
        console.error("Error searching for topics that include: ", search, "\n", err);
        res.status(500);//error status
    }
})

//inserts some dummy data for testing
router.get('/insertData', async (req, res) => {
    let topics = [
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
    
    try{
        data = await Topic.bulkCreate(topics,{
            updateOnDuplicate:['title', 'description']
        })
        res.json(data);
    }catch(err){
        res.json(err);
    }
    
});


module.exports = router;