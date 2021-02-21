const { checkInput } = require('./board');
const { getRandomArbitrary, sleep } = require('./utils');

async function easy(matches, time) {
    let result = {};
    for (let i = 0; i < matches.length; i += 1) {
        if (matches[i].number > 0) {
            result = {
                line: i,
                matches: 1,
            };
            break;
        }
    }
    await sleep(time);
    return result;
}

async function intermediate(matches, time) {
    let result = {};
    let line = await getRandomArbitrary(0, matches.length);
    let error = await checkInput({ line, matches: 1 }, matches);
    while (error !== '') {
        line = await getRandomArbitrary(0, matches.length);
        error = await checkInput({ line: line, matches: 1 }, matches);
    }
    result = {
        line,
        matches: 1,
    };
    await sleep(time);
    return result;
}

async function hard(matches, time) {
    let result = {};
    let line = await getRandomArbitrary(0, matches.length);
    let error = await checkInput({ line, matches: 1 }, matches);
    while (error !== '') {
        line = await getRandomArbitrary(0, matches.length);
        error = await checkInput({ line: line, matches: 1 }, matches);
    }
    result = {
        line,
        matches: await getRandomArbitrary(1, matches[line].number),
    };
    await sleep(time);
    return result;
}

async function play(currentPlayer, matches, settings) {
    let time = 0;
    let result = {};
    if (settings.ia === 'auto') {
        time = getRandomArbitrary(1000, 1500);
    }
    if (currentPlayer.difficulty === 'easy') {
        result = await easy(matches, time);
    } else if (currentPlayer.difficulty === 'intermediate') {
        result = await intermediate(matches, time);
    } else {
        result = await hard(matches, time);
    }
    return result;
}

module.exports = {
    play,
};
