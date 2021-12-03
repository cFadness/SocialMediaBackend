const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        text: { type: String, required: true},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
    }
)

function validatePost(post) {
    const schema = Joi.object({
        text: Joi.string().required(),
        userId: Joi.string().required()
    });
    return schema.validate(post);
}

const Post = mongoose.model('Post', postSchema);

exports.Post = Post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;