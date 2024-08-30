const drawOptions = document.querySelector('#draw-options');
const gridSizeButtons = document.querySelectorAll('button.grid-size');
const colorPicker = document.querySelector('.color-picker');
const resetGridBtn = document.querySelector('#reset-grid');
const rainbowBtn = document.querySelector('#rainbow');
const eraser = document.querySelector('#eraser');
const sideButtonsContainer = document.querySelector('.side-buttons');

let cellsPerRow = 24;
let drawMethod = 'on-hover';
let brushColor = 'rgb(211,210,0)';
let isDrawing = false; // Track whether the mouse button is held down
let lastDiv;
let darkening = false;

createGrid(cellsPerRow);

gridSizeButtons.forEach((button) => {
  function changeGrid() {
    const drawingBoardRows = document.querySelectorAll('#drawing-board>.row');
    drawingBoardRows.forEach((row) => row.remove());

    cellsPerRow = Number(button.textContent.substring(0, 2));
    createGrid(cellsPerRow);
  }

  button.addEventListener('click', changeGrid);
});

colorPicker.addEventListener('input', (e) => {
  const color = String(colorPicker.value);
  brushColor = `rgb(${color},${color},${color})`;
});

sideButtonsContainer.addEventListener('click', (e) => {
  const target = e.target;

  switch (target.id) {
    case 'eraser':
      brushColor = 'none';
      break;
    case 'rainbow':
      brushColor = () => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      break;
    case 'reset-grid':
      const drawingBoardRows = document.querySelectorAll('#drawing-board>.row');
      drawingBoardRows.forEach((row) => row.remove());

      createGrid(cellsPerRow);
      break;
    case 'brush-tool':
      darkening = true;
      break;
    case 'pencil-tool':
      darkening = false;
      break;
  }
});

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
  if (cell === lastDiv) {
    return; // because we already colored this cell
  }

  lastDiv = cell;
  let color = brushColor;
  if (typeof brushColor === 'function') {
    color = brushColor();
  }

  if (brushColor === 'none') {
    cell.style.backgroundColor = 'white';
    return (cell.style.border = '0.1px solid #e9e9e9');
  }

  if (darkening) {
    let currentOpacity = Number(cell.style.opacity);
    let currentColor = String(cell.style.backgroundColor).replace(/\s/g, '');

    if (currentColor === color && currentOpacity === 1) {
      return;
    } else {
    }
    if (currentOpacity === 1 && currentColor === color) {
      return;
    } else if (currentOpacity === 1 && currentColor !== color) {
      cell.style.opacity = '0.1';
    } else {
      currentOpacity += 0.1;
      cell.style.opacity = String(currentOpacity);
    }
  } else {
    cell.style.opacity = 1;
  }

  cell.style.backgroundColor = color;
  cell.style.border = '0.1px solid ' + color;
}
