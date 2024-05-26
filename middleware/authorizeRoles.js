function authorizeRoles(...allowedRoles) {
    console.log("authorizeRoles")
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.sendStatus(403); // Forbidden
        }
        next();
    };
}

module.exports = authorizeRoles;
