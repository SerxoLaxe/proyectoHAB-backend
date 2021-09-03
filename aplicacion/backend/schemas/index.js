const Joi = require('joi');
const { joiConfig } = require('../config');
const { schemaExperiencias, schemaUsuarios } = joiConfig;

/**
 * Esquema de validación de la peticion de añadir experiencia.
 */
const añadirExperienciaSchema = Joi.object().keys({

    body: Joi.object().required().keys({
        nombre: Joi.string().required().error(
            new Error('El nombre es un campo obligatorio.')
        ),
        descripcion: Joi.string().required().max(schemaExperiencias.charsDescripcion).error(
            new Error(`La descripción es obligatoria y debe tener menos de ${schemaExperiencias.charsDescripcion} carácteres de extensión.`)
        ),
        fecha_inicial: Joi.string().required().isoDate().error(
            new Error('La fecha de inicio es un campo obligatorio y debe tener formato AAAA/MM/DD.')
        ),
        fecha_final: Joi.string().required().isoDate().error(
            new Error('La fecha final es un campo obligatorio oblogatoria y debe tener formato AAAA/MM/DD.')
        ),
        precio: Joi.number().required().positive().error(
            new Error('El precio es un campo obligatorio y debe ser de valor positivo.')
        ),
        ubicacion: Joi.string().required().error(
            new Error('La ubicación un campo obligatorio.')
        ),
        plazas_totales: Joi.number().required().positive().error(
            new Error('Las plazas totales son obligatorias y debe ser de valor positivo.')
        ),
    }),
    files: Joi.object().required().min(schemaExperiencias.minImagenes).max(schemaExperiencias.maxImagenes).error(
        new Error(`Sólo se permite un mínimo de ${schemaExperiencias.minImagenes} y un máximo de ${schemaExperiencias.maxImagenes} imágenes por experiencia.`)
    ).pattern(
        Joi.string(),
        Joi.object().keys({
            mimetype: Joi.string().required().valid('image/png', 'image/jpeg').error(
                new Error('Formato de imagen no válido')
            ),
        }).unknown(true),
    ),
}).unknown(true);

/**
 * Esquema de validación de la contraseña de la petición de registro de usuario.
 */
const registrarUsuarioSchema = Joi.object().keys({
    password:
        Joi.
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
            ),
    email: Joi.string().required().email().error(
        new Error('Introduce un email válido.')
    )
});

const buscarExperienciaSchema = Joi.object().keys({
    texto: Joi.string().
        error(new Error('Texto de búsqueda es obligatorio')),
    fechaInicial: Joi.string().isoDate().
        error(new Error('La fecha debe de ser en formato ISO')),
    fechaFinal: Joi.string().isoDate().
        error(new Error('La fecha debe de ser en formato ISO')),
    precioMinimo: Joi.number().positive().
        error(new Error('El precio debe ser positivo')),
    precioMaximo: Joi.number().positive().
        error(new Error('El precio debe ser positivo')),
});

module.exports = { añadirExperienciaSchema, registrarUsuarioSchema, buscarExperienciaSchema }
