NodeList.prototype.indexOf = Array.prototype.indexOf;
// shoutout to stackoverflow




const Player = (name, marker) => {
    return {name, marker};
}

function Gameplay() {
    let tiles = [];
    let gameboard = new Gameboard();
    let needsReset = false;

    let buttons = '';

    const you = Player('You', 'X');
    const opponent = Player('Opponent', 'O');

    let whoseTurn = you;
    let winner = '';

    let winStates = [[0, 3, 6],
                     [1, 4, 7],
                     [2, 5, 8],
                     [0, 1, 2],
                     [3, 4, 5],
                     [6, 7, 8],
                     [0, 4, 8],
                     [2, 4, 6]]

    let checkWinCondition =()=> {
        let tileset = [];
        for (let tile in tiles) {
            if (tiles[tile] === whoseTurn.marker) tileset.push(parseInt(tile));
        }

        console.log(whoseTurn.name + ": " + tileset);

        for (let winState of winStates) {
            let counter = 0;
            for (let win of winState) {
                if (tileset.includes(win)) counter++;
                if (counter == 3) announceWinner(whoseTurn.name, winState);
            }
        }
    }

    let announceWinner =(name, numbers)=> {
        for (let button of buttons) {
            button.disabled = true;
        }
        for (let n of numbers) {
            buttons[n].classList.add('winner');
        } 
    }

    let makeSelection = function(button, index) {
        if (button.classList == 'unclicked' && tiles[index] == '') {
            let marker = whoseTurn.marker;
            gameboard.disableButton(button, marker);
            tiles[index] = marker;
            console.log(tiles);
            if (whoseTurn == you) checkWinCondition();
            if (whoseTurn == you && tiles.indexOf('') > -1 && winner == '') {
                whoseTurn = opponent;
                let freeSpace = Math.floor(Math.random()*8);
                while (tiles[freeSpace] !== '') {
                    freeSpace = Math.floor(Math.random()*8);
                }
                buttons[freeSpace].click();
                checkWinCondition();
                whoseTurn = you;
            }
        } else {console.error('makeSelection fired, but nothing happened')}
    }

    let setGame = function() {
        if (needsReset) {
            tiles = [];
            gameboard.clearBoard();
            console.warn('Board is reset.');
        }

        tiles = ['', '', '', '', '', '', '', '', ''];
        gameboard.populateTiles(tiles);
        buttons = document.querySelectorAll('.unclicked')
        
        for (let button of buttons) {
            button.addEventListener('click', makeSelection.bind(Gameplay, button, buttons.indexOf(button)));
        }

        needsReset = true;
        console.warn('New game created.');
    }

    let resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', setGame);

    setGame();
}

function Gameboard() {
    let board = document.getElementById('board');

    this.clearBoard =()=> {
        let tile = board.lastElementChild;
        while (tile) {
            board.removeChild(tile);
            tile = board.lastElementChild;
        }
    }

    this.populateTiles =(tiles)=> {
        for (let tile in tiles) {
            let button = document.createElement('button');
            button.classList.add('unclicked');
            board.appendChild(button);
        }
    }

    this.disableButton =(button, marker)=> {
        button.classList.remove('unclicked');
        button.classList.add('clicked');
        button.textContent = marker;
        button.disabled = true;
    }
}



const game = new Gameplay();