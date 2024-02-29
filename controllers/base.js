exports.sendErr = (errMessage, req) => {
    if (req != undefined) {
        if (req.app.get("env") === "development") {
            return ": " + errMessage;
        } else {
            if (req.session && req.session.userId) {
                models.User.findOne({
                    where: {
                        id: req.session.userId,
                    },
                    attributes: ["permissions"],
                }).then((user) => {
                    if (user.permissions === "Admin") {
                        return ": " + errMessage;
                    } else {
                        console.log(errMessage);
                        return "";
                    }
                });
            } else {
                console.log(errMessage);
                return "";
            }
        }
    }
};
