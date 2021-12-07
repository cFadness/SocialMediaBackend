const { Post, validateLike } = require('../models/post');
const auth = require("../middleware/auth");
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

//GET Posts from user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const posts = user.posts

        return res.send(posts);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//Post a post
router.post('/', [auth], async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const post = new Post(req.body);

        user.posts.push(post);

        await user.save();

        return res.send(user);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//Delete a post
router.delete('/:id', [auth], async (req, res) => {
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

//Like a post
router.put('/:id', async (req, res) => {
    try {
        const {error} = validateLike(req.body);
        if (error) return res.status(400).send(error);

        const post = await Post.findByIdAndUpdate(req.params.id, 
            {
                likes: req.body.likes
            },
            { new: true }
            );

            if (!post)
                return res.status(400).send(`The post with id "${req.params.id}"
                does not exist.`);

            await post.save();

            return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;