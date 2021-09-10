const Joi = require('joi');
const { joiConfig } = require('../config');
const { schemaUsuarios } = joiConfig;

/**Esquema de validación para las contraseñas */
const contraseñaSchema = Joi.
    string().
    required().
    alphanum().
    min(schemaUsuarios.minCharsContraseña).
    max(schemaUsuarios.maxCharsContraseña).
    custom(                                    //Esta función custom valida sólo las contraseñas que poseen al menos un dígito y una letra.
        (value, helpers) => {
            const regExDigitos = /\d/;
            const regExCaracteres = /\D/;
            if (regExDigitos.test(value) === true && regExCaracteres.test(value) === true) {
                return value;
            }
            return helpers.error('La contraseña debe incluir al menos un dígito y una letra');
        }
    ).
    error(
        new Error(`La contraseña debe ser alfanumérica, contener al menos un número y contar como mínimo con ${schemaUsuarios.minCharsContraseña} carácteres y como máximo con ${schemaUsuarios.maxCharsContraseña} carácteres.`)
    );

/**Esquema de validación para las direcciones de email */
const emailSchema = Joi.string().email().required().error(
    new Error('email no válido')
);

/** Esquema de validación del login y registro de usuarios */
const loginRegistroSchema = Joi.object().keys({
    contraseña: contraseñaSchema,
    email: emailSchema,
});

module.exports = {loginRegistroSchema, contraseñaSchema, emailSchema};