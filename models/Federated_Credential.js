const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Federated_CredentialSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    provider: { type: String, enum: ["https://accounts.google.com", "https://www.facebook.com"] },
    subject: String,
})

module.exports = mongoose.model("Federated_Credentials", Federated_CredentialSchema);