const Joi = require('joi');

/**Esquema de validación de la búsqueda de experiencias */
const buscarExperienciaSchema = Joi.object({
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
    (error) => {
        return error
    }
);


module.exports = buscarExperienciaSchema;