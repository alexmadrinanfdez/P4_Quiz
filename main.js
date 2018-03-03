
const readline = require('readline');
const figlet = require('figlet');
const chalk = require('chalk');

/**
 * Dar color a un string
 * @param msg    El string al que hay que dar color
 * @param color  El color con el que pintar msg
 * @returns {string} Devuelve el string msg con el color indicado
 */
const colorize = (msg, color) => {
    if (typeof color !== "undefined"){
        msg = chalk[color].bold(msg);
    }
    return msg;
};
/**
 * Escribir un mensaje de log
 * @param msg    Texto a escribir
 * @param color  Color del texto (optativo)
 */
const log = (msg, color) => {
    console.log(colorize(msg,color))
};
/**
 * Escribir un mensaje de log grande
 * @param msg    Texto a escribir
 * @param color  Color del texto (opt.)
 */
const biglog = (msg, color) => {
    log(
        figlet.textSync(msg,{
            horizontalLayout: 'full',
            verticalLayout: 'default'
        }), color)
};
/**
 * Escribe un mensaje de error
 * @param emsg Texto del mensaje de error
 */
const errorlog = (emsg) => {
    console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}`)
};
// mensaje inicio
biglog('CORE Quiz', 'green');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize('quiz > ', 'blue'),
    completer: (line) => {
        const completions = 'h help list show add delete edit test p play credits q quit'.split(' ');
        const hits = completions.filter((c) => c.startsWith(line));
        // show all completions if none found
        return [hits.length ? hits : completions, line];
    }
});

rl.prompt();
rl.on('line', (line) => {
    let args = line.split(" ");              // divide el input de la línea por los espacios en blanco
    let cmd = args[0].toLowerCase().trim();  // el primer elemento que encuentre será el comando (en minúsculas)
    let id = args[1];                        // el segundo será un identificador de quiz (parámetro)

    switch (cmd) {
        case '':
            rl.prompt();
            break;
        case 'help':
        case 'h':
            helpCmd();
            break;
        case 'list':
            listCmd();
            break;
        case 'show':
            showCmd(id);
            break;
        case 'add':
            addCmd();
            break;
        case 'delete':
            deleteCmd(id);
            break;
        case 'edit':
            editCmd(id);
            break;
        case 'test':
            testCmd(id);
            break;
        case 'play':
        case 'p':
            playCmd();
            break;
        case 'credits':
            creditsCmd();
            break;
        case 'quit':
        case 'q':
            quitCmd();
            break;
        default:
            log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
            log((`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`));
            rl.prompt();
            break;
    }
}).on('close', () => {
    log('Adiós, vuelve cuando quieras!');
    process.exit(0);
});

/**
 * Muestra la ayuda
 */
const helpCmd = () => {
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
 */
const listCmd = () => {
    log('Listar todos los quizzes existentes.');
    rl.prompt();
};
/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta
 * @param id Clave del quiz a mostrar
 */
const showCmd = id => {
    log('Mostrar el quiz indicado.');
    rl.prompt();
};
/**
 * Añade un nuevo quiz modelo
 * Pregunta interactivamente por la pregunta y por la respuesta
 */
const addCmd = () => {
    log('Añadir un nuevo quiz.');
    rl.prompt();
};
/**
 * Borra un quiz del modelo
 * @param id Clave del quiz a borrar en el modelo
 */
const deleteCmd = id => {
    log('Borrar el quiz indicado.');
    rl.prompt();
};
/**
 * Edita un quiz del modelo
 * @param id Clave del quiz a editar en el modelo
 */
const editCmd = id => {
    log('Editar el quiz indicado.');
    rl.prompt();
};
/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar
 * @param id Clave del quiz a probar
 */
const testCmd = id => {
    log('Probar el quiz indicado.');
    rl.prompt();
};
/**
 * Pregunta todos los quizzes existentes en el modelo en un orden aleatorio
 * Se gana el juego si se contesta a todos satisfactoriamente
 */
const playCmd = () => {
    log('Jugar.');
    rl.prompt();
};
/**
 * Muestra los nombres de los autores de la práctica
 */
const creditsCmd = () => {
    log('Autor(es) de la práctica:');
    log('  ALEJANDRO', 'green');
    rl.prompt();
};
/**
 * Termina el programa
 */
const quitCmd = () => {
    rl.close();
};