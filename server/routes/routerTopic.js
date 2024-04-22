const express = require('express');
const router = express.Router();
const { Topics, Users } = require('../dataAccessLayer/sequelize.js');

// GET all topics
router.get('/topics', async (req, res) => {
  if(!req.user){
    return res.status(401).json({error: "You are not logged in"});
  }
  try {
    const topics = await Topics.findAll();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new topic
router.post('/topics', async (req, res) => {
  if(!req.user){
    return res.status(401).json({error: "You are not logged in"});
  }else if(req.user.userClass < 1){
    return res.status(401).json({error: "You must be an instructor to create a topic"});
  }else{
    try {
      const { title, description, userID } = req.body;
  
      const topicExists = await Topics.findOne({
        where:{
          title: title
        }
      })
  
      if(topicExists){
        res.json({error:"topic name is already in use"})
      }else{
        const newTopic = await Topics.create({ title, description, userID });
        res.status(201).json(newTopic);
      }
  
    } catch (error) {
      console.error('Error creating topic:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// GET a single topic by ID
router.get('/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topics.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing topic by ID
router.put('/topics/:id', async (req, res) => {
  if(!req.user){
    return res.status(401).json({error: "You are not logged in"});
  }
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const topic = await Topics.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    await topic.update({ title, description });
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing topic by ID
router.delete('/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("deleting topic with ID: ", id);
    const topic = await Topics.findByPk(id);
    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
    }else{
      await Topics.destroy({
        where:{
          id:id
        }
      });
      res.status(204).json({success:"Topic destroyed"});
    }
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;