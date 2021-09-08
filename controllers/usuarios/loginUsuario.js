const conexionMysql = require('../../DB/conexionMysql');
const jwt = require('jsonwebtoken');
const { validate } = require('../../helpers');
const { loginRegistroSchema } = require('../../schemas');
/**
 * Esta función logea a los usuarios con credenciales correctas respondiendo con un JWT. ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function loginUsuario(req, res, next) {
    let conexion;
    try {
        await validate(loginRegistroSchema, req.body);
        const { email, contraseña } = req.body;
        conexion = await conexionMysql();
        const [usuario] = await conexion.query(
            `
            SELECT id, privilegios, activo
            FROM usuarios
            WHERE email=? AND contraseña=SHA2(?, 512)
            `, [email, contraseña]
        );

        if (usuario.length === 0) {
            const error = new Error('Fallo en la autentificación');
            error.statusCode = 401;
            throw error;
        }

        // compruebo si el usuario está activo
        if (!usuario[0].activo) {
            const error = new Error("El usuario no está activo. Comprueba tu email.");
            error.httpStatus = 401;
            throw error;
        }

        // si todo está bien devolvemos un json con los datos de login
        const info = {
            id: usuario[0].id,
            role: usuario[0].privilegios,
        };

        const token = jwt.sign(info, process.env.SECRET, {
            expiresIn: "30d",
        });

        res.statusCode = 200;
        res.send({
            status: 'Ok',
            data: {
                token,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) conexion.release();
    }
}
module.exports = loginUsuario;