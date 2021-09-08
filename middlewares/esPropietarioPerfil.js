const { toNumber } = require("lodash");

/**
 * Limita el accceso a la edición del perfil de usuario a su propietario.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const esPropietarioPerfil = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('id query:',id, 'id token:', req.userAuth.id);
        if (toNumber(id) !== req.userAuth.id) {
            // ERROR
            const error = new Error(
                "Acción śolo permitida a propietario del perfil"
            );
            error.httpStatus = 401;
            throw error;
        }
        // Continuo en el siguiente middleware
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = esPropietarioPerfil;