const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
    try {
        // fetch token
        let token = req.header("Authorization");
        // if token does not exist
        if (!token) {
            return res.status(200).json({
                success: false,
                message: "Missing token"
            })
        }
        token = req.header("Authorization").replace("Bearer ", "")
        // verify token with JWT SECRET KEY
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decode;
        } catch (error) {
            res.status(200).json({
                success: false,
                message: "Token verification failed",
                err: error.message
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying token",
            error: error.message
        })
    }
}

exports.isRecruiter = async (req, res, next) => {
    try {
        // role match
        if (req.user.role != "Recruiter") {
            return res.status(200).json({
                success: true,
                message: "You do not have permission. This is protected route for recruiter."
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        // match role
        if (req.user.role != "Student") {
            return res.status(200).json({
                success: true,
                message: "You do not have permission. This is protected route for student."
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}