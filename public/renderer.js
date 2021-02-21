const ipc = require('electron').ipcRenderer;

let linesInput = '';
let matchesInput = '';
let noNeedToChange = false;
let gameAbort = false;

const startButton = document.getElementById('startButton');
const cancelButton = document.getElementById('cancelButton');
const output = document.querySelector('#console');
const display = document.getElementById('matchesDisplay');
const userInput = document.getElementById('userInput');
const settingsButton = document.getElementById('settingsButton');

function blinker() {
    if (userInput.getAttribute('placeholder') === '') {
        userInput.setAttribute('placeholder', '█');
    } else {
        userInput.setAttribute('placeholder', '');
    }
    setTimeout(blinker, 1000);
}

blinker();

let scrolled = false;
function updateScroll() {
    if (!scrolled) {
        output.scrollTop = output.scrollHeight;
    } else {
        scrolled = false;
    }
}

output.addEventListener('scroll', () => {
    scrolled = true;
});

setInterval(updateScroll, 100);

startButton.addEventListener('click', () => {
    ipc.send('startGame');
    startButton.classList.add('hidden');
    cancelButton.classList.remove('hidden');
});

cancelButton.addEventListener('click', () => {
    gameAbort = true;
    ipc.send('cancelGame');
    cancelButton.classList.add('hidden');
    startButton.classList.remove('hidden');
});

userInput.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        const input = event;
        if (linesInput === '') {
            if (event.target.value === '') {
                noNeedToChange = true;
                linesInput = '-42';
            } else {
                linesInput = event.target.value;
            }
        } else if (matchesInput === '') {
            matchesInput = event.target.value;
        }
        input.target.value = '';
    }
});

settingsButton.addEventListener('click', () => {
    const settings = {};
    const form = document.getElementById('settingsForm');
    const elements = Array.from(form.elements);
    elements.map((element) => {
        settings[element.name] = element.value;
        return element;
    });
    const response = ipc.sendSync('setSettings', settings);
    if (response === 'OK') {
        output.innerHTML += '<p>Les paramètres ont été pris en compte</p>';
    } else {
        output.innerHTML += '<p>Une erreur est survenue lors de la sauvegarde des paramètres</p>';
    }
});

async function checkLines() {
    return new Promise((resolve, reject) => {
        (function waitForFoo() {
            if (linesInput !== '' || gameAbort) return resolve(linesInput);
            setTimeout(waitForFoo, 30);
            return reject;
        }());
    });
}

async function checkMatches() {
    return new Promise((resolve, reject) => {
        (function waitForFoo() {
            if (matchesInput !== '' || gameAbort) return resolve(matchesInput);
            setTimeout(waitForFoo, 30);
            return reject;
        }());
    });
}

ipc.on('displayBoard', (event, arg) => {
    display.innerHTML = '';
    display.innerHTML = `<p>${'*'.repeat(arg.width)}</p>`;
    let line = '';
    for (let i = 0; i < arg.height; i += 1) {
        line += '<p>*';
        for (let j = 0; j < arg.width; j += 1) {
            if (j >= arg.matches[i].start && j < arg.matches[i].start + arg.matches[i].number) {
                line += 'I';
            } else {
                line += '&nbsp;';
            }
        }
        line += '*</p>';
        display.innerHTML += line;
        line = '';
    }
    display.innerHTML += `<p>${'*'.repeat(arg.width)}</p>`;
});

ipc.on('waitInput', async (_event, data) => {
    let result = 0;
    let noneed = false;
    if (data === 'line') {
        linesInput = '';
        output.innerHTML += '<p>Line:</p>';
        result = Number(await checkLines());
        if (noNeedToChange) {
            noneed = true;
        } else {
            output.lastChild.textContent = `Line: ${linesInput}`;
        }
    } else {
        matchesInput = '';
        output.innerHTML += '<p>Matches:</p>';
        result = Number(await checkMatches());
        output.lastChild.textContent = `Matches: ${matchesInput}`;
    }
    ipc.sendSync('userInput', result, data, noneed);
});

ipc.on('displayMessage', (event, arg) => {
    output.innerHTML += `<p>${arg}</p>`;
});

ipc.on('gameFinished', (_event, _arg) => {
    display.innerHTML = '';
    cancelButton.classList.add('hidden');
    startButton.classList.remove('hidden');
});
