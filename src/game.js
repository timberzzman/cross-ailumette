/* eslint-disable no-param-reassign */
const board = require('./board');
const display = require('./display');

async function gameTurn(gameInfo, settings) {
    let input = { line: 1, number: 2 };
    if (gameInfo.players[gameInfo.currentPlayer].type === 'human') {
        input = await display.displayInput(settings,
            gameInfo.players[gameInfo.currentPlayer]);
    } else {
        input = { line: 1, number: 2 };
    }
    const error = board.checkInput(input, gameInfo.lines);
    if (error !== '') {
        console.log(error);
    } else {
        gameInfo.lines = board.deleteMatches(input.line, input.matches, gameInfo.lines);
        display.displayBoard(gameInfo.lines, settings);
        gameInfo.matches -= input.matches;
        if (gameInfo.matches === 0) {
            gameInfo.state = 'finished';
        }
        gameInfo.currentPlayer = gameInfo.currentPlayer === 0 ? 1 : 0;
    }

    return gameInfo;
}

function finishGame(result, settings) {
    if (settings.ia === 'manual' || settings.ia === 'auto') {
        console.log(`${result.winner.name} win the game`);
    } else if (result.winner.type === 'ia') {
        console.log('You lost, too bad..');
    } else {
        console.log('I lost.. snif.. but I’ll get you next time!!');
    }
    process.exit(0);
}

async function launchGame(settings, gameInfo) {
    display.displayBoard(gameInfo.lines, settings);
    const result = {
        winner: '',
    };
    gameInfo.state = 'started';
    while (gameInfo.state === 'started') {
        // eslint-disable-next-line no-await-in-loop
        gameInfo = await gameTurn(gameInfo, settings);
    }
    result.winner = gameInfo.players[gameInfo.currentPlayer];
    return result;
}

async function game(settings) {
    const lines = board.initiateBoard(settings.height, settings.width);
    let matches = 0;
    for (let i = 1; i <= settings.height; i += 1) {
        matches += (i * 2) - 1;
    }
    const gameInfo = {
        state: 'config',
        players: [
            {
                type: 'unknown',
                name: 'unknown',
            },
            {
                type: 'unknown',
                name: 'unknown',
            }],
        currentPlayer: 0,
        lines,
        matches,
    };
    if (settings.ia === 'manual') {
        gameInfo.players[0] = { type: 'human', name: 'Player 1' };
        gameInfo.players[1] = { type: 'human', name: 'Player 2' };
    }
    const result = await launchGame(settings, gameInfo);
    finishGame(result, settings);
}

module.exports = game;
