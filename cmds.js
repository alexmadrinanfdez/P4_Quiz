const model = require('./model');
const {log, biglog, colorize, errorlog} = require('./out');

/**
 * Muestra la ayuda
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.helpCmd = rl => {
    log("Comandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz indicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};
/**
 * Lista todos los quizzes existentes en el modelo
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.listCmd = rl => {
    log('Listar todos los quizzes existentes.');
    rl.prompt();
};
/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a mostrar
 */
exports.showCmd = (rl,id) => {
    log('Mostrar el quiz indicado.');
    rl.prompt();
};
/**
 * Añade un nuevo quiz modelo
 * Pregunta interactivamente por la pregunta y por la respuesta
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.addCmd = rl => {
    log('Añadir un nuevo quiz.');
    rl.prompt();
};
/**
 * Borra un quiz del modelo
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a borrar en el modelo
 */
exports.deleteCmd = (rl, id) => {
    log('Borrar el quiz indicado.');
    rl.prompt();
};
/**
 * Edita un quiz del modelo
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a editar en el modelo
 */
exports.editCmd = (rl, id) => {
    log('Editar el quiz indicado.');
    rl.prompt();
};
/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 * @param id Clave del quiz a probar
 */
exports.testCmd = (rl, id) => {
    log('Probar el quiz indicado.');
    rl.prompt();
};
/**
 * Pregunta todos los quizzes existentes en el modelo en un orden aleatorio
 * Se gana el juego si se contesta a todos satisfactoriamente
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.playCmd = rl => {
    log('Jugar.');
    rl.prompt();
};
/**
 * Muestra los nombres de los autores de la práctica
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.creditsCmd = rl => {
    log('Autor(es) de la práctica:');
    log('  Alejandro Madriñán Fernández', 'green');
    rl.prompt();
};
/**
 * Termina el programa
 * @param rl Objeto readline utilizado para implementar el CLI (Command Line Interpreter)
 */
exports.quitCmd = rl => {
    rl.close();
};