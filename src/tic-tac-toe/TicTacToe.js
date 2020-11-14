import React,  { useEffect, useRef, useReducer } from 'react'
import Board from './Board';
import { Container, Input, Button, Message } from 'semantic-ui-react'
import WinnerModal from './WinnerModel'
import { useNewGame, useNextMove } from './TicTacToeAPI'
import ticTacToeReducer from './TicTacToeReducer'

function TicTacToe() {
  const [state, dispatch] = useReducer(ticTacToeReducer, {
    player: 1,
    size: 5,
    board: new Array(25),
    isStart: false,
    isOver: false,
    isError: false,
    isLoading: false
  });

  const [game, setGame] = useNewGame(null);
  const [move, setMove] = useNextMove(null);

  const inputSize = useRef(null);

  useEffect(() => {
    if (game.isError || move.isError) {
      dispatch({ type: 'GAME_ERROR' });
    }

    if (move.data === 1 || move.data === 2) {
      dispatch({ type: 'GAME_OVER' });
      move.data = 0;
    }

  }, [game, move, state.size])

  function handleClick(id) {
    let newBoard = state.board.slice();
    if (newBoard[id] === 'x' || newBoard[id] === 'o') {
      return;
    }

    newBoard[id] = state.player === 1 ? 'x' : 'o';

    placeNewMove(id);

    dispatch({
      type: 'GAME_MOVE', 
      payload: { 
        player: state.player === 1 ? 2 : 1, 
        board: newBoard
      }
    });
  }

  function placeNewMove(id) {
    const row = id / state.size >> 0;
    const col = id % state.size;

    const newMove = {
      row: row,
      col: col,
      player: state.player
    }

    setMove(newMove);
  }

  function handleModalClose() {
    dispatch({type: 'GAME_NOPE' });
  }

  function handleModalNewGame() {
    setGame({size: state.size, board: []});

    dispatch({ type: 'GAME_INIT' });
  }

  function handleDismiss() {
    dispatch({ type: '' });
  }
  
  function handleStartGame() {
    setGame({size: state.size, board: []});

    dispatch({type: 'GAME_INIT' });
  }

  function handleSizeChange(e, { value }) {
    const size = parseInt(value, 10);
    if (isNaN(size)) { return };

    dispatch({type: 'GAME_SIZE', payload: {size: size}});
  }

return (
  <div>
      {state.isOver && 
        <WinnerModal 
          open={state.isOver} 
          onClose={handleModalClose}
          onNewGame={handleModalNewGame}
        />
      }

      {state.isError && 
        <Message
          onDismiss={handleDismiss}
          header='Error'
          content='There is something wrong.'
        />
      }

      {!state.isStart && 
      <Container textAlign='center'>
        <Input floated='right' ref={inputSize} type='text' placeholder='Board Size...' action defaultValue={state.size} onChange={handleSizeChange}>
          <input />
          <Button floated='right'  type='submit' onClick={handleStartGame} color='teal'>Let's Play</Button>
        </Input>
      </Container> 
      }

      {state.isStart &&
        <div>
        <Container textAlign='center'>Current Player: {state.player} </Container>
        <Board 
          board={state.board}
          size={state.size}
          onClick={id => handleClick(id)}
        />
        </div>
      }

  </div>
  );
}


export default TicTacToe