const drawingBoard = document.querySelector('#drawing-board');

let cellsPerRow = 16;

for (let i = 0; i < cellsPerRow; i++) {
  const row = document.createElement('div');
  row.classList.add('row');

  for (let i = 0; i < cellsPerRow; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    debugCell(cell);

    row.appendChild(cell);
  }

  drawingBoard.appendChild(row);
}

function debugCell(cell) {
  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  cell.style.backgroundColor = color;
}
