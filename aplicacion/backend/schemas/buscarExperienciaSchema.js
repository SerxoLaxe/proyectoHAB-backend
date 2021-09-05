const Joi = require('joi');

/**Esquema de validación de la búsqueda de experiencias */
const buscarExperienciaSchema = Joi.object().keys({
    texto: Joi.string().min(1).
        error(new Error('Texto de búsqueda no válido')),
    fechaInicial: Joi.string().isoDate().
        error(new Error('La fecha debe tener formato ISO')),
    fechaFinal: Joi.string().isoDate().
        error(new Error('La fecha debe tener formato ISO')),
    precioMinimo: Joi.number().positive().
        error(new Error('El precio debe ser positivo')),
    precioMaximo: Joi.number().positive().
        error(new Error('El precio debe ser positivo')),
}).required().min(1).error(
    new Error('Introduce al menos un campo de búsqueda')
);

module.exports = buscarExperienciaSchema;