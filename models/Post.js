const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    created_at: { type: Date, default: Date.now(), required: true },
    updated_at: Date,
    title: { type: String, required: true },
    body: { type: String, required: true },
    imgurl: String,
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    community: { type: Schema.Types.ObjectId, ref: "Communities" },
    commentCount: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
})

module.exports = mongoose.model("Posts", PostSchema);