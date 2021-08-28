/**
 * Configuración de generación de datos originados por Faker
 */
const fakerConfig = {
    usuarios: {
        cantidad: 10,
        parrafosBiografia: 2,
    },
    experiencias: {
        cantidad: 10,
        parrafosDescripcion: 3,
        precio: {
            maximo: 5,
            minimo: 2,
        },
        rating: {
            maximo: 5,
            minimo: 0,
        },
        plazas: {
            maximas: 34,
            minimas: 2,
        },
    }
}

const joiConfig = {
    schemaExperiencias: {
        charsDescripcion: 1000,
        maxImagenes: 4,
    }
    
}

module.exports = {fakerConfig, joiConfig }