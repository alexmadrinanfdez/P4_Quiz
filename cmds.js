const Sequelize = require('sequelize');
const {models} = require('./model');
const {log, biglog, colorize, errorlog} = require('./out');

// funciones auxiliares
/**
 * Esta función devuelve una promesa que:
 *    - Valida que se ha introducido un valor para el parámetro
 *    - Convierte el parámetro en un número entero
 * Si todo va bien, la promesa se satisface y devuelve el valor de id a usar
 * @param id Parámetro con el índice a validar
 */
const validateId = id => {
    return new Sequelize.Promise((resolve, reject) => {
        if (typeof  id === "undefined") {
            reject(new Error(`Falta el parámetro <id>.`));
        } else {
            id = parseInt(id); // coger la parte entera y descartar el resto
            if (Number.isNaN(id)) {
                reject(new Error(`El valor del parámetro <id> no es un número.`));
            } else {
                resolve(id);
            }
        }
    });
};
/**
 * Esta función convierte la llamada rl.question(), basada en callbacks, en una llamada basada en promesas
 * Devuelve una promesa que cuando se cumple, proporciona el texto introducido
 * Entonces, la llamada a 'then' que hay que hacer con la llamada devuelta será:
 *    .then (answer => {...})
 * También colorea a rojo el texto de la pregunta, elimina espacios al principio y al final
 * @param rl   Objeto readline usado para implementar el CLI
 * @param text Pregunta que hay que hacer al usuario
 */
const makeQuestion = (rl, text) => {
    return new Sequelize.Promise((resolve, reject) => {
        rl.question(colorize(text, 'red'), answer => {
            resolve(answer.trim());
        })
    })
};

// comandos del CLI
/**
 * Muestra la ayuda
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.helpCmd = (socket, rl) => {
    log(socket, "Comandos:");
    log(socket, "  h|help - Muestra esta ayuda.");
    log(socket, "  list - Listar los quizzes existentes.");
    log(socket, "  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log(socket, "  add - Añadir un nuevo quiz interactivamente.");
    log(socket, "  delete <id> - Borrar el quiz indicado.");
    log(socket, "  edit <id> - Editar el quiz indicado.");
    log(socket, "  test <id> - Probar el quiz indicado.");
    log(socket, "  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log(socket, "  credits - Créditos.");
    log(socket, "  q|quit - Salir del programa.");
    rl.prompt();
};
/**
 * Lista todos los quizzes existentes en el modelo
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.listCmd = (socket, rl) => {
    models.quiz.findAll()
        .each(quiz => { // equivalente a un then() + forEach() -> Es un tipo de promesa especial
                log(socket, `  [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`)
        })
        .catch(error => {
            errorlog(socket, error.message)
        })
        .then(() => {
            rl.prompt();
        });
};
/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a mostrar
 */
exports.showCmd = (socket, rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id = ${id}.`);
            }
            log(socket, `  [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });
};
/**
 * Añade un nuevo quiz modelo
 * Pregunta interactivamente por la pregunta y por la respuesta
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * El funcionamiento de la función rl.question() es asíncrono
 * Por ello, la llamada a rl.prompt() se debe hacer el callback de la segunda llamada a rl.question
 */
exports.addCmd = (socket, rl) => {
    makeQuestion(rl, ' Introduzca una pregunta: ')
        .then(q => {
            return makeQuestion(rl, ' Introduzca la respuesta: ')
                .then(a => {
                    return {question: q, answer: a};
                })
        })
        .then(quiz => {
            return models.quiz.create(quiz);
        })
        .then((quiz) => {
            log(socket, ` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => { // solo atrapa errores de validación
            errorlog(socket, 'El quiz es erróneo:');
            error.errors.forEach(({message}) => errorlog(socket, message));
        })
        .catch(error => { // atrapa el resto de errores
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        })
};
/**
 * Borra un quiz del modelo
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a borrar en el modelo
 */
exports.deleteCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        })
};
/**
 * Edita un quiz del modelo
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a editar en el modelo
 * El funcionamiento de la función rl.question() es asíncrono
 * Por ello, la llamada a rl.prompt() se debe hacer el callback de la segunda llamada a rl.question
 */
exports.editCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id = ${id}.`);
            }
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0); // simula escritura por pantalla
            return makeQuestion(rl, 'Introduzca la pregunta: ')
                .then(q => {
                    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0); // simula escritura por pantalla
                    return makeQuestion(rl, 'Introduzca la respuesta: ')
                        .then(a => {
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        })
                })
        })
        .then(quiz => {
            return quiz.save();
        })
        .then(quiz => {
            log(socket, ` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => { // solo atrapa errores de validación
            errorlog(socket, 'El quiz es erróneo:');
            error.errors.forEach(({message}) => errorlog(socket, message));
        })
        .catch(error => { // atrapa el resto de errores
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        })
};
/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a probar
 */
exports.testCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id = ${id}`);
            }
            return makeQuestion(rl, `${quiz.question}? `)
                .then(answer => {
                    if (answer.toLowerCase().trim() === quiz.answer.toLowerCase()) { // que no sea 'case sensitive', etc
                        log(socket, 'Su respuesta es correcta.');
                        biglog(socket, 'Correcta', 'green');
                    } else {
                        log(socket, 'Su respuesta es incorrecta.');
                        biglog(socket, 'Incorrecta', 'red');
                    }
                })
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() =>{
            rl.prompt();
        })
};
/**
 * Pregunta todos los quizzes existentes en el modelo en un orden aleatorio
 * Se gana el juego si se contesta a todos satisfactoriamente
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.playCmd = (socket, rl) => {
    let score = 0;
    let toBeAsked = []; // preguntas que quedan por contestar
    const playOneMore = () => {
        new Sequelize.Promise((resolve,reject) => {
            if (toBeAsked.length === 0) {
                log(socket, 'No hay nada más que preguntar.');
                log(socket, 'Fin del juego. Aciertos:');
                biglog(socket, score, 'magenta');
                rl.prompt();
            } else {
                let id = Math.round(Math.random() * (toBeAsked.length - 1)); // índice del array local
                let quiz = toBeAsked[id];
                toBeAsked.splice(id, 1);
                makeQuestion(rl, `${quiz.question}? `)
                    .then(answer => {
                        if (answer.toLowerCase().trim() === quiz.answer.toLowerCase()) { // que no sea 'case sensitive'
                            score++;
                            log(socket, `CORRECTO - Lleva ${score} aciertos.`);
                            playOneMore();
                        } else {
                            log(socket, `INCORRECTO - Lleva ${score} aciertos.`);
                            log(socket, 'Fin del juego. Aciertos:');
                            biglog(socket, score, 'magenta');
                            rl.prompt();
                        }
                    })
            }
        })
    };
    models.quiz.count()
        .then(count => {
            toBeAsked = [count];
        })
        .then(() => models.quiz.findAll())
        .each (quiz => {
            toBeAsked[quiz.id - 1] = quiz;
        })
        .then(() => {
            playOneMore();
        })
};
/**
 * Muestra los nombres de los autores de la práctica
 * @param socket Socket de I/O
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.creditsCmd = (socket, rl) => {
    log(socket, 'Autor(es) de la práctica:');
    log(socket, '  Alejandro Madriñán Fernández', 'green');
    rl.prompt();
};
/**
 * Termina el programa
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.quitCmd = (socket, rl) => {
    rl.close();
    socket.end();
};