const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .lowercase()
        .required(),

    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .lowercase()
        .required(),

    surname: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .lowercase()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    phone: Joi.string()
        .pattern(new RegExp(`^((375(29|33|25|44))|(\\+375\\s\\((29|33|25|44)\\)\\s)|(8\\s\\(0(29|33|25|44)\\)\\s))[1-9]{1}([0-9]{6}|[0-9]{2}-[0-9]{2}-[0-9]{2})$`)),

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    email: Joi.string()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
const petsSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})


module.exports = {
    userSchema,
    petsSchema
}
