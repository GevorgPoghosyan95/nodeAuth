const ApiError = require('../exceptions/api-error')

const middleware = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body, { abortEarly: false });
        if (!error) {
            next()
        } else {
            const {details} = error
            const message = details.map(i => i.message);

            throw ApiError.BadRequest('Validation error!', {message: message})
        }
    }
}
module.exports = middleware;