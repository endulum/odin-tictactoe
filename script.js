function Gameboard() {
    let board = document.getElementById('board');
    let tiles = [];
    
    this.clearBoard =()=> {
        let child = board.lastElementChild;
        while (child) {
            board.removeChild();
            child = board.lastElementChild;
        };
        tiles = [];
    };
    
    this.populateBoard =()=> {
        for (let i = 0; i < 9; i++) {
            let button = document.createElement('button');
            tiles[i] = '';
            button.addEventListener('click', function() {
                button.textContent = 'X';
                button.disabled = 'true';
                tiles[i] = 'X';
                console.log(tiles);
            });
            board.appendChild(button);
        };
    };
}

const game = new Gameboard();
game.populateBoard();