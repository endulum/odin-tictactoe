function Gameplay() {
    let tiles = [];
    let gameboard = new Gameboard();

    this.wipeGame =()=> {
        tiles = [];
        gameboard.clearBoard();
        console.log('Game is wiped.');
    }

    this.newGame =()=> {
        tiles = ['', '', '', '', '', '', '', '', ''];
        gameboard.populateGameWith(tiles);
        console.log('Game is created.');
    }
}

function Gameboard() {
    let board = document.getElementById('board');

    this.clearBoard =()=> {
        let tile = board.lastElementChild;
        while (tile) {
            board.removeChild();
            tile = board.lastElementChild;
        }
        console.log('Board is wiped.');
    }

    this.populateGameWith =(tiles)=> {
        for (let tile in tiles) {
            let button = document.createElement('button');
            board.appendChild(button);
        }
    }
}

const game = new Gameplay();
game.newGame();

// game.wipeGame();

// function Gameboard() {
//     let board = document.getElementById('board');
//     let tiles = [];
    
//     this.clearBoard =()=> {
//         let child = board.lastElementChild;
//         while (child) {
//             board.removeChild();
//             child = board.lastElementChild;
//         };
//         tiles = [];
//     };
    
//     this.populateBoard =()=> {
//         for (let i = 0; i < 9; i++) {
//             let button = document.createElement('button');
//             tiles[i] = '';
//             button.addEventListener('click', function() {
//                 button.textContent = 'X';
//                 button.disabled = 'true';
//                 tiles[i] = 'X';
//                 console.log(tiles);
//             });
//             board.appendChild(button);
//         };
//     };
// }

// const game = new Gameboard();
// game.populateBoard();