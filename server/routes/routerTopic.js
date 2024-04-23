const express = require('express');
const router = express.Router();
const { Topics, Users } = require('../dataAccessLayer/sequelize.js');
const { Op } = require('sequelize');

// GET all topics with sorting options
router.get('/topics', async (req, res) => {
  try {
    // Sorting options
    const sortBy = req.query.sortBy || 'dateCreated'; // Default sort by dateCreated
    const sortOrder = req.query.sortOrder || 'DESC'; // Default descending order

    // Fetch topics with sorting
    const topics = await Topics.findAll({
      order: [[sortBy, sortOrder]],
    });

    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new topic
router.post('/topics', async (req, res) => {
  try {
    const { title, description, userID, private, closed, dateCreated, deleted } = req.body;

    const topicExists = await Topics.findOne({
      where: {
        title: title
      }
    });

    if (topicExists) {
      return res.status(400).json({ error: "Topic name is already in use" });
    }

    const newTopic = await Topics.create({ title, description, userID, private, closed, dateCreated, deleted });
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
  try {
    const { id } = req.params;
    const { title, description, private, closed, dateCreated, deleted } = req.body;
    const topic = await Topics.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    await topic.update({ title, description, private, closed, dateCreated, deleted });
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
    console.log("Deleting topic with ID:", id);
    const topic = await Topics.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    await topic.destroy();
    res.status(204).json({ success: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;