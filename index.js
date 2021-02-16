// const yargs = require('yargs');
// const { hideBin } = require('yargs/helpers');
const game = require('./src/game.js');

const settings = {
    mode: 'cli', // ou 'GUI'
    lines: 4,
    ia: 'manual', // ou 'easy' ou 'intermediate' ou 'difficult' ou 'auto'
    width: 7,
    height: 4,
};

/* const { argv } = yargs(hideBin(process.argv))
    .option('mode', {
        alias: 'm',
        description: 'the mode you want',
        type: 'string',
    })
    .option('lines', {
        alias: 'l',
        description: 'Lines you want in the software',
        type: 'number',
    })
    .option('ia', {
        description: 'the difficulty you want the IA to play',
    })
    .help()
    .alias('help', 'h');

console.log(argv); */

game(settings);
