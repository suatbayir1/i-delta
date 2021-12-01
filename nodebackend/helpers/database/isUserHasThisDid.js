const Did = require('../../models/Did');

const isUserHasThisDid = async (user, did) => {
    console.log(did.userID);
    console.log(String(user._id));
    return did.userID === String(user._id) ? true : false;
}

module.exports = isUserHasThisDid;