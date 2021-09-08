/**
 * Configuración de generación de datos originados por Faker. configuración utilizada en ./DB/initDB.js
 */
const fakerConfig = {
    usuarios: {
        cantidad: 10,               //Cantidad de usuarios a introducir en la tabla.
        parrafosBiografia: 2,       //Párrafos de lorem ipsum a introducir en la biografía.
    },
    experiencias: {
        cantidad: 10,               //Cantidad de experiencias a introducir en la tabla.
        parrafosDescripcion: 3,     //Párrafos de lorem ipsum a introducir en la descripción.
        precio: {
            maximo: 5,              //Precio máximo.
            minimo: 2,              //Precio mínimo.
        },
        rating: {
            maximo: 5,              //Rating máximo
            minimo: 0,              //Rating mínimo
        },
        plazas: {
            maximas: 34,            //Número de plazas máximo.
            minimas: 2,             //Número de plazas mínimo.
        },
    }
}
/**
 * Configuración de validaciones de peticiones mediante módulo Joi. Schemas situados en ./schemas/index.js
 */
const joiConfig = {
    schemaExperiencias: {
        charsDescripcion: 1000, //Carácteres máximos de extensión de la descripción.
        maxImagenes: 4,         //Número máximo de imágenes por experiencia
        minImagenes: 1,         //Número mínimo de imágenes por experiencia
    },
    schemaUsuarios: {
        minCharsContraseña: 10, //Número mínimo de carácteres de extensión para la contraseña
        maxCharsContraseña: 20, //Número máximo de carácteres de extensión para la contraseña.
    }

}

module.exports = { fakerConfig, joiConfig }