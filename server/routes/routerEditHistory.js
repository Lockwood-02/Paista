const express = require('express');
const router = express.Router();
const { EditHistories, Posts } = require('../dataAccessLayer/sequelize.js');

// GET all edit histories
router.get('/edithistories', async (req, res) => {
  try {
    const editHistories = await EditHistories.findAll({ include: Posts });
    res.json(editHistories);
  } catch (error) {
    console.error('Error fetching edit histories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new edit history
router.post('/edithistories', async (req, res) => {
  try {
    const { Post_ID, Previous_Edit, Timestamp } = req.body;
    const newEditHistory = await EditHistories.create({ Post_ID, Previous_Edit, Timestamp });
    res.status(201).json(newEditHistory);
  } catch (error) {
    console.error('Error creating edit history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single edit history by ID
router.get('/edithistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const editHistory = await EditHistories.findByPk(id, { include: Posts });
    if (!editHistory) {
      return res.status(404).json({ error: 'Edit history not found' });
    }
    res.json(editHistory);
  } catch (error) {
    console.error('Error fetching edit history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing edit history by ID
router.put('/edithistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Post_ID, Previous_Edit, Timestamp } = req.body;
    const editHistory = await EditHistories.findByPk(id);
    if (!editHistory) {
      return res.status(404).json({ error: 'Edit history not found' });
    }
    await editHistory.update({ Post_ID, Previous_Edit, Timestamp });
    res.json(editHistory);
  } catch (error) {
    console.error('Error updating edit history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing edit history by ID
router.delete('/edithistories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const editHistory = await EditHistories.findByPk(id);
    if (!editHistory) {
      return res.status(404).json({ error: 'Edit history not found' });
    }
    await editHistory.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting edit history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;