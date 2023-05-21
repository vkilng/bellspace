const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    created_at: { type: Date, default: Date.now(), required: true },
    updated_at: Date,
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
    upvotes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
})

module.exports = mongoose.model("Comments", CommentSchema);