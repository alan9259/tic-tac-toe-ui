import React,  { useState, useEffect, useRef } from 'react'
import Board from './Board';
import { Input, Button, Message, Dimmer, Loader } from 'semantic-ui-react'
import WinnerModal from './WinnerModel'
import { useNewGame, useNextMove } from './TicTacToeAPI'

 function TicTacToe() {
  const [player, setPlayer] = useState(1);
  const [size, setSize] = useState(5);
  const [isStart, setIsStart] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const [game, setGame] = useNewGame(null);
  const [move, setMove] = useNextMove(null);

  const [board, setBoard] = useState(new Array(size*size));

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
      setIsOver(true)
      move.data = 0;
    }

  }, [game, move, size])

  function handleClick(id) {
    const row = id / size >> 0;
    const col = id % size;

    const newMove = {
      row: row,
      col: col,
      player: player
    }

    setMove(newMove);

    let newBoard = board.slice();

    newBoard[id] = player === 1 ? 'x' : 'o';

    setBoard(newBoard);
    setPlayer(player === 1 ? 2 : 1);
  }

  function handleModalClose() {
    setIsOver(false);
  }

  function handleModalNewGame() {
    setGame({size: size, board: []});

    setBoard(new Array(size*size))
    setIsStart(true);
    setIsOver(false);
    setPlayer(1);
  }

  function handleDismiss() {
    setIsError(false);
  }
  
  function handleStartGame() {
    setGame({size: size, board: []});

    setBoard(new Array(size*size));
    setIsStart(true);
    setIsOver(false);
    setPlayer(1);
  }

  function handleSizeChange(e, { value }) {
    setSize(value);
  }

  return (
  <div>
      {isOver && 
      <WinnerModal 
        open={isOver} 
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
      {!isStart && 
        <Input ref={inputSize} type='text' placeholder='Board Size...' action defaultValue={size} onChange={handleSizeChange}>
        <input />
        <Button type='submit' onClick={handleStartGame}>Let's Play</Button>
      </Input>
      }

      {isStart &&
      <Board 
        board={board}
        size={size}
        onClick={id => handleClick(id)}
      />
      }
  </div>
  );
}


export default TicTacToe