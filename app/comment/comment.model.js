const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content:      {type: String},
    author:       {type: String},
    createdDate:  {type: Date, default: Date.now()}
})

commentSchema.methods.serialize = function () {
    return {
        id: this._id,
        content: this.content,
        author: this.author,
        createdDate: this.createdDate
    };
}

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, commentSchema };