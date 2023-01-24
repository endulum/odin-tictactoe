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

    const p1 = Player('You', '<img src="/resources/o.svg">', false); // 
    const p2 = Player('The computer', '<img src="/resources/x.svg">', true); // 

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
        const broadcast = document.getElementById('broadcast');
        let buttons;

        const clear = function() {
            let button = board.lastElementChild;
            while (button) {
                board.removeChild(button);
                button = board.lastElementChild;
            }
        }

        const populate = function(tiles) {
            for (let tile in tiles) {
                let button = document.createElement('button');
                button.addEventListener('click', select.bind(Board, parseInt(tile)));
                button.classList.add('unclicked');
                board.appendChild(button);
            }
        }

        const select = function(index) {
            Board.buttons[index].innerHTML = whoseTurn.marker;
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
                b.classList.toggle('inactive');
            });
        }

        const toggleThinking = function() {
            document.querySelectorAll('.unclicked', '.inactive').forEach((b) => {
                b.classList.toggle('thinking');
            });
        }

        const log = function(string) {
            broadcast.textContent = string;
        }

        // menu overlay control
        const menu = document.getElementById('menu');
        const overlay = document.getElementById('overlay');
        const invokeOverlay = function() {
            if (overlay.style.display === 'none') {
                overlay.style.display = 'flex';
                document.getElementById('reset').style.pointerEvents = 'none';
            } else {
                overlay.style.display = 'none';
                document.getElementById('reset').style.pointerEvents = 'auto';
            }
        }
        menu.addEventListener('click', invokeOverlay);

        const setMode = function(e) {
            switch (e.srcElement.id) {
                case 'pvp': 
                    p1.isAI = false; 
                    p2.isAI = false;
                    p1.name = prompt('Please enter Player 1\'s name.');
                    p2.name = prompt('Please enter Player 2\'s name.');
                    break;
                case 'pvc': 
                    p1.isAI = false; 
                    p2.isAI = true; 
                    p1.name = 'You'
                    p2.name = 'The computer';
                    break;
                case 'cvc': 
                    p1.isAI = true; 
                    p2.isAI = true;
                    p1.name = 'Computer 1';
                    p2.name = 'Computer 2';
                    // Board.buttons[Math.floor(Math.random()*9)].click();
                    break;
            }
            overlay.style.display = 'none';
            setGame();
            menu.style.pointerEvents = 'auto';
            document.getElementById('reset').style.pointerEvents = 'auto';
        }

        // .bind(Board, 'pvp')
        document.getElementById('pvp').addEventListener('click', setMode);
        document.getElementById('pvc').addEventListener('click', setMode);
        document.getElementById('cvc').addEventListener('click', setMode);

        return {clear, populate, buttons, highlight, togglePlayable, toggleThinking, log};
    })();

    const setGame = function() {
        if (needsReset) Board.clear();
        tiles = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        Board.populate(tiles);
        whoseTurn = p1;
        needsReset = true;
        Board.buttons = document.querySelectorAll('#board > button');
        Board.log('Ready to play.');
        checkAIChoice();
    }

    const makeChoice = function(choice) {
        if (tiles[choice] === ' ') {
            tiles[choice] = whoseTurn.marker;
            Board.log(whoseTurn.name + ' placed their mark on index ' + choice + '.');
            if (checkForCombo()) {
                Board.log(whoseTurn.name + ' got three in a row!');
            } else if (!tiles.includes(' ')) {
                Board.log('There are no free spaces. It\'s a draw.');
            } else {
                whoseTurn = (whoseTurn == p1) ? p2 : p1 ;
                checkAIChoice();
            }
        } else {
            Board.log('This tile is taken, ' + whoseTurn.name + '.')
        }
    }

    const checkAIChoice = function() {
        if (whoseTurn.isAI) {
            document.getElementById('reset').style.pointerEvents = 'none';
            document.getElementById('menu').style.pointerEvents = 'none';
            Board.log(whoseTurn.name + " is thinking...");
            Board.togglePlayable();
            Board.toggleThinking();
            let freeSpace;
            do {freeSpace = Math.floor(Math.random()*9);}
            while (tiles[freeSpace] !== ' ');
            sleep(1000).then(() => {
                document.getElementById('reset').style.pointerEvents = 'auto';
                document.getElementById('menu').style.pointerEvents = 'auto';
                Board.togglePlayable();
                Board.toggleThinking();
                Board.buttons[freeSpace].click();
            });
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