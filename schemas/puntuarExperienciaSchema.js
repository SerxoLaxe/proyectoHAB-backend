const Joi = require("joi");
const { joiConfig } = require("../config");
const {
  schemaPuntuacion: { minPuntuacion, maxPuntuacion, maxCharsComentario },
} = joiConfig;

const puntuarExperienciaSchema = Joi.object().keys({
  puntuacion: Joi.number()
    .min(minPuntuacion)
    .max(maxPuntuacion)
    .required()
    .error(
      new Error(
        `Introduce una puntuación numérica entre ${minPuntuacion} y ${maxPuntuacion}, puede ser decimal.`
      )
    ),
  comentario: Joi.string()
    .max(maxCharsComentario)
    .error(
      new Error(
        `El comentario debe tener como máximo ${maxCharsComentario} carácteres de extensión.`
      )
    ),
});

module.exports = puntuarExperienciaSchema;
