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

//POST Comment Endpoint
router.post('/', async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error)
            return res.status(400).send(error);

        const comment = new Comment({
            videoId: req.body.videoId,
            text: req.body.text
        });

        await comment.save();

        return res.send(comment);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//PUT Comment Endpoint
router.put('/:id', async (req, res) => {
    try {

        let bodyKeys = Object.getOwnPropertyNames(req.body);
        let schemaKeys = Object.getOwnPropertyNames(Comment.schema.obj);

        console.log(schemaKeys);
        console.log(bodyKeys)

        let includesAll = true;
        bodyKeys.map((someKey) => {
            if(!schemaKeys.includes(someKey)){
                includesAll = false;
            }
        });

        if(!includesAll)
            return res.status(400).send('Improper key in body.');


        const comment = await Comment.findByIdAndUpdate(req.params.id, 
            {
                ...req.body
            },
            { new: true}
            );

            const errors = comment.validateSync();
            console.log(errors);
            if (!comment)
                return res.status(400).send(`The comment with id "${req.params.id}"
                does not exist.`);

            await comment.save();

            return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//POST Replies Endpoint
router.post('/:id/replies', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        const { error } = validateReply(req.body);
        if (error)
            return res.status(400).send(error);
            
        const reply = new Reply({
            text: req.body.text
        });

        comment.replies.push(reply);

        await comment.save();

        return res.send(comment.replies);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;