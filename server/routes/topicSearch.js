const express = require('express');
const router = express.Router();
const { Topic } = require('../dataAccessLayer/sequelize')//will need to include all table names in the import
const { Op } = require('sequelize');

//expects form input to sspecify a search string "search", a maximum number of results "limit"
// page is an optional input that will offset results by the associated limit
router.get('/topic', async (req, res) => {
    console.log("finding topic titles..."); //debug
    console.log("Body: ", req.query);//debug
    let search = req.query.search;
    let limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit);//100 absolute max
    let offset = limit * parseInt(req.query.page);

    //clean search string of special characters and white space
    search = search.replace(/[^a-zA-Z0-9-_]/g, '');
    console.log("valid search: ", search);
    try {
        topics = await Topic.findAll({
            where:{
                title:{
                    [Op.startsWith]:search
                }
            },
            limit: limit,
            offset: offset
        });
        data = topics ?? [];
        console.log("Topics: ", topics, "Data: ", data);
        data = data.map( x => { return {title: x.title, description: x.description} });
        console.log("found matching topics: ", data);
        res.json(topics);
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