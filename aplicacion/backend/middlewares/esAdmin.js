
const esAdmin = (req, res, next) => {
    try {
        if (req.userAuth.role !== "admin") {
            // ERROR
            const error = new Error(
                "Acceso śolo permitido a administradores"
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

module.exports = esAdmin;