// library
const bcrypt = require("bcrypt");

// model
const userModel = require("../models/userModel");

// update user controller
exports.updateUserController = async (req, res) => {
    try {
        // fetch data
        const { firstName, lastName, password } = req.body;
        // validation
        if (!firstName || !lastName || !password) {
            if (!firstName) return res.status(400).json({ success: false, message: "First name required" })

            if (!lastName) return res.status(400).json({ success: false, message: "Last name required" })

            if (!password) return res.status(400).json({ success: false, message: "Password required" })
        }
        // password hashing
        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Password hashing eror",
                err: error.message
            })
        }
        // get user detail using user id 
        const userId = req.user.id;
        // update data
        const updatedUser = await userModel.updateOne(
            { _id: userId },
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    password: hashPassword
                }
            }
        )
        // hide password
        updatedUser.password = undefined;
        // send response
        res.status(200).json({
            success: true,
            message: "Update data successfully",
            newUpdateData: updatedUser
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            err: err.message
        })
    }
}