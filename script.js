let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const DIRECTION = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
};

const verticalDirections = [DIRECTION.Up, DIRECTION.Down];


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
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell[0]][randomCell[1]] = Math.random() < 0.5 ? 2 : 4;
}

function drawGrid() {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        const row = Math.floor(cell.id.split('-')[1]);
        const col = Math.floor(cell.id.split('-')[2]);
        cell.textContent = grid[row][col] === 0 ? '' : grid[row][col];
        if (grid[row][col] != 0) {
            const color = (grid[row][col] * 10) + 385170;
            document.getElementById(cell.id).style.background = `#${color}`;
        } else {
            document.getElementById(cell.id).style.background = "#385170";
        }
    })
}

const mapDirections = {
    ArrowUp: DIRECTION.Up,
    ArrowDown: DIRECTION.Down,
    ArrowLeft: DIRECTION.Left,
    ArrowRight: DIRECTION.Right,
}

function handleKeyPress(event) {
    move(mapDirections[event.key])
}

function move(direction) {
    const board = verticalDirections.includes(direction)
        ? rotateBoard(grid)
        : grid;
    let newGrid = [];
    for (let index = 0; index < 4; index++) {
        let newLine = board[index].filter(num => num !== 0);
        // aqui comprobar si hay merge y hacerlo si lo hay
        newLine = mergeTiles(direction, newLine);
        while (newLine.length < 4) {
            if ([DIRECTION.Right, DIRECTION.Down].includes(direction)) {
                newLine.unshift(0);
            } else if([DIRECTION.Left, DIRECTION.Up].includes(direction)) {
                newLine.push(0);
            }
        }
        newGrid[index] = newLine;
    }
    if (verticalDirections.includes(direction)) {
        newGrid = rotateBoard(newGrid);
    }
    if (!compareGrid(newGrid)) {
        grid = newGrid;
        createRandomTile();
    }
    drawGrid();
}

function mergeTiles(direction, line) {
    let newLine = [];
    let prevNumber = 0;
    let merged = false;

    for (let i = 0; i < line.length; i++) {
        if (prevNumber === 0) {
            prevNumber = line[i];
        } else if (prevNumber === line[i] && !merged) {
            newLine.push(prevNumber * 2);
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
    return newLine;
}


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
