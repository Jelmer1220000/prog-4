module.exports = {
    userLogin(req, res, result) {
        res.status(200).json({
            Status: 200,
            result: result
        })
    },
    wrongPassword(req, res) {
        res.status(404).json({
            Status: 404,
            message: `User not found or password invalid!`
        })
    },

    wrongValidation(req, res, err) {
        res.status(400).json({
            Status: 400,
            message: err.toString()
        })
    },

    headerMissing(req, res) {
        res.status(401).json({
            Status: 401,
            message: 'Authorization header missing!',
        })
    },

    unAuthorized(req, res) {
        res.status(401).json({
            Status: 401,
            message: 'Not authorized',
        })
    },

}