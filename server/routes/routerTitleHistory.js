const express = require('express');
const router = express.Router();
const { TitleHistories, Topics } = require('../dataAccessLayer/sequelize.js');

// GET all TitleHistories
router.get('/TitleHistories', async (req, res) => {
  try {
    const titleHistories = await TitleHistories.findAll();
    res.json(titleHistories);
  } catch (error) {
    console.error('Error fetching TitleHistories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new TitleHistory
router.post('/TitleHistories', async (req, res) => {
  try {
    const { Previous_Title, Timestamp, Topic_ID } = req.body;
    const newTitleHistory = await TitleHistories.create({ Previous_Title, Timestamp, Topic_ID });
    res.status(201).json(newTitleHistory);
  } catch (error) {
    console.error('Error creating TitleHistory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single TitleHistory by ID
router.get('/TitleHistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const titleHistory = await TitleHistories.findByPk(id);
    if (!titleHistory) {
      return res.status(404).json({ error: 'Title history not found' });
    }
    res.json(titleHistory);
  } catch (error) {
    console.error('Error fetching TitleHistory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing TitleHistory by ID
router.put('/TitleHistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Previous_Title, Timestamp, Topic_ID } = req.body;
    const titleHistory = await TitleHistories.findByPk(id);
    if (!titleHistory) {
      return res.status(404).json({ error: 'Title history not found' });
    }
    await titleHistory.update({ Previous_Title, Timestamp, Topic_ID });
    res.json(titleHistory);
  } catch (error) {
    console.error('Error updating TitleHistory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing TitleHistory by ID
router.delete('/TitleHistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const titleHistory = await TitleHistories.findByPk(id);
    if (!titleHistory) {
      return res.status(404).json({ error: 'Title history not found' });
    }
    await titleHistory.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting TitleHistory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;