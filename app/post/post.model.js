const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title:       {type: String, required: true},
    auther:      {type: Schema.Types.ObjectId, ref: 'user'},
    content:     {type: String},
    createdDate: {type: Date},
    updatedDate: {type: Date},
    tags:        [{type: Schema.Types.ObjectId, ref='tag'}],
    comments:    [{type: Schema.Types.ObjectId, ref='comment'}]
},
{
    versionKey: false,
    skipVersioning: {tags: true}

}
);

postSchema.set('toJSON',   { getters: true, virtuals: true });
postSchema.set('toObject', { getters: true, virtuals: true });
postSchema.path('createdTime').get(function(v) {
    return new Date(v).format('MM-dd-yyyy hh:mm:ss');
});
postSchema.path('updatedDate').get(function(v) {
    return new Date(v).format('MM-dd-yyyy hh:mm:ss');
})

const post = mongoose.model('Post', postSchema);

module.exports = Post;