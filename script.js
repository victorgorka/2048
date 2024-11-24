let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];


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
    })
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
}

function moveUp() {
    const rotateGrid = rotateBoard(grid);
    let newGrid = [];
    for (let col = 0; col < 4; col++) {
        let newCol = rotateGrid[col].filter(num => num !== 0); // Filtra los ceros
        while (newCol.length < 4) {
            newCol.push(0); // Rellena con ceros al final
        }
        newGrid[col] = newCol;
    }
    newGrid = rotateBoard(newGrid);
    if (!compareGrid(newGrid)) {
        grid = newGrid;
        createRandomTile();
    }
    drawGrid();
}

function moveDown() {
    const rotateGrid = rotateBoard(grid);
    let newGrid = [];
    for (let col = 0; col < 4; col++) {
        let newCol = rotateGrid[col].filter(num => num !== 0); // Filtra los ceros
        while (newCol.length < 4) {
            newCol.unshift(0); // Rellena con ceros al principio
        }
        newGrid[col] = newCol;
    }
    newGrid = rotateBoard(newGrid);
    if (!compareGrid(newGrid)) {
        grid = newGrid;
        createRandomTile();
    }
    drawGrid();
}

function moveRight() {
    let newGrid = [];
    for (let row = 0; row < 4; row++) {
        let newRow = grid[row].filter(num => num !== 0); // Filtra los ceros
        while (newRow.length < 4) {
            newRow.unshift(0); // Rellena con ceros al principio
        }
        newGrid[row] = newRow;
    }
    if (!compareGrid(newGrid)) {
        grid = newGrid;
        createRandomTile();
    }
    drawGrid();
}

function moveLeft() {
    let newGrid = [];
    for (let row = 0; row < 4; row++) {
        let newRow = grid[row].filter(num => num !== 0); // Filtra los ceros
        while (newRow.length < 4) {
            newRow.push(0); // Rellena con ceros al final
        }
        newGrid[row] = newRow;
    }
    if (!compareGrid(newGrid)) {
        grid = newGrid;
        createRandomTile();
    }
    drawGrid();
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
