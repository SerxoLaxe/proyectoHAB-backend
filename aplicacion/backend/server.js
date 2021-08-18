require('dotenv').config();    //Módulo que carga las variables del archivo .env en las variables de entorno
const { HOST, PORT, UPLOAD_DIRECTORY } = process.env; //Destructuring de las variables de entorno necesarias;
const path = require('path');    //Módulo para el formato de direcciones de archivos y directorios.
const morgan = require('morgan');    //Middleware log de eventos de express.
const fileUpload = require('express-fileupload');    //Middleware para la subida de archivos al servidor.
const chalk = require('chalk');    //Módulo para editar formato y estilo de logs.
const helpers = require('./helpers');    //Helpers, incluye generador de codigos de validacion, formateo de fechas, customización de errores...
const express = require('express');    //Módulo para la creación de servidor http.
const app = express(); //definición de aplicación Express.
require('./DB/initDB').config(); //Reset y configuración de la base de datos con datos creados por módulo Faker.

/* IMPORT DE CONTROLLERS */
const experiencia = require('./controllers/experiencias/index');    //Import de controladores experiencias
const usuario = require('./controllers/usuarios/index');    //Import de controladores usuarios

/////////////////////////////////////*MIDDLEWARES*///////////////////////////////////////

//GLOBALES
app.use(morgan('dev'));    //MIddleware log de eventos de express.
app.use(express.json());     //Middleware parsing responses a json.
app.use(express.static(path.join(__dirname, UPLOAD_DIRECTORY)));    //Middleware recursos estáticos.
app.use(fileUpload());    //Middleware subida de archivos a servidor.

///////////////////////////////////* ENDPOINTS *////////////////////////////////////////

                                                                            /* EXPERIENCIA */
app.get('/experiencias/search', experiencia.buscar);                         //GET experiencias mediante búsqueda y filtrado opcional mediante rango de fechas y precios. ❌
app.get('/experiencias/:id',  experiencia.id);                              //GET Selecciona experiencia mediante id.  ❌
app.post('/experiencias', experiencia.añadir);                              //POST Añade nueva experiencia ( Sólo administrador )❌
app.put('/experiencias/:id', experiencia.editar);                           //PUT Editar experiencia.  ( Sólo administrador )❌
app.delete('/experiencias/:id', experiencia.eliminar);                      //DELETE Elimina experiencia.  ( Sólo administrador )❌
app.post('/experiecias/puntuar', experiencia.puntuar);                      //POST Puntua experiencia ( sólo cuando está finalizada y el usuario ha participado).❌
app.post('/experiencias/:id/imagen/:id', experiencia.añadirImagen);         //POST Añade imagen a experiencia.( Sólo administrador) ❌
app.delete('/experiencias/:id/imagen/:id', experiencia.eliminarImagen);     //DELETE Elimina imagen de experiencia (Sólo administrador) ❌


                                                                            /* USUARIO */
app.get('/usuarios/:id', usuario.id);                                       //GET usuario, para acceso al perfil mediante ID.❌ 
app.post('/usuarios', usuario.registrar);                                   //POST registro de nuevo usuario. ❌
app.get('/usuarios/validar/:codigo', usuario.validar);                      //POST validar usuario mediante codigo. ❌
app.put('/usuarios/:id',  usuario.editar);                                  //PUT usuario, para editar sus datos.  (Sólo el propio usuario)❌
app.delete('/usuarios/:id', usuario.eliminar);                              //DELETE usuario, elimina un usuario. (Sólo administrador)❌
app.post('/usuarios/login', usuario.login);                                 //GET login de usuario. 
app.put('/usuarios/:id/contraseña', usuario.cambiarContraseña)              //PUT Cambia la contraseña ❌

                                                                            /* RESERVADOS A DESARROLLO */
app.get('/experiencias', experiencia.listarTodas);                          //GET experiencias, para mostrar todas las experiencias ( sólo para desarrollo ). ❌
app.get('/usuarios', usuario.listarTodos);                                  //GET todos los usuarios ( sólo para desarrollo ). ❌


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
})



