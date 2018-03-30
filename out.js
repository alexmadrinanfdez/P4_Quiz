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
 * @param socket Socket de I/O
 * @param msg    Texto a escribir
 * @param color  Color del texto (optativo)
 */
const log = (socket, msg, color) => {
    socket.write(`${colorize(msg,color)}\r\n`)
};
/**
 * Escribir un mensaje de log grande
 * @param socket Socket de I/O
 * @param msg    Texto a escribir
 * @param color  Color del texto (opt.)
 */
const biglog = (socket, msg, color) => {
    log(
        socket, figlet.textSync(msg,{
            horizontalLayout: 'full',
            verticalLayout: 'default'
        }), color)
};

/**
 * Escribe un mensaje de error
 * @param socket Socket de I/O
 * @param emsg Texto del mensaje de error
 */
const errorlog = (socket, emsg) => {
    socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\r\n`)
};

exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};