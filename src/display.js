/* eslint-disable no-console */
const readline = require('readline');
const { webContents, ipcMain } = require('electron');
const { isElectron } = require('./utils');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(theQuestion) {
    return new Promise((resolve) => rl.question(theQuestion, (answ) => resolve(answ)));
}

const input = {};
const display = {};

function displayBoardOnConsole(width, height, matches) {
    console.log('*'.repeat(width + 2));
    let line = '';
    for (let i = 0; i < height; i += 1) {
        line += '*';
        for (let j = 0; j < width; j += 1) {
            if (j >= matches[i].start && j < matches[i].start + matches[i].number) {
                line += 'I';
            } else {
                line += ' ';
            }
        }
        line += '*';
        console.log(line);
        line = '';
    }
    console.log('*'.repeat(width + 2));
}

function displayBoardOnGUI(width, height, matches) {
    const data = {
        width,
        height,
        matches,
    };
    webContents.getFocusedWebContents().send('displayBoard', data);
}

function displayScoreOnConsole() {

}

function displayScoreOnGUI() {

}

function displayMessageOnConsole(message) {
    console.log(message);
}

function displayMessageOnGUI(message) {
    webContents.getFocusedWebContents().send('displayMessage', message);
}

async function displayInputOnConsole(data) {
    let result = '';
    if (data === 'line') {
        result = await question('Line: ');
        if (result === '') {
            result = input.line;
        } else {
            input.line = Number(result);
        }
        console.log(input);
    } else {
        result = await question('Matches: ');
    }
    console.log('typeof', result, typeof result);
    /* input.line = await question('Line:');
    input.matches = await question('Matches:'); */
    return Number(result);
}

async function checkResult() {
    return new Promise((resolve, reject) => {
        (function waitForFoo() {
            if (input.waiting === false) {
                return resolve();
            }
            /* if (Object.keys(input).length !== 0) {
                return resolve();
            } */
            setTimeout(waitForFoo, 30);
            return reject;
        }());
    });
}

async function displayInputOnGUI(data) {
    webContents.getFocusedWebContents().send('waitInput', data);
    input.waiting = true;
    await checkResult();
    console.log(input);
    return input[data];
}

display.displayBoard = (matches, settings) => {
    if (settings.mode === 'cli') {
        displayBoardOnConsole(settings.width, settings.height, matches);
    } else {
        displayBoardOnGUI(settings.width, settings.height, matches);
    }
};

display.displayInput = async (settings, currentPlayer, data) => {
    let result = {};
    if (settings.mode === 'cli') {
        result = await displayInputOnConsole(data);
    } else {
        result = await displayInputOnGUI(data);
    }
    return result;
};

display.displayMessage = async (settings, message) => {
    if (settings.mode === 'cli') {
        displayMessageOnConsole(message);
    } else {
        displayMessageOnGUI(message);
    }
};

display.displayScore = (settings, winner) => {
    if (settings.mode === 'cli') {
        displayScoreOnConsole(winner);
    } else {
        displayScoreOnGUI(winner);
    }
};

if (isElectron()) {
    ipcMain.on('userInput', (event, arg, data, noneed) => {
        console.log(arg, data, noneed);
        const res = event;
        if (data === 'line' && !noneed) {
            input.line = arg;
        } else if (data === 'matches') {
            input.matches = arg;
        }
        input.waiting = false;
        res.returnValue = 'OK';
    });
}

module.exports = display;
