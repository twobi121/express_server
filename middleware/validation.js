const Joi = require('@hapi/joi');

module.exports = function (schema) {
    return async function (req, res, next) {
        try {
            const value = await schema.validateAsync(req.body);
            req.valid = value
            next()
        }
        catch (err) {
            res.status(400).send({error: err.message});
        }

    }
}
