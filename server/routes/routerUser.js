const express = require('express');
const router = express.Router();
const { Users } = require('../dataAccessLayer/sequelize.js');
const { Op } = require('sequelize');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET 20 users with names that match a given string
router.get('/admin/users/:search', async (req,res) => {
  try{
    const { search } = req.params;
    const users = await Users.findAll({
      where:{
        username:{
            [Op.startsWith]:search
        }
      },
      limit:20
    })
    res.json(users);
  }catch (error) {
    console.error('Error searching for users for the admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// POST create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, hashedPassword, userClass, banned, dateCreated, email, firstName, lastName } = req.body;
    const newUser = await Users.create({ username, hashedPassword, userClass, banned, dateCreated, email, firstName, lastName });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, hashedPassword, userClass, banned, dateCreated, email, firstName, lastName } = req.body;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ username, hashedPassword, userClass, banned, dateCreated, email, firstName, lastName });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;