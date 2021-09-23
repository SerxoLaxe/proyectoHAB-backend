/* eslint-disable no-unused-vars */

// Módulo que carga las variables del archivo .env en las variables de entorno
require("dotenv").config();

// Destructuring de las variables de entorno necesarias;
const { HOST, PORT, UPLOAD_DIRECTORY } = process.env;

// Módulo para el formato de direcciones de archivos y directorios.
const path = require("path");

// Middleware log de eventos de express.
const morgan = require("morgan");

// Middleware para la subida de archivos al servidor.
const fileUpload = require("express-fileupload");

// Módulo para editar formato y estilo de logs.
const chalk = require("chalk");

// Helpers incluye generador de codigos de validacion, formateo de fechas, customización de errores...
const helpers = require("./helpers");

// Módulo para la creación de servidor http.
const express = require("express");

// Definición de aplicación Express.
const app = express();

// Reset y configuración de la base de datos con datos creados por módulo Faker.
require("./DB/initDB").config();

// Se incluye este modulo, para que no exista conflictos en la base de datos cuando se realicen  peticiones en el servidor local
const cors = require("cors");

///////////////////////////////////* IMPORT DE CONTROLLERS *//////////////////////////////

// Import de controladores experiencias
const experiencia = require("./controllers/experiencias/index");

// Import de controladores usuarios
const usuario = require("./controllers/usuarios/index");

/////////////////////////////////////*MIDDLEWARES*///////////////////////////////////////

// GLOBALES

// MIddleware log de eventos de express.
app.use(morgan("dev"));

//Evita conflictos en nuestra base de datos local.
app.use(cors());

// Middleware parsing responses a json.
app.use(express.json());

// Middleware recursos estáticos.
app.use("/fotos", express.static(path.join(__dirname, UPLOAD_DIRECTORY)));

// Middleware subida de archivos a servidor.
app.use(fileUpload());

// DE USO ESPECÍFICO

const {
  esUsuario,
  existe,
  esAdmin,
  esAutor,
  esPropietarioPerfil,
} = require("./middlewares/index");

///////////////////////////////////* ENDPOINTS *////////////////////////////////////////

/* EXPERIENCIA */

// GET experiencias mediante búsqueda y filtrado opcional mediante rango de fechas y precios. 👍
app.get("/experiencias/search", experiencia.buscar);

// GET Selecciona experiencia mediante id.  👍
app.get("/experiencias/:id", existe, experiencia.id);

//GET Selecciona los usuarios con reserva de cierta experiencia especificando el Id de esta. 👍
app.get("/experiencias/:id/reservas", esUsuario, existe, experiencia.reservas);

// POST Añade nueva experiencia ( Sólo administrador ) 👍
app.post("/experiencias", esUsuario, esAdmin, experiencia.añadir);

// PUT Editar experiencia.  ( Sólo administrador ) 👍
app.put(
  "/experiencias/:id",
  esUsuario,
  esAdmin,
  esAutor,
  existe,
  experiencia.editar
);

// DELETE Elimina experiencia.  ( Sólo administrador ) 👍
app.delete(
  "/experiencias/:id",
  esUsuario,
  esAdmin,
  existe,
  esAutor,
  experiencia.eliminar
);

// PUT Reserva plaza en experiencia. ( Sólo cuando la experiencia no ha comenzado aún y el usuario no está apuntado). 👍
app.post("/experiencias/:id/reservar", esUsuario, existe, experiencia.reservar);

// DELETE cancela la reserva de la experiencia. ( Sólo cuando la experiencia no ha comenzado aún y el usuario está apuntado). 👍
app.delete(
  "/experiencias/:id/cancelar",
  esUsuario,
  existe,
  experiencia.cancelar
);

// POST Puntúa experiencia ( sólo cuando está finalizada y el usuario ha participado).
app.post("/experiencias/:id/puntuar", esUsuario, existe, experiencia.puntuar);

// POST Añade imagen a experiencia.( Sólo administrador) 👍
app.post(
  "/experiencias/:id/imagen",
  esUsuario,
  esAdmin,
  existe,
  experiencia.añadirImagen
);

// DELETE Elimina imagen de experiencia (Sólo administrador) 👍
app.delete(
  "/experiencias/imagen/:idImagen",
  esUsuario,
  esAdmin,
  experiencia.eliminarImagen
);

/* USUARIO */

// GET usuario, para acceso al perfil mediante ID.👍
app.get("/usuarios/:id", esUsuario, existe, usuario.id);

// POST registro de nuevo usuario. 👍
app.post("/usuarios", usuario.registrar);

// POST validar usuario mediante codigo. 👍
app.get("/usuarios/validar/:codigo", usuario.validar);

// PUT usuario, para editar sus datos.  (Sólo el propio usuario) 👍
app.put(
  "/usuarios/:id",
  esUsuario,
  existe,
  esPropietarioPerfil,
  usuario.editar
);

// DELETE usuario, elimina un usuario. (Sólo el propio usuario)👍
app.delete(
  "/usuarios/:id",
  esUsuario,
  existe,
  /* esPropietarioPerfil */
  usuario.eliminar
);

// POST login de usuario. 👍
app.post("/usuarios/login", usuario.login);

// PUT Cambia la contraseña cuando el usuario está logueado 👍
app.put(
  "/usuarios/:id/changepassword",
  esUsuario,
  existe,
  esPropietarioPerfil,
  usuario.cambiarContraseña
);

// POST Solicita la recuperación de la contraseña introduciendo solamente el email ( para usuarios que hayan olvidado su contraseña).👍
app.post(
  "/usuarios/lostpassword/requestchange",
  usuario.solicitarRecuperacionContraseña
);

// POST Efectúa la recuperación de la contraseña , introduciendo una nueva. 👍
app.post(
  "/usuarios/lostpassword/makechange",
  usuario.efectuarRecuperacionContraseña
);

/* RESERVADOS A DESARROLLO */

//GET experiencias, para mostrar todas las experiencias ( sólo para desarrollo ). 👍
app.get("/experiencias", experiencia.listarTodas);

//GET todos los usuarios ( sólo para desarrollo ). 👍
app.get("/usuarios", usuario.listarTodos);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Middleware error */
app.use((err, req, res, next) => {
  res.status(err.httpStatus || 500).send({
    status: "error",
    message: err.message,
  });
  helpers.logError(err);
});

/* Middleware página no encontrada */
app.use((req, res, next) => {
  res.statusCode = 404;
  res.send({
    status: 404,
    message: "página no encontrada",
  });
});

/* Iniciar escucha del servidor. */
app.listen(PORT, HOST, () => {
  console.log(chalk.yellow.bold(`Servidor escuchando en ${HOST}:${PORT}`));
});
