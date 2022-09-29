const gameBoard = (() => {
  const cells = Array.apply(null, {length: 9});
  const domCells = document.querySelectorAll('.cell');
  
  const isFree = (cell) => {
    return Boolean(!cells[cell]);
  }

  const updateBoard = (cell, token) => {
    if (isFree(cell)) {
      cells[cell] = token;
      render();
      return true;
    } else {
      render();
      return false;
    }
  }

  const render = () => {
    for (let cell in cells) {
      if (cells[cell]) {
        domCells[cell].textContent = cells[cell];
      } else domCells[cell].textContent = '';
    }
  }

  const resetBoard = () => {
    for (let cell in cells) {
      cells[cell] = null;
    }
    for (let cell of domCells) {
      cell.removeAttribute('style');
    }
    render();
  }

  const replayBtn = document.getElementById('replay');
  const restartBtn = document.getElementById('restart');
  const gameOver = document.getElementById('game-over');

  const replay = () => {
    restartBtn.addEventListener('click', () => {
      location.reload();
    });
    replayBtn.addEventListener('click', () => {
      resetBoard();
      gameOver.style.display = 'none';
      game.cellListener(true);
    })
  }

  return {updateBoard, domCells, cells, replay};
})();

const Player = (name, token) => {
  if (!name) {
    if (setup.players.player1 === null) name = 'Player 1';
    else if (setup.players.player2 === null) name = 'Player 2';
  } 
  return {name, token};
}

const setup = (() => {

  const players = {
    player1 : null,
    player2: null,
  }

  const name = document.getElementById('name');
  const startBtn = document.getElementById('start-btn');
  const startScreen = document.getElementById('start-screen');
  const gameboard = document.getElementById('gameboard');

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
    }
  }

  const player2Setup = () => {
    name.value = '';
    name.setAttribute('placeholder', 'Player Two');
    startBtn.style.display = 'block';
    const xToken = document.getElementById('X');
    const oToken = document.getElementById('O');
    if (players.player1.token === 'X') {
      xToken.style.display = 'none';
    } else if (players.player1.token === 'O') {
      oToken.style.display = 'none';
    }
    const tokens = document.querySelector('.tokens');
    tokens.style['grid-template-columns'] = '1fr';
  }

  function createPlayer2() {
    startBtn.addEventListener('click', () => {
      if (players.player1.token === 'X') {
        players.player2 = Player(getName(), 'O');
      } else players.player2 = Player(getName(), 'X');
      gameboard.style.display = 'grid';
      startScreen.style.display = 'none';
      init();
    })
  }

  const init = () => {
    const player1Name = document.getElementById('player-1-name');
    const player2Name = document.getElementById('player-2-name');
    const player1Token = document.getElementById('player-1-token');
    const player2Token = document.getElementById('player-2-token');

    player1Name.textContent = setup.players.player1.name;
    player2Name.textContent = setup.players.player2.name;
    player1Token.textContent = setup.players.player1.token;
    player2Token.textContent = setup.players.player2.token;
  }

  return {getToken, players};
})();


const game = (() => {

  let currentPlayer = null;

  const cellListener = (on) => {
    gameBoard.domCells.forEach(cell => {
      if (on) {
        cell.addEventListener('click', getMove)
      } else cell.removeEventListener('click', getMove);
    });
  }

  const getMove = (e) => {
    if (currentPlayer === null) currentPlayer = setup.players.player1;

    if (gameBoard.updateBoard(e.target.dataset.index, currentPlayer.token)) {
      if (currentPlayer === setup.players.player1) {
        currentPlayer = setup.players.player2;
      } else if (currentPlayer === setup.players.player2) {
        currentPlayer = setup.players.player1;
      }
    }
    if (checkWin(currentPlayer)) announceWinner(currentPlayer);
    if (checkTie()) announceWinner('draw');
  }

  const checkWin = () => {
    const winLines = [[0, 1, 2],
                      [3, 4, 5],
                      [6, 7, 8],
                      [0, 3, 6],
                      [1, 4, 7],
                      [2, 5, 8],
                      [0, 4, 8],
                      [2, 4, 6]];

    for (let line of winLines) {
      let checkLine = [gameBoard.cells[line[0]],
                       gameBoard.cells[line[1]],
                       gameBoard.cells[line[2]]]

      let lineToSet = new Set(checkLine);
      if (lineToSet.size === 1 && lineToSet.values().next().value) {
        cellListener(false);
        colourLine(line);
        return true;
      }
    }      
  }

  const checkTie = () => {
    if (!gameBoard.cells.includes(undefined) && !checkWin()) {
      if (gameBoard.cells.includes(null)) return false;
      cellListener(false);
      return true;
    }
  }

  const colourLine = (line) => {
    const squares = document.querySelectorAll("div[data-index]");
    for (let square of line) {
      squares[square].style.background = 'silver';
      squares[square].style.color = 'white';
      squares[square].style['text-shadow'] = '2px 2px black';
      squares[square].style['font-size'] = '120px';
    }
  }

  const announceWinner = (currentPlayer) => {
    const gameOver = document.getElementById('game-over');
    const result = document.getElementById('result');
    
    gameOver.style.display = 'block';
    let winner;
    if (currentPlayer === 'draw') {
      result.textContent = 'Game Tied';
      gameBoard.replay();
      return;
    }
    if (currentPlayer == setup.players.player1) {
      winner = setup.players.player2.name;
    } else if (currentPlayer == setup.players.player2) {
      winner = setup.players.player1.name;
    }
    result.textContent = `${winner} WINS!`;
    gameBoard.replay();
    cellListener(true);
  }                
  return {cellListener};
})()

setup.getToken();
game.cellListener(true);


