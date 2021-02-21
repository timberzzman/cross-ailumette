const board = {};

function checkLines(line, matches) {
    if (line < 0 || line > matches.length - 1) {
        return false;
    }
    return true;
}

function checkMatches(input, matches) {
    if (matches[input.line].number < input.matches
        || matches[input.line].number - input.matches < 0) {
        return false;
    }
    return true;
}

board.initiateBoard = (height, width) => {
    const matches = [];

    matches.push({ number: 1, start: (width - 1) / 2 });
    for (let i = 2; i <= height; i += 1) {
        const number = (i * 2) - 1;
        matches.push({ number, start: (width - number) / 2 });
    }
    return matches;
};

board.checkInput = async (input, matches) => {
    if (typeof input.line !== 'number' || input.line < 0) {
        return 'Error: invalid input (positive number expected)';
    }
    if (!checkLines(input.line, matches)) {
        return 'Error: this line is out of range';
    }
    if (typeof input.matches !== 'number' || input.matches < 0) {
        return 'Error: invalid input (positive number expected)';
    }
    if (input.matches === 0) {
        return 'Error: you have to remove at least one match';
    }
    if (!checkMatches(input, matches)) {
        return 'Error: not enough matches on this line';
    }
    return '';
};

board.checkLines = async (input, matches) => {
    if (typeof input !== 'number' || input < 0) {
        return 'Error: invalid input (positive number expected)';
    }
    if (!checkLines(input, matches)) {
        return 'Error: this line is out of range';
    }
    return '';
};

board.checkMatches = async (input, matches) => {
    if (typeof input.matches !== 'number' || input.matches < 0) {
        return 'Error: invalid input (positive number expected)';
    }
    if (input.matches === 0) {
        return 'Error: you have to remove at least one match';
    }
    if (!checkMatches(input, matches)) {
        return 'Error: not enough matches on this line';
    }
    return '';
};

board.deleteMatches = (line, number, matches) => {
    const result = matches;
    const leftMatches = matches[line].number - number;
    result[line].number = leftMatches;
    return result;
};

module.exports = board;
