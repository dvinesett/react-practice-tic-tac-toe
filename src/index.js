import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={`square ${props.winner ? "square--winner " : ""}`}
      onClick={props.onClick}>
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={this.props.winnerLine.indexOf(i) > -1}  // is this Square in the winnerLine
      />
    );
  }

  boardRow(cols) {
    return (
      <div className="board-row">
        {cols.map((i) => this.renderSquare(i))}
      </div>
    )
  }

  render() {
    const rows = [0, 1, 2]
    const cols = [0, 1, 2]

    return (
      <div>
        {
          rows.map((row) => {
            return this.boardRow(
              cols.map((col) => row*rows.length + col)
            );
          })
        }
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        thisMove: [null, null]
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        thisMove: calculateMoveLocation(i)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 ) === 0,
    });
  }

  toggleSort() {
    this.setState({
      sortAscending: !this.state.sortAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerLine = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc
      if (move) {
        desc = 'Go to move #' + move + ' (col: ' +
                step.thisMove[0] + ', row: ' +
                step.thisMove[1] + ')';
      } else {
        desc = 'Go to game start';
      }
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={
              move === this.state.stepNumber ? "button--current-move" : ""
            }>
              {desc}
          </button>
        </li>
      );
    })

    const sortButton = () => {
      return (
        <button onClick={() => this.toggleSort()}>
          Sort {this.state.sortAscending ? "descending" : "ascending"}
        </button>
      );
    }

    let status;
    if (winnerLine) {
      status = 'Winner: ' + current.squares[winnerLine[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } 


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winnerLine || []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol reversed={this.state.sortAscending ? false : true}>
            {this.state.sortAscending ? moves : moves.reverse()}
          </ol>
          <div>{sortButton()}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function calculateMoveLocation(i) {
  return [
    i%3 + 1,
    Math.ceil(i/3)
  ];
}
