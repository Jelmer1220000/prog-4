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

    noEndpoint(req, res) {
        console.log('no endpoint')
        res.status(404).json({
            Status: 404,
            message: `This Endpoint is currently Unavailable!`,
        })
    },
    
    mealNotFound(req, res, code) {
        console.log('meal not found')
        res.status(code).json({
            Status: code,
            message: `Meal does not exist`,
        })
    },

    returnParticipate(req, res, result) {
        res.status(200).json({
            Status: 200,
            result: result
        })
    },

    createFail(req, res) {
        console.log('create failed')
        res.status(400).json({
            Status: 400,
            message: `Meal could not be created!`,
        })
    },
}