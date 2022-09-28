const gameBoard = (() => {
  const cells = Array.apply(null, {length: 9});
  
  const isFree = (cell) => {
    return Boolean(!cells[cell]);
  }

  const updateBoard = (cell, token) => {
    if (isFree(cell)) {
      cells[cell] = token;
    }
    render();
  }

  const render = () => {
    const domCells = document.querySelectorAll('.cell');
    for (let cell in cells) {
      if (cells[cell]) {
        domCells[cell].textContent = cells[cell];
      }
    }
  }

  return {updateBoard};
})();

gameBoard.updateBoard(1, 'X');
gameBoard.updateBoard(4, 'O');

// Make sure only 0-8 can be selected for cell
// Make tokens O or X

