const añadirExperienciaSchema = require('./añadirExperienciaSchema');
const buscarExperienciaSchema = require('./buscarExperienciaSchema');
const {loginRegistroSchema} = require('./loginregistroSchema');
const {contraseñaSchema} =require('./loginregistroSchema')
const puntuarExperienciaSchema = require('./puntuarExperienciaSchema')

module.exports = { añadirExperienciaSchema, buscarExperienciaSchema, loginRegistroSchema, puntuarExperienciaSchema, contraseñaSchema }
