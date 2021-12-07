const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema(
    {
        text: { type: String, required: true},
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        dateCreated: { type: Date, default: Date()}
    }
)

function validateLike(post) {
    const schema = Joi.object({
        likes: Joi.number().required()
    });
    return schema.validate(post);
}

const Post = mongoose.model('Post', postSchema);

exports.Post = Post;
exports.validateLike = validateLike;
exports.postSchema = postSchema;