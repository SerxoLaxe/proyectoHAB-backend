const conexionMysql = require("../../DB/conexionMysql");
/**
 * Valida usuarios mediante una petición GET, que usa la ruta /usuarios/validar/:código de validación. 👍
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
async function validarUsuario(req, res, next) {
  let conexion;
  try {
    const { codigo } = req.params;
    conexion = await conexionMysql();
    await existeUsuarioConCodigo(codigo, conexion);
    await activarUsuario(codigo, conexion);
    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: "Usuario validado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (conexion) {
      conexion.release();
    }
  }
}

async function existeUsuarioConCodigo(codigo, conexion) {
  const [user] = await conexion.query(
    `
        SELECT id FROM usuarios
        WHERE codigo_validacion=?
        `,
    [codigo]
  );
  if (user.length === 0) {
    const error = new Error("Código no válido");
    error.httpStatus = 404;
    throw error;
  }
}

async function activarUsuario(codigo, conexion) {
  await conexion.query(
    `
        UPDATE usuarios
        SET activo=true, codigo_validacion=NULL
        WHERE codigo_validacion=?
        `,
    [codigo]
  );
}

module.exports = validarUsuario;
