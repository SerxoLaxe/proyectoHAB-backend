const Joi = require('joi')
const { joiConfig } = require('../config');

const añadirExperienciaSchema = Joi.object().keys({

    body: Joi.object().required().keys({
        nombre: Joi.string().required().error(
            new Error('El nombre es obligatorio.')
        ),
        descripcion: Joi.string().required().max(joiConfig.schemaExperiencias.charsDescripcion).error(
            new Error(`La descripción es obligatoria y debe tener menos de ${joiConfig.schemaExperiencias.charsDescripcion} carácteres de extensión.`)
        ),
        fecha_inicial: Joi.string().required().isoDate().error(
            new Error('La fecha de inicio es obligatoria y debe tener formato AAAA/MM/DD.')
        ),
        fecha_final: Joi.string().required().isoDate().error(
            new Error('La fecha final es oblogatoria y debe tener formato AAAA/MM/DD.')
        ),
        precio: Joi.number().required().positive().error(
            new Error('El precio es obligatorio y debe ser de valor positivo.')
        ),
        ubicacion: Joi.string().required().error(
            new Error('La ubicación es obligatoria.')
        ),
        plazas_totales: Joi.number().required().positive().error(
            new Error('Las plazas totales son obligatorias.')
        ),
    }),
    files: Joi.object().required().max(joiConfig.schemaExperiencias.maxImagenes).error(
        new Error(`Sólo se permite un máximo de ${joiConfig.schemaExperiencias.maxImagenes} imágenes por experiencia.`)
    ).pattern(
        Joi.string(),
        Joi.object().keys({
            mimetype: Joi.string().required().valid('image/png', 'image/jpeg').error(
                new Error('Formato de imagen no válido')
            ),
        }).unknown(true),
    ),
}).unknown(true);

module.exports = { añadirExperienciaSchema }