/* eslint-disable no-unused-vars */
require('dotenv').config();                                 //Módulo que carga las variables del archivo .env en las variables de entorno
const { HOST, PORT, UPLOAD_DIRECTORY } = process.env;       //Destructuring de las variables de entorno necesarias;
const path = require('path');                               //Módulo para el formato de direcciones de archivos y directorios.
const morgan = require('morgan');                           //Middleware log de eventos de express.
const fileUpload = require('express-fileupload');           //Middleware para la subida de archivos al servidor.
const chalk = require('chalk');                             //Módulo para editar formato y estilo de logs.
const helpers = require('./helpers');                       //Helpers, incluye generador de codigos de validacion, formateo de fechas, customización de errores...
const express = require('express');                         //Módulo para la creación de servidor http.
const app = express();                                      //definición de aplicación Express.
require('./DB/initDB').config();                            //Reset y configuración de la base de datos con datos creados por módulo Faker.

/* IMPORT DE CONTROLLERS */
const experiencia = require('./controllers/experiencias/index');        //Import de controladores experiencias
const usuario = require('./controllers/usuarios/index');                //Import de controladores usuarios

/////////////////////////////////////*MIDDLEWARES*///////////////////////////////////////

//GLOBALES
app.use(morgan('dev'));                                                 //MIddleware log de eventos de express.
app.use(express.json());                                                //Middleware parsing responses a json.
app.use(express.static(path.join(__dirname, UPLOAD_DIRECTORY)));        //Middleware recursos estáticos.
app.use(fileUpload());                                                  //Middleware subida de archivos a servidor.

//DE USO ESPECÍFICO
const { esUsuario, existe, esAdmin, esAutor } = require('./middlewares/index') //Middlewares propios.

///////////////////////////////////* ENDPOINTS *////////////////////////////////////////

/* EXPERIENCIA */

// GET experiencias mediante búsqueda y filtrado opcional mediante rango de fechas y precios. 👍
app.get('/experiencias/search', experiencia.buscar);

// GET Selecciona experiencia mediante id.  👍                                       
app.get('/experiencias/:id', existe, experiencia.id);

// POST Añade nueva experiencia ( Sólo administrador ) 👍 
app.post('/experiencias', esUsuario, esAdmin, experiencia.añadir);

// PUT Editar experiencia.  ( Sólo administrador ) ❌
app.put('/experiencias/:id', esUsuario, esAdmin, esAutor, existe, experiencia.editar);

// DELETE Elimina experiencia.  ( Sólo administrador ) ❌
app.delete('/experiencias/:id', esUsuario, esAdmin, existe, esAutor, experiencia.eliminar);

// POST Puntúa experiencia ( sólo cuando está finalizada y el usuario ha participado).❌                        
app.post('/experiecias/puntuar', esUsuario, existe, experiencia.puntuar);

// POST Añade imagen a experiencia.( Sólo administrador) ❌
app.post('/experiencias/:id/imagen/:id', esUsuario, esAdmin, esAutor, existe, experiencia.añadirImagen);

// DELETE Elimina imagen de experiencia (Sólo administrador) ❌
app.delete('/experiencias/:id/imagen/:id', esUsuario, existe, esAutor, experiencia.eliminarImagen);

/* USUARIO */

// GET usuario, para acceso al perfil mediante ID.👍 
app.get('/usuarios/:id', esUsuario, existe, usuario.id);

// POST registro de nuevo usuario. 👍 
app.post('/usuarios', usuario.registrar);

// POST validar usuario mediante codigo. 👍 
app.get('/usuarios/validar/:codigo', usuario.validar);

// PUT usuario, para editar sus datos.  (Sólo el propio usuario)❌
app.put('/usuarios/:id', esUsuario, existe, usuario.editar);

// DELETE usuario, elimina un usuario. (Sólo administrador)👍
app.delete('/usuarios/:id', esUsuario, existe, usuario.eliminar);

// GET login de usuario. 👍
app.post('/usuarios/login', usuario.login);

// PUT Cambia la contraseña ❌
app.put('/usuarios/:id/password', existe, usuario.cambiarContraseña);

/* RESERVADOS A DESARROLLO */

//GET experiencias, para mostrar todas las experiencias ( sólo para desarrollo ). 👍
app.get('/experiencias', experiencia.listarTodas);

//GET todos los usuarios ( sólo para desarrollo ). 👍
app.get('/usuarios', usuario.listarTodos);

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
        message: 'página no encontrada',
    });

});

/* Iniciar escucha del servidor. */
app.listen(PORT, HOST, () => {
    console.log(chalk.yellow.bold(`Servidor escuchando en ${HOST}:${PORT}`));
});



