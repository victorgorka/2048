let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];


window.onload = function () {
    gridBuilder();
    movement();
}

function gridBuilder() {
    const gridContainer = document.querySelector('.grid-container');
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
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
    randomCell.textContent = Math.random() < 0.9 ? '2' : '4';
}