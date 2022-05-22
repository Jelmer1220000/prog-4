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
        console.log('user not found failed')
        res.status(code).json({
            Status: code,
            message: `User does not exist`,
        })
    },

    invalidPassword(req, res) {
        res.status(400).json({
            Status: 400,
            message: 'Password is Invalid'
        })
    },

    notOwner(req, res) {
        res.status(403).json({
            Status: 403,
            message: `User is not the owner`,
        })
    },

    returnDelete(req, res) {
        res.status(200).json({
            Status: 200,
            message: `Succesfully deleted: ${req.params.id}`,
        })
    },

    createFail(req, res) {
        console.log('create failed')
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
