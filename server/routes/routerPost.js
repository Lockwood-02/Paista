const express = require('express');
const router = express.Router();
const { Posts, Users, Topics } = require('../dataAccessLayer/sequelize.js');
const { Op } = require('sequelize');

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

// GET all posts in a thread
router.get("/getThread/:Thread_ID", async (req, res) => {
  try{
    const { Thread_ID } = req.params;
    const comments = await Posts.findAll({
      where:{
        Thread_ID:Thread_ID
      }
    })
    let userIds = []
    comments.forEach(comment => {
      userIds.push(comment.dataValues.Creator_ID);
    })
    console.log("finding users in: ", userIds);
    const users = await Users.findAll({
      where:{
        id:userIds
      }
    })
    let userMap = {}
    users.forEach(u => {
      userMap[u.id] = u.username
    })
    comments.forEach(comment => {
      comment.dataValues.username = userMap[comment.dataValues.Creator_ID]
    })
    console.log("Ammended comments: ", comments);
    res.json(comments);
  } catch(error){
    console.error("Error fetching thread: ", error)
    res.status(500).json({error: 'Could not fetch thread'});
  }
});

//GET 20 posts with a title matching a given string
router.get('/admin/posts/:search', async (req,res) => {
  if(!req.user){
    return res.status(401);
  }else if(req.user.userClass !== 2){
    return res.status(401)
  }else{
    try{
      const { search } = req.params;
      const posts = await Posts.findAll({
        where:{
          Title:{
              [Op.startsWith]:search
          }
        },
        limit:20
      })
      res.json(posts);
    }catch (error) {
      console.error('Error searching for posts for the admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
})

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
  let user = req.user;
  console.log("PUT on post requested by user: ", user);
  console.log("Attempting to update with data: ", req.body);
  try {
    const { id } = req.params;
    const { Creator_ID, Thread_ID, Topic_ID, Solution_ID, Title, Body, Deleted, Anonymous, Type } = req.body;
    if(['Announcement', 'Resolved', 'Unresolved'].indexOf(Type) < 0){
      return res.status(500).json({error: "attempted to create post with invalid type"});
    }
    const post = await Posts.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }else if(user.userClass !== 2 && post.Creator_ID !== user.id){
      //user cannot edit another users post unless they are the admin
      return res.status(401).json({error: "User is not permitted to edit this post"})
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