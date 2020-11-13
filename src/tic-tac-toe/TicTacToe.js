import React,  { useState, useEffect, useRef, useReducer } from 'react'
import Board from './Board';
import { Input, Button, Message, Dimmer, Loader } from 'semantic-ui-react'
import WinnerModal from './WinnerModel'
import { useNewGame, useNextMove } from './TicTacToeAPI'

function ticTacToeReducer(state, action) {
  switch (action.type) {
    case 'GAME_SIZE':
      return {
        ...state,
        size: action.payload.size
      };
    case 'GAME_MOVE':
      return {
        ...state,
        board: action.payload.board,
        player: action.payload.player
      };
    case 'GAME_INIT':
      return {
        ...state,
        isOver: false,
        isStart: true,
        board: new Array(state.size*state.size),
        player: 1
      };
    case 'GAME_OVER':
      return {
        ...state,
        isOver: true,
        isStart: false,
      };
    case 'GAME_NOPE':
      return {
        ...state,
        isOver: false,
        isStart: false
      }

    default:


  }
}

function TicTacToe() {
  // const [player, setPlayer] = useState(1);
  // const [size, setSize] = useState(5);
  // const [isStart, setIsStart] = useState(false);
  // const [isOver, setIsOver] = useState(false);

  const [state, dispatch] = useReducer(ticTacToeReducer, {
    player: 1,
    size: 5,
    board: new Array(25),
    isStart: false,
    isOver: false
  });

  const [game, setGame] = useNewGame(null);
  const [move, setMove] = useNextMove(null);

  const [isLoading, setIsLoading] = useState(game.isLoading || move.isLoading);
  const [isError, setIsError] = useState(game.isError || move.isError);

  const inputSize = useRef(null);

  useEffect(() => {
    if (game.isError || move.isError) {
      setIsError(true);
    }

    if (!game.isError && !move.isError) {
      setIsError(false);
    }

    if (game.isLoading || move.isLoading) {
      setIsLoading(true);
    }

    if (!game.isLoading && !move.isLoading) {
      setIsLoading(false);
    }

    if (move.data === 1 || move.data === 2) {
      //setIsOver(true)
      dispatch({ type: 'GAME_OVER' });
      move.data = 0;
    }

  }, [game, move, state.size])

  function handleClick(id) {
    const row = id / state.size >> 0;
    const col = id % state.size;

    const newMove = {
      row: row,
      col: col,
      player: state.player
    }

    setMove(newMove);

    let newBoard = state.board.slice();
    newBoard[id] = state.player === 1 ? 'x' : 'o';

    dispatch({
      type: 'GAME_MOVE', 
      payload: { 
        player: state.player === 1 ? 2 : 1, 
        board: newBoard
      }
    });
  }

  function handleModalClose() {
    dispatch({type: 'GAME_NOPE' });
  }

  function handleModalNewGame() {
    setGame({size: state.size, board: []});

    dispatch({ type: 'GAME_INIT' });
  }

  function handleDismiss() {
    setIsError(false);
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

      {isError && 
      <Message
        onDismiss={handleDismiss}
        header='Error'
        content='There is something wrong.'
      />
      }

      {/* {isLoading &&
        <Dimmer active>
          <Loader active>Loading</Loader>
        </Dimmer>
      } */}
      {!state.isStart && 
        <Input ref={inputSize} type='text' placeholder='Board Size...' action defaultValue={state.size} onChange={handleSizeChange}>
        <input />
        <Button type='submit' onClick={handleStartGame}>Let's Play</Button>
      </Input>
      }

      {state.isStart &&
      <Board 
        board={state.board}
        size={state.size}
        onClick={id => handleClick(id)}
      />
      }
  </div>
  );
}


export default TicTacToe