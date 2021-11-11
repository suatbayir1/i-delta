const jwt = require('jsonwebtoken');
const User = require('../models/User');
const accessList = require('../constants/accessList.json');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(404).json({
                message: "Token is empty or undefined"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (new Date() > new Date(decodedToken.expiry_time * 1000)) {
            return res.status(408).json({
                message: "Token expired"
            })
        }

        const user = await User.findById(decodedToken.userID).select({ "password": 0 });

        res.locals.user = user;

        next();
    } catch {
        res.status(401).json({
            message: 'Invalid request!'
        })
    }
}

exports.isAuthorized = (endpoint) => {
    return function (req, res, next) {
        try {
            if (!accessList[endpoint].includes(res.locals.user.role)) {
                throw new Error()
            }

            next();
        } catch {
            res.status(401).json({
                message: "User doesn't have permission to access this method"
            })
        }
    }
}