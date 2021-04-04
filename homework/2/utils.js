function errorResponse(schemaErrors) {
    const errors = schemaErrors.map(({ path, message }) => {
        return { path, message }
    })

    return {
        status: 'failed',
        errors,
    }
}

function validateSchema(schema){
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        })

        if(error && error.isJoi) {
            res.status(400).json(errorResponse(error.details))
        } else {
            next()
        }
    }
}

module.exports = { validateSchema }