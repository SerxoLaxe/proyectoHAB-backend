const conexionMysql = require("../../DB/conexionMysql");

/**
 * Selecciona de la tabla de experiencias un único registro especificando su ID. 👍 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
async function reservarExperiencia(req, res, next) {
    let conexion;
    try {
        conexion = await conexionMysql();
        //const { id } = req.params;
        res.send({
            status: 'Ok',
            data: 'reservar plaza'
        });
    } catch (err) {
        next(err)
    } finally {
        if (conexion) conexion.release();
    }
}

module.exports = reservarExperiencia;