const Joi = require('@hapi/joi');

module.exports = function jopa (schema) {
    return async function (req, res, next) {
        try {
            const value = await schema.validateAsync(req.body);
            req.valid = value
            next()
        }
        catch (err) {
            console.log(err)
        }

    }

}
