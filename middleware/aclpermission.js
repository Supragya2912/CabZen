// check if the role is allowed to perform actions
const User = require('../model/User');
const checkPermission = (requiredRole) => {

    return async function (req, res, next) {

        const id = req.user.id;
        const user = await User.findById(id);
        const userRole = user.role;

        if (requiredRole.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ error: "You are unauthorized to perform this action" });
        }
    };
};

module.exports = checkPermission;