const express = require('express');
const router = express.Router();
const { TitleHistories, Topics } = require('../dataAccessLayer/sequelize.js');

// GET all title histories
router.get('/titlehistories', async (req, res) => {
  try {
    const titleHistories = await TitleHistories.findAll();
    res.json(titleHistories);
  } catch (error) {
    console.error('Error fetching title histories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new title history
router.post('/titlehistories', async (req, res) => {
  try {
    const { previousTitle, timestamp, Topic_ID } = req.body;
    const newTitleHistory = await TitleHistories.create({ Previous_Title: previousTitle, Timestamp: timestamp, Topic_ID });
    res.status(201).json(newTitleHistory);
  } catch (error) {
    console.error('Error creating title history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single title history by ID
router.get('/titlehistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const titleHistory = await TitleHistories.findByPk(id);
    if (!titleHistory) {
      return res.status(404).json({ error: 'Title history not found' });
    }
    res.json(titleHistory);
  } catch (error) {
    console.error('Error fetching title history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing title history by ID
router.put('/titlehistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { previousTitle, timestamp, Topic_ID } = req.body;
    const titleHistory = await TitleHistories.findByPk(id);
    if (!titleHistory) {
      return res.status(404).json({ error: 'Title history not found' });
    }
    await titleHistory.update({ Previous_Title: previousTitle, Timestamp: timestamp, Topic_ID });
    res.json(titleHistory);
  } catch (error) {
    console.error('Error updating title history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing title history by ID
router.delete('/titlehistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const titleHistory = await TitleHistories.findByPk(id);
    if (!titleHistory) {
      return res.status(404).json({ error: 'Title history not found' });
    }
    await titleHistory.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting title history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;