const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommunitySchema = new Schema({
    created_at: { type: Date, default: Date.now(), required: true },
    updated_at: Date,
    name: { type: String, minLength: 1, maxLength: 21, required: true },
    description: { type: String, minLength: 1 },
    rules: [{ type: String, default: null }],
    profilepic: String,
    memberCount: { type: Number, default: 1 },
    moderators: [{ type: Schema.Types.ObjectId, ref: "Users", default: null }],
})

module.exports = mongoose.model("Communities", CommunitySchema);