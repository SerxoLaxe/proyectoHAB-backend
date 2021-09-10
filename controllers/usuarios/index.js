const editar = require('./editarUsuario');
const registrar = require('./registrarUsuario');
const id = require('./conseguirUsuarioID');
const listarTodos = require('./conseguirTodoUsuario');
const validar = require('./validarUsuario');
const eliminar = require('./eliminarUsuario');
const login = require('./loginUsuario');
const cambiarContraseña = require('./cambiarContraseñaUsuario');
const solicitarRecuperacionContraseña = require('./solicitarRecuperacionContraseñaUsuario');
const efectuarRecuperacionContraseña = require('./efectuarRecuperacionContraseña');

module.exports = {
    editar,
    registrar,
    id,
    listarTodos,
    validar,
    eliminar,
    login,
    cambiarContraseña,
    solicitarRecuperacionContraseña,
    efectuarRecuperacionContraseña,
};