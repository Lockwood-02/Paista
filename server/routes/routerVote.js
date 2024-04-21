const express = require('express');
const router = express.Router();
const { Votes, Users, Posts } = require('../dataAccessLayer/sequelize.js');

// GET all votes
router.get('/votes', async (req, res) => {
  try {
    const votes = await Votes.findAll();
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all votes for a post
router.get('/totalVotes/:id', async (req,res) => {
  try{
    const { id } = req.params;
    const { count } = await Votes.findAndCountAll({
      where:{
        Post_ID:id
      }
    })
    res.json({count: count})
  }catch(err){
    res.json({error:"Could not get all votes: " + err})
  }
})

// POST create a new vote
router.post('/votes', async (req, res) => {
  try {
    const { User_ID, Post_ID } = req.body;
    const newVote = await Votes.create({ User_ID, Post_ID });
    res.status(201).json(newVote);
  } catch (error) {
    console.error('Error creating vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single vote by ID
router.get('/votes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vote = await Votes.findByPk(id);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    res.json(vote);
  } catch (error) {
    console.error('Error fetching vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//GET a single vote by user ID and post ID
router.get('/userVote/:user_id/:post_id', async (req, res) => {
  try {
    const { user_id, post_id } = req.params;
    const vote = await Votes.findOne({
      where:{
        User_ID:user_id,
        Post_ID: post_id
      }
    })
    if (!vote) {
      return res.status(200).json({ vote: 'Vote not found' });
    }
    res.json(vote);
  }catch (error) {
    console.error('Error fetching vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// PUT update an existing vote by ID
router.put('/votes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { User_ID, Post_ID } = req.body;
    const vote = await Votes.findByPk(id);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    await vote.update({ User_ID, Post_ID });
    res.json(vote);
  } catch (error) {
    console.error('Error updating vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing vote by ID
router.delete('/votes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vote = await Votes.findByPk(id);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }
    await vote.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;