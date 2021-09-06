const conexionMysql = require('../../DB/conexionMysql');
const { validate, generateRandomString, formatearDateMysql, sendMail } = require('../../helpers');
const { loginRegistroSchema } = require('../../schemas/index')
/**
 * Registra un nuevo usuario tomando del body de la petición el email y la contraseña, genera para el usuario un código de registro y envia un correo con enlace de validación. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function registrarUsuario(req, res, next) {
    let conexion;
    try {
        await validate(loginRegistroSchema, req.body);                   //Validamos los datos del body.
        const { email } = req.body;                                         //Destructuring del body.
        conexion = await conexionMysql();                                   //Obtenemos una conexión a la BD.
        await existeUsuarioConEmail(email, conexion);                       //Comprobamos que el email no exista ya en la BD.
        const codigoRegistro = generateRandomString();                      //Genero un código de registro (ej: sbdhfbud809urut9304)
        await añadirUsuarioEnTabla(req.body, codigoRegistro, conexion);     //Añado el usuario a la tabla de usuarios.
        enviarEmail(email, codigoRegistro)                            //Envio un email con el enlace de validación.
        res.statusCode = 200;
        res.send({
            status: 'Ok',
            message: 'Registrar usuario',
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

/**
 * // compruebo que no exista en la base de datos un usuario con esta email.
 * @param {String} email - email con el que realizar la comprobación.
 * @param {Object} conexion 
 */
async function existeUsuarioConEmail(email, conexion) {
    const [idUsuario] = await conexion.query(
        `
        SELECT id
        FROM usuarios
        WHERE email=?
        `,
        [email]
    );
    if (idUsuario.length > 0) {
        const error = new Error("Ya existe un usuario con este mail");
        error.httpStatus = 409;
        throw error;
    }
}

/**
 * Añade a la tabla usuarios un nuevo usuario.
 * @param {Object} datos - Objeto que contiene el email y la password
 * @param {Object} conexion - conexion a Mysql
 */
async function añadirUsuarioEnTabla(datos, codigoRegistro, conexion) {
    await conexion.query(                                   // añado el usuario a la base de datos (con registrationCode=sbdhfbud809urut9304)
        `
        INSERT INTO usuarios(fecha,email,contraseña,codigo_validacion)
        VALUES (?,?,SHA2(?, 512),?)
        `,
        [formatearDateMysql(new Date()), datos.email, datos.contraseña, codigoRegistro]
    );
}

/**
 * Envia un email con el enlace de validación del usuario.
 * @param {String} email - email destinatario
 * @param {String} codigoRegistro - codigo de validacion del usuario
 */
function enviarEmail(email, codigoRegistro) {
    const emailBody =
        `
    Te acabas de registrar en Experiencias diferentes.
    Pulsa aqui para validar tu usuario: ${process.env.PUBLIC_HOST}:${process.env.PUBLIC_PORT}/usuarios/validar/${codigoRegistro}
    `;
    sendMail({
        to: email,
        subject: "Activa tu usuario de experiencias Diferentes",
        body: emailBody,
    });
}

module.exports = registrarUsuario;