const express = require('express');
const router = express.Router();
const { Posts, Users, Topics } = require('../dataAccessLayer/sequelize.js');

// GET all posts
router.get('/Posts', async (req, res) => {
  try {
    const posts = await Posts.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new post
router.post('/Posts', async (req, res) => {
  try {
    const { Creator_ID, Thread_ID, Topic_ID, Solution_ID, Title, Body, Deleted, Anonymous, Type } = req.body;
    if(['Announcement', 'Resolved', 'Unresolved'].indexOf(Type) < 0){
      res.status(500).json({error: "attempted to create post with invalid type"});
    }else{
      const newPost = await Posts.create({ Creator_ID, Thread_ID, Topic_ID, Solution_ID, Title, Body, Deleted, Anonymous, Type });
      res.status(201).json(newPost);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single post by ID
router.get('/Posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing post by ID
router.put('/Posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Creator_ID, Thread_ID, Topic_ID, Solution_ID, Title, Body, Deleted, Anonymous, Type } = req.body;
    if(['Announcement', 'Resolved', 'Unresolved'].indexOf(Type) < 0){
      return res.status(500).json({error: "attempted to create post with invalid type"});
    }
    const post = await Posts.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.update({ Creator_ID, Thread_ID, Topic_ID, Solution_ID, Title, Body, Deleted, Anonymous, Type });
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing post by ID
router.delete('/Posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;