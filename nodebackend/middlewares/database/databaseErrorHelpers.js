const User = require('../../models/User');
const CustomError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const Did = require('../../models/Did');


const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { _id } = res.locals.user;

    const user = await User.findById(_id);

    if (!user) {
        return next(new CustomError("There is no such user with that id", 400));
    }

    next();
});

const checkUserExistWithParam = asyncErrorWrapper(async (req, res, next) => {
    const { userID } = req.params;

    const user = await User.findById(userID);

    if (!user) {
        return next(new CustomError("There is no such user with that id", 400));
    }

    next();
});

const checkUserHasDid = asyncErrorWrapper(async (req, res, next) => {
    const { _id } = res.locals.user;

    const did = await Did.find({ userID: _id });

    if (did.length > 0) {
        return next(new CustomError("This user already has a did", 409))
    }

    next();
});

module.exports = {
    checkUserExist,
    checkUserHasDid,
    checkUserExistWithParam,
}