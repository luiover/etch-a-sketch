const drawOptions = document.querySelector('#draw-options');

let cellsPerRow = 25;
let drawMethod = 'on-hover';
let brushColor = 'red';
let isDrawing = false; // Track whether the mouse button is held down

createGrid(cellsPerRow);

function createGrid(rowCells) {
  const drawingBoard = document.querySelector('#drawing-board');

  for (let i = 0; i < rowCells; i++) {
    const row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < rowCells; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Prevent default drag behavior on each cell
      cell.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });

      row.appendChild(cell);
    }

    drawingBoard.appendChild(row);
  }

  function pressingMethod(event) {
    drawingBoard.removeEventListener('mouseover', hoverMethod);
    if (event.target.classList.contains('cell')) {
      changeColor(event.target);
    }
    isDrawing = true;
  }

  function hoverMethod(event) {
    drawingBoard.removeEventListener('mousedown', pressingMethod);
    if (event.target.classList.contains('cell')) {
      changeColor(event.target);
    }
  }

  function continueDrawing(event) {
    if (isDrawing && event.target.classList.contains('cell')) {
      changeColor(event.target);
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }

  drawOptions.addEventListener('change', () => {
    drawMethod = drawOptions['draw-method'].value;

    if (drawMethod === 'while-pressing') {
      drawingBoard.removeEventListener('mouseover', hoverMethod); // Ensure removal
      drawingBoard.addEventListener('mousedown', pressingMethod);
      drawingBoard.addEventListener('mousemove', continueDrawing);
      drawingBoard.addEventListener('mouseup', stopDrawing);
      drawingBoard.addEventListener('mouseleave', stopDrawing); // Stop drawing when the mouse leaves the board
    } else {
      drawingBoard.removeEventListener('mousedown', pressingMethod); // Ensure removal
      drawingBoard.removeEventListener('mousemove', continueDrawing);
      drawingBoard.removeEventListener('mouseup', stopDrawing);
      drawingBoard.removeEventListener('mouseleave', stopDrawing);
      drawingBoard.addEventListener('mouseover', hoverMethod);
    }
  });

  // Initialize the event listeners
  const changeDrawMethod = new Event('change');
  drawOptions.dispatchEvent(changeDrawMethod);
}

function changeColor(cell) {
  cell.style.backgroundColor = brushColor;
  cell.style.border = '0.1px solid ' + brushColor;
}
