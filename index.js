const minimist = require('minimist');
const { openApp } = require('./src/electron.js');
const game = require('./src/game.js');

const args = minimist(process.argv.slice(2),
    {
        boolean: ['gui'],
        string: ['ia', 'lines'],
        alias: {
            i: 'ia',
            l: 'lines',
        },
        default: {
            l: 4,
            i: 'easy',
        },
    });

const settings = {
    mode: args.gui ? 'gui' : 'cli',
    lines: args.lines,
    ia: 'manual', // ou 'easy' ou 'intermediate' ou 'difficult' ou 'auto'
    height: args.l,
    width: (2 * args.l) - 1,
};

console.log(settings);

if (args.gui) {
    console.log('I want the GUI mode');
    openApp();
} else {
    game(settings);
}
