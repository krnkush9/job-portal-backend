const mongoose = require("mongoose");
// user model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["Student", "Recruiter"]
    },
    experience : {
        type: String,
    },
    createdAt : {
        type: String,
        default: new Date()
    }
})

module.exports = mongoose.model("User", userSchema);