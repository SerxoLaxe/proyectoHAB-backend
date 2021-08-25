const conexionMysql = require("../../DB/conexionMysql");


/**
 * Selecciona de la tabla de experiencias un único registro especificando su ID. ❌ 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conseguirExperienciaID(req, res, next) {
    let conexion;
    try {
        conexion = await conexionMysql();

        const {id} = req.params;

       

        const [result] = await conexion.query(`
        SELECT * FROM experiencias WHERE id=?
    `, [id])
    


        res.send({
            status: 'Ok',
            data: result
        });
    } catch (err) {
        next(err)
    } finally {
        if (conexion) conexion.release();
    }
}
module.exports = conseguirExperienciaID;