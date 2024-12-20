let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let score = 0;
let maxScore = localStorage.getItem('maxScore') || 0;
let finish = '';
let randomCell = [];

const DIRECTION = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
};

const COLORS = {
    2: '#5e4fa2',
    4: '#3288bd',
    8: '#66c2a5',
    16: '#abdda4',
    32: '#e6f598',
    64: '#ffffbf',
    128: '#fee08b',
    256: '#fdae61',
    512: '#f46d43',
    1024: '#d53e4f',
    2048: '#9e0142',
}

const verticalDirections = [DIRECTION.Up, DIRECTION.Down];

const mapDirections = {
    ArrowUp: DIRECTION.Up,
    ArrowDown: DIRECTION.Down,
    ArrowLeft: DIRECTION.Left,
    ArrowRight: DIRECTION.Right,
}

window.onload = function () {
    gridBuilder();
}

document.onkeydown = handleKeyPress;

function gridBuilder() {
    const gridContainer = document.querySelector('.grid-container');
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.id = `cell-${Math.floor(i / 4)}-${i % 4}`
        gridContainer.appendChild(cell);
    }
    createRandomTile();
    drawGrid();
}

// Create a random tile with value 2 or 4 in a random cell
// of the grid
function createRandomTile() {
    const emptyCells = [];
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === 0) {
                emptyCells.push([r, c]);
            }
        })
    });
    randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell[0]][randomCell[1]] = Math.random() < 0.5 ? 2 : 4;
}

function drawGrid() {
    const gridCells = document.querySelectorAll('.grid-cell');

    if (finish) {
        document.querySelector('.grid-container').style.display = 'none';
        document.getElementById('win').style.display = 'flex';
        document.getElementById('win').innerText = finish;
    }
    gridCells.forEach(cell => {
        const row = Math.floor(cell.id.split('-')[1]);
        const col = Math.floor(cell.id.split('-')[2]);
        const number = grid[row][col];

        cell.textContent = number === 0 ? '' : number;
        if (randomCell.length === 2 && randomCell[0] === row && randomCell[1] === col) {
            cell.style.border = '2px solid red';
        } else {
            cell.style.border = '';
        }
        if (number != 0) {

            if (number >= 16 && number <= 128) {
                cell.style.color = 'black';
            } else {
                cell.style.color = 'white';
            }
            cell.style.background = COLORS[number];
            document.getElementById('score').innerText = score;
            document.getElementById('max-score').innerText = localStorage.getItem('maxScore');
        } else {
            cell.style.color = 'white';
            cell.style.background = "#385170";
        }
    })
}


function handleKeyPress(event) {
    move(mapDirections[event.key])
}

function move(direction) {
    if (finish) {
        console.log(finish);
    }
    if (![DIRECTION.Up, DIRECTION.Down, DIRECTION.Left, DIRECTION.Right].includes(direction)) {
        return;
    }
    const board = verticalDirections.includes(direction)
        ? rotateBoard(grid)
        : grid;
    let newGrid = [];
    for (let index = 0; index < 4; index++) {
        let newLine = board[index].filter(num => num !== 0);
        newLine = mergeTiles(newLine, direction);
        while (newLine.length < 4) {
            if ([DIRECTION.Right, DIRECTION.Down].includes(direction)) {
                newLine.unshift(0);
            } else if ([DIRECTION.Left, DIRECTION.Up].includes(direction)) {
                newLine.push(0);
            }
        }
        newGrid[index] = newLine;
    }
    console.log(`New grid: ${JSON.stringify(newGrid)}`);
    if (verticalDirections.includes(direction)) {
        newGrid = rotateBoard(newGrid);
    }
    validMovesLeft(newGrid);
    if (!compareGrid(newGrid)) {
        grid = newGrid;
        createRandomTile();
    }
    drawGrid();
}

function checkGame(grid) { 
    cells = grid.flat();
    if (!cells.some(c => c === 0)) {
        finish = 'YOU LOST';
    }
}


function mergeTiles(line, direction) {
    let newLine = [];
    let prevNumber = 0;
    let merged = false;

    if ([DIRECTION.Right, DIRECTION.Down].includes(direction)) {
        line = line.reverse();
    }
    for (let i = 0; i < line.length; i++) {
        if (prevNumber === 0) {
            prevNumber = line[i];
            merged = false;
        } else if (prevNumber === line[i] && !merged) {
            newLine.push(prevNumber * 2);
            score += prevNumber * 2;
            if (maxScore <= score) {
                maxScore = score;
                localStorage.setItem('maxScore', maxScore);
            }
            if (prevNumber * 2 === 2048) {
                finish = 'YOU WIN';
            }
            prevNumber = 0;
            merged = true;
        } else {
            newLine.push(prevNumber);
            prevNumber = line[i];
            merged = false;
        }
    }
    if (prevNumber !== 0) {
        newLine.push(prevNumber);
    }

    return [DIRECTION.Right, DIRECTION.Down].includes(direction)
        ? newLine.reverse()
        : newLine;
}

// Function to check if thereany valid moves left
function validMovesLeft(grid) {
    let movesLeft = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === grid[i][j + 1] || grid[j][i] === grid[j + 1][i] || grid[i][j] === 0 || grid[i][j + 1] === 0) {
                movesLeft = true;
            }
        }
    }
    if (!movesLeft){
        finish = 'YOU LOST';
    }
}

// Compare two grids to check if they are equal
function compareGrid(newGrid) {
    let isEqual = true
    if (newGrid.length != grid.length) {
        return false;
    }
    newGrid.forEach((row, r) => {
        if (row.length !== grid[r].length) {
            isEqual = false;
        }
        if (!row.every((cell, c) => cell === grid[r][c])) {
            isEqual = false;
        }
    })
    return isEqual;
}

function rotateBoard(board) {
    const columns = []
    if (board.length <= 0) {
        return [];
    }

    board[0].forEach((_, i) => {
        const col = []
        board.forEach(row => col.push(row[i]))
        columns.push(col)
    })
    return columns;
}

function restartGame() {
    score = 0;
    grid.forEach((_, i) => {
        grid[i] = [0, 0, 0, 0];
    })
    console.log(grid)
    createRandomTile();
    finish = '';
    drawGrid();
    document.querySelector('.grid-container').style.display = 'grid';
    document.getElementById('win').style.display = 'none';
}