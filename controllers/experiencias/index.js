const añadir = require('./añadirExperiencia');
const eliminar = require('./eliminarExperiencia');
const buscar = require('./buscarExperiencias');
const id = require('./conseguirExperienciaID');
const editar = require('./editarExperiencia');
const listarTodas = require('./conseguirTodaExperiencia')
const añadirImagen = require('./añadirImagenExperiencia');
const eliminarImagen = require('./eliminarImagenExperiencia');
const puntuar = require('./puntuarExperiencia');
const reservar = require('./reservarExperiencia');
const cancelar = require('./cancelarExperiencia')

module.exports = { 
    añadir,
    eliminar,
    buscar,
    id,
    editar,
    listarTodas,
    añadirImagen,
    eliminarImagen,
    puntuar,
    reservar,
    cancelar,
};