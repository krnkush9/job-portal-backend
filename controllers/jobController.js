const mongoose = require("mongoose");
const jobSchema = require("../models/jobModel");
const appliedSchema = require("../models/appliedJobModel");

// create job controller
exports.createJobController = async (req, res) => {
    try {
        // fetch data
        const {
            company,
            position,
            workType,
            description,
            workLocation,
            experience
        } = req.body;
        // validation
        if (!company || !position || !workType || !workLocation || !description || !experience) {
            // TODO: write valide for each data
            return res.status(200).json({
                success: false,
                message: "All fields required"
            })
        }
        // get user id
        const createdByUserId = req.user.id;
        // save data in DB
        const job = await jobSchema.create({
            company,
            position,
            workType,
            workLocation,
            description,
            createdBy: createdByUserId,
            experience
        })
        // send response
        res.status(200).json({
            success: true,
            message: "Job posted successfylly",
            job: job
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Can't post job, please try again",
            error: error.message
        })
    }
}

// get all job controller
exports.getAllJob = async (req, res) => {
    try {
        // find all job
        const allJob = await jobSchema.find();
        // send response
        res.status(200).json({
            success: true,
            message: "All jobs list",
            total_job: allJob.length,
            job_list: allJob
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Can't get all job, please try again",
            error: error.message
        })
    }
}

// search job by position
exports.searchJobByPosition = async (req, res) => {
    try {
        // fetch all qurey params
        let { position, search } = req.query;
        // query object
        const queryObject = {}

        if (position) {
            position = position.toLowerCase();
            queryObject.position = position;
        }

        if (search) {
            // search by any word
            queryObject.position = { $regex: search, $options: "i" }
        }

        const result = await jobSchema.find(queryObject);

        if (result.length == 0) {
            res.status(200).json({
                success: true,
                total_job: result.length,
                message: "Job not found for this position"
            })
        }
        // send response
        res.status(200).json({
            success: true,
            total_job: result.length,
            jobs: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Can't serch job, please try again",
            error: error.message
        })
    }
}

// get all job by posted user
exports.getAllJobByPostedUser = async (req, res) => {
    try {
        // get user id
        const userId = req.user.id;
        // find all job using user
        const allJob = await jobSchema.find({ createdBy: userId })
        // send response
        res.status(200).json({
            success: true,
            message: "All jobs list by a user",
            total_job: allJob.length,
            job_list: allJob
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Can't get all job by posted user, please try again",
            error: error.message
        })
    }
}

// update job
exports.updateJob = async (req, res) => {
    try {
        // fetch all fields
        const {
            company,
            position,
            description,
            workType,
            workLocation
        } = req.body;
        // fetch job id
        const { jobId } = req.params;

        // validation
        if (!company || !position || !description || !workType || !workLocation) {
            return res.status(200).json({
                success: false,
                message: "All fields are required"
            })
        }
        // find job
        const job = await jobSchema.findOne({ _id: jobId });
        // validate job
        if (!job) {
            return res.status(200).json({
                success: false,
                message: "Job not found with this job id"
            })
        }
        // validate authorize user
        if (req.user.id != job.createdBy.toString()) {
            return res.status(200).json({
                success: false,
                message: "You have not permission to update"
            })
        }
        // update job
        const updatedJob = await jobSchema.findOneAndUpdate(
            { _id: jobId },
            {
                company,
                position,
                description,
                workType,
                workLocation
            },
            {
                new: true,
            }
        )
        // send response
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            update_job: updatedJob
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Can't update job, please try again",
            error: error.message
        })
    }
}

// delete job
exports.deleteJobController = async (req, res) => {
    try {
        // fetch job id
        const { jobId } = req.params;
        // find job
        const job = await jobSchema.findById({ _id: jobId });
        if (!job) {
            return res.status(200).json({
                success: false,
                message: `Job not found with this job id: ${jobId}`
            })
        }
        // authorization to the user
        if (req.user.id != job.createdBy.toString()) {
            return res.status(200).json({
                success: false,
                message: "You have not permission to delete"
            })
        }
        // delete job id DB
        const deletedJob = await jobSchema.findByIdAndDelete({ _id: jobId });
        // send response
        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            deleted_job: deletedJob
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Can't delete job, please try again",
            error: error.message
        })
    }
}

// apply job
exports.applyJob = async (req, res) => {
    try {
        // fetch job id
        const { jobId } = req.params;
        // validation
        if (!jobId) {
            return res.status(200).json({
                success: false,
                message: "Job id required"
            })
        }
        // search job in database
        const getJob = await jobSchema.findById(jobId);
        // validation
        if (!getJob) {
            return res.status(200).json({
                success: false,
                message: "Job not found"
            })
        }

        // get user (student)
        const userId = req.user.id;
        // check already applied or not
        const alreadyApplied = await appliedSchema.find({
            $and: [
                { user: userId },
                { job: jobId }
            ]
        })

        if (alreadyApplied.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Already applied"
            })
        }
        // apply job
        // save data in database
        await appliedSchema.create({
            job: jobId,
            user: userId,
            jobCreatedBy: getJob.createdBy
        })
        // send resp
        res.status(200).json({
            success: true,
            message: "Application sent.",
            job: getJob
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Can't apply. Please try again.",
            error: err.message
        })
    }
}

// appled job form
exports.getAppliedJobForm = async (req, res) => {
    try {
        // get recruiter id
        const recruiterId = req.user.id;
        // get all applied job
        const allUser = await appliedSchema.find({ jobCreatedBy: recruiterId }).populate("user");

        if (!allUser) {
            return res.status(500).json({
                success: false,
                message: "Application not found",
            })
        }
        // make a applied student object
        let appliedStudent = [];
        for (let a of allUser) {
            appliedStudent.push({
                "Name": `${a.user.firstName} ${a.user.lastName}`,
                "email": `${a.user.email}`
            })
        }
        // send response
        res.status(200).json({
            success: true,
            message: "All application",
            total_applied_user: allUser === null ? 0 : allUser.length,
            users: allUser === null ? "Application not found" : appliedStudent
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Can't apply. Please try again.",
            error: err.message
        })
    }
}