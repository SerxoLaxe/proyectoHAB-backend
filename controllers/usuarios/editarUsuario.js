const conexionMysql = require("../../DB/conexionMysql");
const { validate, guardarAvatarUsuario } = require("../../helpers");
const { perfilUsuarioSchema } = require("../../schemas");

/**
 * Edita el usuario indicado por su ID, introduciendo nuevos valores en las
 * columnas de nombre, biografía y avatar. 👍
 */
async function editarUsuario(req, res, next) {
  let conexion;
  try {
    await validate(perfilUsuarioSchema, req);
    if (req.files &&
      typeof req.files !== "undefined" &&
      Object.values(req.files).length > 0
    ) {
      req.body.nombreAvatar = await guardarAvatarUsuario(
        Object.values(req.files)[0],
      );
    }
    conexion = await conexionMysql();
    await conexion.query(generarQueryString(req, conexion));
    res.statusCode = 200;
    res.send({
      status: "Ok",
      message: "Perfil de usuario editado correctamente.",
    });
  } catch (error) {
    next(error);
  }
}

function generarQueryString(req, conexion) {
  const { id } = req.userAuth;
  const { nombre, biografia, nombreAvatar } = req.body;
  const queryArray = [];

  if (typeof nombre !== "undefined" && nombre.length > 0) {
    queryArray.push(`nombre=${conexion.escape(nombre)}`);
  }

  if (typeof biografia !== "undefined") {
    queryArray.push(`biografia=${conexion.escape(biografia)}`);
  }

  if (typeof nombreAvatar !== "undefined" && nombreAvatar.length > 0) {
    queryArray.push(`avatar=${conexion.escape(nombreAvatar)}`);
  }

  if (queryArray.length === 0) {
    const error = new Error(
      "Ningún campo cubierto, cubre al menos uno para editar el perfil"
    );
    error.httpStatus = 400;
    throw error;
  }

  const queryString = queryArray.join(" , ");
  const finalString = `UPDATE usuarios SET ${queryString} WHERE id=${conexion.escape(
    id
  )}`;
  return finalString;
}

module.exports = editarUsuario;
