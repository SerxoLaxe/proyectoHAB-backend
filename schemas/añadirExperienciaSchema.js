const Joi = require('joi');
const { joiConfig } = require('../config');
const { schemaExperiencias } = joiConfig;

/** Esquema de validación de la peticion de añadir experiencia. */
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
        plazas_totales: Joi.number().required().positive().integer().error(
            new Error('Las plazas totales son obligatorias y debe ser un integral positivo.')
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

module.exports = añadirExperienciaSchema;