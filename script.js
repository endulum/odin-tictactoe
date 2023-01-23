NodeList.prototype.indexOf = Array.prototype.indexOf;
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
} // shoutout to stackoverflow

const Player =(name, marker, isAI)=> {
    return {name, marker, isAI};
}

const Game =(()=> {
    let tiles = [];
    let needsReset = false;

    const p1 = Player('Bob', '<img src="/resources/o.svg">', false); // 
    const p2 = Player('Eve', '<img src="/resources/x.svg">', true); // 

    const setP1Mode = function(mode) {
        p1.isAI = mode;
    }; const setP2Mode = function(mode) {
        p2.isAI = mode;
    }

    let whoseTurn = p1;

    const combos = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                    [0, 1, 2], [3, 4, 5], [6, 7, 8],
                    [0, 4, 8], [2, 4, 6]];

    const Board =(()=> {
        const board = document.getElementById('board');
        let buttons;

        const clear = function() {
            console.warn('Emptying board.');
            let button = board.lastElementChild;
            while (button) {
                board.removeChild(button);
                button = board.lastElementChild;
            }
        }

        const populate = function(tiles) {
            console.warn('Creating new board.');
            for (let tile in tiles) {
                let button = document.createElement('button');
                button.addEventListener('click', select.bind(Board, parseInt(tile)));
                button.classList.add('unclicked');
                board.appendChild(button);
            }
        }

        const select = function(index) {
            Board.buttons[index].innerHTML = whoseTurn.marker;
            Board.buttons[index].disabled = true;
            Board.buttons[index].classList.remove('unclicked');
            Board.buttons[index].classList.add('clicked');
            // 'buttons' does not work but 'Board.buttons' does. why?
            makeChoice(index);
        }

        const highlight = function(combo) {
            for (let n of combo) {
                Board.buttons[n].classList.add('winner');
            }
            togglePlayable();
        }

        const togglePlayable = function() {
            document.querySelectorAll('.unclicked').forEach((b) => {
                b.disabled = (b.disabled == true) ? false : true;
            });
        }

        return {clear, populate, buttons, highlight, togglePlayable};
    })();

    const setGame = function() {
        if (needsReset) Board.clear();
        tiles = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        Board.populate(tiles);
        whoseTurn = p1;
        needsReset = true;
        Board.buttons = document.querySelectorAll('#board > button');
    }

    const makeChoice = function(choice) {
        if (tiles[choice] === ' ') {
            tiles[choice] = whoseTurn.marker;
            console.log(whoseTurn.name + " placed their mark on index " + choice);
            if (checkForCombo()) {
                console.warn(whoseTurn.name + ' got 3 in a row!');
            } else if (!tiles.includes(' ')) {
                console.warn('There are no free spaces. It\'s a draw.');
            } else {
                whoseTurn = (whoseTurn == p1) ? p2 : p1 ;
                if (whoseTurn.isAI) {
                    console.log(whoseTurn.name + " is thinking...");
                    Board.togglePlayable();
                    let freeSpace;
                    do {freeSpace = Math.floor(Math.random()*9);}
                    while (tiles[freeSpace] !== ' ');
                    sleep(1000).then(() => {
                        Board.togglePlayable();
                        Board.buttons[freeSpace].click();
                    });
                }
            }
        } else {
            console.warn('This tile is taken, ' + whoseTurn.name + '.')
        }
    }

    const checkForCombo = function() {
        let tileset = [];
        for (let tile in tiles) {
            if (tiles[tile] === whoseTurn.marker) tileset.push(parseInt(tile));
        }
        for (let combo of combos) {
            let counter = 0;
            for (let n of combo) {
                if (tileset.includes(n)) counter++;
                if (counter === 3) {
                    Board.highlight(combo);
                    return true;
                }
            }
        }
    }

    setGame();

    document.getElementById('reset').addEventListener('click', setGame);

    return {makeChoice, setGame, setP1Mode, setP2Mode};
})();

const fight = function() {
    Game.setP1Mode(true);
    Game.setP2Mode(true);

    let choices = document.querySelectorAll('.unclicked');
    choices[Math.floor(Math.random()*9)].click();
}