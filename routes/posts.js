const { Post, validatePost } = require('../models/post');
const express = require('express');
const router = express.Router();

//GET Posts from user
router.get('/:userId', async (req, res) => {
    try {
        const posts = await Post.find({userId: req.params.userId});
        return res.send(posts);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//GET All posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        return res.send(posts);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//Post a post
router.post('/', async (req, res) => {
    try {
        const { error } = validatePost(req.body);
        if (error)
            return res.status(400).send(error);

        const post = new Post({
            userId: req.body.userId,
            text: req.body.text
        });

        await post.save();

        return res.send(post);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//Delete a post
router.delete('/:id', async (req, res) => {
    try {

        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post)
            return res.status(400).send(`The post with id "${req.params.id}" does
            not exist.`);

        return res.send(post);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;