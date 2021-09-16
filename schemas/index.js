const añadirExperienciaSchema = require("./añadirExperienciaSchema");
const buscarExperienciaSchema = require("./buscarExperienciaSchema");
const editarExperienciaSchema = require("./editarExperienciaSchema");
const { loginRegistroSchema } = require("./loginregistroSchema");
const { contraseñaSchema } = require("./loginregistroSchema");
const { emailSchema } = require("./loginregistroSchema");
const puntuarExperienciaSchema = require("./puntuarExperienciaSchema");
const perfilUsuarioSchema = require("./perfilUsuarioSchema");

module.exports = {
  añadirExperienciaSchema,
  buscarExperienciaSchema,
  editarExperienciaSchema,
  loginRegistroSchema,
  puntuarExperienciaSchema,
  contraseñaSchema,
  emailSchema,
  perfilUsuarioSchema,
};
