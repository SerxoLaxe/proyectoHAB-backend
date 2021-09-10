const conexionMysql = require('../../DB/conexionMysql');
const { validate } = require('../../helpers');
const { contraseñaSchema } = require('../../schemas')
/**
 * Cambia la contraseña del usuario ❌
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function cambiarContraseña(req, res, next) {
    let conexion;
    try {
        const { antiguaContraseña, nuevaContraseña } = req.body;
        
        //Validamos la nueva contraseña con los requisitos de su esquema
        await validate(contraseñaSchema, nuevaContraseña);
        conexion = await conexionMysql();

        const { id } = req.params;

        // controlar que la antigua contraseña sea correcta
        const [current] = await conexion.query(
            `
            SELECT id
            FROM usuarios
            WHERE id=? AND contraseña=SHA2(?,512)
            `,
            [id, antiguaContraseña]
        );

        if (current.length === 0) {
            const error = new Error("La contraseña antigua no es correcta");
            error.httpStatus = 401;
            throw error;
        }

        // guardamos en el DB la nueva password
        await conexion.query(
            `
            UPDATE usuarios
            SET contraseña=SHA2(?,512), ultimo_cambio_contraseña=?
            WHERE id=?
    `       ,
            [nuevaContraseña, new Date(), id]
        );

        res.send({
            status: "ok",
            message: "Contraseña cambiada",
        });
    } catch (error) {
        next(error);
    } finally {
        if (conexion) conexion.release();
    }
}
module.exports = cambiarContraseña;


