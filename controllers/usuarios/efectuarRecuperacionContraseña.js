const conexionMysql = require("../../DB/conexionMysql");
const { validate } = require("../../helpers");
const { contraseñaSchema } = require("../../schemas");

async function efectuarRecuperacionContraseña(req, res, next) {
  let conexion;
  try {
    const { nuevaContraseña, codigoRecuperacion } = req.body;

    // Validamos la contraseña.
    await validate(contraseñaSchema, nuevaContraseña);

    // Obtenemos conexion a la BD
    conexion = await conexionMysql();

    // Comprobamos si existe alguna cuenta que posea el código de recuperacion provisto en la ruta
    const [usuario] = await conexion.query(
      `
            SELECT id FROM usuarios
            WHERE codigo_recuperacion=?
            `,
      [codigoRecuperacion]
    );

    if (usuario.length === 0) {
      const error = new Error("Código de recuperación de contraseña no válido");
      error.httpStatus = 404;
      throw error;
    }

    await conexion.query(
      `
            UPDATE usuarios 
            SET codigo_recuperacion=NULL, contraseña=SHA2(?,512), ultimo_cambio_contraseña=?
            WHERE id=?
            `,
      [nuevaContraseña, new Date(), usuario[0].id]
    );

    res.send({
      status: "Ok",
      message: "Contraseña cambiada correctamente",
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) conexion.release();
  }
}
module.exports = efectuarRecuperacionContraseña;
