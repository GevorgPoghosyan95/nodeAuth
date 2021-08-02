const ApiError = require('../exceptions/api-error')

const middleware = (schema, property) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);
        if (!error) {
            next()
        } else {
            const {details} = error
            const message = details.map(i => i.message).join(',');

            throw ApiError.BadRequest('Validation error!', {message: message})
        }
    }
}
module.exports = middleware;