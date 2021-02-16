const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

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
};

function displayBoardOnGUI(_width, _height, _matches) {
    console.log('I am on GUI');
}

function displayScoreOnConsole() {

}

function displayScoreOnGUI() {

}

function question(theQuestion) {
    return new Promise((resolve) => rl.question(theQuestion, (answ) => resolve(answ)));
}

async function displayInputOnConsole(currentPlayer, _settings) {
    const input = {};

    console.log(`${currentPlayer.name} turn:`);
    input.line = await question('Line:') - 1;
    input.matches = await question('Matches:');
    return input;
}

function displayInputOnGUI() {

}

display.displayBoard = (matches, settings) => {
    if (settings.mode === 'cli') {
        displayBoardOnConsole(settings.width, settings.height, matches);
    } else {
        displayBoardOnGUI(settings.width, settings.height, matches);
    }
};

display.displayInput = async (settings, currentPlayer) => {
    let result = {};
    if (settings.mode === 'cli') {
        result = await displayInputOnConsole(currentPlayer, settings);
    } else {
        result = await displayInputOnGUI(currentPlayer, settings);
    }
    return result;
};

display.displayScore = (settings, winner) => {
    if (settings.mode === 'cli') {
        displayScoreOnConsole(winner);
    } else {
        displayScoreOnGUI(winner);
    }
};

module.exports = display;
