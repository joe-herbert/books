const models = require("../models");
exports.admin = function (req, res, next) {
    next();
    /*if (req.session && req.session.userId) {
        models.User.findOne({
            where: {
                id: res.session.userId,
            },
            attributes: ["permissions"],
        })
            .then((user) => {
                if (user.permissions === "Admin") {
                    next();
                } else {
                    redirect(req, res, true);
                }
            })
            .catch((err) => {
                redirect(req, res, false);
            });
    } else {
        redirect(req, res, true);
    }*/
};

function redirect(req, res, accessDenied) {
    if (req.method === "POST") {
        res.status(403).send("Access Denied");
    } else {
        res.render("login", {
            error: accessDenied ? "Access Denied. You do not have the required permissions." : undefined,
        });
    }
}
