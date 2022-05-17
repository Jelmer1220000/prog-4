module.exports = {
    databaseError(req, res, result) {
        console.log(result)
        res.status(400).json({
            Status: 400,
            message: result,
        })
    },
}