const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commentSchema } = require('../comment/comment.model');

const postSchema = new Schema({
    title:       {type: String, required: true},
    auther:      {type: Schema.Types.ObjectId, ref: 'user'},
    content:     {type: String},
    createdDate: {type: Date, default: Date.now()},
    updatedDate: {type: Date},
    tags:        [{type: Schema.Types.ObjectId, ref: 'tags'}],
    comments:    [ commentSchema ]
});

postSchema.methods.serialize = function () {
    let user;   
    if (this.author && this.author.serialize) {
        user = this.user.serialize();
    } else {
        user = this.user;
    }
    return {
        id: this._id,
        auther: user,
        title: this.title,
        content: this.content,
        createdDate: this.createdDate,
        updatedDate: this.createdDate,
        tags: this.tags,
        comments: this.comments
    };
}

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };