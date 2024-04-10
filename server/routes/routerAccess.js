const express = require('express');
const router = express.Router();
const { Accesses, Users, Topics } = require('../dataAccessLayer/sequelize.js');

// GET all accesses
router.get('/accesses', async (req, res) => {
  try {
    const accesses = await Accesses.findAll();
    res.json(accesses);
  } catch (error) {
    console.error('Error fetching accesses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new access
router.post('/accesses', async (req, res) => {
  try {
    const { Users_ID, Topic_ID, Access_Type } = req.body;
    const newAccess = await Accesses.create({ Users_ID, Topic_ID, Access_Type });
    res.status(201).json(newAccess);
  } catch (error) {
    console.error('Error creating access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single access by ID
router.get('/accesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const access = await Accesses.findByPk(id);
    if (!access) {
      return res.status(404).json({ error: 'Access not found' });
    }
    res.json(access);
  } catch (error) {
    console.error('Error fetching access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing access by ID
router.put('/accesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Users_ID, Topic_ID, Access_Type } = req.body;
    const access = await Accesses.findByPk(id);
    if (!access) {
      return res.status(404).json({ error: 'Access not found' });
    }
    await access.update({ Users_ID, Topic_ID, Access_Type });
    res.json(access);
  } catch (error) {
    console.error('Error updating access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing access by ID
router.delete('/accesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const access = await Accesses.findByPk(id);
    if (!access) {
      return res.status(404).json({ error: 'Access not found' });
    }
    await access.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;