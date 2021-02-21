/* eslint-disable no-param-reassign */
const { webContents, ipcMain } = require('electron');
const board = require('./board');
const display = require('./display');
const { play } = require('./ia');
const {
    isElectron,
    sleep,
} = require('./utils');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomDifficulty() {
    const difficulties = ['easy', 'intermediate', 'hard'];
    return difficulties[getRandomInt(3)];
}

let gameInfo = {};

async function gameTurn(settings) {
    if (settings.ia === 'auto') {
        await sleep(1000);
    }
    let input = {};
    const currentPlayer = gameInfo.players[gameInfo.currentPlayer];
    if (currentPlayer.type === 'human') {
        display.displayMessage(settings, `${currentPlayer.name} turn:`);
        input.line = await display.displayInput(settings,
            gameInfo.players[gameInfo.currentPlayer], 'line');
        input.line -= 1;
        let error = await board.checkLines(input.line, gameInfo.lines);
        if (error !== '' && gameInfo.state !== 'aborted') {
            display.displayMessage(settings, error);
            return gameInfo;
        }
        input.matches = await display.displayInput(settings,
            gameInfo.players[gameInfo.currentPlayer], 'matches');
        error = await board.checkMatches(input, gameInfo.lines);
        if (error !== '' && gameInfo.state !== 'aborted') {
            display.displayMessage(settings, error);
            return gameInfo;
        }
    } else {
        display.displayMessage(settings, `${currentPlayer.name}'s turn...`);
        input = await play(gameInfo.players[gameInfo.currentPlayer], gameInfo.lines, settings);
    }
    if (gameInfo.state !== 'aborted') {
        gameInfo.lines = board.deleteMatches(input.line, input.matches, gameInfo.lines);
        if (currentPlayer.type === 'ia') {
            input.line += 1;
        }
        display.displayMessage(settings, `${currentPlayer.name} removed ${input.matches} match(es) from line ${input.line}`);
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
        display.displayMessage(settings, `${result.winner.name} win the game`);
    } else if (result.winner.type === 'ia') {
        display.displayMessage(settings, 'You lost, too bad..');
    } else {
        display.displayMessage(settings, 'I lost.. snif.. but I’ll get you next time!!');
    }
    if (!isElectron()) {
        process.exit(0);
    } else {
        webContents.getFocusedWebContents().send('gameFinished');
    }
}

async function launchGame(settings) {
    display.displayBoard(gameInfo.lines, settings);
    const result = {
        winner: '',
    };
    gameInfo.state = 'started';
    while (gameInfo.state === 'started') {
        // eslint-disable-next-line no-await-in-loop
        gameInfo = await gameTurn(settings);
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
    gameInfo = {
        state: 'config',
        players: [{
            type: 'unknown',
            name: 'unknown',
        },
        {
            type: 'unknown',
            name: 'unknown',
        },
        ],
        currentPlayer: 0,
        lines,
        matches,
    };
    if (settings.ia === 'manual') {
        gameInfo.players[0] = {
            type: 'human',
            name: 'Player 1',
        };
        gameInfo.players[1] = {
            type: 'human',
            name: 'Player 2',
        };
    } else if (settings.ia === 'auto') {
        gameInfo.players[0] = {
            type: 'ia',
            name: 'IA 1',
            difficulty: getRandomDifficulty(),
        };
        gameInfo.players[1] = {
            type: 'ia',
            name: 'IA 2',
            difficulty: getRandomDifficulty(),
        };
    } else {
        gameInfo.players[0] = {
            type: 'human',
            name: 'Player',
        };
        gameInfo.players[1] = {
            type: 'ia',
            name: 'IA',
            difficulty: settings.ia,
        };
    }
    const result = await launchGame(settings);
    if (gameInfo.state !== 'aborted') {
        finishGame(result, settings);
    } else {
        display.displayMessage(settings, 'The game has been aborted');
    }
}

if (isElectron()) {
    ipcMain.on('cancelGame', () => {
        gameInfo.state = 'aborted';
    });
}

module.exports = game;
