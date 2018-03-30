const readline = require('readline');
const {log, biglog, colorize, errorlog} = require('./out');
const cmds = require('./cmds');
const net = require('net');

// crea un nuevo servidor (TCP o ICP) y lo inicializa para que escuche al puerto 3030
net.createServer((socket) => {
    log(socket, `Se ha conectado un cliente desde la dirección: ${socket.remoteAddress}
    (familia ${socket.remoteFamily} / puerto ${socket.remotePort})`, `whiteBright`);

    // mensaje inicio
    biglog(socket, 'CORE Quiz', 'green');

    const rl = readline.createInterface({
        input: socket,
        output: socket,
        prompt: colorize('quiz > ', 'blue'),
        completer: (line) => {
            const completions = 'h help list show add delete edit test p play credits q quit'.split(' ');
            const hits = completions.filter((c) => c.startsWith(line));
            // show all completions if none found
            return [hits.length ? hits : completions, line];
        }
    });

    // en ciertos casos se cierra el CLI
    socket
        .on("end", () => {rl.close()})
        .on("error", () => {rl.close()});

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
                cmds.helpCmd(socket, rl);
                break;
            case 'list':
                cmds.listCmd(socket, rl);
                break;
            case 'show':
                cmds.showCmd(socket, rl, id);
                break;
            case 'add':
                cmds.addCmd(socket, rl);
                break;
            case 'delete':
                cmds.deleteCmd(socket, rl, id);
                break;
            case 'edit':
                cmds.editCmd(socket, rl, id);
                break;
            case 'test':
                cmds.testCmd(socket, rl, id);
                break;
            case 'play':
            case 'p':
                cmds.playCmd(socket, rl);
                break;
            case 'credits':
                cmds.creditsCmd(socket, rl);
                break;
            case 'quit':
            case 'q':
                cmds.quitCmd(socket, rl);
                break;
            default:
                log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
                log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
                rl.prompt();
                break;
        }
    }).on('close', () => {
        log(socket, 'Adiós, vuelve cuando quieras!', 'cyanBright');
        // process.exit(0);
    });
}).listen(3030);

