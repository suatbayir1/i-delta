const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const accessList = require('../constants/accessList.json');

const isAuthenticated = asyncErrorWrapper(async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return next(new CustomError("Token is empty or undefined", 400));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (new Date() > new Date(decodedToken.expiry_time * 1000)) {
        return next(new CustomError("Token expired", 408));
    }

    const user = await User.findById(decodedToken.userID).select({ "password": 0 });

    res.locals.user = user;

    next();
})

const isAuthorized = function (param) {
    return asyncErrorWrapper(async (req, res, next) => {
        if (!accessList[param].includes(res.locals.user.role)) {
            return next(new CustomError("You are not authorized to access this url", 401));
        }

        next();
    })
}


module.exports = {
    isAuthenticated,
    isAuthorized,
}