const express = require("express");
const router = express.Router();

// middlewares
const {
    authMiddleware,
    isRecruiter,
    isStudent
} = require("../middlewares/authMiddleware");

// controllers
const {
    createJobController,
    getAllJob,
    getAllJobByPostedUser,
    updateJob,
    deleteJobController,
    searchJobByPosition,
    applyJob,
    getAppliedJobForm
} = require("../controllers/jobController");

// create job 
router.post("/create-job", authMiddleware, isRecruiter, createJobController);
// get all job
router.get("/get-all-job", getAllJob);
// get all job by posted user
router.get("/get-all-job-by-user", authMiddleware, isRecruiter, getAllJobByPostedUser);
// update job
router.put("/update-job/:jobId", authMiddleware, isRecruiter, updateJob);
// delete job
router.delete("/delete-job/:jobId", authMiddleware, isRecruiter, deleteJobController);
// search by position
router.get("/search-by-position", searchJobByPosition);
// apply job
router.post("/apply/:jobId", authMiddleware, isStudent, applyJob);
// get all applied user
router.get("/applied-job-form", authMiddleware, isRecruiter, getAppliedJobForm);

module.exports = router;