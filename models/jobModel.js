const mongoose = require("mongoose")

// job model
const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    workType: {
        type: String,
        required: true,
        enum: ["full time", "part time", "internship"],
        default: "full time"
    },
    workLocation: {
        type: String,
        required: true,
    },
    experience : {
        type: String,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobPostDate: {
        type: String,
        default: new Date()
    }
})

module.exports = mongoose.model("Jobs", jobSchema);