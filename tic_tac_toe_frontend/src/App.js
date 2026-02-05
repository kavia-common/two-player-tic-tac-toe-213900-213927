import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Calculates the winner for a given 3x3 tic-tac-toe board.
 * @param {(null|"X"|"O")[]} squares - Array of 9 values (row-major).
 * @returns {{winner: ("X"|"O"), line: number[]} | null} Winner info or null.
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

/**
 * Returns true if all squares are filled and there's no winner.
 * @param {(null|"X"|"O")[]} squares
 * @param {{winner: ("X"|"O"), line: number[]} | null} winnerInfo
 * @returns {boolean}
 */
function isDraw(squares, winnerInfo) {
  return !winnerInfo && squares.every((sq) => sq !== null);
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled, isWinning }) {
  const ariaLabel = value
    ? `Square, ${value}`
    : disabled
      ? "Square, empty, disabled"
      : "Square, empty";

  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? "is-winning" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className="ttt-squareValue" aria-hidden="true">
        {value ?? ""}
      </span>
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onPlay, disabled, winningLine }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((sq, idx) => (
        <Square
          // Using index as key is safe here (static 0..8 grid).
          key={idx}
          value={sq}
          disabled={disabled || sq !== null}
          isWinning={Boolean(winningLine?.includes(idx))}
          onClick={() => onPlay(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Status({ nextPlayer, winnerInfo, draw }) {
  let label = `Turn: ${nextPlayer}`;

  if (winnerInfo) label = `Winner: ${winnerInfo.winner}`;
  if (draw) label = "Draw: no more moves";

  return (
    <div className="ttt-status" role="status" aria-live="polite">
      <span className="ttt-statusLabel">{label}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares, winnerInfo), [squares, winnerInfo]);

  const nextPlayer = xIsNext ? "X" : "O";
  const gameOver = Boolean(winnerInfo) || draw;

  // PUBLIC_INTERFACE
  const handlePlay = (index) => {
    // Ignore clicks after game is over or on occupied square.
    if (gameOver || squares[index] !== null) return;

    const nextSquares = squares.slice();
    nextSquares[index] = nextPlayer;

    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="ttt-page">
        <div className="ttt-card">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Two players. One board. Retro vibes.</p>
          </header>

          <Status nextPlayer={nextPlayer} winnerInfo={winnerInfo} draw={draw} />

          <Board
            squares={squares}
            onPlay={handlePlay}
            disabled={gameOver}
            winningLine={winnerInfo?.line ?? null}
          />

          <div className="ttt-footer">
            <button
              type="button"
              className="ttt-restartBtn"
              onClick={handleRestart}
              aria-label="Restart game"
            >
              Restart
            </button>

            <p className="ttt-hint">
              Tip: Use Tab/Shift+Tab to move between squares, then press Enter or
              Space to play.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
