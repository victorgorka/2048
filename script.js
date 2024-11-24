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

function updateGrid() {
    const gridCells = document.querySelectorAll('.grid-cell');
    console.log(gridCells);
    gridCells.forEach(cell => {
        const row = Math.floor(cell.id.split('-')[1]);
        const col = Math.floor(cell.id.split('-')[2]);
        console.log(`row: ${row} columns: ${col}`);
        cell.textContent = grid[row][col] === 0 ? '' : grid[row][col];
    })
}

function gridBuilder() {
    const gridContainer = document.querySelector('.grid-container');
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.id = `cell-${Math.floor(i / 4)}-${i % 4}`
        gridContainer.appendChild(cell);
    }
    createRandomTile();
}

// Create a random tile with value 2 or 4 in a random cell
// of the grid
function createRandomTile() {
    const gridCells = document.querySelectorAll('.grid-cell');
    const emptyCells = [];
    gridCells.forEach(cell => {
        if (cell.textContent === '') {
            emptyCells.push(cell);
        }
    });
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = Math.random() < 0.5 ? '2' : '4';
    grid[Math.floor(randomCell.id.split('-')[1])][Math.floor(randomCell.id.split('-')[2])] = parseInt(randomCell.textContent);
    console.log(grid);
}

function handleKeyPress(event) {
    console.log(event);
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


function moveLeft() {
    let newGrid = JSON.parse(JSON.stringify(grid));
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
    updateGrid();
    console.log(grid);
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