const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date },
    cred_name: String,
    username: { type: String, minLength: 1, maxLength: 20 },
    email: String,
    password: String,
    profilepicurl: String,
    pinned: [{ type: Schema.Types.ObjectId, ref: "Posts"}],
    saved: [{ type: Schema.Types.ObjectId, ref: "Posts"}],
})

module.exports = mongoose.model("Users", UserSchema);