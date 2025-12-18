const mongoose = require("mongoose");

// applied job model
const appliedJobModel = new mongoose.Schema({
    job: {
        type: mongoose.Types.ObjectId,
        ref:"Jobs",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobCreatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    applyOn: {
        type: String,
        dafault: new Date()
    }
})

module.exports = mongoose.model("Applied User", appliedJobModel);