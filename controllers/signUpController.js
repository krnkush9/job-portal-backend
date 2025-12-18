// packages
const bcrypt = require("bcrypt");

// files
const userModel = require("../models/userModel");

// sign up controller
exports.signUpController = async (req, res) => {
    try {
        // get values
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            experience
        } = req.body;

        // validation
        if (!firstName || !lastName || !email || !password || !role || !experience) {
            if (!firstName) return res.status(400).json({ success: false, message: "First name required" })

            if (!lastName) return res.status(400).json({ success: false, message: "Last name required" })

            if (!email) return res.status(400).json({ success: false, message: "Email required" })

            if (!password) return res.status(400).json({ success: false, message: "Password required" })

            if (!role) return res.status(400).json({ success: false, message: "Role required" })

            if (!experience) return res.status(400).json({ success: false, message: "Experience required" })
        }

        // check user already exist
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "User already exist. Please login"
            })
        }

        // password length validation
        if (password.length < 6) {
            return res.status(200).json({
                success: true,
                message: "Password length must be atlest 6.",
            })
        }

        // user does not exist
        // password hashing
        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in password hashing",
                err: error.message
            })
        }

        // save data in DB
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            role,
            experience
        })
        // hide password
        user.password = undefined
        // send response
        res.status(200).json({
            success: true,
            message: "User account created successfully",
            user: user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Can not create account. Please try again.",
            err: err.message
        })
    }
}