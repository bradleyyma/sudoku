// import React from 'react';
// import ReactDOM from 'react-dom';
// import '../css/index.css';

function Square(props) {
    let classN = "square"
    if(props.isInitial){
        classN = "square default-square"
    }
    return (
      <button className={classN} onClick={props.onClick} value={props.value} style={props.style} onKeyPress={props.onKeyPress}
      >
        <div>{props.value}</div>
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i, j, selected) {
    let border = '2px solid #000'
    if((j+1) % 3 == 0){
        var right={ borderRight: border, }
    }
    else if(j % 3 == 0){
        var left = { borderLeft: border,}
    }
    if((i+1) %3 == 0){
        var bottom = { borderBottom: border,}
    }
    else if(i % 3 == 0){
        var top = { borderTop: border,}
    }
    let style_name = Object.assign({}, right, left, bottom, top)

    return(
        <Square
            key={(i+j).toString()}
            value={this.props.squares[i][j].value}
            isInitial={this.props.squares[i][j].initial}
            onClick={() => this.props.onClickSelect(i, j)}
            style={style_name}
            onKeyPress={() => this.props.onKeyPress(i, j, event.key)}
        />
    );

  }


  render() {
      let board = [];
      for(let i = 0; i < 9; i++){
          let row=[];
          for(let j = 0; j < 9; j++){
              let selected = false;
              if(i == this.props.selected[0] && j == this.props.selected[1]){
                  selected = true;
              }
              row.push(this.renderSquare(i, j, selected));
          }
          board.push(
              <div key={"row"+i} className="board-row">{row}</div>
          )
      }
      return(
          <div>{board}</div>
      );
    const status = 'Next player: X';
  }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // solveIteration: 0,
            // isSolving: false,
            initial: [],
            selected: [-1, -1],
            history: [{
                squares: puzzle,
            }],
        };
    }


    select(i, j){
        this.setState({
            selected: [i, j]
        })
    }

    keyPress(i,j, event){
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));
        // const squares = current.squares.map(arr => arr.map(cell => cell)); //Deep copy
        if(squares[i][j].initial == true)
            return;
        if(event < '1' && event > '9')
            return;
        if(event != squares[i][j].value){
            squares[i][j].value = event;
            this.setState({
                history: history.concat([{
                    squares: squares,
                }]),
            });
        }
    }
    set(){
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));
        squares.map((arr, i) => arr.map((cell, j) => {if(cell.value){cell.initial=true; cell.i = i; cell.j = j;
            return cell}}))
        let initial = squares.flat().filter(cell => cell.value != null)
        console.log(initial)
        this.setState({
            initial: initial,
            history: [{
                squares: squares,
            }],
        },()=> console.log(this.state.initial));
    }
    undo(){
        const history = this.state.history;
        if(history.length > 1){
            const undo = history.slice(0, history.length-1)
            this.setState({
                history: undo,
            });
        }

    }

    solve(i, j){
        const history = this.state.history
        const current = history[0]
        const squares = JSON.parse(JSON.stringify(current.squares));
        const initial = this.state.initial
        for(let cell in initial){
            let i = initial[cell].i;
            let j = initial[cell].j;
            if(findConflict(i, j, squares)){
                 alert("NO SOLUTION POSSIBLE!");
                return false;
            }
        }
        if(this.solvehelper(i, j, squares, 0)){
            this.setState({
                history: [{
                    squares: squares,
                }],
            });
        }
        else{
            alert("No Solution!")
        }

    }
    solvehelper(i, j, squares, depth){
        let next_i = i;
        let next_j = j;
        if(depth == 81)
            return true;
        if(next_j == 8){
            next_j = 0
            next_i += 1
        }
        else {
            next_j += 1
        }
        if(squares[i][j].initial){
            let bool = this.solvehelper(next_i, next_j, squares, depth+1)
            return bool
        }
        for(let val = 1; val < 10; val++){
            squares[i][j].value = val;
            if(findConflict(i, j, squares))
                squares[i][j].value = null;
            else{
                let bool = this.solvehelper(next_i, next_j, squares, depth+1);
                if(bool){
                    return true;
                }
                else{
                    squares[i][j].value = null;
                }
            }
        }
        return false;
    }

    clear(){
        this.setState({
            // solveIteration: 0,
            // isSolving: false,
            selected: [-1, -1],
            history: [{
                squares: puzzle,
            }],
        })
    }
    play(){
        let rand_index = Math.floor(Math.random() * boards.length)
        console.log(rand_index)
        let board = boards[rand_index].map(arr => arr.map(cell => { return {value: cell, initial: false};}))
        this.setState({
            history: [{
                squares: board,
            }],
        }, ()=>this.set());
    }
    render() {

        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClickSelect={(i, j) => this.select(i, j)}
                        selected={this.state.selected}
                        onKeyPress={(i, j, event) => this.keyPress(i, j, event)}
                    />
                </div>
                <br/>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
                <br/>
                <div className="menu">
                    <button type="button" className="btn btn-primary" onClick={()=>this.set()}>Play</button>
                    <button className="btn btn-primary" onClick={()=>this.undo()}>Undo</button>
                    <button className="btn btn-secondary" onClick={() => this.solve(0, 0)}>Solve</button>
                    <button className="btn btn-danger" onClick={() => this.clear()}>Clear</button>
                    <button className="btn btn-primary" onClick={()=>this.play()}>Play Random Board</button>
                </div>
            </div>
            );
    }
}

function findConflict(i, j, squares){
    const value = squares[i][j].value;
    let conflict = false;
    //check row
    for(let col = 0; col < 9; col++){
        if(col != j){
            if(squares[i][col].value == value){
                conflict = true;
            }
        }
    }
    //check column
    for(let row = 0; row < 9; row++){
        if(row != i){
            if(squares[row][j].value == value){
                conflict = true;
            }
        }
    }

    //check square section
    let top_row = Math.floor(i / 3) * 3;
    let left_col = Math.floor(j / 3) * 3;


    for(let row = top_row; row < (top_row + 3); row++){
        for(let col = left_col; col < (left_col + 3); col ++){
            if(row != i && col != j){
                if(squares[row][col].value == value){
                    conflict = true;
                }
            }
        }
    }

    return conflict;

}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
