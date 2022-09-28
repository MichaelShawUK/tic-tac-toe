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

const Player = (name, token) => {
  return {name, token};
}

const players = {
  player1: null,
  player2: null,
}

const setup = (() => {

  const name = document.getElementById('name');
  const startBtn = document.getElementById('start-btn');


  const getName = () => {
    return name.value;
  }

  const getToken = () => {
    const tokens = document.querySelectorAll('.token');
    tokens.forEach(token => {
      token.addEventListener('click', createPlayer1);
    })
  }

  function createPlayer1(e) {
    if (!players.player1) {
      players.player1 = Player(getName(), e.target.textContent);
      player2Setup();
      createPlayer2();
    } else return;
  }

  const player2Setup = () => {
    name.value = '';
    name.setAttribute('placeholder', 'Player Two');
    startBtn.style.display = 'inline-block';
    const xToken = document.getElementById('X');
    const oToken = document.getElementById('O');
    if (players.player1.token === 'X') {
      xToken.style.display = 'none';
    } else if (players.player1.token === 'O') {
      oToken.style.display = 'none';
    }
  }

  function createPlayer2() {
    startBtn.addEventListener('click', () => {
      if (players.player1.token === 'X') {
        players.player2 = Player(getName(), 'O');
      } else players.player2 = Player(getName(), 'X');
    })
  }

  return {getToken};
})();

setup.getToken();


