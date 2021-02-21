/* eslint-disable no-console */
const minimist = require('minimist');
const { exec } = require('child_process');
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
    ia: args.ia, // ou 'easy' ou 'intermediate' ou 'difficult' ou 'auto'
    height: args.l,
    width: (2 * args.l) - 1,
};

if (args.gui) {
    exec('npx electron ./src/electron.js', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        process.exit(0);
    });
} else {
    game(settings);
}
