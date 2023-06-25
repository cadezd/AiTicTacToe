// parameter that tells us which player is on the move
let move = 0;
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let children = document.getElementById("game-board").getElementsByTagName("*");
console.log(children);

// the user chooses which player he will be
let userPlyer = "";
Swal.fire({
  title: "Choose a player!",
  showCancelButton: true,
  confirmButtonText: "Player X",
  cancelButtonText: "Player O",
  confirmButtonColor: "#df5244",
  cancelButtonColor: "#1eba9c",
}).then((result) => {
  if (result.isConfirmed) {
    userPlyer = "X";
  } else {
    userPlyer = "O";
    //AI makes first move
    move++;
    aiMove(board, "X", " orange", false, move);
  }
});

function onClick(id) {
  let cellX = document.getElementById(id);

  // makes sure that cell is empty
  if (cellX.innerText) return;

  if (userPlyer === "X") {
    // player move
    if (move % 2 == 0) {
      move++;
      playerMove(id, cellX, board, "X", " orange");
      detectWinner();
    }

    disableBoard();
    // AI move
    setTimeout(() => {
      if (move % 2 == 1) {
        move++;
        aiMove(board, "O", " green", true, move);
        detectWinner();
        enableBoard();
      }
    }, 500);
  } else {
    // AI move
    disableBoard();
    setTimeout(() => {
      if (move % 2 == 0) {
        move++;
        aiMove(board, "X", " orange", false, move);
        detectWinner();
        enableBoard();
      }
    }, 500);

    // player move
    if (move % 2 == 1) {
      move++;
      playerMove(id, cellX, board, "O", " green");
      detectWinner();
    }
  }
}

function detectWinner() {
  disableBoard();

  // checks if we have a winner and displays winner dialog
  let winnerX = checkWin(board, "X");
  let winnerO = checkWin(board, "O");

  if (winnerX) {
    setTimeout(() => {
      Swal.fire({
        title: "Player X won!",
        confirmButtonText: "Play again",
        confirmButtonColor: "#df5244",
      }).then((result) => {
        location.reload();
      });
    }, 1000);
  }

  if (winnerO) {
    setTimeout(() => {
      Swal.fire({
        title: "Player O won!",
        confirmButtonText: "Play again",
        confirmButtonColor: "#1eba9c",
      }).then((result) => {
        location.reload();
      });
    }, 1000);
  }

  if (getEmptyCells(board).length == 0) {
    setTimeout(() => {
      Swal.fire({
        title: "Draw!",
        confirmButtonText: "Play again",
        confirmButtonColor: "#34495e",
      }).then((result) => {
        location.reload();
      });
    }, 1000);
  }

  enableBoard();
}

function aiMove(board, char, className, isMaximizingPlayer, move) {
  // generating AI move
  let aiMove = bestMove(board, char, isMaximizingPlayer, move);

  // adding AI move to the board and styling the board
  board[aiMove.y][aiMove.x] = char;
  let id1 =
    String.fromCharCode(aiMove.y + 97) + String.fromCharCode(aiMove.x + 48);
  let cell = document.getElementById(id1);
  cell.innerText = char;
  cell.className += className;
}

function playerMove(id, cell, board, char, className) {
  // adding Player move to the board and styling the board
  let y = id.charCodeAt(0) - 97;
  let x = id.charCodeAt(1) - 48;
  board[y][x] = char;
  cell.innerText = char;
  cell.className += className;
}

function checkWin(board, player) {
  // check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === player &&
      board[i][1] === player &&
      board[i][2] === player
    ) {
      return true;
    }
  }
  // check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] === player &&
      board[1][i] === player &&
      board[2][i] === player
    ) {
      return true;
    }
  }
  // check diagonals
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }
  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    return true;
  }
  return false;
}

function minimax(board, depth, isMaximizingPlayer) {
  // first we check if we have a winner and if we do we return score
  if (checkWin(board, "X")) {
    return +10 - depth;
  }
  if (checkWin(board, "O")) {
    return -10 + depth;
  }
  if (getEmptyCells(board).length == 0) {
    return 0;
  }

  if (isMaximizingPlayer) {
    // MAX wants highest score
    let bestScore = -Infinity;
    for (const cell of getEmptyCells(board)) {
      board[cell.y][cell.x] = "X";
      const score = minimax(board, depth, false);
      board[cell.y][cell.x] = "";
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  } else {
    // MIN wants lowest score
    let bestScore = Infinity;
    for (const cell of getEmptyCells(board)) {
      board[cell.y][cell.x] = "O";
      const score = minimax(board, depth, true);
      board[cell.y][cell.x] = "";
      bestScore = Math.min(bestScore, score);
    }
    return bestScore;
  }
}

function getEmptyCells(board) {
  // returns empy calls ordered by how many empy cells are around
  let emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === "") {
        let emtyCellsAround = 0;
        if (i - 1 >= 0 && board[i - 1][j] === "") emtyCellsAround++;
        if (i + 1 <= 2 && board[i + 1][j] === "") emtyCellsAround++;
        if (j - 1 >= 0 && board[i][j - 1] === "") emtyCellsAround++;
        if (j + 1 <= 2 && board[i][j + 1] === "") emtyCellsAround++;
        if (i - 1 >= 0 && j - 1 >= 0 && board[i - 1][j - 1] === "")
          emtyCellsAround++;
        if (i + 1 <= 2 && j + 1 <= 2 && board[i + 1][j + 1] === "")
          emtyCellsAround++;
        if (i - 1 >= 0 && j + 1 <= 2 && board[i - 1][j + 1] === "")
          emtyCellsAround++;
        if (i + 1 <= 2 && j - 1 >= 0 && board[i + 1][j - 1] === "")
          emtyCellsAround++;

        emptyCells.push({ y: i, x: j, emtyCellsAround: emtyCellsAround });
      }
    }
  }

  return emptyCells.sort(function (c1, c2) {
    return c2.emtyCellsAround - c1.emtyCellsAround;
  });
}

function bestMove(board, player, isMaximizingPlayer, depth) {
  let bestMove = { y: -1, x: -1 };
  let bestScore = isMaximizingPlayer ? +Infinity : -Infinity;

  // we evaluate every possible move
  for (const cell of getEmptyCells(board)) {
    board[cell.y][cell.x] = player;
    const score = minimax(board, depth, isMaximizingPlayer);
    board[cell.y][cell.x] = "";
    if (isMaximizingPlayer && score < bestScore) {
      // MIN wants lowest score
      bestScore = score;
      bestMove = cell;
    } else if (!isMaximizingPlayer && score > bestScore) {
      // MIN wants highest score
      bestScore = score;
      bestMove = cell;
    }
  }
  return bestMove;
}

function disableBoard() {
  for (let i = 0; i < children.length; i++) {
    children[i].ariaDisabled = true;
  }
}

function enableBoard() {
  for (let i = 0; i < children.length; i++) {
    children[i].ariaDisabled = false;
  }
}
