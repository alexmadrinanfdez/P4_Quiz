// modelo de datos
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