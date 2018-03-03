const readline = require('readline');
const {log, biglog, colorize, errorlog} = require('./out');
const cmds = require('./cmds');

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
            cmds.helpCmd(rl);
            break;
        case 'list':
            cmds.listCmd(rl);
            break;
        case 'show':
            cmds.showCmd(rl, id);
            break;
        case 'add':
            cmds.addCmd(rl);
            break;
        case 'delete':
            cmds.deleteCmd(rl, id);
            break;
        case 'edit':
            cmds.editCmd(rl, id);
            break;
        case 'test':
            cmds.testCmd(rl, id);
            break;
        case 'play':
        case 'p':
            cmds.playCmd(rl);
            break;
        case 'credits':
            cmds.creditsCmd(rl);
            break;
        case 'quit':
        case 'q':
            cmds.quitCmd(rl);
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
