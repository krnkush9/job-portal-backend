const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// login controller
exports.loginController = async (req, res) => {
    try {
        // get value
        const { email, password } = req.body;
        if (!email || !password) {
            if (!email) return res.status(200).json({ success: false, message: "Email required" })
            if (!password) return res.status(200).json({ success: false, message: "Password required" })
        }

        // check user exist or not
        const user = await userModel.findOne({ email });
        // if user does not exist
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User does not exist. Please create an account"
            })
        }

        // if user exist
        // match password
        let token;
        if (await bcrypt.compare(password, user.password)) {
            // password correct then generate token
            user.password = undefined;
            const payload = {
                id: user._id,
                email: user.email,
                role: user.role
            }
            token = jwt.sign(
                payload,
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            )

        } else {
            // password incorrect
            return res.status(200).json({
                success: false,
                message: "Incorrect password"
            })
        }
        // send response
        res.status(200).json({
            success: true,
            message: "Login successfully",
            user: user,
            token: token
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
            err: err.message
        })
    }
}