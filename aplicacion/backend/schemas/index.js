const Joi = require('joi')

const añadirExperienciaSchema = Joi.object().keys({

    body: Joi.object().required().keys({
        nombre: Joi.string().required().error(
            new Error('El nombre es obligatorio.')
        ),
        descripcion: Joi.string().required().max(1000).error(
            new Error('La descripción es obligatoria y debe tener menos de mil carácteres de extensión.')
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
    files: Joi.object().required().max(4).error(
        new Error('Sólo se permite un máximo de 4 imágenes por experiencia.')
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