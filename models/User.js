const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: null },
    username: { type: String, minLength: 1, maxLength: 20, required: true },
    email: String,
    password: String,
    profilepicurl: { type: String, default: null },
    communities: [{ type: Schema.Types.ObjectId, ref: "Communities", default: null }],
    pinned: [{ type: Schema.Types.ObjectId, ref: "Posts", default: null }],
    saved: [{ type: Schema.Types.ObjectId, ref: "Posts", default: null }],
})

module.exports = mongoose.model("Users", UserSchema);