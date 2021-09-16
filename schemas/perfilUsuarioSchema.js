const Joi = require("joi");

const perfilUsuarioSchema = Joi.object()
  .keys({
    body: Joi.object().keys({
      nombre: Joi.string()
        .min(5)
        .max(15)
        .error(new Error("Nombre de usuario no válido")),
      biografia: Joi.string()
        .max(2000)
        .error(
          new Error(
            `La biografía tiene una extensión máxima de 2000 carácteres`
          )
        ),
    }),
    files: Joi.object()
      .max(1)
      .pattern(
        Joi.any(),
        Joi.object()
          .keys({
            mimetype: Joi.string()
              .required()
              .valid("image/png", "image/jpeg")
              .error(new Error("Formato de imagen no válido")),
          })
          .unknown()
      ),
  })
  .unknown();

module.exports = perfilUsuarioSchema;
