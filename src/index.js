import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
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
  		/>
  	);
  }

  boardRow(cols) {
    const rowItem = []
    for (let c of cols) {
      rowItem.push(this.renderSquare(c));
    }
    return rowItem;
  }

  render() {
    const rows = [0, 1, 2]
    const cols = [0, 1, 2]

    const boardItems = []

    for (let r of rows) {
      let rowItem = []
      rowItem.push(
        <div className="board-row">
          {this.boardRow(cols.map(c => r*rows.length + c))}
        </div>
      )
      boardItems.push(rowItem)
    }

    return (<div>{boardItems}</div>)
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } 


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a];
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
