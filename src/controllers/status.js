module.exports = {
    returnList(req, res, result, code) {
        res.status(code).json({
            Status: code,
            results: result,
        })
    },

    returnOne(req, res, result, code) {
        res.status(code).json({
            Status: code,
            result: result,
        })
    },

    userNotFound(req, res, code) {
        res.status(code).json({
            Status: code,
            message: `User does not exist`,
        })
    },

    mealNotFound(req, res, code) {
        res.status(code).json({
            Status: code,
            message: `Meal does not exist`,
        })
    },

    returnDelete(req, res) {
        res.status(200).json({
            Status: 200,
            message: `Succesfully deleted: ${req.params.id}`,
        })
    },

    databaseError(req, res, result) {
        res.status(400).json({
            Status: 400,
            message: result,
        })
    },

    createFail(req, res) {
        res.status(400).json({
            Status: 400,
            message: `User could not be created!`,
        })
    },

    noEndpoint(req, res) {
        res.status(404).json({
            Status: 404,
            message: `This Endpoint is currently Unavailable!`,
        })
    },

    emailInvalid(req, res) {
        res.status(400).json({
            Status: 400,
            message: `Email is invalid`,
        })
    },

    emailExists(req, res) {
        res.status(409).json({
            Status: 409,
            message: `Email already exists!`,
        })
    },

    invalidBody(req, res, error) {
        res.status(400).json({
            Status: 400,
            message: error,
        })
    },
}
