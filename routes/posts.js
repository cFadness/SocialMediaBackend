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

// //POST Replies Endpoint
// router.post('/:id/replies', async (req, res) => {
//     try {
//         const comment = await Comment.findById(req.params.id);

//         const { error } = validateReply(req.body);
//         if (error)
//             return res.status(400).send(error);
            
//         const reply = new Reply({
//             text: req.body.text
//         });

//         comment.replies.push(reply);

//         await comment.save();

//         return res.send(comment.replies);

//     } catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`);
//     }
// });

module.exports = router;