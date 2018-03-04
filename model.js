const fs = require('fs');

// PERSISTENCIA
// nombre del fichero donde se guardan las preguntas
// es un fichero de texto con el JSON  de quizzes
const DB_FILENAME = "quizzes.json";

// modelo de datos
// en esta variable se mantienen todos los quizzes existentes
// es un array de objetos, donde cada objeto tiene los atributos question y answer
// al arrancar la aplicación esta variable solo contiene estas 4 preguntas
// pero al final del módulo se llama a load() para cargar las preguntas guardadas en el fichero DB_FILENAME
let quizzes = [
    {
        question: "Capital de Italia",
        answer: "Roma"
    },
    {
        question: "Capital de Francia",
        answer: "París"
    },
    {
        question: "Capital de España",
        answer: "Madrid"
    },
    {
        question: "Capital de Portugal",
        answer: "Lisboa"
    }];

/**
 * Carga las preguntas guardadas en el fichero
 * Este método carga el contenido del fichero DB_FILENAME en la variable quizzes
 * El contenido de ese fichero está en formato JSON
 * La primera vez que se ejecute el método, el fichero DB_FILENAME no existe, y se producirá el error ENOENT
 * En este caso se salva el contenido inicial almacenado en quizzes
 * Si hay otro error, se lanza una excepción que aborta la ejecución del programa
 */
const load = () => {
    fs.readFile(DB_FILENAME, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") { // la primera vez no existe el fichero
                save(); // valores iniciales
                return;
            }
            throw err;
        }
        let json = JSON.parse(data);
        if (json) {
            quizzes = json;
        }
    });
};
/**
 * Guarda las preguntas en el fichero
 * Guarda (en formato JSON) el valor de quizzes en DB_FILENAME
 * Si hay algún error, lanza una excepción que aborta la ejecución del programa
 */
const save = () => {
    fs.writeFile(DB_FILENAME,
        JSON.stringify(quizzes),
        err => {
            if (err) throw err;
        });
};
/**
 * @returns {number} Número total de preguntas existentes
 */
exports.count = () => quizzes.length;
/**
 * Añade un nuevo quizz
 * @param question String con la pregunta
 * @param answer   String con la respuesta
 */
exports.add = (question, answer) => {
    // en caso de que se pasen argumentos 'undefined', se incorpora ""
    quizzes.push({
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};
/**
 * Elimina un quiz existente
 * @param id Clave que identifica el quiz a borrar
 */
exports.deleteByIndex = id => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    quizzes.splice(id, 1);
    save();
};
/**
 * Actualiza un quiz determinado
 * @param id       Clave que identifica el quiz a actualizar
 * @param question String con la pregunta
 * @param answer   String con la respuesta
 */
exports.update = (id, question, answer) => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    quizzes.splice(id, 1, {
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};
/**
 * @returns {any} Todos los quizzes existentes (las preguntas)
 * Devuelve un clon del valor guardado en la variable quizzes, es decir, devuelve un objeto nuevo
 * Para clonar quizzes se utiliza stringify + parse
 */
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));
/**
 * @param id Clave que identifica el quiz a devolver
 * @returns {question, answer} Un clon del objeto quiz almacenado en la posición dada
 * Para clonar el quiz se usa stringify + parse
 */
exports.getByIndex = id => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    return JSON.parse(JSON.stringify(quiz));
};

// carga los quizzes almacenados en el fichero (DB_FILENAME) cuando se hace un require de model.js
load();