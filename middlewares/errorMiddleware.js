const errorHandler = async(error, req, res, next)=>{
    const statuscode = res.statusCode ? res.statusCode : 500
    res.status(statuscode)
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : null
    })
}

module.exports = errorHandler

