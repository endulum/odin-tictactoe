NodeList.prototype.indexOf = Array.prototype.indexOf;
// shoutout to stackoverflow

const Player =(name, marker, isAI)=> {
    return {name, marker, isAI};
}

const Game =(()=> {
    let tiles = [];
    let flagReset = false;

    const p1 = Player('Bob', 'O', false); // <img src="/resources/o.svg">
    const p2 = Player('Eve', 'X', true); // <img src="/resources/x.svg">

    let whoseTurn = p1;

    const combos = [[0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical combos
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal combos
                    [0, 4, 8], [2, 4, 6]]; // diagonal combos

    const setGame = function() {
        tiles = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        whoseTurn = p1;
        console.warn('New game created.');
        console.log(tiles);
    }

    setGame(); // set the game once when page loads

    const makeChoice = function(choice) {
        if (tiles[choice] === ' ') {
            tiles[choice] = whoseTurn.marker;
            console.warn(whoseTurn.name + " placed " + whoseTurn.marker + " on index " + choice);
            console.log(tiles);
            if (!tiles.includes(' ')) {
                console.warn('There are no free spaces. It\'s a draw.');
                setGame();
            } else if (checkForCombo()) {
                console.warn(whoseTurn.name + " got 3 in a row!");
                setGame();
            } else {
                whoseTurn = (whoseTurn == p1) ? p2 : p1 ;
                if (whoseTurn.isAI) {
                    let freeSpace = Math.floor(Math.random()*8);
                    while (tiles[freeSpace] !== ' ') {
                        freeSpace = Math.floor(Math.random()*8);
                    }
                    makeChoice(freeSpace);
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

        console.log(whoseTurn.name + ' currently has tiles in indices ' + tileset);

        for (let combo of combos) {
            let counter = 0;
            for (let n of combo) {
                if (tileset.includes(n)) counter++;
                if (counter === 3) return true;
            }
        }
    }

    return {makeChoice, setGame};
})();