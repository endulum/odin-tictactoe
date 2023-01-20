NodeList.prototype.indexOf = Array.prototype.indexOf;
// shoutout to stackoverflow

function Gameplay() {
    let tiles = [];
    let gameboard = new Gameboard();
    let needsReset = false;

    let makeSelection = function(button, index) {
        if (button.classList == 'unclicked' && tiles[index] == '') {
            gameboard.disableButton(button);
            tiles[index] = 'X';
            button.textContent = 'X';
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
        let buttons = document.querySelectorAll('.unclicked');
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

    this.disableButton =(button)=> {
        button.classList.remove('unclicked');
        button.classList.add('clicked');
        button.disabled = true;
    }
}

const game = new Gameplay();