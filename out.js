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

exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};